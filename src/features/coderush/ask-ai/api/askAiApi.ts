import { apiClient } from '../../../../lib/axios';

/**
 * Send a message to the AI tutor and get a streaming SSE response.
 */
export async function askAiStream(
  message: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<AbortController> {
  const controller = new AbortController();

  try {
    const response = await fetch(
      `${apiClient.defaults.baseURL ?? 'http://localhost:3000'}/ask_ai`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      onError(`Server error: ${String(response.status)}`);
      return controller;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response body');
      return controller;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data) as Record<string, unknown>;
            if (parsed.error) {
              const errorMessage =
                typeof parsed.error === 'string'
                  ? parsed.error
                  : JSON.stringify(parsed.error);
              onError(errorMessage);
              return controller;
            }
            if (parsed.done) {
              onDone();
              return controller;
            }
            if (typeof parsed.text === 'string') {
              onChunk(parsed.text);
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    }

    onDone();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return controller;
    onError(err instanceof Error ? err.message : 'Unknown error');
  }

  return controller;
}

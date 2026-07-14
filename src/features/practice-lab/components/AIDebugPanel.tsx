import { useCallback, useEffect, useState } from 'react';
import { debugCode, type DebugResponse } from '../api/chatbotApi';

interface AIDebugPanelProps {
  code: string;
  errorMessage: string;
  requestId: number;
}

export function AIDebugPanel({
  code,
  errorMessage,
  requestId,
}: AIDebugPanelProps) {
  const [result, setResult] = useState<DebugResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestDebug = useCallback(async () => {
    if (!errorMessage.trim()) return;

    setIsLoading(true);

    try {
      setResult(await debugCode(code, errorMessage));
    } catch {
      setResult({
        diagnosis: 'The Debug Assistant could not be reached.',
        fixSuggestion: 'Check that the backend is running.',
        explanation: 'The frontend could not call POST /chatbot/debug.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [code, errorMessage]);

  useEffect(() => {
    if (requestId > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void requestDebug();
    }
  }, [requestId, requestDebug]);

  return (
    <div className="h-full overflow-y-auto bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800">🤖 Debug Assistant</h2>
        <button
          type="button"
          onClick={() => void requestDebug()}
          className="rounded-lg bg-[#6C63FF] px-3 py-1.5 text-xs font-bold text-white"
        >
          Ask AI
        </button>
      </div>

      {!errorMessage && (
        <p className="text-sm text-neutral-500">
          Run code with an error, or click Ask AI after an error appears.
        </p>
      )}

      {isLoading && <p className="text-sm text-neutral-500">Analyzing...</p>}

      {result && !isLoading && (
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-bold text-red-600">🔴 Error Diagnosis</h3>
            <p className="mt-1 text-neutral-700">{result.diagnosis}</p>
          </section>

          <section>
            <h3 className="font-bold text-[#6C63FF]">🔧 How to Fix</h3>
            <p className="mt-1 text-neutral-700">{result.fixSuggestion}</p>
          </section>

          <section>
            <h3 className="font-bold text-blue-600">📘 Why This Happened</h3>
            <p className="mt-1 text-neutral-700">{result.explanation}</p>
          </section>
        </div>
      )}
    </div>
  );
}

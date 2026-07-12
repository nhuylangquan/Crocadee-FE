import { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askAiStream } from '../../features/coderush/ask-ai/api/askAiApi';

interface AiTutorPanelProps {
  /** The explanation text from the backend (ex) */
  explanation: string;
  /** The user's wrong answer (for context) */
  wrongAnswer: string;
  /** The correct code / answer (for context) */
  correctAnswer: string;
  /** Optional question text for context */
  questionText?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function AiTutorPanel({
  explanation,
  wrongAnswer,
  correctAnswer,
  questionText,
}: AiTutorPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const streamingMsgIdxRef = useRef<number | null>(null);
  const nextMessageIdRef = useRef(0);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = useCallback(() => {
    const msg = inputValue.trim();
    if (!msg || isStreaming) return;

    setInputValue('');

    // Build context for the AI
    const context = [
      '[QUESTION]',
      questionText ?? '',
      '',
      '[YOUR ANSWER]',
      wrongAnswer,
      '',
      '[CORRECT ANSWER]',
      correctAnswer,
      '',
      '[EXPLANATION]',
      explanation,
      '',
      '[USER FOLLOW-UP]',
      msg,
    ].join('\n');

    setIsStreaming(true);

    const nextId = () =>
      Date.now().toString() + '-' + String(nextMessageIdRef.current++);

    // Add user message and placeholder AI message atomically
    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: msg,
    };
    const aiPlaceholder: ChatMessage = {
      id: nextId(),
      role: 'ai',
      content: '',
    };
    setChatMessages((prev) => {
      const next = [...prev, userMsg, aiPlaceholder];
      streamingMsgIdxRef.current = next.length - 1;
      return next;
    });

    let currentContent = '';

    void askAiStream(
      context,
      (chunk) => {
        currentContent += chunk;
        const idx = streamingMsgIdxRef.current;
        if (idx === null) return;
        setChatMessages((prev) => {
          if (idx >= prev.length) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], content: currentContent };
          return updated;
        });
      },
      () => {
        setIsStreaming(false);
        streamingMsgIdxRef.current = null;
      },
      (errorMsg) => {
        setIsStreaming(false);
        streamingMsgIdxRef.current = null;
        setChatMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'ai',
            content: `_Error: ${errorMsg}_`,
          },
        ]);
      }
    ).then((controller) => {
      abortRef.current = controller;
    });
  }, [
    inputValue,
    isStreaming,
    questionText,
    wrongAnswer,
    correctAnswer,
    explanation,
  ]);

  // Cancel streaming on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-600 bg-shade-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#380080] px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">
          {'\u{1F916}'}
        </span>
        <span className="text-base font-semibold text-white">AI Tutor</span>
      </div>

      <div className="space-y-5 p-5">
        {/* Wrong Answer */}
        {wrongAnswer && (
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-800">
              Your Answer
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-danger-500 bg-danger-100 px-4 py-2.5">
              <span className="text-sm font-medium text-danger-500">
                {wrongAnswer}
              </span>
              <span className="ml-auto text-danger-500">{'\u2717'}</span>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-800">
            Explanation
          </p>
          <div className="rounded-[10px] bg-neutral-100 p-4 text-sm leading-6 text-neutral-800 prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {explanation}
            </ReactMarkdown>
          </div>
        </div>

        {/* Chat messages */}
        {chatMessages.length > 0 && (
          <div className="max-h-60 space-y-3 overflow-y-auto rounded-lg border border-neutral-200 dark:border-neutral-600 bg-shade-white p-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-5 ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-shade-white text-neutral-900 border border-neutral-200 dark:border-neutral-600'
                  }`}
                >
                  <div
                    className={`prose prose-sm max-w-none dark:prose-invert [&_p]:my-0 [&_ul]:my-0 [&_ol]:my-0 [&_h1]:my-0 [&_h2]:my-0 [&_h3]:my-0 [&_h4]:my-0 [&_code]:text-xs ${
                      msg.role === 'user'
                        ? 'prose-invert text-white **:text-white'
                        : ''
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Ask more input */}
        <div className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask more..."
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm leading-4.25 text-primary-900 placeholder-primary-900/50 outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isStreaming || !inputValue.trim()}
              className="flex h-6.5 w-11.75 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {isStreaming ? '...' : '\u2192'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

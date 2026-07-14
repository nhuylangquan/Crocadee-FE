import { useState, type KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { askConcept } from '../api/chatbotApi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatBubbleProps {
  lessonTitle?: string;
}

export function AIChatBubble({ lessonTitle }: AIChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = lessonTitle
    ? [
        `Giải thích về bài học ${lessonTitle}.`,
        `Mình cần tập trung vào phần nào trong bài ${lessonTitle}?`,
        `Cho mình xem ví dụ đơn giản về bài ${lessonTitle}.`,
      ]
    : [
        'Biến (variable) là gì vậy?',
        'Vòng lặp (loop) hoạt động thế nào?',
        'Con trỏ (pointer) dùng để làm gì?',
      ];

  const sendQuestion = async (value: string) => {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion || isLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: trimmedQuestion },
    ]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await askConcept(trimmedQuestion, lessonTitle);

      setMessages((previous) => [
        ...previous,
        { role: 'assistant', content: response.answer },
      ]);
      setFollowUps(response.followUpQuestions);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: 'I could not connect to the Concept Assistant.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      void sendQuestion(question);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#25233B] shadow-2xl">
          <div className="border-b border-white/10 bg-[#6C63FF] px-5 py-4 text-white">
            <p className="font-bold">🧠 Trợ Lý Khái Niệm C++</p>
            {lessonTitle && (
              <p className="mt-1 text-xs text-white/80">
                📖 Bài học: {lessonTitle}
              </p>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-xl bg-white/10 p-3 text-sm text-white/80">
                Hãy đặt một câu hỏi liên quan đến bài học này nhé.
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${String(index)}`}
                className={
                  message.role === 'user'
                    ? 'ml-10 rounded-2xl bg-[#6C63FF] px-4 py-3 text-sm text-white'
                    : 'mr-4 rounded-2xl bg-white px-4 py-3 text-sm text-neutral-800'
                }
              >
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="mr-4 rounded-2xl bg-white px-4 py-3 text-sm text-neutral-500">
                Đang suy nghĩ...
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="space-y-2">
                {suggestedQuestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void sendQuestion(item)}
                    className="block w-full rounded-xl border border-white/20 px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            {!isLoading && followUps.length > 0 && (
              <div className="space-y-2">
                {followUps.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void sendQuestion(item)}
                    className="block w-full rounded-xl border border-white/20 px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi mình về bài học này..."
              className="min-w-0 flex-1 rounded-xl bg-white px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => void sendQuestion(question)}
              className="rounded-xl bg-[#6C63FF] px-4 py-2 text-sm font-bold text-white"
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6C63FF] text-2xl text-white shadow-xl transition hover:scale-105"
        aria-label="Open C++ Concept Assistant"
      >
        🧠
      </button>
    </div>
  );
}

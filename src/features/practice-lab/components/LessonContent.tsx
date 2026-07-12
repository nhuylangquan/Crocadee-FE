import { CodePreview } from './CodePreview';
import type { LessonData } from '../data/lessonData';

interface LessonContentProps {
  lessons: LessonData[];
  lessonId: string;
  onNextLesson?: (nextId: string) => void;
}

export function LessonContent({
  lessons,
  lessonId,
  onNextLesson,
}: LessonContentProps) {
  const data = lessons.find((l) => l.lessonId === lessonId);

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-neutral-500">
        Lesson content not found.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-16 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Part Indicator */}
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6C63FF]">
          MODULE {data.module} • {data.partName}
        </p>

        {/* Title */}
        <h1 className="mb-6 text-[36px] font-bold leading-tight tracking-tight text-neutral-900">
          {data.title}
        </h1>

        {/* Description */}
        <div
          className="mb-10 text-[15px] leading-[1.8] text-neutral-600 prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />

        {/* Info Cards */}
        {data.infoCards && data.infoCards.length > 0 && (
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.infoCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/50 bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBgClass}`}
                >
                  <span className={`text-xl ${card.iconTextClass}`}>
                    {card.icon}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">
                  {card.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-neutral-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Code Preview */}
        <div className="mb-10">
          <CodePreview />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pb-8 pt-4">
          {data.prevLessonId ? (
            <button
              onClick={() => onNextLesson?.(String(data.prevLessonId))}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-[15px] font-bold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.98]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="rotate-180"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ❮ Previous
            </button>
          ) : (
            <div></div> /* Spacer when there is no previous lesson */
          )}

          {data.nextLessonId && (
            <button
              onClick={() => onNextLesson?.(String(data.nextLessonId))}
              className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-8 py-3.5 text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#5a52d5] active:scale-[0.98]"
            >
              Next ❯
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

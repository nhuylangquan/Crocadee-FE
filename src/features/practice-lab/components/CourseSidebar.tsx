import type { LessonData } from '../data/lessonData';

interface CourseSidebarProps {
  lessons: LessonData[];
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
}

export function CourseSidebar({
  lessons,
  currentLessonId,
  onSelectLesson,
}: CourseSidebarProps) {
  // Compute progress based on selected lesson index
  const currentIndex = lessons.findIndex((t) => t.lessonId === currentLessonId);
  const progress = Math.max(
    1,
    Math.round(((currentIndex + 1) / (lessons.length || 1)) * 100)
  );

  return (
    <aside className="flex h-full w-65 shrink-0 flex-col border-r border-neutral-100 bg-shade-white px-5 py-6 shadow-sm">
      {/* Title */}
      <h2 className="mb-6 text-center text-xl font-bold tracking-tight text-[#6C63FF]">
        C++ Mastery
      </h2>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-500">
            Progress
          </span>
          <span className="text-[11px] font-bold text-[#6C63FF]">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-[#6C63FF] transition-all duration-700"
            style={{ width: `${String(progress)}%` }}
          />
        </div>
      </div>

      {/* Topic List */}
      <nav className="flex flex-col gap-2">
        {lessons.map((topic) => {
          const isCurrent = topic.lessonId === currentLessonId;
          const isPast =
            lessons.findIndex((t) => t.lessonId === topic.lessonId) <
            currentIndex;

          if (isCurrent) {
            return (
              <div
                key={topic.lessonId}
                className="flex gap-3 rounded-xl border-l-2 border-[#6C63FF] bg-[#EBE7FF] p-3 text-left transition-all"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C63FF]">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF]">
                    Module {topic.module}
                  </span>
                  <span className="text-[13px] font-bold text-[#6C63FF]">
                    {topic.title}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={topic.lessonId}
              type="button"
              onClick={() => {
                onSelectLesson(topic.lessonId);
              }}
              className={`flex items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-neutral-50 ${isPast ? '' : 'opacity-60'}`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${isPast ? 'border-[#6C63FF] bg-[#6C63FF] text-white' : 'border-neutral-300 bg-white'}`}
              >
                {isPast ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <span className="text-xs font-medium text-neutral-400">
                    {topic.module}
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] font-medium ${isPast ? 'text-neutral-900' : 'text-neutral-500'}`}
              >
                {topic.title}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

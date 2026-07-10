type TopicStatus = 'done' | 'current' | 'locked';

interface Topic {
  id: string;
  name: string;
  status: TopicStatus;
  module: number;
}

const topics: Topic[] = [
  { id: 'intro', name: 'Introduction to C++', status: 'current', module: 1 },
  { id: 'basics', name: 'C++ Basics', status: 'locked', module: 2 },
  { id: 'variable', name: 'Variable', status: 'locked', module: 3 },
  { id: 'condition', name: 'Condition', status: 'locked', module: 4 },
  { id: 'loop', name: 'Loop', status: 'locked', module: 5 },
  { id: 'function', name: 'Function', status: 'locked', module: 6 },
  { id: 'array', name: 'Array', status: 'locked', module: 7 },
  { id: 'pointer', name: 'Pointer', status: 'locked', module: 8 },
];

export function CourseSidebar() {
  const progress = 1;

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
        {topics.map((topic) => {
          if (topic.status === 'current') {
            return (
              <div
                key={topic.id}
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
                    {topic.name}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={topic.id}
              type="button"
              disabled
              className="flex items-center gap-4 rounded-xl px-3 py-2.5 text-left opacity-60 transition-all"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-shade-white">
                <span className="text-xs font-medium text-neutral-400">
                  {topic.module}
                </span>
              </div>
              <span className="text-[13px] font-medium text-neutral-500">
                {topic.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

type TopicStatus = 'done' | 'current' | 'locked';

interface Topic {
  id: string;
  name: string;
  status: TopicStatus;
}

const topics: Topic[] = [
  { id: 'variable', name: 'Variable', status: 'done' },
  { id: 'datatype', name: 'DataType', status: 'done' },
  { id: 'condition', name: 'Condition', status: 'current' },
  { id: 'loop', name: 'Loop', status: 'locked' },
  { id: 'function', name: 'Function', status: 'locked' },
  { id: 'array', name: 'Array', status: 'locked' },
  { id: 'pointer', name: 'Pointer', status: 'locked' },
];

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 7L5.5 9.5L11 4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1.5L8.5 6L1 10.5V1.5Z" fill="white" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="6"
        width="9"
        height="6.5"
        rx="1.5"
        stroke="white"
        strokeOpacity="0.45"
        strokeWidth="1.3"
      />
      <path
        d="M3.5 6V4.5C3.5 3.11929 4.61929 2 6 2C7.38071 2 8.5 3.11929 8.5 4.5V6"
        stroke="white"
        strokeOpacity="0.45"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CourseSidebar() {
  const completedCount = topics.filter((t) => t.status === 'done').length;
  const progress = (completedCount / topics.length) * 100;

  return (
    <aside className="flex w-[256px] shrink-0 flex-col rounded-2xl bg-[#2D1F5E] p-5 text-white">
      {/* Title */}
      <h2 className="mb-1 text-lg font-bold tracking-tight">C++ Mastery</h2>

      {/* Progress */}
      <div className="mb-5">
        <span className="mb-1.5 block text-[11px] font-medium text-white/50">
          Progress
        </span>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-300 to-tertiary-500 transition-all duration-700"
            style={{ width: `${String(progress)}%` }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-white/8" />

      {/* Topic List */}
      <nav className="flex flex-col gap-0.5">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
              topic.status === 'current'
                ? 'bg-white/12 font-semibold'
                : topic.status === 'done'
                  ? 'hover:bg-white/5'
                  : 'cursor-default opacity-45'
            }`}
            disabled={topic.status === 'locked'}
          >
            {/* Status Icon */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                topic.status === 'done'
                  ? 'bg-tertiary-500'
                  : topic.status === 'current'
                    ? 'bg-primary-500'
                    : 'bg-white/10'
              }`}
            >
              {topic.status === 'done' && <CheckIcon />}
              {topic.status === 'current' && <PlayIcon />}
              {topic.status === 'locked' && <LockIcon />}
            </div>
            <span className="text-sm font-medium">{topic.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

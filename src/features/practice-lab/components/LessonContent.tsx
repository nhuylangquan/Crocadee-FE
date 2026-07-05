import { CodePreview } from './CodePreview';

export function LessonContent() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Part Indicator */}
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-500">
        Part 1 - Introduction
      </p>

      {/* Title */}
      <h1 className="mb-4 text-[28px] font-bold leading-tight tracking-tight text-neutral-900">
        Welcome to C++
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-[720px] text-[15px] leading-relaxed text-neutral-600">
        Embark on your journey into the world of high-performance computing.{' '}
        <strong className="font-semibold text-neutral-800">
          C++ is a powerful, fast, and versatile programming language
        </strong>{' '}
        used to build operating systems, game engines, and critical
        infrastructure. In this path, you&apos;ll master everything from{' '}
        <strong className="font-semibold text-neutral-800">basic syntax</strong>{' '}
        to{' '}
        <strong className="font-semibold text-neutral-800">
          advanced memory management
        </strong>
        . Let&apos;s write your first line of code!
      </p>

      {/* Info Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card: Why C++? */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M6 4L2 9L6 14"
                stroke="#6C63FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 4L16 9L12 14"
                stroke="#6C63FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-bold text-neutral-900">
            Why C++?
          </h3>
          <p className="text-[13px] leading-relaxed text-neutral-500">
            C++ gives you unparalleled control over system resources and memory.
            It&apos;s the language of choice when performance is not negotiable.
          </p>
        </div>

        {/* Card: Close to the Metal */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="3"
                y="7"
                width="12"
                height="7"
                rx="1.5"
                stroke="#FF8A1F"
                strokeWidth="1.5"
              />
              <path
                d="M6 7V5C6 3.34315 7.34315 2 9 2C10.6569 2 12 3.34315 12 5V7"
                stroke="#FF8A1F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="9" cy="11" r="1" fill="#FF8A1F" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-bold text-neutral-900">
            Close to the Metal
          </h3>
          <p className="text-[13px] leading-relaxed text-neutral-500">
            Unlike most modern languages, C++ compiles directly to machine code,
            making it incredibly fast and efficient to execute.
          </p>
        </div>
      </div>

      {/* Code Preview */}
      <div className="mb-8">
        <CodePreview />
      </div>

      {/* Navigation */}
      <div className="flex justify-end pb-4">
        <a
          href="/practice-lab/try-it"
          className="inline-flex items-center gap-2 rounded-xl bg-tertiary-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-tertiary-700 active:scale-[0.98]"
        >
          C++ Basic
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

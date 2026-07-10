import { CodePreview } from './CodePreview';
import chevronRightUrl from '../../../assets/icons/practice-chevron-right.svg';

export function LessonContent() {
  return (
    <div className="flex-1 overflow-y-auto px-16 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Part Indicator */}
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6C63FF]">
          MODULE 1 • INTRODUCTION
        </p>

        {/* Title */}
        <h1 className="mb-6 text-[36px] font-bold leading-tight tracking-tight text-neutral-900">
          Welcome to C++
        </h1>

        {/* Description */}
        <p className="mb-10 text-[15px] leading-[1.8] text-neutral-600">
          Embark on your journey into the world of high-performance computing.{' '}
          <strong className="font-semibold text-neutral-800">
            C++ is a powerful, fast, and versatile programming language
          </strong>{' '}
          used to build operating systems, game engines, and critical
          infrastructure. In this path, you&apos;ll master everything from{' '}
          <strong className="font-semibold text-neutral-800">
            basic syntax
          </strong>{' '}
          to{' '}
          <strong className="font-semibold text-neutral-800">
            advanced memory management
          </strong>
          . Let&apos;s write your first line of code!
        </p>

        {/* Info Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card: Why C++? */}
          <div className="rounded-2xl border border-neutral-100 bg-shade-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <span className="text-xl text-[#6C63FF]">💪</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-neutral-900">
              Why C++?
            </h3>
            <p className="text-[14px] leading-relaxed text-neutral-500">
              C++ gives you unparalleled control over system resources and
              memory. It&apos;s the language of choice when performance is
              non-negotiable.
            </p>
          </div>

          {/* Card: Close to the Metal */}
          <div className="rounded-2xl border border-neutral-100 bg-shade-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <span className="text-xl text-orange-500">⚙️</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-neutral-900">
              Close to the Metal
            </h3>
            <p className="text-[14px] leading-relaxed text-neutral-500">
              Unlike many modern languages, C++ compiles directly to machine
              code, making it incredibly fast and efficient to execute.
            </p>
          </div>
        </div>

        {/* Code Preview */}
        <div className="mb-10">
          <CodePreview />
        </div>

        {/* Navigation */}
        <div className="flex justify-end pb-8">
          <a
            href="/practice-lab/try-it"
            className="inline-flex items-center gap-2 rounded-full bg-[#6C63FF] px-8 py-3.5 text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#5a52d5] active:scale-[0.98]"
          >
            C++ Basics
            <img src={chevronRightUrl} alt="" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

import { Button } from '../../../components/ui/Button';
import arrowRightUrl from '../../../assets/icons/profile-arrow-right.svg';

export function LearningProgressHighlight() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[#ccc3d833] bg-[#ede5f4] p-6 md:p-8 lg:p-10">
      {/* IN PROGRESS badge */}
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#630ed41a] bg-white px-3 py-1">
        <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#630ed4]">
          IN PROGRESS
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1d1a24] md:text-3xl">
        Pointers
      </h2>

      {/* Description */}
      <p className="text-base leading-relaxed text-[#4a4455] md:text-base">
        You're 60% through this module. Complete the
        <br />
        next 3 lessons to earn the &ldquo;Specialist&rdquo; badge!
      </p>

      {/* Continue Learning Button */}
      <div className="relative inline-flex w-fit">
        <div className="absolute inset-0 rounded-lg bg-white/40 blur-sm" />
        <Button
          variant="primary"
          className="relative z-10 flex items-center gap-2 rounded-lg bg-[#630ed4] px-8 py-3 text-base font-medium text-white shadow-[0_4px_14px_rgba(99,14,212,0.3)] transition-all duration-200 hover:bg-primary-900 active:scale-[0.98]"
        >
          Continue Learning
          <img src={arrowRightUrl} alt="Arrow right" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

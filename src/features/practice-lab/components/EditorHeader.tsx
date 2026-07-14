import codebiteLogoUrl from '../../../assets/logo/Codebite logo.svg';
import playIconUrl from '../../../assets/icons/practice-play.svg';

interface EditorHeaderProps {
  onRun?: () => void;
  onSave?: () => void;
  onExit?: () => void;
  isRunning?: boolean;
}

export function EditorHeader({
  onRun,
  onSave,
  onExit,
  isRunning,
}: EditorHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between bg-[#2D1F5E] px-4">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-1.5">
          <img
            src={codebiteLogoUrl}
            alt="CodeBite"
            className="h-7 w-7 object-contain"
          />
        </a>
        <div className="h-5 w-px bg-white/20" />
        <span className="text-sm font-medium text-white/90">
          Try It Yourself -{' '}
          <span className="text-primary-300">C++ Mastery</span>
        </span>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-bold text-white transition-all active:scale-[0.97] ${
            isRunning
              ? 'bg-danger-500/50 cursor-not-allowed'
              : 'bg-danger-500 hover:bg-danger-700'
          }`}
        >
          {!isRunning && <img src={playIconUrl} alt="" className="h-3 w-3" />}
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/20 active:scale-[0.97]"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#FF4B4B] hover:bg-[#E03A3A] px-4 py-1.5 text-sm font-bold text-white transition-all active:scale-[0.97]"
        >
          Thoát
        </button>
      </div>
    </header>
  );
}

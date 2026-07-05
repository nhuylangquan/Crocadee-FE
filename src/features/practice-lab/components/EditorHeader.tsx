import codebiteLogoUrl from '../../../assets/logo/Codebite logo.svg';

interface EditorHeaderProps {
  onRun?: () => void;
  onSave?: () => void;
  isRunning?: boolean;
}

export function EditorHeader({ onRun, onSave, isRunning }: EditorHeaderProps) {
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
          {!isRunning && (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1L9 6L1 11V1Z" fill="white" />
            </svg>
          )}
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white/20 active:scale-[0.97]"
        >
          Save
        </button>
      </div>
    </header>
  );
}

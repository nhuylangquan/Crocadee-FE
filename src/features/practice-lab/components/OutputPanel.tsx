import terminalIconUrl from '../../../assets/icons/practice-terminal.svg';

interface OutputPanelProps {
  output: string;
  onClear?: () => void;
}

export function OutputPanel({ output, onClear }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col bg-shade-white">
      {/* Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <img src={terminalIconUrl} alt="" className="h-3.5 w-3.5" />
          <span className="text-sm font-semibold text-neutral-700">Output</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer text-xs font-medium text-neutral-400 transition hover:text-neutral-600"
        >
          ⊘ Clear
        </button>
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-neutral-800">
          {output}
        </pre>
      </div>
    </div>
  );
}

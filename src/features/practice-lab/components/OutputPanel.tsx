interface OutputPanelProps {
  output: string;
  onClear?: () => void;
}

export function OutputPanel({ output, onClear }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="12"
              height="12"
              rx="2"
              stroke="#6C63FF"
              strokeWidth="1.3"
            />
            <path
              d="M4 5L6 7L4 9"
              stroke="#6C63FF"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="7.5"
              y1="9"
              x2="10"
              y2="9"
              stroke="#6C63FF"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
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

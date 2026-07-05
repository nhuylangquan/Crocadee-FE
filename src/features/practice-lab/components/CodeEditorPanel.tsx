import Editor from '@monaco-editor/react';

interface CodeEditorPanelProps {
  code: string;
  onChange?: (value: string | undefined) => void;
}

export function CodeEditorPanel({ code, onChange }: CodeEditorPanelProps) {
  return (
    <div className="flex h-full flex-col bg-[#1E1E2E]">
      {/* File Tab Bar */}
      <div className="flex shrink-0 items-center border-b border-white/5 bg-[#181825] px-4 py-2">
        <div className="flex items-center gap-2 rounded-md bg-[#1E1E2E] px-3 py-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4 3L1.5 6L4 9"
              stroke="#89B4FA"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 3L10.5 6L8 9"
              stroke="#89B4FA"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-mono text-xs text-white/60">main.cpp</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={code}
          theme="vs-dark"
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'off',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 8,
            lineNumbersMinChars: 3,
            overviewRulerBorder: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { EditorHeader } from '../components/EditorHeader';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { OutputPanel } from '../components/OutputPanel';

interface PistonResponse {
  compile?: {
    code: number;
    output: string;
  };
  run?: {
    code: number;
    output: string;
  };
}

const defaultCode = `#include <iostream>

int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}`;

export function TryItYourselfPage() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('Click "Run" to execute the code.');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setOutput('Compiling and running...');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'cpp',
          version: '10.2.0',
          files: [
            {
              name: 'main.cpp',
              content: code,
            },
          ],
        }),
      });

      const data = (await response.json()) as PistonResponse;

      if (data.compile && data.compile.code !== 0) {
        setOutput(data.compile.output);
      } else {
        setOutput(data.run?.output ?? 'Program exited with no output.');
      }
    } catch (error) {
      setOutput('Error: Could not connect to the execution server.');
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    // In production, this would save the code to the backend
    console.log('Code saved:', code);
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="flex h-full flex-col bg-[#1E1E2E]">
      {/* Custom Header */}
      <EditorHeader
        onRun={() => {
          void handleRun();
        }}
        onSave={handleSave}
        isRunning={isRunning}
      />

      {/* Editor + Output Split */}
      <div className="flex min-h-0 flex-1">
        {/* Code Editor (Left) */}
        <div className="flex-1 border-r border-white/10">
          <CodeEditorPanel
            code={code}
            onChange={(v) => {
              setCode(v ?? '');
            }}
          />
        </div>

        {/* Output Panel (Right) */}
        <div className="flex-1">
          <OutputPanel output={output} onClear={handleClear} />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { EditorHeader } from '../components/EditorHeader';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { OutputPanel } from '../components/OutputPanel';

interface SandboxResponse {
  success: boolean;
  output: string;
  error?: string;
  compilationError?: string;
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
      const response = await fetch('http://localhost:3000/sandbox/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'cpp',
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${String(response.status)}`);
      }

      const data = (await response.json()) as SandboxResponse;

      if (!data.success) {
        if (data.compilationError) {
          setOutput(`Compilation Error:\n${data.compilationError}`);
        } else {
          setOutput(
            `Execution Error:\n${data.error ?? 'Unknown error'}\n\nOutput:\n${data.output}`
          );
        }
      } else {
        setOutput(data.output || 'Program exited with no output.');
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

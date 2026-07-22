import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/axios';
import { EditorHeader } from '../components/EditorHeader';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { OutputPanel } from '../components/OutputPanel';
import { AIDebugPanel } from '../components/AIDebugPanel';

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
}
`;

export function TryItYourselfPage() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('Click "Run" to execute the code.');

  const queryParams = new URLSearchParams(window.location.search);
  const lessonId = queryParams.get('lessonId');

  useEffect(() => {
    if (!lessonId) return;

    const fetchLessonCode = async () => {
      try {
        const res: unknown = await apiClient.get(`/lessons/${lessonId}`);
        const data = (
          res && typeof res === 'object' && 'data' in res
            ? (res as { data: { code?: string } }).data
            : res
        ) as { code?: string } | null | undefined;

        if (data?.code) {
          setCode(data.code);
        }
      } catch (error) {
        console.error('Error fetching lesson code:', error);
      }
    };

    void fetchLessonCode();
  }, [lessonId]);
  const [isRunning, setIsRunning] = useState(false);

  const [activeTab, setActiveTab] = useState<'output' | 'debug'>('output');

  const [errorMessage, setErrorMessage] = useState('');
  const [debugRequestId, setDebugRequestId] = useState(0);

  const handleRun = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setOutput('Compiling and running...');

    try {
      const res: unknown = await apiClient.post('/sandbox/execute', {
        language: 'cpp',
        code,
      });

      const data = res as SandboxResponse | null | undefined;

      if (!data?.success) {
        const detectedError =
          data?.compilationError ?? data?.error ?? 'Unknown execution error';

        setErrorMessage(detectedError);
        setActiveTab('debug');
        setDebugRequestId((prev) => prev + 1);

        if (data?.compilationError) {
          setOutput(`Compilation Error:\n${data.compilationError}`);
        } else {
          setOutput(
            `Execution Error:\n${detectedError}\n\nOutput:\n${data?.output ?? ''}`
          );
        }
      } else {
        setErrorMessage('');
        setActiveTab('output');
        setOutput(data.output || 'Program exited with no output.');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error occurred';

      setOutput(message);
      setErrorMessage(message);
      setActiveTab('debug');
      setDebugRequestId((prev) => prev + 1);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    console.log('Code saved:', code);
  };

  const handleExit = () => {
    if (window.history.length > 1) {
      window.close();
      setTimeout(() => {
        window.location.href = '/practice-lab';
      }, 100);
    } else {
      window.location.href = '/practice-lab';
    }
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="flex h-full flex-col bg-[#1E1E2E]">
      <EditorHeader
        onRun={() => {
          void handleRun();
        }}
        onSave={handleSave}
        onExit={handleExit}
        isRunning={isRunning}
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex-1 border-r border-white/10">
          <CodeEditorPanel
            code={code}
            onChange={(value) => {
              setCode(value ?? '');
            }}
          />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex border-b border-white/10 bg-[#25233B]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('output');
              }}
              className={`px-5 py-3 text-sm font-semibold ${
                activeTab === 'output'
                  ? 'border-b-2 border-[#6C63FF] text-white'
                  : 'text-white/60'
              }`}
            >
              Output
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('debug');
              }}
              className={`px-5 py-3 text-sm font-semibold ${
                activeTab === 'debug'
                  ? 'border-b-2 border-[#6C63FF] text-white'
                  : 'text-white/60'
              }`}
            >
              🤖 Debug
            </button>
          </div>

          <div className="min-h-0 flex-1">
            {activeTab === 'output' ? (
              <OutputPanel output={output} onClear={handleClear} />
            ) : (
              <AIDebugPanel
                code={code}
                errorMessage={errorMessage}
                requestId={debugRequestId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

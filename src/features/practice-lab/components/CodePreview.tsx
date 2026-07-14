import fileIconUrl from '../../../assets/icons/practice-file.svg';
import type { LessonData } from '../data/lessonData';

interface CodePreviewProps {
  lesson: LessonData;
}

export function CodePreview({ lesson }: CodePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#171721] shadow-xl">
      {/* File Tab */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#171721] px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-xs text-white/40">
          <img src={fileIconUrl} alt="" className="h-3.5 w-3.5" />
          {lesson.codeFilename ?? 'main.cpp'}
        </div>
      </div>

      {/* Code Content */}
      <div className="p-6 font-mono text-[14px] leading-7 overflow-x-auto">
        <pre className="text-white/90 whitespace-pre">
          <code>{lesson.code ?? '// No code example for this lesson.'}</code>
        </pre>
      </div>

      {/* Console Output Footer */}
      <div className="border-t border-white/5 bg-[#1C1C28] p-5 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
              CONSOLE OUTPUT
            </p>
            <p className="font-mono text-sm text-[#A6E3A1]">
              {lesson.output ?? '> Program exited.'}
            </p>
            <p className="mt-1 font-mono text-xs text-white/30">
              Program exited with code 0
            </p>
          </div>
          <a
            href={`/practice-lab/try-it?lessonId=${lesson.lessonId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#2563EB] active:scale-[0.97]"
          >
            Try it Yourself »
          </a>
        </div>
      </div>
    </div>
  );
}

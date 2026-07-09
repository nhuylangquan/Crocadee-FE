import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../../../components/ui/Button';
import type { GuessOutputQuestion } from './guessOutputData';
import { DEMO_QUESTIONS } from './guessOutputData';

type GamePhase = 'playing' | 'correct' | 'incorrect' | 'finished';

interface GuessOutputScreenProps {
  questions?: GuessOutputQuestion[];
}

const TOTAL_QUESTIONS = 5;
const TIMER_TOTAL = 30;

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

function getOptionEntry(
  o: GuessOutputQuestion['o'],
  idx: number
): [string, string] {
  const entries = Object.entries(o);
  return entries[idx] ?? ['a', ''];
}

export function GuessOutputScreen({
  questions = DEMO_QUESTIONS,
}: GuessOutputScreenProps) {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiryRef = useRef<number>(0);

  const totalQuestions = Math.min(questions.length, TOTAL_QUESTIONS);
  const question = questions[currentQ] ?? questions[0];
  const isLastQuestion = currentQ >= totalQuestions - 1;

  /* ── Extract code from question text ────────────────── */
  const questionParts = question.q.split('\n');
  const questionHeading = questionParts[0] ?? '';
  const questionCode = questionParts.slice(1).join('\n').trim();

  /* ── Timer ──────────────────────────────────────────── */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase !== 'playing') {
      clearTimer();
      return;
    }

    expiryRef.current = Date.now() + TIMER_TOTAL * 1000;

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, expiryRef.current - Date.now());
      const seconds = Math.ceil(remaining / 1000);
      setTimeLeft(seconds);

      if (remaining <= 0) {
        clearTimer();
        setPhase('incorrect');
        setSelectedIdx(null);
      }
    }, 200);

    return clearTimer;
  }, [phase, currentQ, clearTimer]);

  /* ── Select an answer ───────────────────────────────── */
  const handleSelect = (idx: number) => {
    if (phase !== 'playing') return;
    setSelectedIdx(idx);
    clearTimer();

    const isCorrect = idx === question.c;
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((s) => s + 150 * newCombo);
      setPhase('correct');
    } else {
      setCombo(0);
      setPhase('incorrect');
    }
  };

  /* ── Advance / Skip ─────────────────────────────────── */
  const handleNext = () => {
    if (isLastQuestion) {
      setPhase('finished');
      return;
    }
    setCurrentQ((q) => q + 1);
    setPhase('playing');
    setSelectedIdx(null);
  };

  const handleSkip = () => {
    if (phase !== 'playing') return;
    clearTimer();
    setCombo(0);
    setSelectedIdx(null);
    setPhase('incorrect');
  };

  const handleBackToHub = () => {
    void navigate({ to: '/coderush' });
  };

  /* ── Option styling helpers ─────────────────────────── */
  const getOptionClass = (idx: number) => {
    const base =
      'flex h-[86px] cursor-pointer items-center rounded-[12px] border bg-white px-5 transition-all duration-200 hover:border-primary-300 hover:bg-[#F8F4FF]';

    if (phase === 'playing') {
      return `${base} border-[#CCC3D7] ${
        selectedIdx === idx ? 'border-primary-300 bg-[#F8F4FF]' : ''
      }`;
    }

    if (idx === question.c) {
      return `${base} border-[#006B5A] bg-[#E6F9F6]`;
    }
    if (idx === selectedIdx && idx !== question.c) {
      return `${base} border-[#BA1A1A] bg-[#FFF0F0]`;
    }
    return `${base} border-[#CCC3D7] opacity-60`;
  };

  const getBadgeClass = (idx: number) => {
    if (phase === 'playing') {
      return 'bg-[#EDE9F5]';
    }
    if (idx === question.c) return 'bg-[#CCEFE9]';
    if (idx === selectedIdx && idx !== question.c) return 'bg-[#FFDAD6]';
    return 'bg-[#EBEBEB]';
  };

  const getTextClass = (idx: number) => {
    if (phase === 'playing') return 'text-[#151C27]';
    if (idx === question.c) return 'text-[#006B5A]';
    if (idx === selectedIdx && idx !== question.c) return 'text-[#BA1A1A]';
    return 'text-[#4A4454]';
  };

  /* ═══════════════════════════════════════════════════════
     RENDER: Completion Popup
     ═══════════════════════════════════════════════════════ */
  if (phase === 'finished') {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[#F9F9FF]">
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="pointer-events-none absolute inset-0 bg-[#1C1B1B]/46" />

          <div className="relative z-10 mx-4 w-full max-w-148.75 overflow-hidden rounded-[14px] border border-[#E5E2E180] bg-white shadow-lg">
            <div className="flex flex-col items-center px-7 pb-6 pt-10 text-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary-500">
                <span className="text-4xl">{'\u{1F3C6}'}</span>
              </div>
              <h2 className="text-[32px] font-extrabold text-[#151C27]">
                Challenge Complete!
              </h2>
              <p className="mt-2 text-base text-[#4A4454]">
                You scored{' '}
                <span className="font-bold text-primary-900">{score}</span> XP
              </p>
            </div>

            <div className="border-y border-[#E5E2E1] bg-[#FAFAFA] px-7 py-5">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-[#151C27]">{combo}</p>
                  <p className="text-sm text-[#4A4454]">Best Combo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#151C27]">
                    {score}/{totalQuestions * 150}
                  </p>
                  <p className="text-sm text-[#4A4454]">Total Score</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-5">
              <Button variant="primary" onClick={handleBackToHub}>
                Back to CodeRush
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Main Game Screen
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-1 min-h-0 flex-col bg-[#F9F9FF]">
      {/* HUD */}
      <div className="flex h-11 shrink-0 items-center bg-[#EEEAFF] px-6 md:px-71">
        <span className="text-[13px] leading-4 text-[#4A4454]">
          Guess Output · Logic & Syntax
        </span>

        <div
          className={`ml-auto flex h-9 items-center gap-2 rounded-lg border px-3 text-sm leading-4 font-medium ${
            timeLeft <= 5
              ? 'border-[#FFCDD2] bg-[#FFF0F0] text-[#BA1A1A]'
              : 'border-[#CCC3D7] bg-white text-[#4A4454]'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 4.5V8L10.5 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>{timeLeft}s</span>
        </div>

        <span className="ml-6 text-[13px] leading-4 text-[#4A4454]">
          Q {currentQ + 1} / {totalQuestions}
        </span>
      </div>

      {/* Combo Banner */}
      {phase === 'correct' && combo >= 2 && (
        <div className="flex shrink-0 items-center justify-end px-71 py-2">
          <div className="flex items-center gap-3 rounded-lg bg-[#E6F9F6] px-6 py-3">
            <span className="text-lg font-bold text-[#006B5A]">
              {'\u{1F525}'} COMBO INCREASED! {'\u00D7'}
              {combo}
            </span>
            <span className="text-sm text-[#006B5A]">
              You're on fire! Keep it going!
            </span>
          </div>
        </div>
      )}

      {/* Scrollable content area — buttons are outside this */}
      <div className="flex min-h-0 flex-1 gap-8 overflow-y-auto px-6 py-6 md:px-71">
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="text-[28px] leading-[1.2] font-extrabold text-[#151C27]">
            {questionHeading}
          </h2>

          <div className="mt-4.5 overflow-hidden rounded-[10px] bg-[#1E1E1E] p-5">
            <div className="mb-2 flex items-center gap-3 border-b border-[#374151] pb-1.5">
              <span className="font-mono text-[13px] text-[#6B7280]">
                python
              </span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[15px] leading-7 text-[#DCE2F3]">
              {questionCode || 'No code snippet available'}
            </pre>
          </div>

          <p className="mt-5 text-[14px] font-medium text-[#4A4454]">
            Select the correct answer:
          </p>

          <div className="mt-3 grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((idx) => {
              const [key, value] = getOptionEntry(question.o, idx);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    handleSelect(idx);
                  }}
                  disabled={phase !== 'playing'}
                  className={getOptionClass(idx)}
                >
                  <span
                    className={`mr-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px] font-bold ${getBadgeClass(idx)} ${getTextClass(idx)}`}
                  >
                    {OPTION_LABELS[idx]}
                  </span>

                  <span
                    className={`text-[18px] font-medium ${getTextClass(idx)}`}
                  >
                    {value}
                  </span>

                  {phase !== 'playing' && idx === question.c && (
                    <span className="ml-auto text-lg font-bold text-[#006B5A]">
                      {'\u2713'}
                    </span>
                  )}
                  {phase !== 'playing' &&
                    idx === selectedIdx &&
                    idx !== question.c && (
                      <span className="ml-auto text-lg font-bold text-[#BA1A1A]">
                        {'\u2717'}
                      </span>
                    )}
                </button>
              );
            })}
          </div>

          {/* No buttons inside scrollable area — moved to fixed bottom bar */}
        </div>

        {/* AI Tutor side panel — only on xl+ */}
        {phase === 'incorrect' && (
          <div className="hidden w-110 shrink-0 xl:block">
            <div className="sticky top-0 overflow-hidden rounded-2xl border border-[#CCC3D7] bg-white shadow-sm">
              <div className="flex items-center gap-3 bg-[#380080] px-5 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">
                  {'\u{1F916}'}
                </span>
                <span className="text-base font-semibold text-white">
                  AI Tutor
                </span>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#4A4454]">
                    Your Answer
                  </p>
                  <div className="flex items-center gap-3 rounded-lg border border-[#BA1A1A] bg-[#FFF0F0] px-4 py-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FFDAD6] text-sm font-bold text-[#BA1A1A]">
                      {OPTION_LABELS[selectedIdx ?? 0]}
                    </span>
                    <span className="text-sm font-medium text-[#BA1A1A]">
                      {selectedIdx !== null
                        ? Object.values(question.o)[selectedIdx]
                        : '\u2014'}
                    </span>
                    <span className="ml-auto text-[#BA1A1A]">{'\u2717'}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#4A4454]">
                    Correct Answer
                  </p>
                  <div className="flex items-center gap-3 rounded-lg border border-[#006B5A] bg-[#E6F9F6] px-4 py-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#CCEFE9] text-sm font-bold text-[#006B5A]">
                      {OPTION_LABELS[question.c]}
                    </span>
                    <span className="text-sm font-medium text-[#006B5A]">
                      {Object.values(question.o)[question.c]}
                    </span>
                    <span className="ml-auto text-[#006B5A]">{'\u2713'}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#4A4454]">
                    Explanation
                  </p>
                  <div className="rounded-[10px] bg-[#F6F3F2] p-4 text-sm leading-6 text-[#4A4454]">
                    {question.ex ?? 'No explanation available.'}
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#4A4454]">
                    Code Pattern
                  </p>
                  <div className="overflow-hidden rounded-lg bg-[#1E1E1E] p-3">
                    <pre className="overflow-x-auto font-mono text-xs leading-5 text-[#DCE2F3]">
                      {questionCode || 'No code snippet available'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom action bar */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E2E1] bg-white px-6 py-3 md:px-71">
        {phase === 'playing' ? (
          <Button
            variant="choice"
            onClick={handleSkip}
            className="h-11! w-auto! rounded-[10px] border border-[#CCC3D7] bg-white px-5 py-2.5 text-sm font-medium text-[#4A4454] hover:bg-[#F8F4FF]"
          >
            Skip {'\u2192'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            className="h-11! w-auto! px-6"
          >
            {isLastQuestion ? 'See Results' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  );
}

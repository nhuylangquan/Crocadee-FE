import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { CompletionPopup } from '../../../components/coderush/CompletionPopup';
import type { RearrangeQuestion } from './rearrangeData';
import { validateRearrangeAnswer } from './api/rearrangeApi';

type GamePhase = 'playing' | 'checking' | 'correct' | 'incorrect' | 'finished';

interface RearrangeScreenProps {
  questions?: RearrangeQuestion[];
}

const TOTAL_QUESTIONS = 5;
const TIMER_TOTAL = 45;

export function RearrangeScreen({ questions = [] }: RearrangeScreenProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [orderedLines, setOrderedLines] = useState<string[]>(
    () => questions[0]?.lines ?? []
  );
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiryRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState('0:00');
  const [accuracy, setAccuracy] = useState(0);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const totalQuestions = Math.min(questions.length, TOTAL_QUESTIONS);
  const question = questions[currentQ] ?? questions[0];
  const isLastQuestion = currentQ >= totalQuestions - 1;

  const questionKey = question.id;

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
    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }
    expiryRef.current = Date.now() + TIMER_TOTAL * 1000;
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, expiryRef.current - Date.now());
      const seconds = Math.ceil(remaining / 1000);
      setTimeLeft(seconds);
      if (remaining <= 0) {
        clearTimer();
        setPhase('incorrect');
      }
    }, 200);
    return () => {
      clearTimer();
    };
  }, [phase, currentQ, clearTimer]);

  /* ── Calculate final stats when game finishes ───────── */
  useEffect(() => {
    if (phase !== 'finished') return;
    const elapsedMs = Date.now() - startTimeRef.current;
    const totalSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const newAccuracy =
      answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const t = setTimeout(() => {
      setTimeTaken(`${String(mins)}:${secs.toString().padStart(2, '0')}`);
      setAccuracy(newAccuracy);
    }, 0);
    return () => {
      clearTimeout(t);
    };
  }, [phase, correctCount, answeredCount]);

  /* ── Drag & Drop handlers ───────────────────────────── */
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newLines = [...orderedLines];
    const [moved] = newLines.splice(dragIdx, 1);
    newLines.splice(idx, 0, moved);
    setOrderedLines(newLines);
    setDragIdx(idx);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
  };

  const moveLine = (idx: number, direction: 'up' | 'down') => {
    const newLines = [...orderedLines];
    if (direction === 'up' && idx > 0) {
      [newLines[idx - 1], newLines[idx]] = [newLines[idx], newLines[idx - 1]];
    } else if (direction === 'down' && idx < newLines.length - 1) {
      [newLines[idx], newLines[idx + 1]] = [newLines[idx + 1], newLines[idx]];
    } else {
      return;
    }
    setOrderedLines(newLines);
  };

  const handleConfirm = async () => {
    if (phase !== 'playing') return;
    clearTimer();
    setPhase('checking');
    setAnsweredCount((c) => c + 1);
    try {
      const result = await validateRearrangeAnswer(question.id, orderedLines);
      if (result.correct) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        setScore((s) => s + 150 * newCombo);
        setCorrectCount((c) => c + 1);
        setPhase('correct');
      } else {
        setCombo(0);
        setPhase('incorrect');
      }
    } catch {
      setCombo(0);
      setPhase('incorrect');
    }
  };

  const handleSkip = () => {
    if (phase !== 'playing') return;
    clearTimer();
    setCombo(0);
    setAnsweredCount((c) => c + 1);
    setPhase('incorrect');
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setPhase('finished');
      return;
    }
    setCurrentQ((q) => q + 1);
    setOrderedLines(questions[currentQ + 1]?.lines ?? []);
    setPhase('playing');
    setDragIdx(null);
    setTimeLeft(TIMER_TOTAL);
  };

  /* ── Finished screen ─────────────────────────────────── */
  if (phase === 'finished') {
    return (
      <CompletionPopup
        xpEarned={score}
        timeTaken={timeTaken}
        accuracy={accuracy}
        badgeName="Code Architect"
        badgeDescription="You mastered the code ordering and earned the "
      />
    );
  }

  /* ── Main game screen ──────────────────────────────── */
  return (
    <div className="flex flex-1 min-h-0 flex-col bg-bg-default">
      {/* HUD */}
      <div className="flex h-11 shrink-0 items-center bg-primary-100 px-6 md:px-71">
        <span className="text-[13px] leading-4 text-neutral-700">
          Rearrange Code · Logic & Syntax
        </span>
        <div
          className={`ml-auto flex h-9 items-center gap-2 rounded-lg border px-3 text-sm leading-4 font-medium ${
            timeLeft <= 5
              ? 'border-danger-100 bg-danger-100 text-danger-500'
              : 'border-[#CCC3D7] bg-shade-white text-neutral-700'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
        <span className="ml-6 text-[13px] leading-4 text-neutral-700">
          Q {currentQ + 1} / {totalQuestions}
        </span>
      </div>

      {/* Combo Banner */}
      {phase === 'correct' && combo >= 2 && (
        <div className="flex shrink-0 items-center justify-end px-71 py-2">
          <div className="flex items-center gap-3 rounded-lg bg-tertiary-100 px-6 py-3">
            <span className="text-lg font-bold text-tertiary-900">
              {'\u{1F525}'} COMBO INCREASED! {'\u00D7'}
              {combo}
            </span>
            <span className="text-sm text-tertiary-900">
              You're on fire! Keep it going!
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6 md:px-71">
        <h2 className="text-[22px] leading-[1.2] font-extrabold text-neutral-900">
          {question.q}
        </h2>
        <p className="mt-3 text-[14px] font-medium text-neutral-700">
          Drag the lines into the correct order:
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {orderedLines.length === 0 && (
            <p className="text-sm text-neutral-500">Loading code lines...</p>
          )}
          {orderedLines.map((line, idx) => (
            <div
              key={`q${questionKey}-${String(idx)}`}
              draggable={phase === 'playing'}
              onDragStart={() => {
                handleDragStart(idx);
              }}
              onDragOver={(e) => {
                handleDragOver(e, idx);
              }}
              onDragEnd={handleDragEnd}
              className={`flex items-center rounded-[10px] border bg-shade-white transition-all duration-150 ${
                phase === 'playing'
                  ? 'cursor-grab border-[#CCC3D7] hover:border-primary-300 hover:bg-[#F8F4FF] active:cursor-grabbing'
                  : phase === 'correct'
                    ? 'border-success-500 bg-success-100'
                    : 'border-danger-500 bg-danger-100'
              } ${dragIdx === idx ? 'opacity-60 shadow-md' : ''}`}
            >
              {/* Drag handle */}
              <div className="flex shrink-0 items-center px-3 py-3 text-neutral-400">
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  fill="currentColor"
                >
                  <circle cx="3" cy="2" r="1.5" />
                  <circle cx="9" cy="2" r="1.5" />
                  <circle cx="3" cy="8" r="1.5" />
                  <circle cx="9" cy="8" r="1.5" />
                  <circle cx="3" cy="14" r="1.5" />
                  <circle cx="9" cy="14" r="1.5" />
                </svg>
              </div>
              <span className="mr-3 w-6 shrink-0 text-right font-mono text-[13px] text-neutral-400">
                {idx + 1}
              </span>
              <span className="flex-1 py-3 pr-3 font-mono text-[14px] leading-5 text-neutral-900">
                {line}
              </span>

              {phase === 'playing' && (
                <div className="flex shrink-0 flex-col gap-0.5 pr-2">
                  <button
                    type="button"
                    onClick={() => {
                      moveLine(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-[#EDE9F5] hover:text-primary-900 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="currentColor"
                    >
                      <path d="M4 0L8 6H0L4 0Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      moveLine(idx, 'down');
                    }}
                    disabled={idx === orderedLines.length - 1}
                    className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-[#EDE9F5] hover:text-primary-900 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="currentColor"
                    >
                      <path d="M4 6L0 0H8L4 6Z" />
                    </svg>
                  </button>
                </div>
              )}

              {phase !== 'playing' && phase !== 'checking' && (
                <span
                  className={`mr-3 text-lg font-bold ${phase === 'correct' ? 'text-success-500' : 'text-danger-500'}`}
                >
                  {phase === 'correct' ? '\u2713' : '\u2717'}
                </span>
              )}
            </div>
          ))}
        </div>

        {phase === 'checking' && (
          <div className="mt-6 flex items-center justify-center">
            <span className="text-sm text-primary-900">
              Checking your answer...
            </span>
          </div>
        )}

        {(phase === 'correct' || phase === 'incorrect') && (
          <div
            className={`mt-6 rounded-2xl border bg-shade-white p-6 shadow-sm ${phase === 'correct' ? 'border-success-500' : 'border-danger-500'}`}
          >
            <p
              className={`text-center text-lg font-bold ${phase === 'correct' ? 'text-success-500' : 'text-danger-500'}`}
            >
              {phase === 'correct'
                ? 'Correct! Well done!'
                : 'Incorrect. Try the next one!'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E2E1] bg-shade-white px-6 py-3 md:px-71">
        {phase === 'playing' && (
          <>
            <Button
              variant="choice"
              onClick={handleSkip}
              className="h-11! w-auto! rounded-[10px] border border-[#CCC3D7] bg-shade-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-[#F8F4FF]"
            >
              Skip {'\u2192'}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                void handleConfirm();
              }}
              disabled={orderedLines.length === 0}
              className="h-11! w-auto! px-6"
            >
              Confirm {'\u2713'}
            </Button>
          </>
        )}
        {phase === 'checking' && (
          <span className="text-sm text-neutral-700">Checking...</span>
        )}
        {(phase === 'correct' || phase === 'incorrect') && (
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

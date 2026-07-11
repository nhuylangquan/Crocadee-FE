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
  const startTimeRef = useRef(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState('0:00');
  const [accuracy, setAccuracy] = useState(0);

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

    /* Record the very first time we enter 'playing' mode as session start */
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
        setSelectedIdx(null);
      }
    }, 200);

    return clearTimer;
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

    // Defer state updates to avoid synchronous setState calls inside effect
    const t = setTimeout(() => {
      setTimeTaken(`${String(mins)}:${secs.toString().padStart(2, '0')}`);
      setAccuracy(newAccuracy);
    }, 0);

    return () => {
      clearTimeout(t);
    };
  }, [phase, correctCount, answeredCount]);

  /* ── Select an answer ───────────────────────────────── */
  const handleSelect = (idx: number) => {
    if (phase !== 'playing') return;
    setSelectedIdx(idx);
    clearTimer();

    const isCorrect = idx === question.c;
    setAnsweredCount((c) => c + 1);
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((s) => s + 150 * newCombo);
      setCorrectCount((c) => c + 1);
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
    setAnsweredCount((c) => c + 1);
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
     RENDER: Completion Popup — Figma "S3 · Completion Popup"
     ═══════════════════════════════════════════════════════ */
  if (phase === 'finished') {
    const xpEarned = score;

    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[#F9F9FF]">
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
          {/* Dim overlay */}
          <div className="pointer-events-none fixed inset-0 bg-[#1C1B1B]/46" />

          {/* Modal */}
          <div className="relative z-10 mx-auto w-full max-w-148.75 overflow-y-auto rounded-[14px] border border-[#E5E2E180] bg-white shadow-lg max-h-[calc(100vh-80px)]">
            {/* Close button */}
            <button
              type="button"
              onClick={handleBackToHub}
              className="absolute right-3.75 top-3.75 z-20 flex h-[26.56px] w-[26.56px] items-center justify-center rounded-full transition-colors hover:bg-[#F0EDED]"
              aria-label="Close"
            >
              <svg
                width="12.4"
                height="12.4"
                viewBox="0 0 12.4 12.4"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12.4 1.0475L11.3525 0L6.2 5.1525L1.0475 0L0 1.0475L5.1525 6.2L0 11.3525L1.0475 12.4L6.2 7.2475L11.3525 12.4L12.4 11.3525L7.2475 6.2L12.4 1.0475Z"
                  fill="#4A4454"
                />
              </svg>
            </button>

            {/* Hero Area */}
            <div className="flex flex-col items-center pt-[42.5px] pb-0">
              {/* Glow & Badge */}
              <div className="relative mb-[21.25px]">
                {/* Glow circle */}
                <div className="absolute left-1/2 top-1/2 h-42.5 w-42.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FFBDB]/30" />
                {/* Badge image */}
                <div className="relative flex h-[113.33px] w-[113.33px] items-center justify-center">
                  <svg
                    width="113.33"
                    height="113.33"
                    viewBox="0 0 113.33 113.33"
                    fill="none"
                    aria-hidden="true"
                  >
                    {/* Badge circle */}
                    <circle cx="56.665" cy="56.665" r="56.665" fill="#380080" />
                    {/* Inner ring */}
                    <circle
                      cx="56.665"
                      cy="56.665"
                      r="46.665"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                    {/* Lightning bolt */}
                    <path
                      d="M63.665 35.665L46.665 55.665H56.665L49.665 75.665L70.665 52.665H59.665L63.665 35.665Z"
                      fill="#FFD700"
                    />
                    {/* Sparkle dots */}
                    <circle cx="38" cy="38" r="2.5" fill="#FFD700" />
                    <circle cx="75" cy="30" r="1.8" fill="#FFD700" />
                    <circle cx="80" cy="70" r="2" fill="#FFD700" />
                    <circle cx="35" cy="72" r="1.5" fill="#FFD700" />
                  </svg>
                </div>
              </div>

              {/* NEW BADGE UNLOCKED label */}
              <span className="mb-1 text-center text-[12.4px] font-bold tracking-[1.24px] text-[#006B5A]">
                NEW BADGE UNLOCKED
              </span>

              {/* Quest Complete title */}
              <h2 className="text-[31.88px] font-bold leading-[38.25px] text-[#380080]">
                Quest Complete!
              </h2>

              {/* Subtitle */}
              <p className="mx-auto mt-2 max-w-101.25 text-center text-[18px] leading-[28.8px] text-[#4A4454]">
                You dominated the logic challenges and earned the{' '}
                <span className="font-semibold">Speed Demon</span> badge
              </p>
            </div>

            {/* Content / Stats Area */}
            <div className="px-[28.33px] pt-0 pb-[28.33px]">
              {/* Main Stats Grid (3 columns) — includes XP Earned inside the grid */}
              <div className="mt-[28.33px] grid grid-cols-3 gap-3">
                {/* Time Taken */}
                <div className="flex flex-col items-center rounded-[10.625px] border border-[#E5E2E14D] bg-[#F0EDED] px-[14.17px] pt-[14.17px] pb-[14.17px]">
                  <svg
                    width="18"
                    height="21"
                    viewBox="0 0 18 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 2V0H12V2H6ZM8 13H10V7H8V13ZM9 21C7.76667 21 6.60417 20.7625 5.5125 20.2875C4.42083 19.8125 3.46667 19.1667 2.65 18.35C1.83333 17.5333 1.1875 16.5792 0.7125 15.4875C0.2375 14.3958 0 13.2333 0 12C0 10.7667 0.2375 9.60417 0.7125 8.5125C1.1875 7.42083 1.83333 6.46667 2.65 5.65C3.46667 4.83333 4.42083 4.1875 5.5125 3.7125C6.60417 3.2375 7.76667 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L16.05 3.55L17.45 4.95L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7625 14.3958 17.2875 15.4875C16.8125 16.5792 16.1667 17.5333 15.35 18.35C14.5333 19.1667 13.5792 19.8125 12.4875 20.2875C11.3958 20.7625 10.2333 21 9 21ZM9 19C10.9333 19 12.5833 18.3167 13.95 16.95C15.3167 15.5833 16 13.9333 16 12C16 10.0667 15.3167 8.41667 13.95 7.05C12.5833 5.68333 10.9333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 13.9333 2.68333 15.5833 4.05 16.95C5.41667 18.3167 7.06667 19 9 19Z"
                      fill="#7238D5"
                    />
                  </svg>
                  <span className="text-[17.7px] font-semibold leading-5.75 text-[#1C1B1B]">
                    {timeTaken}
                  </span>
                  <span className="mt-1 text-[10.625px] font-medium tracking-[0.53px] text-[#4A4454]">
                    TIME TAKEN
                  </span>
                </div>

                {/* Accuracy */}
                <div className="relative flex flex-col items-center rounded-[10.625px] border border-[#E5E2E14D] bg-[#F0EDED] px-[14.17px] pt-[14.17px] pb-[14.17px]">
                  {/* Green overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-[10.625px] bg-[#006B5A0D]" />
                  <svg
                    width="22"
                    height="21"
                    viewBox="0 0 22 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z"
                      fill="#006B5A"
                    />
                  </svg>
                  <span className="text-[17.7px] font-semibold leading-5.75 text-[#1C1B1B]">
                    {accuracy}%
                  </span>
                  <span className="mt-1 text-[10.625px] font-medium tracking-[0.53px] text-[#4A4454]">
                    ACCURACY
                  </span>
                </div>

                {/* XP Earned — now inside the 3-column grid */}
                <div className="flex flex-col items-center rounded-[10.625px] border border-[#3800801A] bg-[#3800800D] px-[14.17px] pt-[14.17px] pb-[14.17px]">
                  <svg
                    width="10"
                    height="20"
                    viewBox="0 0 10 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0H10V7.85C10 8.23333 9.91667 8.575 9.75 8.875C9.58333 9.175 9.35 9.41667 9.05 9.6L5.5 11.7L6.2 14H10L6.9 16.2L8.1 20L5 17.65L1.9 20L3.1 16.2L0 14H3.8L4.5 11.7L0.95 9.6C0.65 9.41667 0.416667 9.175 0.25 8.875C0.0833333 8.575 0 8.23333 0 7.85V0ZM2 2V7.85L4 9.05V2H2ZM8 2H6V9.05L8 7.85V2Z"
                      fill="#380080"
                    />
                  </svg>
                  <span className="text-[17.7px] font-semibold leading-5.75 text-[#380080]">
                    +{xpEarned}
                  </span>
                  <span className="mt-1 text-[10.625px] font-medium tracking-[0.53px] text-[#4A4454]">
                    XP EARNED
                  </span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[12.4px] font-semibold leading-[17.35px] text-[#4A4454]">
                    Level 12 Progress
                  </span>
                  <span className="text-[10.625px] font-bold leading-[14.87px] text-[#380080]">
                    2,450 / 3,000 XP
                  </span>
                </div>
                <div className="mt-2.5 h-[10.63px] w-full overflow-hidden rounded-full bg-[#E5E2E1]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '70%',
                      background:
                        'linear-gradient(90deg, #380080 0%, #380080 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Bonus Breakdown List */}
              <div className="mt-5 rounded-[10.625px] border border-[#E5E2E180] bg-[#F6F3F2] px-[17.7px] py-[17.7px]">
                <span className="text-[12.4px] font-semibold leading-[17.7px] tracking-[0.62px] text-[#4A4454]">
                  REWARD BREAKDOWN
                </span>

                {/* Speed Bonus */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      width="8.26"
                      height="10.33"
                      viewBox="0 0 9 11"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M8.5 0.5L0.5 5.5H4.5L1.5 10.5L7.5 4.5H5L8.5 0.5Z"
                        fill="#006B5A"
                      />
                    </svg>
                    <span className="text-[14.17px] leading-[22.67px] text-[#1C1B1B]">
                      Speed Bonus
                    </span>
                  </div>
                  <span className="text-[12.4px] font-bold leading-[17.35px] text-[#006B5A]">
                    +100 XP
                  </span>
                </div>

                {/* Perfect Logic Bonus */}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      width="9.82"
                      height="10.33"
                      viewBox="0 0 10 11"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 0.5L6.12 3.88L9.5 5L6.12 6.12L5 9.5L3.88 6.12L0.5 5L3.88 3.88L5 0.5Z"
                        fill="#7238D5"
                      />
                    </svg>
                    <span className="text-[14.17px] leading-[22.67px] text-[#1C1B1B]">
                      Perfect Logic Bonus
                    </span>
                  </div>
                  <span className="text-[12.4px] font-bold leading-[17.35px] text-[#7238D5]">
                    +200 XP
                  </span>
                </div>

                {/* 5 Day Streak Multiplier */}
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      width="8.26"
                      height="9.81"
                      viewBox="0 0 9 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4.5 0.5C3.5 1 2.5 2.5 2.5 4C2.5 5.5 3.5 6.5 4.5 7C5.5 6.5 6.5 5.5 6.5 4C6.5 2.5 5.5 1 4.5 0.5Z"
                        fill="#722A00"
                      />
                      <path
                        d="M2 8.5C2 9.5 3 9.75 4.5 9.75C6 9.75 7 9.5 7 8.5"
                        stroke="#722A00"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-[14.17px] leading-[22.67px] text-[#1C1B1B]">
                      5 Day Streak Multiplier
                    </span>
                  </div>
                  <span className="text-[12.4px] font-bold leading-[17.35px] text-[#722A00]">
                    1.5x
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions (Footer) */}
            <div className="flex items-center justify-between border-t border-[#E5E2E1] px-[21.25px] py-[21.25px]">
              {/* Share Result button (secondary) */}
              <button
                type="button"
                onClick={handleBackToHub}
                className="flex h-[49.58px] items-center gap-2 rounded-[7.08px] border border-[#CCC3D7] bg-white px-5 text-[12.4px] font-semibold leading-[17.35px] text-[#1C1B1B] transition-colors hover:bg-[#F8F4FF]"
              >
                <svg
                  width="13.28"
                  height="14.76"
                  viewBox="0 0 14 15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M11 9.5C10.3 9.5 9.7 9.78 9.24 10.21L4.76 7.71C4.88 7.31 4.88 6.89 4.76 6.49L9.24 4C9.7 4.45 10.3 4.74 11 4.74C12.38 4.74 13.5 3.62 13.5 2.25C13.5 0.88 12.38 -0.24 11 -0.24C9.62 -0.24 8.5 0.88 8.5 2.25C8.5 2.45 8.52 2.64 8.56 2.83L4.06 5.33C3.6 4.88 3 4.59 2.25 4.59C0.88 4.59 -0.24 5.71 -0.24 7.08C-0.24 8.45 0.88 9.57 2.25 9.57C3 9.57 3.6 9.28 4.06 8.83L8.56 11.33C8.52 11.52 8.5 11.71 8.5 11.91C8.5 13.28 9.62 14.4 11 14.4C12.38 14.4 13.5 13.28 13.5 11.91C13.5 10.54 12.38 9.42 11 9.42V9.5Z"
                    fill="#1C1B1B"
                  />
                </svg>
                Share Result
              </button>

              {/* Claim and continue primary button */}
              <Button
                variant="primary"
                onClick={handleBackToHub}
                className="h-12.5! rounded-xl px-6 text-[16px]"
              >
                Claim and continue &rarr;
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

          {/* Inline explanation card — visible on smaller screens (< xl) when answered incorrectly */}
          {phase === 'incorrect' && (
            <div className="mt-6 rounded-2xl border border-[#CCC3D7] bg-white shadow-sm xl:hidden">
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

                {/* Ask more input */}
                <div className="rounded-lg border border-[#CCC3D7] px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Ask more..."
                      className="flex-1 bg-transparent text-sm leading-4.25 text-[#380080] placeholder-[#380080]/50 outline-none"
                    />
                    <button
                      type="button"
                      className="flex h-6.5 w-11.75 items-center justify-center rounded-full bg-[#6C63FF] text-sm font-semibold text-white transition-colors hover:bg-[#5B52EE]"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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

                {/* SLICE SYNTAX */}
                <div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#4A4454]">
                    Slice Syntax
                  </p>
                  <div className="rounded-lg border border-[#CCC3D7] bg-[#F0EDFF] px-4 py-2.5">
                    <span className="text-sm leading-4.25 text-[#380080]">
                      list[ start : end : step ]
                    </span>
                  </div>
                </div>

                {/* Ask more input */}
                <div className="rounded-lg border border-[#CCC3D7] px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Ask more..."
                      className="flex-1 bg-transparent text-sm leading-4.25 text-[#380080] placeholder-[#380080]/50 outline-none"
                    />
                    <button
                      type="button"
                      className="flex h-6.5 w-11.75 items-center justify-center rounded-full bg-[#6C63FF] text-sm font-semibold text-white transition-colors hover:bg-[#5B52EE]"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary button at bottom */}
              <div className="border-t border-[#E5E2E1] px-5 py-5">
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto flex h-10.75 items-center rounded-xl bg-[#6C63FF] px-6 text-[16px] font-semibold leading-[19.6px] text-white transition-colors hover:bg-[#5B52EE]"
                >
                  Claim Rewards & Continue &rarr;
                </button>
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

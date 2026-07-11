import { useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/Button';

interface CompletionPopupProps {
  xpEarned: number;
  timeTaken: string;
  accuracy: number;
  badgeName?: string;
  badgeDescription?: string;
}

export function CompletionPopup({
  xpEarned,
  timeTaken,
  accuracy,
  badgeName = 'Speed Demon',
  badgeDescription,
}: CompletionPopupProps) {
  const navigate = useNavigate();

  const handleBackToHub = () => {
    navigate({ to: '/coderush' }).catch(() => undefined);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg-default">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
        {/* Dim overlay */}
        <div className="pointer-events-none fixed inset-0 bg-[#1C1B1B]/46" />

        {/* Modal */}
        <div className="relative z-10 mx-auto w-full max-w-148.75 overflow-y-auto rounded-[14px] border border-[#E5E2E180] bg-shade-white shadow-lg max-h-[calc(100vh-80px)]">
          {/* Close button */}
          <button
            type="button"
            onClick={handleBackToHub}
            className="absolute right-3.75 top-3.75 z-20 flex h-[26.56px] w-[26.56px] items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
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
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Hero Area */}
          <div className="flex flex-col items-center pt-[42.5px] pb-0">
            {/* Glow & Badge */}
            <div className="relative mb-[21.25px]">
              <div className="absolute left-1/2 top-1/2 h-42.5 w-42.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5FFBDB]/30" />
              <div className="relative flex h-[113.33px] w-[113.33px] items-center justify-center">
                <svg
                  width="113.33"
                  height="113.33"
                  viewBox="0 0 113.33 113.33"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="56.665" cy="56.665" r="56.665" fill="#380080" />
                  <circle
                    cx="56.665"
                    cy="56.665"
                    r="46.665"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="3"
                    opacity="0.6"
                  />
                  <path
                    d="M63.665 35.665L46.665 55.665H56.665L49.665 75.665L70.665 52.665H59.665L63.665 35.665Z"
                    fill="#FFD700"
                  />
                  <circle cx="38" cy="38" r="2.5" fill="#FFD700" />
                  <circle cx="75" cy="30" r="1.8" fill="#FFD700" />
                  <circle cx="80" cy="70" r="2" fill="#FFD700" />
                  <circle cx="35" cy="72" r="1.5" fill="#FFD700" />
                </svg>
              </div>
            </div>

            {/* NEW BADGE UNLOCKED label */}
            <span className="mb-1 text-center text-[12.4px] font-bold tracking-[1.24px] text-tertiary-900">
              NEW BADGE UNLOCKED
            </span>

            {/* Quest Complete title */}
            <h2 className="text-[31.88px] font-bold leading-[38.25px] text-primary-900">
              Quest Complete!
            </h2>

            {/* Subtitle */}
            <p className="mx-auto mt-2 max-w-101.25 text-center text-[18px] leading-[28.8px] text-neutral-700">
              {badgeDescription ??
                `You dominated the challenges and earned the `}
              <span className="font-semibold">{badgeName}</span>
              {!badgeDescription ? ' badge' : ''}
            </p>
          </div>

          {/* Stats Area */}
          <div className="px-[28.33px] pt-0 pb-[28.33px]">
            {/* Main Stats Grid (3 columns) */}
            <div className="mt-[28.33px] grid grid-cols-3 gap-3">
              {/* Time Taken */}
              <div className="flex flex-col items-center rounded-[10.625px] border border-[#E5E2E14D] bg-neutral-100 px-[14.17px] pt-[14.17px] pb-[14.17px]">
                <svg
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 2V0H12V2H6ZM8 13H10V7H8V13ZM9 21C7.76667 21 6.60417 20.7625 5.5125 20.2875C4.42083 19.8125 3.46667 19.1667 2.65 18.35C1.83333 17.5333 1.1875 16.5792 0.7125 15.4875C0.2375 14.3958 0 13.2333 0 12C0 10.7667 0.2375 9.60417 0.7125 8.5125C1.1875 7.42083 1.83333 6.46667 2.65 5.65C3.46667 4.83333 4.42083 4.1875 5.5125 3.7125C6.60417 3.2375 7.76667 3 9 3C10.0333 3 11.025 3.16667 11.975 3.5C12.925 3.83333 13.8167 4.31667 14.65 4.95L16.05 3.55L17.45 4.95L16.05 6.35C16.6833 7.18333 17.1667 8.075 17.5 9.025C17.8333 9.975 18 10.9667 18 12C18 13.2333 17.7625 14.3958 17.2875 15.4875C16.8125 16.5792 16.1667 17.5333 15.35 18.35C14.5333 19.1667 13.5792 19.8125 12.4875 20.2875C11.3958 20.7625 10.2333 21 9 21ZM9 19C10.9333 19 12.5833 18.3167 13.95 16.95C15.3167 15.5833 16 13.9333 16 12C16 10.0667 15.3167 8.41667 13.95 7.05C12.5833 5.68333 10.9333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 13.9333 2.68333 15.5833 4.05 16.95C5.41667 18.3167 7.06667 19 9 19Z"
                    fill="#7238D5"
                  />
                </svg>
                <span className="text-[17.7px] font-semibold leading-5.75 text-neutral-900">
                  {timeTaken}
                </span>
                <span className="mt-1 text-[10.625px] font-medium tracking-[0.53px] text-neutral-700">
                  TIME TAKEN
                </span>
              </div>

              {/* Accuracy */}
              <div className="relative flex flex-col items-center rounded-[10.625px] border border-[#E5E2E14D] bg-neutral-100 px-[14.17px] pt-[14.17px] pb-[14.17px]">
                <svg
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z"
                    fill="#006B5A"
                  />
                </svg>
                <span className="text-[17.7px] font-semibold leading-5.75 text-neutral-900">
                  {accuracy}%
                </span>
                <span className="mt-1 text-[10.625px] font-medium tracking-[0.53px] text-neutral-700">
                  ACCURACY
                </span>
              </div>

              {/* XP Earned */}
              <div className="flex flex-col items-center rounded-[10.625px] border border-[#E5E2E14D] bg-neutral-100 px-[14.17px] pt-[14.17px] pb-[14.17px]">
                <svg
                  width="10"
                  height="20"
                  viewBox="0 0 10 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 0H10V7.85C10 8.23333 9.91667 8.575 9.75 8.875C9.58333 9.175 9.35 9.41667 9.05 9.6L5.5 11.7L6.2 14H10L6.9 16.2L8.1 20L5 17.65L1.9 20L3.1 16.2L0 14H3.8L4.5 11.7L0.95 9.6C0.65 9.41667 0.416667 9.175 0.25 8.875C0.0833333 8.575 0 8.23333 0 7.85V0ZM2 2V7.85L4 9.05V2H2ZM8 2H6V9.05L8 7.85V2Z"
                    fill="#7238D5"
                  />
                </svg>
                <span className="text-[17.7px] font-semibold leading-5.75 text-neutral-900">
                  +{xpEarned}
                </span>
                <span className="mt-1 text-[10.625px] font-medium tracking-[0.53px] text-neutral-700">
                  XP EARNED
                </span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-[12.4px] font-semibold leading-[17.35px] text-neutral-700">
                  Level 12 Progress
                </span>
                <span className="text-[10.625px] font-bold leading-[14.87px] text-primary-900">
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

            {/* Bonus Breakdown */}
            <div className="mt-5 rounded-[10.625px] border border-[#E5E2E180] bg-neutral-100 px-[17.7px] py-[17.7px]">
              <span className="text-[12.4px] font-semibold leading-[17.7px] tracking-[0.62px] text-neutral-700">
                REWARD BREAKDOWN
              </span>

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
                  <span className="text-[14.17px] leading-[22.67px] text-neutral-900">
                    Speed Bonus
                  </span>
                </div>
                <span className="text-[12.4px] font-bold leading-[17.35px] text-tertiary-900">
                  +100 XP
                </span>
              </div>

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
                  <span className="text-[14.17px] leading-[22.67px] text-neutral-900">
                    Perfect Logic Bonus
                  </span>
                </div>
                <span className="text-[12.4px] font-bold leading-[17.35px] text-primary-900">
                  +200 XP
                </span>
              </div>

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
                  <span className="text-[14.17px] leading-[22.67px] text-neutral-900">
                    5 Day Streak Multiplier
                  </span>
                </div>
                <span className="text-[12.4px] font-bold leading-[17.35px] text-secondary-900">
                  1.5x
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-[#E5E2E1] px-[21.25px] py-[21.25px]">
            <button
              type="button"
              onClick={handleBackToHub}
              className="flex h-[49.58px] items-center gap-2 rounded-[7.08px] border border-[#CCC3D7] bg-shade-white px-5 text-[12.4px] font-semibold leading-[17.35px] text-neutral-900 transition-colors hover:bg-[#F8F4FF]"
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
                  fill="currentColor"
                />
              </svg>
              Share Result
            </button>

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

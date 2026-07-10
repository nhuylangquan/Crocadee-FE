import { useNavigate } from '@tanstack/react-router';
import codeCopyIconUrl from '../../assets/icons/coderush-code-copy.svg';
// import coinIconUrl from '../../assets/icons/coderush-reward-coin.svg';
import xpIconUrl from '../../assets/icons/coderush-reward-xp.svg';
import type {
  MiniGame,
  MiniGameTemplate,
} from '../../features/coderush/data/miniGames';
import { generateGuessOutputSeed } from '../../features/coderush/guess-output/guessOutputData';
import { Button } from '../ui/Button';

interface MiniGameCardProps {
  game: MiniGame;
  isFeatured?: boolean;
}

interface RewardItemProps {
  iconUrl: string;
  label: string;
  textColor: string;
}

const rearrangePlaceholderPattern = /^(\s*)\[\[(.+?)\]\]$/;
const decorativeCircleColor = '#ffdad6';

function getIconBadgeColor(template: MiniGameTemplate) {
  switch (template) {
    case 'spot-bug':
      return '#BA1A1A';
    case 'guess-output':
      return '#1ABAB7';
    default:
      return '#6C63FF';
  }
}

function getIconSizeClass(template: MiniGameTemplate) {
  switch (template) {
    case 'spot-bug':
      return 'h-6 w-[21px]';
    case 'guess-output':
      return 'h-[23px] w-[23px]';
    default:
      return 'h-[23px] w-[23px]';
  }
}

function RewardItem({ iconUrl, label, textColor }: RewardItemProps) {
  return (
    <div className="flex items-center gap-2">
      <img src={iconUrl} alt="" aria-hidden="true" className="h-4.5 w-4.5" />
      <span
        className="text-[16px] leading-6.25 font-bold"
        style={{
          color: textColor,
          fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function MiniGameCard({ game, isFeatured = false }: MiniGameCardProps) {
  const navigate = useNavigate();
  const hasFragmentOptions =
    game.id === 'rearrange-code' && (game.fragmentOptions?.length ?? 0) > 0;
  const hasChoiceOptions =
    game.template === 'guess-output' && (game.choiceOptions?.length ?? 0) > 0;
  const hasOptionPanel = hasFragmentOptions || hasChoiceOptions;
  const hasRoomForComfortableSpacing = isFeatured && !hasOptionPanel;

  const cardHeightClass = isFeatured ? 'h-full min-h-0' : 'min-h-[520px]';
  const cardPaddingClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'p-[clamp(1.25rem,3.5vh,1.75rem)]'
      : 'p-[clamp(1rem,2.6vh,1.5rem)]'
    : 'p-7';
  const iconWrapperClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'mb-[clamp(1.25rem,3.5vh,1.75rem)] h-[clamp(3rem,7vh,3.5625rem)] w-[clamp(3rem,7vh,3.5625rem)]'
      : 'mb-[clamp(0.875rem,2.4vh,1.5rem)] h-[clamp(2.75rem,6.4vh,3.4375rem)] w-[clamp(2.75rem,6.4vh,3.4375rem)]'
    : 'mb-7 h-14.25 w-14.25';
  const introSpacingClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'mb-[clamp(1.25rem,3.5vh,1.75rem)]'
      : 'mb-[clamp(0.875rem,2.4vh,1.5rem)]'
    : 'mb-7';
  const titleClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'text-[clamp(1.5rem,3.6vh,1.75rem)] leading-[1.2]'
      : 'text-[clamp(1.375rem,3.1vh,1.75rem)] leading-[1.15]'
    : 'text-[28px] leading-8.5';
  const subtitleClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'mt-[clamp(0.5rem,1.5vh,0.75rem)] text-[clamp(0.9375rem,2vh,1rem)] leading-[1.6]'
      : 'mt-[clamp(0.375rem,1.2vh,0.75rem)] text-[clamp(0.875rem,1.9vh,1rem)] leading-[1.45]'
    : 'mt-3 text-[16px] leading-[25.5px]';
  const codePanelClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'flex min-h-0 flex-1 flex-col p-[clamp(1rem,2.7vh,1.3125rem)]'
      : 'flex min-h-0 flex-1 flex-col p-[clamp(0.875rem,2.35vh,1.25rem)]'
    : 'p-5.25';
  const codePreClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'mt-[clamp(0.625rem,1.8vh,0.875rem)] min-h-0 text-[clamp(0.875rem,2vh,0.96875rem)] leading-[clamp(1.4rem,3.35vh,1.75rem)]'
      : 'mt-[clamp(0.5rem,1.4vh,0.875rem)] min-h-0 text-[clamp(0.8125rem,1.9vh,0.96875rem)] leading-[clamp(1.2rem,2.9vh,1.55rem)]'
    : 'mt-3.5 text-[15.5px] leading-7';
  const optionPanelClass = isFeatured
    ? 'mt-[clamp(0.75rem,2.1vh,1.3125rem)] p-[clamp(0.875rem,2.35vh,1.25rem)]'
    : 'mt-5.25 p-5';
  const footerClass = isFeatured
    ? hasRoomForComfortableSpacing
      ? 'mt-auto flex flex-col gap-3 pt-[clamp(1rem,2.7vh,1.75rem)] sm:flex-row sm:items-center sm:justify-between'
      : 'mt-auto flex flex-col gap-3 pt-[clamp(0.875rem,2.35vh,1.5rem)] sm:flex-row sm:items-center sm:justify-between'
    : 'mt-auto flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between';

  return (
    <article
      className={`relative overflow-hidden rounded-[11px] border border-[#E2E8F8] bg-shade-white shadow-[0px_4px_20px_rgba(15,23,42,0.05)] ${cardHeightClass} ${cardPaddingClass}`}
    >
      <span
        className="pointer-events-none absolute -top-17.5 -right-17.5 h-71 w-71 rounded-full"
        style={{ backgroundColor: decorativeCircleColor }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div
          className={`relative flex items-center justify-center rounded-full ${iconWrapperClass}`}
          style={{ backgroundColor: getIconBadgeColor(game.template) }}
        >
          <span
            className="absolute inset-0 rounded-full bg-white/2"
            aria-hidden="true"
          />

          {game.iconUrl ? (
            <img
              src={game.iconUrl}
              alt=""
              aria-hidden="true"
              className={`${getIconSizeClass(game.template)} shrink-0`}
            />
          ) : (
            <span className="h-5.75 w-5.75" aria-hidden="true" />
          )}
        </div>

        <div className={introSpacingClass}>
          <h3 className={`${titleClass} font-bold text-neutral-900`}>
            {game.title}
          </h3>
          <p
            className={`${subtitleClass} max-w-127.75 whitespace-pre-line text-neutral-700`}
          >
            {game.subtitle}
          </p>
        </div>

        <div className={`rounded-[7px] bg-[#1E1E1E] ${codePanelClass}`}>
          <div className="border-b border-[#374151] pb-1.75">
            <div className="flex items-start gap-3">
              <span className="font-mono text-[10.6px] leading-3.5 text-[#DCE2F3]">
                {game.languageLabel}
              </span>
              <div className="ml-auto">
                <img
                  src={codeCopyIconUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-2.5 w-2.25"
                />
              </div>
            </div>
          </div>

          <pre
            className={`${codePreClass} whitespace-pre-wrap font-mono text-[#DCE2F3]`}
          >
            {game.codeSnippet.split('\n').map((line, index) => {
              const isSpotIfLine =
                game.template === 'spot-bug' &&
                line.trimStart().startsWith('if ');

              const rearrangePlaceholderMatch =
                game.id === 'rearrange-code'
                  ? rearrangePlaceholderPattern.exec(line)
                  : null;

              if (rearrangePlaceholderMatch) {
                const [, indentation, placeholderValue] =
                  rearrangePlaceholderMatch;
                const placeholderWidth = Math.max(
                  120,
                  placeholderValue.length * 8 + 32
                );

                return (
                  <span
                    key={`${game.id}-code-line-${String(index)}`}
                    className="block"
                  >
                    {indentation}
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 rounded-md border border-white/70 bg-white/70 align-middle backdrop-blur-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]"
                      style={{ width: `${String(placeholderWidth)}px` }}
                    />
                  </span>
                );
              }

              return (
                <span
                  key={`${game.id}-code-line-${String(index)}`}
                  className="block"
                  style={{ color: isSpotIfLine ? '#EF4444' : undefined }}
                >
                  {line}
                </span>
              );
            })}
          </pre>
        </div>

        {game.id === 'rearrange-code' && game.fragmentOptions?.length ? (
          <div className={`rounded-[7px] bg-shade-white ${optionPanelClass}`}>
            <div className="flex flex-wrap gap-3">
              {game.fragmentOptions.map((fragment) => (
                <Button
                  key={`${game.id}-${fragment}`}
                  variant="codeFragment"
                  aria-label={`Code fragment ${fragment}`}
                >
                  {fragment}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {game.template === 'guess-output' && game.choiceOptions?.length ? (
          <div className={`rounded-[7px] bg-shade-white ${optionPanelClass}`}>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {game.choiceOptions.map((option) => (
                <Button
                  key={option}
                  variant="choice"
                  aria-label={`Choice ${option}`}
                >
                  <span className="inline-flex min-w-7.75 items-center justify-center rounded-lg bg-[#EDE9F5] px-2.5 py-2 text-[14.5px] leading-4.5 font-bold text-primary-900">
                    {option}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <div className={footerClass}>
          <div className="flex flex-wrap items-center gap-7">
            <RewardItem
              iconUrl={xpIconUrl}
              label={game.xpRewardLabel}
              textColor="#5300B7"
            />
            {/* <RewardItem
              iconUrl={coinIconUrl}
              label={game.coinRewardLabel}
              textColor="#FD761A"
            /> */}
          </div>

          <Button
            variant="primary"
            onClick={() => {
              if (game.id === 'guess-output') {
                const seed = generateGuessOutputSeed();
                void navigate({
                  to: '/coderush/guess_output/$seed',
                  params: { seed },
                });
              }
            }}
          >
            {game.ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

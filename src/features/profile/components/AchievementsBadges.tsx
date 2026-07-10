import starIconUrl from '../../../assets/icons/profile-star.svg';

interface BadgeItem {
  label: string;
  earned: boolean;
  color: string;
}

const badges: BadgeItem[] = [
  { label: 'Python', earned: true, color: '#6c63ff' },
  { label: 'JS', earned: true, color: '#f4b400' },
  { label: 'React', earned: false, color: '#24d3b5' },
  { label: 'Go', earned: false, color: '#ff8a1f' },
];

export function AchievementsBadges() {
  return (
    <section className="rounded-xl border border-[#ccc3d84d] bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1d1a24] md:text-xl">
          Achievements
        </h3>
        <button
          type="button"
          className="cursor-pointer text-sm font-medium text-[#630ed4] transition-colors hover:text-primary-700"
        >
          View all
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-2">
            {/* Badge Circle */}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-200 md:h-19 md:w-19 ${
                badge.earned
                  ? 'border-[#630ed41a] bg-[#f5f3ff] shadow-[0_2px_8px_rgba(99,14,212,0.1)]'
                  : 'border-[#ccc3d7] bg-[#f9f9ff] opacity-50'
              }`}
            >
              <img
                src={starIconUrl}
                alt={badge.label}
                className="h-7 w-7"
                style={{
                  filter: badge.earned ? 'none' : 'grayscale(0.8)',
                  opacity: badge.earned ? 1 : 0.5,
                  color: badge.earned ? badge.color : '#ccc3d7',
                }}
              />
            </div>
            {/* Label */}
            <span
              className={`text-xs font-medium ${
                badge.earned ? 'text-[#4a4455]' : 'text-[#b3aeb8]'
              }`}
            >
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

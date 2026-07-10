import fireIconUrl from '../../../assets/icons/home-fire.svg';
import xpIconUrl from '../../../assets/icons/profile-xp.svg';
import modulesIconUrl from '../../../assets/icons/profile-modules.svg';
import badgesIconUrl from '../../../assets/icons/profile-badges.svg';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  alt: string;
  bgClass: string;
}

const stats: StatItem[] = [
  {
    label: 'Streak',
    value: '12 days',
    icon: fireIconUrl,
    alt: 'Fire',
    bgClass: 'bg-[#fff0e5]',
  },
  {
    label: 'XP Earned',
    value: '8,420',
    icon: xpIconUrl,
    alt: 'XP',
    bgClass: 'bg-[#f5f3ff]',
  },
  {
    label: 'Modules',
    value: '6 / 12',
    icon: modulesIconUrl,
    alt: 'Modules',
    bgClass: 'bg-[#dffff8]',
  },
  {
    label: 'Badges',
    value: '9',
    icon: badgesIconUrl,
    alt: 'Badges',
    bgClass: 'bg-[#fff8e0]',
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(99,14,212,0.1)]"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgClass}`}
          >
            <img src={stat.icon} alt={stat.alt} className="h-5 w-5" />
          </div>
          <span className="text-[#4a4455] text-xs md:text-sm">
            {stat.label}
          </span>
          <span className="text-[#1d1a24] text-lg md:text-xl font-bold">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

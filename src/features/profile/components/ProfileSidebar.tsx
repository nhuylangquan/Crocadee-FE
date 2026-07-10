import profileIconUrl from '../../../assets/icons/navbar-profile.svg';
import editIconUrl from '../../../assets/icons/profile-edit.svg';
import copyIconUrl from '../../../assets/icons/profile-copy.svg';

interface ProfileSidebarProps {
  name?: string;
  tagline?: string;
  level?: string;
  xp?: string;
  nextLevel?: string;
  role?: string;
  onEditProfile?: () => void;
  onCopyId?: () => void;
}

export function ProfileSidebar({
  name = 'Alex Nguyen',
  tagline = 'Student in disguise',
  level = 'Level 14',
  xp = '2,450 / 3,000 XP',
  nextLevel = 'Level 15',
  role = 'Trainee',
  onEditProfile,
  onCopyId,
}: ProfileSidebarProps) {
  return (
    <aside className="flex w-full flex-col items-center rounded-xl border border-[#630ed41a] bg-white px-16 py-16">
      <div className="flex w-full max-w-92.25 flex-col items-center">
        {/* Avatar - 128x128 circle */}
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#630ed41a] bg-[#f5f3ff]">
          <img
            src={profileIconUrl}
            alt="Profile"
            className="h-30 w-30 object-cover"
          />
        </div>

        {/* Spacing */}
        <div className="mt-8 flex w-full flex-col items-center gap-6">
          {/* Name - Alex Nguyen - 32px Bold */}
          <h1 className="text-center text-[32px] font-bold leading-10 text-[#1d1a24] tracking-[-0.32px]">
            {name}
          </h1>

          {/* Tagline */}
          <p className="text-center text-lg leading-7 text-[#4a4455]">
            {tagline}
          </p>

          {/* XP Progress Section */}
          <div className="flex w-full flex-col">
            {/* Level + XP row */}
            <div className="flex items-center justify-between">
              <span className="text-base font-bold leading-6 text-primary-900">
                {level}
              </span>
              <span className="text-base leading-6 text-[#4a4455]">{xp}</span>
            </div>
            {/* Progress bar - 12px height */}
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#e0d6ff]">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary-500 to-primary-900"
                style={{ width: '82%' }}
              />
            </div>
            {/* Next level + role */}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-bold leading-4 text-primary-900">
                {nextLevel}
              </span>
              <span className="text-xs leading-4 text-[#4a4455]">{role}</span>
            </div>
          </div>

          {/* Edit Profile Button - Purple */}
          <button
            type="button"
            onClick={onEditProfile}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#630ed4] px-10 py-4 text-base font-medium text-white transition-all duration-200 hover:bg-primary-900 active:scale-[0.98]"
          >
            <img src={editIconUrl} alt="Edit" className="h-4.5 w-4.5" />
            Edit Profile
          </button>

          {/* Copy ID Button - Outlined */}
          <button
            type="button"
            onClick={onCopyId}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#630ed41a] bg-white px-10 py-4 text-base font-medium text-[#4a4455] transition-all duration-200 hover:bg-[#f5f3ff] active:scale-[0.98]"
          >
            <img src={copyIconUrl} alt="Copy" className="h-4.5 w-4.5" />
            Copy ID
          </button>
        </div>
      </div>
    </aside>
  );
}

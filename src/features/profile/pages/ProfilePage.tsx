import { useState } from 'react';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { StatsGrid } from '../components/StatsGrid';
import { LearningProgressHighlight } from '../components/LearningProgressHighlight';
import { AchievementsBadges } from '../components/AchievementsBadges';
import { ContributionMap } from '../components/ContributionMap';
import { EditProfileModal } from '../components/EditProfileModal';
import type { EditProfileData } from '../components/EditProfileModal';

export function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [username] = useState(() => {
    const authUserString =
      localStorage.getItem('authUser') ?? sessionStorage.getItem('authUser');

    if (!authUserString) {
      return 'Alex Nguyen';
    }

    try {
      const authUser = JSON.parse(authUserString) as { username: string };
      return authUser.username;
    } catch {
      return 'Alex Nguyen';
    }
  });

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (data: EditProfileData) => {
    console.log('Saving profile:', data);
  };

  return (
    <div className="min-h-screen bg-bg-default">
      <div className="mx-auto max-w-360 px-4 py-6 md:px-8 md:py-8 lg:px-10">
        {/* Two-column grid layout matching Figma */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[499px_1fr]">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <ProfileSidebar name={username} onEditProfile={handleEditProfile} />
            <AchievementsBadges />
          </div>

          {/* Right Column - min-w-0 prevents overflow from heatmap */}
          <div className="flex min-w-0 flex-col gap-6">
            <StatsGrid />
            <LearningProgressHighlight />
            <ContributionMap />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

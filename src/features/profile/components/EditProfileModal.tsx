import { useState, type SyntheticEvent } from 'react';
import closeIconUrl from '../../../assets/icons/profile-close.svg';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditProfileData) => void;
}

export interface EditProfileData {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  website: string;
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<EditProfileData>({
    name: 'Alex Nguyen',
    tagline: 'Student in disguise',
    bio: 'Passionate about coding and building cool stuff. Currently learning full-stack development.',
    location: 'Ho Chi Minh City',
    website: 'alexnguyen.dev',
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof EditProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-[#e8dfee] bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e8dfee] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#1d1a24]">Edit Profile</h2>
            <p className="text-sm text-[#4a4455]">
              Update your personal information
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[#f5f3ff]"
          >
            <img src={closeIconUrl} alt="Close" className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 px-10 py-5"
        >
          {/* Form Fields */}
          <div className="flex flex-col gap-5">
            {/* Name & Tagline row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1d1a24]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange('name', e.target.value);
                  }}
                  className="rounded-lg border border-[#ccc3d7] px-3 py-2.5 text-sm text-[#1d1a24] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Your full name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1d1a24]">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => {
                    handleChange('tagline', e.target.value);
                  }}
                  className="rounded-lg border border-[#ccc3d7] px-3 py-2.5 text-sm text-[#1d1a24] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="A short description"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1d1a24]">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => {
                  handleChange('bio', e.target.value);
                }}
                rows={3}
                className="resize-none rounded-lg border border-[#ccc3d7] px-3 py-2.5 text-sm text-[#1d1a24] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="Tell us about yourself"
              />
            </div>

            {/* Location & Website row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1d1a24]">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    handleChange('location', e.target.value);
                  }}
                  className="rounded-lg border border-[#ccc3d7] px-3 py-2.5 text-sm text-[#1d1a24] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="City, Country"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1d1a24]">
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => {
                    handleChange('website', e.target.value);
                  }}
                  className="rounded-lg border border-[#ccc3d7] px-3 py-2.5 text-sm text-[#1d1a24] outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-[#e8dfee] pt-5">
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-base font-medium text-white shadow-[0_4px_14px_rgba(108,99,255,0.3)] transition-all duration-200 hover:bg-primary-700 active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

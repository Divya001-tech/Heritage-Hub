import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Award, MapPin, Mail, UserCheck, Edit2, Check, Sparkles } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { UserRole } from '../../types';

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    setUserRole,
    isProfileModalOpen,
    setProfileModalOpen,
    entries,
  } = useCultureStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || '');

  if (!isProfileModalOpen) return null;

  const userContributions = entries.filter((e) => e.created_by_id === currentUser.id);

  const handleSave = () => {
    updateUserProfile({ name, bio, location });
    setIsEditing(false);
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white dark:bg-[#1E1B17] rounded-3xl p-6 sm:p-8 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xl space-y-6 relative text-left"
      >
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9CA3AF] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-[#F0EBE0] dark:border-[#2A2723] pb-6">
          <div className="relative group">
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#E07A1F]"
            />
          </div>

          <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading font-bold text-xl text-[#111827] dark:text-[#F3F4F6]">
                {currentUser.name}
              </h2>
              <span className="capitalize text-[11px] font-semibold bg-[#E07A1F]/10 text-[#E07A1F] px-2 py-0.5 rounded-full">
                {currentUser.role}
              </span>
            </div>

            <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E07A1F]" />
              <span>{currentUser.location || 'India'}</span>
              <span aria-hidden="true">·</span>
              <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span>{currentUser.email}</span>
            </div>

            <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] pt-1 leading-relaxed">
              {currentUser.bio}
            </p>
          </div>
        </div>

        {/* Avatar Picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#374151] dark:text-[#D1D5DB]">
            Select Heritage Avatar
          </label>
          <div className="flex items-center gap-3">
            {avatarOptions.map((av, idx) => (
              <img
                key={idx}
                src={av}
                alt="Avatar option"
                onClick={() => updateUserProfile({ avatar_url: av })}
                className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                  currentUser.avatar_url === av
                    ? 'border-[#E07A1F] ring-2 ring-[#E07A1F]/30 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recognition Badges (Unboxed metadata per anti-pill discipline) */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#374151] dark:text-[#D1D5DB] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#E07A1F]" />
            <span>Community Recognition Badges</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563] dark:text-[#9CA3AF]">
            {currentUser.recognition_badges.map((b, idx) => (
              <React.Fragment key={idx}>
                <span className="font-semibold text-[#111827] dark:text-[#F3F4F6]">{b}</span>
                {idx < currentUser.recognition_badges.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Edit Bio Form */}
        {isEditing ? (
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="font-semibold text-[#374151] dark:text-[#D1D5DB]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-[#374151] dark:text-[#D1D5DB]">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-[#374151] dark:text-[#D1D5DB]">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] outline-none leading-relaxed"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg text-xs bg-[#E07A1F] text-white font-semibold"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-[#6B7280]">
              Member since {new Date(currentUser.created_at).toLocaleDateString()}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-[#E07A1F] hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};

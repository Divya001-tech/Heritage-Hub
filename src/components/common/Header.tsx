import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Bookmark,
  Moon,
  Sun,
  Database,
  Search,
  User as UserIcon,
  ChevronDown,
  Volume2,
  VolumeX,
  Sparkles,
  Command
} from 'lucide-react';
import { useCultureStore, AppView } from '../../store/useCultureStore';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentView,
    setView,
    currentUser,
    setUserRole,
    bookmarks,
    entries,
    setSupabaseModalOpen,
    setProfileModalOpen,
    isDarkMode,
    toggleDarkMode,
    filters,
    setFilter,
  } = useCultureStore();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const pendingCount = entries.filter((e) => e.status === 'Pending').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setFilter('searchQuery', searchInput.trim());
      setView('discover');
    }
  };

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'contributor', label: 'Tradition Chronicler', desc: 'Village elder, artisan, or field researcher' },
    { id: 'moderator', label: 'Archival Council', desc: 'University faculty, NGO, or review council' },
    { id: 'explorer', label: 'Cultural Fellow', desc: 'Student, researcher, or curious traveler' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF7F0]/92 dark:bg-[#12100E]/92 border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Masthead: Google Arts & Culture / Museum Editorial */}
        <div 
          onClick={() => setView('home')}
          className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
        >
          {/* Classical Emblem: Sanskrit 'श्रु' (Shruti - Oral Transmission) */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C85A17] to-[#A8450A] flex items-center justify-center text-white shadow-sm shadow-[#C85A17]/25 group-hover:scale-105 transition-transform duration-200">
            <span className="font-serif-display font-bold text-lg leading-none">श्रु</span>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-monumental font-bold text-sm sm:text-base tracking-[0.14em] text-[#181512] dark:text-[#F6F3ED] flex items-center gap-2">
              HINDUSTAN CULTURE ATLAS
            </span>
            <span className="text-[10px] uppercase font-semibold text-[#8C8274] dark:text-[#A49988] tracking-[0.22em] hidden sm:block">
              National Living Heritage Commons
            </span>
          </div>
        </div>

        {/* Global Search Bar (Apple Minimalist + Command shortcut) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center relative flex-1 max-w-sm mx-6"
        >
          <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search ballads, dialects, sacred rituals..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-12 py-2 text-xs rounded-full bg-[#F2EDE2] dark:bg-[#1C1814] border border-transparent focus:border-[#C85A17]/40 focus:bg-white dark:focus:bg-[#12100E] text-[#181512] dark:text-[#F6F3ED] placeholder-[#8C8274] outline-none transition-all duration-200"
          />
          <div className="absolute right-3 text-[10px] font-mono text-[#8C8274] bg-[#E7E0D2] dark:bg-[#2A241E] px-1.5 py-0.5 rounded">
            ⌘K
          </div>
        </form>

        {/* Editorial Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold tracking-wide">
          <button
            onClick={() => setView('home')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentView === 'home'
                ? 'text-[#C85A17] font-bold bg-[#C85A17]/8'
                : 'text-[#5C554D] dark:text-[#A49988] hover:text-[#181512] dark:hover:text-white'
            }`}
          >
            Exhibitions
          </button>
          
          <button
            onClick={() => setView('map')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentView === 'map'
                ? 'text-[#C85A17] font-bold bg-[#C85A17]/8'
                : 'text-[#5C554D] dark:text-[#A49988] hover:text-[#181512] dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#C85A17]" />
            Cartography
          </button>

          <button
            onClick={() => setView('discover')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentView === 'discover'
                ? 'text-[#C85A17] font-bold bg-[#C85A17]/8'
                : 'text-[#5C554D] dark:text-[#A49988] hover:text-[#181512] dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Repository
          </button>

          <button
            onClick={() => setView('contribute')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentView === 'contribute'
                ? 'text-[#C85A17] font-bold bg-[#C85A17]/8'
                : 'text-[#5C554D] dark:text-[#A49988] hover:text-[#181512] dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#2E6F40]" />
            Field Recording
          </button>

          <button
            onClick={() => setView('moderation')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors relative ${
              currentView === 'moderation'
                ? 'text-[#C85A17] font-bold bg-[#C85A17]/8'
                : 'text-[#5C554D] dark:text-[#A49988] hover:text-[#181512] dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
            Archival Council
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#C85A17] text-white">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Controls & Role Persona */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Supabase Schema Modal Button */}
          <button
            onClick={() => setSupabaseModalOpen(true)}
            title="Database Architecture & Vercel Specs"
            className="p-2 rounded-xl text-[#5C554D] dark:text-[#A49988] hover:bg-[#EFE9DD] dark:hover:bg-[#201C17] transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Bookmarks / Personal Folio */}
          <button
            onClick={() => setView('bookmarks')}
            title="Saved Cultural Folios"
            className={`p-2 rounded-xl transition-colors relative ${
              currentView === 'bookmarks'
                ? 'text-[#C85A17] bg-[#C85A17]/10'
                : 'text-[#5C554D] dark:text-[#A49988] hover:bg-[#EFE9DD] dark:hover:bg-[#201C17]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 text-[8px] font-bold bg-[#1E3A8A] text-white rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Daylight Canvas' : 'Nocturnal Archival Mode'}
            className="p-2 rounded-xl text-[#5C554D] dark:text-[#A49988] hover:bg-[#EFE9DD] dark:hover:bg-[#201C17] transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Active Persona Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-[#DFD7C7] dark:border-[#332C24] bg-white dark:bg-[#1A1612] text-[#181512] dark:text-[#F6F3ED] hover:border-[#C85A17]/60 transition-colors shadow-2xs"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                currentUser.role === 'moderator' ? 'bg-[#1E3A8A]' :
                currentUser.role === 'contributor' ? 'bg-[#C85A17]' : 'bg-[#2E6F40]'
              }`} />
              <span className="capitalize">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-[#8C8274]" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1A1612] border border-[#DFD7C7] dark:border-[#332C24] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C8274]">
                  Simulate Operational Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex flex-col gap-0.5 ${
                      currentUser.role === r.id
                        ? 'bg-[#C85A17]/10 text-[#C85A17] font-semibold'
                        : 'text-[#3D372F] dark:text-[#D1C9BE] hover:bg-[#FAF7F0] dark:hover:bg-[#241F1A]'
                    }`}
                  >
                    <span className="font-medium">{r.label}</span>
                    <span className="text-[10px] text-[#8C8274]">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-[#C85A17]/40 transition-all"
            title="Profile & Badges"
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#DFD7C7] dark:border-[#332C24]"
            />
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#E8E1D3] dark:border-[#28231D] px-2 py-2 bg-white/80 dark:bg-[#12100E]/80 text-[11px] font-semibold">
        <button
          onClick={() => setView('home')}
          className={`py-1 px-2.5 rounded-md ${currentView === 'home' ? 'text-[#C85A17]' : 'text-[#8C8274]'}`}
        >
          Exhibits
        </button>
        <button
          onClick={() => setView('map')}
          className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${currentView === 'map' ? 'text-[#C85A17]' : 'text-[#8C8274]'}`}
        >
          <MapPin className="w-3 h-3 text-[#C85A17]" />
          Atlas
        </button>
        <button
          onClick={() => setView('discover')}
          className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${currentView === 'discover' ? 'text-[#C85A17]' : 'text-[#8C8274]'}`}
        >
          <Compass className="w-3 h-3" />
          Repository
        </button>
        <button
          onClick={() => setView('contribute')}
          className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${currentView === 'contribute' ? 'text-[#2E6F40]' : 'text-[#8C8274]'}`}
        >
          <PlusCircle className="w-3 h-3 text-[#2E6F40]" />
          Record
        </button>
        <button
          onClick={() => setView('moderation')}
          className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${currentView === 'moderation' ? 'text-[#1E3A8A]' : 'text-[#8C8274]'}`}
        >
          <ShieldCheck className="w-3 h-3 text-[#1E3A8A]" />
          Council
          {pendingCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />}
        </button>
      </div>
    </header>
  );
};

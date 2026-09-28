import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  RotateCcw,
  Volume2,
  Bookmark,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { INDIAN_STATES, CATEGORIES } from '../../data/seedData';
import { CulturalEntry } from '../../types';

export const DiscoveryView: React.FC = () => {
  const {
    entries,
    filters,
    setFilter,
    resetFilters,
    setSelectedEntry,
    audioPlayer,
    playAudio,
    pauseAudio,
    toggleBookmark,
    isBookmarked,
  } = useCultureStore();

  // Extract unique languages and categories for facet lists
  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.language) set.add(e.language);
    });
    return Array.from(set);
  }, [entries]);

  // Filtered & sorted entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      // Must be approved unless user is moderator checking all
      const matchesStatus =
        filters.status === 'All'
          ? e.status === 'Approved'
          : e.status === filters.status;

      const matchesSearch =
        !filters.searchQuery ||
        e.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        e.state.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        e.district.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        e.language.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (e.ai_content?.tags &&
          e.ai_content.tags.some((t) =>
            t.toLowerCase().includes(filters.searchQuery.toLowerCase())
          ));

      const matchesCategory =
        !filters.category || e.category === filters.category;
      const matchesState = !filters.state || e.state === filters.state;
      const matchesLanguage =
        !filters.language || e.language === filters.language;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesCategory &&
        matchesState &&
        matchesLanguage
      );
    }).sort((a, b) => {
      if (filters.sortBy === 'views') return b.view_count - a.view_count;
      if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [entries, filters]);

  const handleAudioToggle = (e: React.MouseEvent, entry: CulturalEntry) => {
    e.stopPropagation();
    if (audioPlayer.isPlaying && audioPlayer.entryId === entry.id) {
      pauseAudio();
    } else {
      playAudio({
        url: entry.audio_url || '',
        title: entry.title,
        contributor: entry.created_by_name,
        cover: entry.cover_image,
        entryId: entry.id,
      });
    }
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.category) ||
    Boolean(filters.state) ||
    Boolean(filters.language);

  return (
    <div className="w-full min-h-screen bg-[#FAF8F3] dark:bg-[#12110F] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E0D4] dark:border-[#2A2723]">
          <div className="space-y-1.5 text-left">
            <div className="text-xs font-semibold text-[#E07A1F] uppercase tracking-wider">
              Search &amp; Discovery Engine
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#111827] dark:text-[#F3F4F6] tracking-tight">
              Hindustan Living Repository
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF]">
              Query across {entries.length} living oral archives, dialects, and ethnographic recordings.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search by keyword, deity, instrument, dialect..."
              value={filters.searchQuery}
              onChange={(e) => setFilter('searchQuery', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1E1B17] border border-[#E5E0D4] dark:border-[#38332B] text-sm text-[#111827] dark:text-[#F3F4F6] placeholder-[#9CA3AF] focus:border-[#E07A1F] focus:ring-1 focus:ring-[#E07A1F] outline-none shadow-xs"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilter('searchQuery', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] hover:text-[#111827]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Facet Filters & View Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E1B17] border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs">
          
          {/* Left: Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-[#374151] dark:text-[#D1D5DB] outline-none focus:border-[#E07A1F]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={filters.state}
              onChange={(e) => setFilter('state', e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-[#374151] dark:text-[#D1D5DB] outline-none focus:border-[#E07A1F]"
            >
              <option value="">All States &amp; UTs</option>
              {INDIAN_STATES.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={filters.language}
              onChange={(e) => setFilter('language', e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-[#374151] dark:text-[#D1D5DB] outline-none focus:border-[#E07A1F]"
            >
              <option value="">All Languages</option>
              {availableLanguages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs font-medium text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Right: Sort & Grid/List View Toggles */}
          <div className="flex items-center gap-3">
            
            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e: any) => setFilter('sortBy', e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-[#374151] dark:text-[#D1D5DB] outline-none"
            >
              <option value="latest">Sort: Latest Additions</option>
              <option value="views">Sort: Most Explored</option>
              <option value="title">Sort: Alphabetical (A-Z)</option>
            </select>

            {/* Grid / List Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B]">
              <button
                onClick={() => setFilter('viewMode', 'grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  filters.viewMode === 'grid'
                    ? 'bg-white dark:bg-[#1E1B17] text-[#E07A1F] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#111827]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFilter('viewMode', 'list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  filters.viewMode === 'list'
                    ? 'bg-white dark:bg-[#1E1B17] text-[#E07A1F] shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#111827]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] px-1">
          <div>
            Showing <span className="font-bold text-[#111827] dark:text-[#F3F4F6]">{filteredEntries.length}</span> documented traditions
          </div>
          {hasActiveFilters && (
            <div className="text-[11px] text-[#E07A1F]">Filters active</div>
          )}
        </div>

        {/* Entries Display: Grid View vs List View */}
        {filteredEntries.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-white dark:bg-[#1E1B17] rounded-3xl border border-[#E5E0D4] dark:border-[#38332B]">
            <Search className="w-12 h-12 text-[#9CA3AF] mx-auto opacity-50" />
            <h3 className="font-heading font-bold text-lg text-[#111827] dark:text-[#F3F4F6]">
              No Cultural Records Found
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              We couldn’t find any entries matching your filters. Try clearing your search query or selecting &quot;All States&quot;.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E07A1F] text-white hover:bg-[#C8640E] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : filters.viewMode === 'grid' ? (
          /* Grid View (320 x 420 px desktop baseline) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {filteredEntries.map((entry) => {
              const isPlayingThis =
                audioPlayer.isPlaying && audioPlayer.entryId === entry.id;
              const bookmarked = isBookmarked(entry.id);

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="w-full max-w-[340px] sm:w-[320px] h-[440px] bg-white dark:bg-[#1A1815] rounded-2xl overflow-hidden border border-[#E5E0D4] dark:border-[#2E2A24] culture-card-hover cursor-pointer flex flex-col group text-left select-none relative"
                >
                  {/* Image 40% */}
                  <div className="h-[40%] w-full relative overflow-hidden bg-stone-200 dark:bg-stone-800 flex-shrink-0">
                    <img
                      src={entry.cover_image}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Audio Play Overlay */}
                    <button
                      onClick={(e) => handleAudioToggle(e, entry)}
                      className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/95 text-[#111827] shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingThis ? 'text-[#E07A1F] animate-pulse' : 'text-[#E07A1F]'}`} />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(entry.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        bookmarked
                          ? 'bg-[#E07A1F] text-white'
                          : 'bg-black/35 text-white hover:bg-black/60'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Content 60% */}
                  <div className="h-[60%] p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                        <span className="text-[#E07A1F] font-semibold">{entry.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.district}, {entry.state}</span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-[#111827] dark:text-[#F3F4F6] line-clamp-2 group-hover:text-[#E07A1F] transition-colors leading-snug">
                        {entry.title}
                      </h3>

                      <p className="font-body text-xs text-[#4B5563] dark:text-[#9CA3AF] line-clamp-3 leading-relaxed">
                        {entry.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0EBE0] dark:border-[#2A2723] flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                      <span className="truncate max-w-[170px]">{entry.created_by_name}</span>
                      <span className="font-mono text-[10px] text-[#E07A1F] bg-[#E07A1F]/10 px-2 py-0.5 rounded">
                        {entry.language}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const bookmarked = isBookmarked(entry.id);
              const isPlayingThis =
                audioPlayer.isPlaying && audioPlayer.entryId === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="bg-white dark:bg-[#1E1B17] rounded-2xl p-4 sm:p-5 border border-[#E5E0D4] dark:border-[#38332B] hover:border-[#E07A1F]/50 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={entry.cover_image}
                      alt={entry.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                        <span className="text-[#E07A1F] font-semibold">{entry.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.district}, {entry.state}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[10px]">{entry.language}</span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-[#111827] dark:text-[#F3F4F6] truncate">
                        {entry.title}
                      </h3>
                      <p className="font-body text-xs text-[#4B5563] dark:text-[#9CA3AF] line-clamp-1 max-w-2xl">
                        {entry.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={(e) => handleAudioToggle(e, entry)}
                      className="p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-[#E07A1F] hover:bg-[#E07A1F] hover:text-white transition-colors"
                      title="Play Recording"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(entry.id);
                      }}
                      className={`p-2 rounded-xl border border-[#E5E0D4] dark:border-[#38332B] transition-colors ${
                        bookmarked
                          ? 'bg-[#E07A1F] text-white'
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                      title="Save to Collection"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

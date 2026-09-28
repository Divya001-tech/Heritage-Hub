import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bookmark,
  FolderPlus,
  Compass,
  Volume2,
  Trash2,
  Share2,
  Check,
  Folder,
  ArrowRight
} from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { CulturalEntry } from '../../types';

export const BookmarksView: React.FC = () => {
  const {
    entries,
    bookmarks,
    toggleBookmark,
    setSelectedEntry,
    playAudio,
    setView,
  } = useCultureStore();

  const [activeCollection, setActiveCollection] = useState<string>('All');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [collections, setCollections] = useState<string[]>([
    'All',
    'Desert Ballads',
    'Sacred Rites',
    'Himalayan Traditions',
  ]);
  const [copied, setCopied] = useState(false);

  const bookmarkedEntries = entries.filter((e) => bookmarks.includes(e.id));

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim() && !collections.includes(newCollectionName.trim())) {
      setCollections([...collections, newCollectionName.trim()]);
      setActiveCollection(newCollectionName.trim());
      setNewCollectionName('');
    }
  };

  const handleShareArchive = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F3] dark:bg-[#12110F] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E0D4] dark:border-[#2A2723]">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#2563EB]" />
              <span>Personal Heritage Archive &amp; Field Collections</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#111827] dark:text-[#F3F4F6] tracking-tight">
              Saved Cultural Chronicles
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF]">
              Curate custom thematic anthologies of oral traditions, folk songs, and ritual lore.
            </p>
          </div>

          <button
            onClick={handleShareArchive}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-[#E5E0D4] dark:border-[#38332B] bg-white dark:bg-[#1E1B17] text-xs font-semibold text-[#111827] dark:text-[#F3F4F6] hover:border-[#E07A1F] transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span>Share My Archive Link</span>
          </button>
        </div>

        {/* Collections Tab Bar & Create Collection */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-white dark:bg-[#1E1B17] border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs">
            {collections.map((col) => (
              <button
                key={col}
                onClick={() => setActiveCollection(col)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeCollection === col
                    ? 'bg-[#E07A1F] text-white shadow-xs'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{col}</span>
              </button>
            ))}
          </div>

          {/* New Collection Form */}
          <form onSubmit={handleCreateCollection} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New Collection Name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1B17] border border-[#E5E0D4] dark:border-[#38332B] text-xs text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-[#E07A1F]"
            />
            <button
              type="submit"
              disabled={!newCollectionName.trim()}
              className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </form>
        </div>

        {/* Bookmarked Grid */}
        {bookmarkedEntries.length === 0 ? (
          <div className="py-24 text-center space-y-4 bg-white dark:bg-[#1E1B17] rounded-3xl border border-[#E5E0D4] dark:border-[#38332B]">
            <Bookmark className="w-12 h-12 text-[#9CA3AF] mx-auto opacity-40" />
            <h3 className="font-heading font-bold text-lg text-[#111827] dark:text-[#F3F4F6]">
              Your Archive is Empty
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Save stories, folk ballads, and chants by clicking the bookmark icon while browsing the interactive map or story cards.
            </p>
            <button
              onClick={() => setView('discover')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#E07A1F] text-white hover:bg-[#C8640E] transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Cultural Traditions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {bookmarkedEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="w-full max-w-[340px] sm:w-[320px] h-[440px] bg-white dark:bg-[#1A1815] rounded-2xl overflow-hidden border border-[#E5E0D4] dark:border-[#2E2A24] culture-card-hover cursor-pointer flex flex-col group text-left select-none relative"
              >
                <div className="h-[40%] w-full relative overflow-hidden bg-stone-200 dark:bg-stone-800 flex-shrink-0">
                  <img
                    src={entry.cover_image}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(entry.id);
                    }}
                    title="Remove from archive"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

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
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

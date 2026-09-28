import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Bookmark, ArrowUpRight, Headphones, MapPin } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { CulturalEntry } from '../../types';

export const FeaturedStories: React.FC = () => {
  const {
    entries,
    setSelectedEntry,
    audioPlayer,
    playAudio,
    pauseAudio,
    toggleBookmark,
    isBookmarked,
    setView,
  } = useCultureStore();

  const approvedEntries = entries.filter((e) => e.status === 'Approved');
  const featured = approvedEntries.slice(0, 6);

  const handleAudioToggle = (e: React.MouseEvent, entry: CulturalEntry) => {
    e.stopPropagation();
    if (audioPlayer.isPlaying && audioPlayer.entryId === entry.id) {
      pauseAudio();
    } else {
      playAudio({
        url: entry.audio_url || 'https://cdn.freesound.org/previews/512/512948_649468-lq.mp3',
        title: entry.title,
        contributor: entry.created_by_name,
        cover: entry.cover_image,
        entryId: entry.id,
      });
    }
  };

  const handleBookmarkToggle = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    toggleBookmark(entryId);
  };

  return (
    <section className="py-24 bg-[#FAF7F0] dark:bg-[#12100E] border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Masthead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-[#E8E1D3] dark:border-[#28231D] pb-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#C85A17] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
              <span>Archival Selection</span>
            </div>
            <h2 className="font-serif-display font-bold text-3xl sm:text-5xl text-[#181512] dark:text-[#F6F3ED] tracking-tight">
              Featured Living Chronicles
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] max-w-xl leading-relaxed">
              Living masterworks documented in the courtyards of tradition bearers, recorded with permission and preserved in their original acoustic purity.
            </p>
          </div>

          <button
            onClick={() => setView('discover')}
            className="self-start md:self-auto inline-flex items-center gap-2 text-xs font-semibold text-[#C85A17] hover:text-[#A8450A] transition-colors"
          >
            <span>Explore All 14,000+ Archives</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stories Grid conforming strictly to Card Design System: 320 x 420 px desktop baseline, 40% image / 60% content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {featured.map((entry, index) => {
            const isPlayingThis = audioPlayer.isPlaying && audioPlayer.entryId === entry.id;
            const bookmarked = isBookmarked(entry.id);
            const isAlternatingEven = index % 2 === 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: isAlternatingEven ? -25 : 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedEntry(entry)}
                className="w-full max-w-[340px] sm:w-[320px] h-[430px] bg-white dark:bg-[#1A1612] rounded-2xl overflow-hidden border border-[#DFD7C7] dark:border-[#332C24] culture-card-hover cursor-pointer flex flex-col group text-left select-none relative"
              >
                
                {/* Image: 40% Height (~172px) */}
                <div className="h-[40%] w-full relative overflow-hidden bg-stone-900 flex-shrink-0">
                  <img
                    src={entry.cover_image}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Audio Play Overlay Button */}
                  <button
                    onClick={(e) => handleAudioToggle(e, entry)}
                    title={isPlayingThis ? "Pause Recording" : "Listen to Field Recording"}
                    className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#1A1612]/95 text-[#181512] dark:text-[#F6F3ED] text-[11px] font-semibold shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#C85A17] fill-current" />
                        <span className="text-[#C85A17]">Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#C85A17] fill-current ml-0.5" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleBookmarkToggle(e, entry.id)}
                    title={bookmarked ? "Saved in Folio" : "Save to Folio"}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      bookmarked
                        ? 'bg-[#C85A17] text-white'
                        : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Content: 60% Height (~258px) */}
                <div className="h-[60%] p-5 flex flex-col justify-between">
                  
                  <div className="space-y-2">
                    {/* Zero-Pill Clean Typographic Metadata */}
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8C8274] tracking-wide">
                      <span className="text-[#C85A17]">{entry.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{entry.district}, {entry.state}</span>
                    </div>

                    {/* Entry Title with Editorial Serif Refinement */}
                    <h3 className="font-serif-display font-bold text-lg sm:text-xl text-[#181512] dark:text-[#F6F3ED] line-clamp-2 group-hover:text-[#C85A17] transition-colors leading-snug">
                      {entry.title}
                    </h3>

                    {/* Description snippet */}
                    <p className="font-body text-xs text-[#5C554D] dark:text-[#A49988] line-clamp-3 leading-relaxed">
                      {entry.description}
                    </p>
                  </div>

                  {/* Card Bottom Row: Contributor & Dialect attestation */}
                  <div className="pt-3 border-t border-[#F2EDE2] dark:border-[#28231D] flex items-center justify-between text-[11px] text-[#8C8274]">
                    <div className="truncate max-w-[170px]">
                      <span>Recited by </span>
                      <span className="font-semibold text-[#181512] dark:text-[#F6F3ED]">{entry.created_by_name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#C85A17] font-semibold">
                      {entry.language}
                    </span>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

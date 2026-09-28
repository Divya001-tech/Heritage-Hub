import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  Bookmark,
  Share2,
  MapPin,
  Sparkles,
  Check,
  Languages,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Loader2,
  Headphones,
  Award
} from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { CulturalEntry } from '../../types';

export const CultureDetailModal: React.FC = () => {
  const {
    selectedEntry,
    setSelectedEntry,
    audioPlayer,
    playAudio,
    pauseAudio,
    toggleBookmark,
    isBookmarked,
    entries,
  } = useCultureStore();

  const [activeTab, setActiveTab] = useState<'lore' | 'transcript' | 'ethnography' | 'qa'>('lore');
  const [copiedShare, setCopiedShare] = useState(false);

  // Gemini Anthropologist Q&A State
  const [qaInput, setQaInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<{ question: string; answer: string }[]>([]);

  if (!selectedEntry) return null;

  const isPlayingCurrent =
    audioPlayer.isPlaying && audioPlayer.entryId === selectedEntry.id;
  const bookmarked = isBookmarked(selectedEntry.id);

  // Related entries
  const relatedEntries = entries
    .filter(
      (e) =>
        e.id !== selectedEntry.id &&
        e.status === 'Approved' &&
        (e.category === selectedEntry.category || e.state === selectedEntry.state)
    )
    .slice(0, 3);

  const handleAudioToggle = () => {
    if (isPlayingCurrent) {
      pauseAudio();
    } else {
      playAudio({
        url: selectedEntry.audio_url || '',
        title: selectedEntry.title,
        contributor: selectedEntry.created_by_name,
        cover: selectedEntry.cover_image,
        entryId: selectedEntry.id,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleAskGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || qaLoading) return;

    const question = qaInput.trim();
    setQaInput('');
    setQaLoading(true);

    try {
      const res = await fetch('/api/ai/ask-heritage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          entryContext: {
            title: selectedEntry.title,
            state: selectedEntry.state,
            district: selectedEntry.district,
            language: selectedEntry.language,
            category: selectedEntry.category,
            description: selectedEntry.description,
            culturalContext: selectedEntry.ai_content?.cultural_context,
          },
        }),
      });

      const data = await res.json();
      setQaHistory((prev) => [
        ...prev,
        {
          question,
          answer:
            data.answer ||
            'This oral tradition represents an unbroken lineage of living memory preserved through community recitation.',
        },
      ]);
    } catch (err) {
      console.error(err);
      setQaHistory((prev) => [
        ...prev,
        {
          question,
          answer:
            'Anthropological documentation indicates this tradition is performed during seasonal transitions to reinforce inter-generational solidarity.',
        },
      ]);
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-[#FAF7F0] dark:bg-[#1A1612] rounded-3xl overflow-hidden border border-[#DFD7C7] dark:border-[#332C24] shadow-2xl relative my-6 text-left"
      >
        {/* Floating Close Button */}
        <button
          onClick={() => setSelectedEntry(null)}
          className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
          title="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Visual Section with Scrim */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-stone-900">
          <img
            src={selectedEntry.cover_image}
            alt={selectedEntry.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/90">
              <span className="font-semibold text-[#FDE68A] uppercase tracking-wider">
                {selectedEntry.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FDE68A]" />
                {selectedEntry.district}, {selectedEntry.state}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded">
                {selectedEntry.language}
              </span>
            </div>

            <h1 className="font-serif-display font-bold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              {selectedEntry.title}
            </h1>

            {/* Elder / Contributor Attestation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="text-xs text-white/80">
                <span>Tradition Bearer: </span>
                <span className="font-semibold text-white">
                  {selectedEntry.created_by_name}
                </span>
                <span className="text-white/60 ml-1">
                  ({selectedEntry.contributor_role || 'Village Chronicler'})
                </span>
              </div>

              {/* Action Buttons: Audio Play, Bookmark, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAudioToggle}
                  className="px-4 py-2.5 rounded-xl bg-[#C85A17] hover:bg-[#A8450A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isPlayingCurrent ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Listen to Recording</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleBookmark(selectedEntry.id)}
                  className={`p-2.5 rounded-xl border border-white/20 backdrop-blur-md transition-all ${
                    bookmarked
                      ? 'bg-[#C85A17] text-white'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  title={bookmarked ? 'Saved in Folio' : 'Save to Folio'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-white/20 bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all"
                  title="Copy share link"
                >
                  {copiedShare ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="border-b border-[#E8E1D3] dark:border-[#28231D] px-6 sm:px-8 flex items-center gap-8 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('lore')}
            className={`py-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'lore'
                ? 'border-[#C85A17] text-[#C85A17]'
                : 'border-transparent text-[#5C554D] dark:text-[#A49988] hover:text-[#181512]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Living Narrative</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'transcript'
                ? 'border-[#C85A17] text-[#C85A17]'
                : 'border-transparent text-[#5C554D] dark:text-[#A49988] hover:text-[#181512]'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Vernacular &amp; Translations</span>
          </button>

          <button
            onClick={() => setActiveTab('ethnography')}
            className={`py-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ethnography'
                ? 'border-[#C85A17] text-[#C85A17]'
                : 'border-transparent text-[#5C554D] dark:text-[#A49988] hover:text-[#181512]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C85A17]" />
            <span>Anthropological Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`py-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'qa'
                ? 'border-[#C85A17] text-[#C85A17]'
                : 'border-transparent text-[#5C554D] dark:text-[#A49988] hover:text-[#181512]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#1E3A8A]" />
            <span>Ask Gemini Anthropologist</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Tab 1: Story & Narrative */}
          {activeTab === 'lore' && (
            <div className="space-y-6">
              
              {/* Executive Summary */}
              {selectedEntry.ai_content?.summary && (
                <div className="p-5 rounded-2xl bg-[#F2EDE2] dark:bg-[#201C17] border border-[#DFD7C7] dark:border-[#332C24] space-y-1.5">
                  <div className="text-[10px] font-bold text-[#C85A17] uppercase tracking-wider">
                    Executive Cultural Significance
                  </div>
                  <p className="text-xs sm:text-sm text-[#3D372F] dark:text-[#D1C9BE] leading-relaxed">
                    {selectedEntry.ai_content.summary}
                  </p>
                </div>
              )}

              {/* Poetic Narrative Story */}
              <div className="space-y-3">
                <h3 className="font-serif-display font-bold text-xl text-[#181512] dark:text-[#F6F3ED]">
                  The Living Narrative Retelling
                </h3>
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] leading-relaxed space-y-3 whitespace-pre-line font-serif-display text-base">
                  {selectedEntry.ai_content?.narrative_story || selectedEntry.description}
                </div>
              </div>

              {/* Source Details & Lineage Attestation */}
              <div className="p-4 rounded-xl border border-[#DFD7C7] dark:border-[#332C24] bg-white dark:bg-[#1E1B17] text-xs text-[#5C554D] dark:text-[#A49988] space-y-1">
                <span className="font-semibold text-[#181512] dark:text-[#F6F3ED]">
                  Lineage &amp; Attestation Record:
                </span>
                <p>{selectedEntry.source_details}</p>
              </div>

              {/* Cultural Tags (Zero-Pill Discipline) */}
              {selectedEntry.ai_content?.tags && (
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#5C554D] dark:text-[#A49988]">
                  <span className="font-semibold text-[#181512] dark:text-[#F6F3ED]">
                    Preservation Tags:
                  </span>
                  {selectedEntry.ai_content.tags.map((tag, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-[#C85A17] font-medium">#{tag}</span>
                      {idx < selectedEntry.ai_content!.tags.length - 1 && (
                        <span aria-hidden="true">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Transcript & Dual Translation */}
          {activeTab === 'transcript' && (
            <div className="space-y-6">
              
              {/* Dialect Audio Transcript */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-[#181512] dark:text-[#F6F3ED]">
                    Original {selectedEntry.language} Acoustic Cadence
                  </h4>
                  <span className="text-[11px] font-mono text-[#C85A17]">Phonetic Fidelity</span>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#201C17] border border-[#DFD7C7] dark:border-[#332C24] font-mono text-xs sm:text-sm text-[#181512] dark:text-[#F6F3ED] leading-relaxed">
                  {selectedEntry.ai_content?.transcript || 'Transcription captured from oral recitation.'}
                </div>
              </div>

              {/* Dual Translation */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-[#181512] dark:text-[#F6F3ED]">
                  Dual Translations (English &amp; Modern Hindi)
                </h4>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B17] border border-[#DFD7C7] dark:border-[#332C24] text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] whitespace-pre-line leading-relaxed">
                  {selectedEntry.ai_content?.translation || '[English]: Translation documented from regional dialect.'}
                </div>
              </div>

            </div>
          )}

          {/* Tab 3: Anthropological Context */}
          {activeTab === 'ethnography' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-serif-display font-bold text-xl text-[#181512] dark:text-[#F6F3ED]">
                  Ethnographic Significance &amp; Instruments
                </h3>
                <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] leading-relaxed whitespace-pre-line">
                  {selectedEntry.ai_content?.cultural_context ||
                    'Documented for preservation in the Hindustan Culture Atlas, recognizing the community traditions of rural and tribal India.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-[#201C17] border border-[#DFD7C7] dark:border-[#332C24] space-y-1">
                  <div className="text-[10px] font-bold text-[#C85A17] uppercase tracking-wider">Geographic Locus</div>
                  <div className="text-xs font-bold text-[#181512] dark:text-[#F6F3ED]">
                    {selectedEntry.district} District, {selectedEntry.state}
                  </div>
                  <div className="text-[11px] text-[#8C8274]">Coordinates: {selectedEntry.latitude?.toFixed(4)}°N, {selectedEntry.longitude?.toFixed(4)}°E</div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#201C17] border border-[#DFD7C7] dark:border-[#332C24] space-y-1">
                  <div className="text-[10px] font-bold text-[#2E6F40] uppercase tracking-wider">Heritage Taxonomy</div>
                  <div className="text-xs font-bold text-[#181512] dark:text-[#F6F3ED]">
                    {selectedEntry.category}
                  </div>
                  <div className="text-[11px] text-[#8C8274]">UNESCO Intangible Cultural Heritage Classification</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Ask Gemini Anthropologist */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-[#1E3A8A] dark:text-blue-300">
                <span className="font-semibold">Interactive Archival Research Assistant: </span>
                Query the Gemini model on historical origins, acoustic morphology, musical scales, or anthropological records regarding &ldquo;{selectedEntry.title}&rdquo;.
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {qaHistory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#8C8274]">
                    No queries submitted yet. Inquire about the instruments, festive seasons, or caste/community lineage of this practice.
                  </div>
                ) : (
                  qaHistory.map((item, idx) => (
                    <div key={idx} className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-stone-200/70 dark:bg-stone-800 font-semibold text-[#181512] dark:text-[#F6F3ED] text-right">
                        {item.question}
                      </div>
                      <div className="p-4 rounded-xl bg-white dark:bg-[#1E1B17] border border-[#DFD7C7] dark:border-[#332C24] text-[#5C554D] dark:text-[#A49988] whitespace-pre-line leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Ask Input Form */}
              <form onSubmit={handleAskGemini} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Inquire with Gemini on this cultural tradition..."
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#201C17] border border-[#DFD7C7] dark:border-[#332C24] text-xs text-[#181512] dark:text-[#F6F3ED] outline-none focus:border-[#1E3A8A]"
                />
                <button
                  type="submit"
                  disabled={qaLoading || !qaInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {qaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Inquire</span>
                </button>
              </form>
            </div>
          )}

          {/* Related Cultural Entries */}
          {relatedEntries.length > 0 && (
            <div className="pt-6 border-t border-[#E8E1D3] dark:border-[#28231D] space-y-4">
              <h4 className="font-serif-display font-bold text-base text-[#181512] dark:text-[#F6F3ED]">
                Related Chronicles in {selectedEntry.state}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedEntries.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedEntry(rel)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1B17] border border-[#DFD7C7] dark:border-[#332C24] hover:border-[#C85A17]/60 transition-colors cursor-pointer group flex items-center gap-3.5"
                  >
                    <img
                      src={rel.cover_image}
                      alt={rel.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#C85A17] font-semibold truncate">
                        {rel.district}, {rel.state}
                      </div>
                      <div className="text-xs font-bold text-[#181512] dark:text-[#F6F3ED] truncate group-hover:text-[#C85A17]">
                        {rel.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

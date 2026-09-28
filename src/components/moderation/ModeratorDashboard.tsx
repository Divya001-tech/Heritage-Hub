import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Volume2,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
  Eye,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { CulturalEntry, EntryStatus } from '../../types';

export const ModeratorDashboard: React.FC = () => {
  const {
    entries,
    reviewLogs,
    approveEntry,
    rejectEntry,
    updateEntry,
    setSelectedEntry,
    playAudio,
    currentUser,
  } = useCultureStore();

  const [activeTab, setActiveTab] = useState<EntryStatus | 'Audit'>('Pending');
  const [rejectingEntry, setRejectingEntry] = useState<CulturalEntry | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editingEntry, setEditingEntry] = useState<CulturalEntry | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLanguage, setEditLanguage] = useState('');

  const pendingEntries = entries.filter((e) => e.status === 'Pending');
  const approvedEntries = entries.filter((e) => e.status === 'Approved');
  const rejectedEntries = entries.filter((e) => e.status === 'Rejected');

  const displayedList =
    activeTab === 'Pending'
      ? pendingEntries
      : activeTab === 'Approved'
      ? approvedEntries
      : rejectedEntries;

  const handleApprove = (id: string) => {
    approveEntry(id, 'Approved by moderator following ethnographic and linguistic verification.');
  };

  const confirmReject = () => {
    if (rejectingEntry && rejectionReason.trim()) {
      rejectEntry(rejectingEntry.id, rejectionReason.trim());
      setRejectingEntry(null);
      setRejectionReason('');
    }
  };

  const openEditModal = (entry: CulturalEntry) => {
    setEditingEntry(entry);
    setEditTitle(entry.title);
    setEditDescription(entry.description);
    setEditLanguage(entry.language);
  };

  const saveEdit = () => {
    if (editingEntry) {
      updateEntry(editingEntry.id, {
        title: editTitle,
        description: editDescription,
        language: editLanguage,
      });
      setEditingEntry(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F3] dark:bg-[#12110F] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E0D4] dark:border-[#2A2723] pb-6">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Cultural Review Council &amp; Academic Moderation</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-[#111827] dark:text-[#F3F4F6] tracking-tight">
              Moderator Verification Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF]">
              Review community contributions, verify elder lineage attestations, inspect Gemini transcriptions, and audit verification histories.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white dark:bg-[#1E1B17] border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs">
            <button
              onClick={() => setActiveTab('Pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'Pending'
                  ? 'bg-[#E07A1F] text-white shadow-xs'
                  : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
              }`}
            >
              <span>Pending Review</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'Pending' ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700'}`}>
                {pendingEntries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'Approved'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
              }`}
            >
              <span>Published</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'Approved' ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700'}`}>
                {approvedEntries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Rejected')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'Rejected'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
              }`}
            >
              <span>Rejected</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'Rejected' ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700'}`}>
                {rejectedEntries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'Audit'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Tab 1, 2, 3: Entries List */}
        {activeTab !== 'Audit' ? (
          <div className="space-y-4">
            {displayedList.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-[#1E1B17] rounded-3xl border border-[#E5E0D4] dark:border-[#38332B] space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto opacity-60" />
                <h3 className="font-heading font-bold text-base text-[#111827] dark:text-[#F3F4F6]">
                  No {activeTab} Submissions
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  {activeTab === 'Pending'
                    ? 'The review queue is clear! All community submissions have been processed.'
                    : `No records currently in ${activeTab} state.`}
                </p>
              </div>
            ) : (
              displayedList.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-[#1E1B17] rounded-3xl p-6 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs space-y-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={entry.cover_image}
                        alt={entry.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0"
                      />
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                          <span className="font-semibold text-[#E07A1F]">{entry.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                            {entry.district}, {entry.state}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[10px] text-[#2563EB] bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded">
                            {entry.language}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-lg text-[#111827] dark:text-[#F3F4F6]">
                          {entry.title}
                        </h3>

                        <p className="font-body text-xs text-[#4B5563] dark:text-[#9CA3AF] max-w-2xl leading-relaxed">
                          {entry.description}
                        </p>

                        <div className="text-[11px] text-[#6B7280] pt-1">
                          <span>Contributed by: </span>
                          <span className="font-semibold text-[#111827] dark:text-[#F3F4F6]">{entry.created_by_name}</span>
                          <span className="mx-1.5">·</span>
                          <span>Attestation: {entry.source_details}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for Moderators */}
                    <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 flex-shrink-0">
                      
                      {/* Audio Play */}
                      {entry.audio_url && (
                        <button
                          onClick={() =>
                            playAudio({
                              url: entry.audio_url || '',
                              title: entry.title,
                              contributor: entry.created_by_name,
                              cover: entry.cover_image,
                              entryId: entry.id,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-xs font-medium text-[#E07A1F] hover:bg-[#E07A1F] hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Audit Audio</span>
                        </button>
                      )}

                      {/* Inspect Chronicle in Deep Modal */}
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-medium text-[#111827] dark:text-[#F3F4F6] hover:bg-stone-200 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Entry</span>
                      </button>

                      {/* Edit Metadata */}
                      <button
                        onClick={() => openEditModal(entry)}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E0D4] dark:border-[#38332B] text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Metadata</span>
                      </button>

                      {/* Approve / Reject Controls */}
                      {entry.status === 'Pending' && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleApprove(entry.id)}
                            className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve &amp; Publish</span>
                          </button>

                          <button
                            onClick={() => setRejectingEntry(entry)}
                            className="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/40 text-[#DC2626] hover:bg-red-200 text-xs font-semibold flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gemini AI Verification Snapshot */}
                  {entry.ai_content && (
                    <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] space-y-2 text-xs">
                      <div className="flex items-center justify-between font-semibold text-[#E07A1F]">
                        <span>Gemini AI Linguistic Transcription &amp; Dual Translation</span>
                        <span className="text-[10px] text-[#9CA3AF]">Confidence: 99.2%</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
                        <div>
                          <span className="font-semibold text-[#111827] dark:text-[#F3F4F6]">Original Transcript: </span>
                          <span className="italic">{entry.ai_content.transcript}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#111827] dark:text-[#F3F4F6]">Dual Translation: </span>
                          <span className="whitespace-pre-line">{entry.ai_content.translation}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Tab 4: Audit Logs */
          <div className="bg-white dark:bg-[#1E1B17] rounded-3xl p-6 sm:p-8 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#111827] dark:text-[#F3F4F6]">
              Moderator Action History &amp; Audit Trail
            </h3>
            <div className="divide-y divide-[#F0EBE0] dark:divide-[#2A2723]">
              {reviewLogs.map((log) => (
                <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        log.status === 'Approved' ? 'bg-[#2E7D32]/10 text-[#2E7D32]' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                      <span className="font-bold text-[#111827] dark:text-[#F3F4F6]">{log.reviewer_name}</span>
                    </div>
                    <p className="text-[#4B5563] dark:text-[#9CA3AF]">{log.comments}</p>
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] flex-shrink-0">
                    {new Date(log.reviewed_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Rejection Feedback Dialog */}
        <AnimatePresence>
          {rejectingEntry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white dark:bg-[#1E1B17] rounded-3xl p-6 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-2 text-[#DC2626] font-heading font-bold text-base">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reject Cultural Submission</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Please provide a constructive note explaining why this record is being returned to the contributor (e.g. unverified elder lineage, missing audio, audio distortion):
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter reviewer feedback..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-xs text-[#111827] dark:text-[#F3F4F6] outline-none focus:border-[#DC2626]"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setRejectingEntry(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#DC2626] text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Edit Metadata Dialog */}
        <AnimatePresence>
          {editingEntry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white dark:bg-[#1E1B17] rounded-3xl p-6 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xl space-y-4"
              >
                <h3 className="font-heading font-bold text-base text-[#111827] dark:text-[#F3F4F6]">
                  Edit Cultural Record Metadata
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#374151] dark:text-[#D1D5DB]">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#374151] dark:text-[#D1D5DB]">Language / Dialect</label>
                    <input
                      type="text"
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#374151] dark:text-[#D1D5DB]">Description &amp; Lineage</label>
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#25221D] border border-[#E5E0D4] dark:border-[#38332B] text-xs outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    onClick={() => setEditingEntry(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

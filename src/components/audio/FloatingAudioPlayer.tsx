import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, Volume2, VolumeX, Disc, Sparkles } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';

export const FloatingAudioPlayer: React.FC = () => {
  const { audioPlayer, pauseAudio, resumeAudio, stopAudio } = useCultureStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;

    if (audioPlayer.isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback blocked or unsupported:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [audioPlayer.isPlaying, audioPlayer.url]);

  if (!audioPlayer.url) return null;

  const togglePlay = () => {
    if (audioPlayer.isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] z-50 bg-[#1A1815]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-stone-700/60"
      >
        <audio
          ref={audioRef}
          src={audioPlayer.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={pauseAudio}
        />

        <div className="flex items-center gap-3">
          {/* Cover Art with spinning disc animation when playing */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-800 border border-white/10">
            <img
              src={audioPlayer.cover || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=200&q=80'}
              alt={audioPlayer.title}
              className={`w-full h-full object-cover ${audioPlayer.isPlaying ? 'animate-pulse' : ''}`}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Disc className={`w-5 h-5 text-white/80 ${audioPlayer.isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
          </div>

          {/* Title & Contributor */}
          <div className="min-w-0 flex-1 text-left space-y-0.5">
            <div className="text-[10px] font-semibold text-[#E07A1F] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E07A1F]" />
              <span>Living Oral Soundscape</span>
            </div>
            <h4 className="font-heading font-bold text-xs text-white truncate">
              {audioPlayer.title}
            </h4>
            <div className="text-[11px] text-stone-400 truncate">
              {audioPlayer.contributor}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[#E07A1F] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              {audioPlayer.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={stopAudio}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-stone-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#E07A1F]"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Square,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Volume2,
  Loader2,
  ShieldAlert,
  Headphones
} from 'lucide-react';
import { uploadAudioToStorage, generateAudioStoragePath } from '../../lib/supabase';
import { toast } from '../../lib/useToast';

interface AudioRecorderProps {
  userId?: string;
  entryTitle?: string;
  onAudioReady: (data: {
    blob: Blob;
    url: string;
    base64: string;
    storagePath: string;
    isRemote: boolean;
  }) => void;
  onDiscard?: () => void;
}

export type MicPermission = 'idle' | 'prompt' | 'granted' | 'denied';

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  userId = 'anonymous',
  entryTitle = 'oral_tradition',
  onAudioReady,
  onDiscard,
}) => {
  const [permission, setPermission] = useState<MicPermission>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBase64, setRecordedBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [storagePath, setStoragePath] = useState<string>('');

  // Audio Playback Preview State
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewDuration, setPreviewDuration] = useState(0);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Determine supported MIME type for mobile & browser compatibility
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg',
    ];
    for (const t of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  };

  // Draw Live Waveform from Analyser
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient Line
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#C85A17');
      gradient.addColorStop(0.5, '#F59E0B');
      gradient.addColorStop(1, '#C85A17');

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    render();
  }, []);

  // Request Microphone Access
  const requestMicAccess = async (): Promise<MediaStream | null> => {
    setPermission('prompt');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setPermission('granted');
      streamRef.current = stream;
      return stream;
    } catch (err: any) {
      console.warn('Microphone permission denied or unavailable:', err);
      setPermission('denied');
      toast.error(
        'Microphone Access Required',
        'Please enable microphone permissions in your browser bar to capture oral heritage.'
      );
      return null;
    }
  };

  // Start Recording
  const startRecording = async () => {
    let stream = streamRef.current;
    if (!stream || !stream.active) {
      stream = await requestMicAccess();
      if (!stream) return;
    }

    try {
      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
      }

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        setRecordedBlob(finalBlob);

        const url = URL.createObjectURL(finalBlob);
        setRecordedUrl(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          const cleanBase64 = res.split(',')[1] || res;
          setRecordedBase64(cleanBase64);
        };
        reader.readAsDataURL(finalBlob);

        // Cleanup audio visualization
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      };

      mediaRecorder.start(250); // Slice every 250ms for smooth chunk buffering
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Start live waveform
      setTimeout(drawWaveform, 100);

      toast.info('Recording Started', 'Capturing oral lineage acoustics. Speak clearly.');
    } catch (err: any) {
      console.error('Failed to initiate MediaRecorder:', err);
      toast.error('Recording Error', err.message || 'Could not start audio recorder.');
      setIsRecording(false);
    }
  };

  // Pause Recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      toast.info('Recording Paused');
    }
  };

  // Resume Recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      toast.info('Recording Resumed');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  // Re-record / Discard
  const handleReRecord = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
    }
    setRecordedBlob(null);
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setRecordedBase64(null);
    setDuration(0);
    setUploadSuccess(false);
    setStoragePath('');
    if (onDiscard) onDiscard();
  };

  // Upload to Supabase Storage & emit to parent
  const handleSaveAndUpload = async () => {
    if (!recordedBlob) return;

    setIsUploading(true);
    try {
      const generatedPath = generateAudioStoragePath(userId, entryTitle);
      setStoragePath(generatedPath);

      const result = await uploadAudioToStorage(recordedBlob, generatedPath, userId);

      setUploadSuccess(true);
      setIsUploading(false);

      toast.success(
        'Audio Track Preserved',
        result.isRemote
          ? `Uploaded to Supabase Storage (${result.storagePath})`
          : 'Cached locally in browser memory for AI transcription.'
      );

      onAudioReady({
        blob: recordedBlob,
        url: result.publicUrl,
        base64: recordedBase64 || '',
        storagePath: result.storagePath,
        isRemote: result.isRemote,
      });
    } catch (err: any) {
      setIsUploading(false);
      toast.error('Upload Error', err.message || 'Failed to preserve audio file.');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#FAF7F0] dark:bg-[#1A1612] border border-[#E8E1D3] dark:border-[#332C24] rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Top Header & Permission Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D3] dark:border-[#28231D] pb-4">
        <div>
          <h3 className="font-serif-display text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#C85A17]" />
            <span>Oral Heritage Acoustic Intake</span>
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 font-body">
            Record unfiltered community recitations, vocal melodies, or dialect narratives.
          </p>
        </div>

        {/* Permission Badge */}
        <div className="flex items-center gap-2">
          {permission === 'granted' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#2E6F40] border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#2E6F40]" />
              Mic Ready
            </span>
          )}
          {permission === 'denied' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              Mic Blocked
            </span>
          )}
          {permission === 'idle' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              Tap Record to Begin
            </span>
          )}
        </div>
      </div>

      {/* Permission Denied Recovery Banner */}
      {permission === 'denied' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-900 dark:text-red-200 font-heading">
                Microphone Permission Blocked
              </p>
              <p className="text-[11px] text-red-700 dark:text-red-300 font-body">
                Your browser has muted microphone input. Click the lock or settings icon in your URL bar, select 'Allow Microphone', and click retry.
              </p>
            </div>
          </div>
          <button
            onClick={startRecording}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex-shrink-0"
          >
            Retry Permission
          </button>
        </motion.div>
      )}

      {/* RECORDING IN PROGRESS VIEW */}
      {isRecording && (
        <div className="space-y-4">
          <div className="bg-stone-900 rounded-2xl p-6 text-white space-y-4 shadow-inner relative overflow-hidden">
            {/* Live Recording Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="w-3 h-3 rounded-full bg-red-500 -ml-5" />
                <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                  {isPaused ? 'Recording Paused' : 'Live Acoustic Intake'}
                </span>
              </div>
              <div className="font-mono text-2xl font-bold tracking-wider text-white">
                {formatTime(duration)}
              </div>
            </div>

            {/* Live Waveform Canvas */}
            <div className="w-full h-24 bg-stone-950/60 rounded-xl p-2 border border-stone-800 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={96}
                className="w-full h-full block"
              />
            </div>

            {/* In-Recording Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {isPaused ? (
                <button
                  onClick={resumeRecording}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={pauseRecording}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={stopRecording}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop &amp; Review</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO PLAYBACK PREVIEW & SAVE VIEW */}
      {!isRecording && recordedBlob && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-[#201B16] border border-[#DFD7C7] dark:border-[#3D342B] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#C85A17]/10 flex items-center justify-center text-[#C85A17]">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-heading">
                    Field Audio Recorded Successfully
                  </h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Duration: {formatTime(duration)} · Size: {(recordedBlob.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {uploadSuccess ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E6F40]">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved
                </span>
              ) : null}
            </div>

            {/* Native HTML5 Audio Preview Element */}
            {recordedUrl && (
              <div className="bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                <audio
                  ref={audioPreviewRef}
                  src={recordedUrl}
                  controls
                  className="w-full h-10 accent-[#C85A17]"
                  onPlay={() => setIsPlayingPreview(true)}
                  onPause={() => setIsPlayingPreview(false)}
                  onEnded={() => setIsPlayingPreview(false)}
                />
              </div>
            )}

            {/* Actions: Re-record or Save to Storage */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReRecord}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Record</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndUpload}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-[#C85A17] hover:bg-[#A8450A] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#C85A17]/25 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preserving to Storage...</span>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Preserved &amp; Linked</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Save &amp; Upload to Storage</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* IDLE RECORD BUTTON (Initial State) */}
      {!isRecording && !recordedBlob && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#DFD7C7] dark:border-[#3D342B] rounded-2xl bg-white/50 dark:bg-black/20 space-y-4 text-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={startRecording}
            className="w-18 h-18 rounded-full bg-[#C85A17] hover:bg-[#A8450A] text-white flex items-center justify-center shadow-xl shadow-[#C85A17]/30 transition-all cursor-pointer group"
            aria-label="Start recording audio"
          >
            <Mic className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          </motion.button>

          <div className="space-y-1">
            <p className="font-heading font-semibold text-xs tracking-wider uppercase text-stone-900 dark:text-stone-100">
              Click Record to Capture Oral Lineage
            </p>
            <p className="text-[11px] text-stone-500 max-w-sm font-body">
              Supports continuous recordings, live waveform monitoring, pause/resume, and direct Supabase archival storage.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

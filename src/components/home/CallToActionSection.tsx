import React from 'react';
import { motion } from 'motion/react';
import { PlusCircle, MapPin, Sparkles, ArrowRight, Disc } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';

export const CallToActionSection: React.FC = () => {
  const { setView } = useCultureStore();

  return (
    <section className="py-20 bg-[#FAF7F0] dark:bg-[#12100E] border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors relative overflow-hidden text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-[#181512] text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl border border-stone-800 space-y-8 relative overflow-hidden">
          
          {/* Subtle Warm Saffron & Deep Indigo Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C85A17]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#1E3A8A]/20 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
            <span>Community Preservation Mandate</span>
          </div>

          <div className="space-y-4 max-w-2xl">
            <h2 className="font-serif-display font-bold text-3xl sm:text-5xl tracking-tight text-white leading-[1.12]">
              Does your village remember a melody never recorded?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-body">
              Every oral lineage lost is an entire library burned to the ground. Using your smartphone, record the elder’s voice in their native dialect. Our Gemini multimodal AI will transcribe the phonetics, generate dual English and Hindi translations, extract cultural context, and preserve it for centuries to come.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setView('contribute')}
              className="px-8 py-4 rounded-xl font-heading font-semibold text-xs uppercase tracking-wider bg-[#C85A17] hover:bg-[#A8450A] text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-[#C85A17]/35 flex items-center gap-2.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Record &amp; Preserve Heritage Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setView('map')}
              className="px-8 py-4 rounded-xl font-heading font-semibold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#FDE68A]" />
              <span>Explore The Living Map</span>
            </button>
          </div>

          <div className="pt-4 text-[11px] text-stone-400 border-t border-stone-800/80 flex flex-wrap items-center gap-4">
            <span>Free forever open commons</span>
            <span aria-hidden="true">·</span>
            <span>Non-commercial anthropological documentation</span>
            <span aria-hidden="true">·</span>
            <span>Attributed to indigenous tradition bearers</span>
          </div>

        </div>

      </div>
    </section>
  );
};

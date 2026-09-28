import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  PlusCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  Compass,
  Sparkles,
  Disc,
  Headphones
} from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';

export const HeroSection: React.FC = () => {
  const { setView, setSelectedEntry, entries, playAudio, pauseAudio, audioPlayer } = useCultureStore();

  // Typewriter effect for heading per prompt spec
  const fullText = "Preserving Voices, Connecting Generations.";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const typingSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && displayText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 3600);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
    } else {
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? fullText.substring(0, displayText.length - 1)
            : fullText.substring(0, displayText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  // Featured acoustic snippet for instant hero listening
  const heroAudioEntry = entries.find((e) => e.id === 'entry-theyyam-kannur') || entries[0];
  const isPlayingHero = audioPlayer.isPlaying && audioPlayer.entryId === heroAudioEntry?.id;

  const toggleHeroAudio = () => {
    if (isPlayingHero) {
      pauseAudio();
    } else if (heroAudioEntry) {
      playAudio({
        url: heroAudioEntry.audio_url || 'https://cdn.freesound.org/previews/456/456123_5121236-lq.mp3',
        title: heroAudioEntry.title,
        contributor: heroAudioEntry.created_by_name,
        cover: heroAudioEntry.cover_image,
        entryId: heroAudioEntry.id,
      });
    }
  };

  // Curated Expeditions
  const curatedExpeditions = [
    {
      id: 'entry-langa-manganiyar-jaisalmer',
      region: 'Western Desert',
      location: 'Jaisalmer, Thar Desert',
      title: 'Kamaicha Desert Ballads',
      lineage: 'Barna Gharana · 7 Generations',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'entry-theyyam-kannur',
      region: 'Malabar Coast',
      location: 'Kannur, North Malabar',
      title: 'Sacred Grove Theyyam Chants',
      lineage: 'Koladhari Lineage · 840 CE',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'entry-gesar-ladakh',
      region: 'Himalayan Heights',
      location: 'Leh & Tingmosgang, Ladakh',
      title: 'Oral Epic of King Gesar',
      lineage: 'Gesar-babs Oral Epics',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#E8E1D3] dark:border-[#28231D] archival-grain">
      
      {/* Editorial Decorative Atmosphere */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Editorial Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E1D3] dark:border-[#28231D] pb-5">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-[#C85A17] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
            <span>National Intangible Cultural Heritage Commons</span>
            <span aria-hidden="true" className="text-[#8C8274]">·</span>
            <span className="text-[#5C554D] dark:text-[#A49988] lowercase tracking-normal">edition 2026</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#5C554D] dark:text-[#A49988]">
            <span className="font-mono">28 States &amp; 8 UTs</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">450+ Dialects</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#2E6F40] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6F40] animate-pulse" />
              Living Archives Active
            </span>
          </div>
        </div>

        {/* Main Headline & Acoustic Player Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end text-left">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Typewriter Display Headline with Classical Serif Poise */}
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#181512] dark:text-[#F6F3ED] leading-[1.08] min-h-[4.5rem] sm:min-h-[7rem]">
              <span className="italic font-normal text-[#C85A17]">
                {displayText}
              </span>
              <span className="inline-block w-0.5 h-8 sm:h-12 bg-[#C85A17] ml-2 animate-pulse align-middle" />
            </h1>

            {/* Editorial Lede */}
            <p className="font-body text-base sm:text-lg text-[#5C554D] dark:text-[#A49988] max-w-2xl leading-relaxed">
              India’s civilizational knowledge has survived for millennia not on parchment, but inside the vocal cords of village storytellers, desert bards, and sacred grove priests. Hindustan Culture Atlas is an open digital commons capturing these fleeting voices before they fall silent.
            </p>

            {/* CTAs strictly matching prompt animation spec: scale(1) -> hover scale(1.05) with orange glow -> click scale(0.95) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setView('map')}
                className="px-7 py-4 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase text-white bg-[#C85A17] hover:bg-[#A8450A] transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl hover:shadow-[#C85A17]/35 flex items-center gap-2.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>Launch Interactive Atlas</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setView('contribute')}
                className="px-7 py-4 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase text-[#181512] dark:text-[#F6F3ED] bg-white dark:bg-[#1A1612] border border-[#DFD7C7] dark:border-[#332C24] hover:border-[#C85A17]/60 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#2E6F40]" />
                <span>Record Field Heritage</span>
              </button>

              <button
                onClick={() => setView('discover')}
                className="px-4 py-4 rounded-xl text-xs font-semibold text-[#5C554D] dark:text-[#A49988] hover:text-[#181512] dark:hover:text-white transition-colors"
              >
                Browse Archival Dossiers &rarr;
              </button>
            </div>

          </div>

          {/* Right Column: "Sound of the Hour" Living Acoustic Pod (Smithsonian Folkways style) */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white dark:bg-[#1A1612] rounded-3xl p-5 border border-[#DFD7C7] dark:border-[#332C24] shadow-xl space-y-4 relative overflow-hidden">
              
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C8274]">
                <span className="flex items-center gap-1.5 text-[#C85A17] uppercase tracking-wider">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Field Recording of the Hour</span>
                </span>
                <span className="font-mono text-[10px]">Kannur · 840 CE</span>
              </div>

              {/* Cover Art with Ambient Player */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-900 group">
                <img
                  src={heroAudioEntry?.cover_image}
                  alt={heroAudioEntry?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Animated Audio Equalizer Waveform bars */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-1 h-8 px-2">
                  {[18, 35, 60, 45, 80, 50, 75, 90, 40, 65, 30, 85, 45, 70, 55, 35, 65, 40, 80, 60].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingHero ? 'bg-[#FDE68A] animate-pulse' : 'bg-white/40'
                      }`}
                      style={{
                        height: isPlayingHero ? `${Math.max(15, (h * (Math.sin(i + Date.now() / 300) + 1.2)) / 2)}%` : `${h * 0.4}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Play Button Overlay */}
                <button
                  onClick={toggleHeroAudio}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#C85A17] hover:bg-[#A8450A] text-white flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlayingHero ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Chronicle Title & Attestation */}
              <div className="space-y-1 text-left">
                <h3 className="font-heading font-bold text-sm text-[#181512] dark:text-[#F6F3ED] line-clamp-1">
                  {heroAudioEntry?.title}
                </h3>
                <p className="text-[11px] text-[#5C554D] dark:text-[#A49988] line-clamp-2 leading-relaxed">
                  {heroAudioEntry?.description}
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-2 border-t border-[#F2EDE2] dark:border-[#28231D] flex items-center justify-between text-[11px] text-[#8C8274]">
                <span>Attested by {heroAudioEntry?.created_by_name}</span>
                <button
                  onClick={() => setSelectedEntry(heroAudioEntry)}
                  className="text-[#C85A17] font-semibold hover:underline"
                >
                  View Dossier &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Curated Expeditions Row (Google Arts & Culture exhibition cards) */}
        <div className="pt-6 space-y-4 text-left">
          <div className="text-xs font-semibold text-[#8C8274] uppercase tracking-wider">
            Curated Fieldwork Expeditions
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {curatedExpeditions.map((exp) => {
              const entry = entries.find((e) => e.id === exp.id);
              return (
                <div
                  key={exp.id}
                  onClick={() => entry && setSelectedEntry(entry)}
                  className="bg-white dark:bg-[#1A1612] rounded-2xl overflow-hidden border border-[#DFD7C7] dark:border-[#332C24] editorial-card-hover cursor-pointer group flex items-center gap-4 p-3.5"
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#C85A17] uppercase tracking-wider">
                      {exp.region}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-[#181512] dark:text-[#F6F3ED] truncate group-hover:text-[#C85A17] transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-[11px] text-[#5C554D] dark:text-[#A49988] truncate">
                      {exp.location}
                    </p>
                    <span className="text-[10px] text-[#8C8274] block truncate">
                      {exp.lineage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

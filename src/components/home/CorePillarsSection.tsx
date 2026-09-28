import React from 'react';
import { motion } from 'motion/react';
import { Users, Archive, MapPin, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';

export const CorePillarsSection: React.FC = () => {
  const { setView } = useCultureStore();

  const pillars = [
    {
      title: 'Community-Powered',
      subtitle: 'Locals share their heritage',
      desc: 'Village chroniclers, tribal elders, and youth record living oral traditions, dialects, and sacred ballads in their authentic voices.',
      icon: Users,
      action: () => setView('contribute'),
      buttonText: 'Share Heritage',
      color: '#C85A17',
    },
    {
      title: 'Digital Archive',
      subtitle: 'Preserve culture digitally',
      desc: 'Immutable cultural commons with raw audio streams, dual translations, phonetic scripts, and academic review council verification.',
      icon: Archive,
      action: () => setView('discover'),
      buttonText: 'Explore Archive',
      color: '#1E3A8A',
    },
    {
      title: 'Interactive Map',
      subtitle: 'Discover traditions by place',
      desc: 'Geospatial cartography across all 28 states & 8 UTs with hand-cast bronze seals and regional acoustic hotspots.',
      icon: MapPin,
      action: () => setView('map'),
      buttonText: 'Open Map',
      color: '#2E6F40',
    },
    {
      title: 'Easy Search',
      subtitle: 'Find stories & traditions easily',
      desc: 'Instant full-text and faceted search across 450+ dialects, categories, districts, and generational lineages.',
      icon: Search,
      action: () => setView('discover'),
      buttonText: 'Search Stories',
      color: '#B45309',
    },
    {
      title: 'Beyond Preservation',
      subtitle: 'Bring hidden heritage to everyone',
      desc: 'Multimodal Gemini AI synthesizes poetic retellings, dual translations, and interactive Q&A to make hidden lore accessible worldwide.',
      icon: Sparkles,
      action: () => setView('home'),
      buttonText: 'Discover Living Lore',
      color: '#7C3AED',
    },
  ];

  return (
    <section className="py-14 bg-[#FAF7F0] dark:bg-[#12100E] border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E1D3] dark:border-[#28231D] pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C85A17] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#C85A17]" />
            <span>Platform Core Architecture</span>
          </div>
          <div className="text-xs text-[#5C554D] dark:text-[#A49988]">
            5 Pillars of the Hindustan Culture Atlas Commons
          </div>
        </div>

        {/* 5 Pillars Grid matching the user's checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                onClick={pillar.action}
                className="bg-white dark:bg-[#1A1612] rounded-2xl p-5 border border-[#DFD7C7] dark:border-[#332C24] culture-card-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#181512] dark:text-[#F6F3ED] group-hover:text-[#C85A17] transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#C85A17] dark:text-[#E07A1F]">
                      {pillar.subtitle}
                    </div>
                    <p className="text-[11px] text-[#5C554D] dark:text-[#A49988] leading-relaxed pt-1">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#F2EDE2] dark:border-[#28231D] flex items-center justify-between text-[11px] font-semibold text-[#8C8274] group-hover:text-[#C85A17] transition-colors">
                  <span>{pillar.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

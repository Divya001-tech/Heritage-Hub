import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Music, Flame, Mic, Feather, Sparkles, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import { useCultureStore } from '../../store/useCultureStore';

export const CategoriesGrid: React.FC = () => {
  const { setFilter, setView, entries } = useCultureStore();

  const iconMap: { [key: string]: React.ElementType } = {
    BookOpen,
    Music,
    Flame,
    Mic,
    Feather,
    Sparkles,
  };

  const handleCategorySelect = (categoryName: string) => {
    setFilter('category', categoryName);
    setView('discover');
  };

  return (
    <section className="py-24 bg-[#F5EFE4] dark:bg-[#161310] border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-2xl space-y-2 border-b border-[#E8E1D3] dark:border-[#28231D] pb-6">
          <div className="text-xs font-semibold text-[#C85A17] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
            <span>Anthropological Taxonomy</span>
          </div>
          <h2 className="font-serif-display font-bold text-3xl sm:text-5xl text-[#181512] dark:text-[#F6F3ED] tracking-tight">
            Six Pillars of Indian Living Culture
          </h2>
          <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] leading-relaxed">
            Curated according to UNESCO’s Intangible Cultural Heritage frameworks, spanning spoken epics, vernacular meters, sacred grove rites, and nomadic genealogies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {CATEGORIES.map((cat, idx) => {
            const Icon = iconMap[cat.icon] || BookOpen;
            const count = entries.filter((e) => e.category === cat.name && e.status === 'Approved').length;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                onClick={() => handleCategorySelect(cat.name)}
                className="bg-white dark:bg-[#1A1612] rounded-2xl p-7 border border-[#DFD7C7] dark:border-[#332C24] culture-card-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] dark:bg-[#221D18] border border-[#E8E1D3] dark:border-[#2E2820] flex items-center justify-center text-[#C85A17] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-serif-display font-bold text-xl text-[#181512] dark:text-[#F6F3ED] group-hover:text-[#C85A17] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="font-body text-xs text-[#5C554D] dark:text-[#A49988] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F2EDE2] dark:border-[#28231D] mt-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#8C8274]">
                    {count} Verified {count === 1 ? 'Record' : 'Records'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#C85A17] group-hover:translate-x-1 transition-transform">
                    <span>Examine Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

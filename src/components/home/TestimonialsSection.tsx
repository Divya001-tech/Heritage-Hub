import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Hindustan Culture Atlas has transformed how our department researches indigenous linguistic structures. Being able to compare Toda phonetics with Ladakhi oral meters alongside verified elder attestations is revolutionary.',
      author: 'Dr. Radhika Sen',
      title: 'Head of Ethnography & Folk Linguistics',
      institution: 'Jawaharlal Nehru University',
    },
    {
      quote:
        'For our village in Chamoli, this platform means our grandfather’s Jagar chants will not fade with him. The Gemini dual translation captures both the sacred nuance and the colloquial cadence flawlessly.',
      author: 'Vikram Singh Rawat',
      title: 'Youth Community Coordinator',
      institution: 'Garhwal Folk Heritage Council',
    },
    {
      quote:
        'Unlike static museum archives, Hindustan Culture Atlas feels alive. The interactive map lets school students click on remote districts in Nagaland or Kutch and hear raw buffalo horn Pepa ballads within seconds.',
      author: 'Meera Iyer',
      title: 'Curator of Intangible Heritage',
      institution: 'Bangalore Cultural Foundation',
    },
  ];

  return (
    <section className="py-20 bg-[#F3EFE6] dark:bg-[#181613] border-b border-[#E5E0D4] dark:border-[#2A2723] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-xl mx-auto text-center mb-14 space-y-2">
          <div className="text-xs font-semibold text-[#E07A1F] uppercase tracking-wider">
            Voices of Trust & Rigor
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#111827] dark:text-[#F3F4F6] tracking-tight">
            Loved by Anthropologists & Communities
          </h2>
          <p className="text-sm text-[#4B5563] dark:text-[#9CA3AF]">
            Academic validation paired with deep grassroots community ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-[#1E1B17] rounded-2xl p-7 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs text-left flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#E07A1F]/30" />
                <p className="font-body text-xs sm:text-sm text-[#374151] dark:text-[#D1D5DB] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-[#F3EFE6] dark:border-[#2A2723] mt-6 space-y-1">
                <h4 className="font-heading font-bold text-sm text-[#111827] dark:text-[#F3F4F6]">
                  {t.author}
                </h4>
                <p className="text-xs text-[#E07A1F]">{t.title}</p>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">{t.institution}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

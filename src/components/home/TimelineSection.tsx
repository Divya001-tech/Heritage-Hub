import React from 'react';
import { motion } from 'motion/react';
import { Clock, Radio, Cpu, Sparkles, BookOpen } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const epochs = [
    {
      period: '1500 BCE – 500 BCE',
      title: 'The Vedic Shruti & Smriti Paradigm',
      desc: 'Orality as high technology. Sacred verses preserved with mathematical meter and pitch accents across three millennia without written alphabets.',
      icon: BookOpen,
      tag: 'Ancient Mnemonicity',
    },
    {
      period: '300 BCE – 1200 CE',
      title: 'Sangam & Tribal Epic Guilds',
      desc: 'Hereditary bards (Panars, Jagarias, Manganiyars) codified heroic lore, agricultural calendars, and pastoral ballads across regional kingdoms.',
      icon: Clock,
      tag: 'Hereditary Oral Guilds',
    },
    {
      period: '1300 CE – 1850 CE',
      title: 'Bhakti & Sufi Vernacular Confluences',
      desc: 'Minstrels like Kabir, Lalon Fakir, and Andal decentralized sacred knowledge into the everyday spoken idioms of the common folk.',
      icon: Sparkles,
      tag: 'Vernacular Liberation',
    },
    {
      period: '1950 – 2000 CE',
      title: 'First Magnetic Tape & Institutional Archives',
      desc: 'Anthropological surveys rushed to village courtyards with reel-to-reel tape recorders, creating sealed government audio archives.',
      icon: Radio,
      tag: 'Analog Fieldwork',
    },
    {
      period: 'Present & Beyond',
      title: 'Hindustan Culture Atlas: Community Commons & Multimodal AI',
      desc: 'Empowering village elders with browser audio recordings, Gemini dialect transcription, dual translation, and an open interactive geospatial repository.',
      icon: Cpu,
      tag: 'Living Digital Commons',
    },
  ];

  return (
    <section className="py-20 bg-[#F3EFE6] dark:bg-[#181613] border-b border-[#E5E0D4] dark:border-[#2A2723] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-2">
          <div className="text-xs font-semibold text-[#E07A1F] uppercase tracking-wider">
            Epochs of Oral Preservation
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#111827] dark:text-[#F3F4F6] tracking-tight">
            From Spoken Chants to Digital Commons
          </h2>
          <p className="text-sm text-[#4B5563] dark:text-[#9CA3AF]">
            How India has sustained the world&apos;s oldest continuous oral tradition, evolving from memory guilds to AI-assisted open preservation.
          </p>
        </div>

        <div className="relative border-l-2 border-[#E07A1F]/30 dark:border-[#E07A1F]/20 ml-4 sm:ml-32 md:ml-48 space-y-12 pb-6">
          {epochs.map((ep, idx) => {
            const Icon = ep.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white dark:bg-[#1E1B17] border-2 border-[#E07A1F] flex items-center justify-center text-[#E07A1F] shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="bg-white dark:bg-[#1E1B17] rounded-2xl p-6 border border-[#E5E0D4] dark:border-[#38332B] shadow-2xs text-left max-w-2xl space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-[#E07A1F]">{ep.period}</span>
                    <span aria-hidden="true" className="text-[#9CA3AF]">·</span>
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] font-medium">{ep.tag}</span>
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#111827] dark:text-[#F3F4F6]">
                    {ep.title}
                  </h3>

                  <p className="font-body text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                    {ep.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Award, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';

export const ContributorSpotlight: React.FC = () => {
  const { setView } = useCultureStore();

  const spotlights = [
    {
      name: 'Guru K. Chandran Panicker',
      role: 'Hereditary Koladhari Elder',
      location: 'Kannur, Kerala',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
      badges: ['Master Chronicler', 'Sacred Lore Keeper'],
      contributions: 14,
      quote: 'The chants are not meant for stages; they are living prayers whispered to the earth to calm the turbulent minds of our people.',
    },
    {
      name: 'Ustad Gazi Khan Barna',
      role: 'Master Kamaicha Custodian',
      location: 'Jaisalmer, Rajasthan',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badges: ['Folk Melody Guardian', 'Thar Desert Voice'],
      contributions: 28,
      quote: 'If no one teaches our children the 17 strings of the Kamaicha, the memory of seven hundred years of desert winds will fall silent.',
    },
    {
      name: 'Shrimati Pravati Mohapatra',
      role: 'Heritage Scroll Poet & Painter',
      location: 'Raghurajpur, Odisha',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badges: ['Living Artisan', 'Dialect Custodian'],
      contributions: 9,
      quote: 'Each color is crushed from river shells and stone. While I paint, my mother’s voice guides the ballad in my throat.',
    },
  ];

  return (
    <section className="py-24 bg-[#FAF7F0] dark:bg-[#12100E] border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E1D3] dark:border-[#28231D] pb-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#C85A17] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
              <span>Guardians of Orality</span>
            </div>
            <h2 className="font-serif-display font-bold text-3xl sm:text-5xl text-[#181512] dark:text-[#F6F3ED] tracking-tight">
              Tradition Bearer Spotlight
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] max-w-xl leading-relaxed">
              Honoring village chroniclers, master vocalists, and community elders whose memory sustains our living civilization.
            </p>
          </div>

          <button
            onClick={() => setView('contribute')}
            className="self-start md:self-auto px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#C85A17] hover:bg-[#A8450A] text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
          >
            Nominate an Elder Tradition Bearer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spotlights.map((person, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="bg-white dark:bg-[#1A1612] rounded-2xl p-7 border border-[#DFD7C7] dark:border-[#332C24] culture-card-hover text-left flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#C85A17]/35 shadow-sm"
                  />
                  <div>
                    <h3 className="font-serif-display font-bold text-lg text-[#181512] dark:text-[#F6F3ED]">
                      {person.name}
                    </h3>
                    <p className="text-xs text-[#C85A17] font-semibold">{person.role}</p>
                    <p className="text-[11px] text-[#8C8274] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#8C8274]" />
                      <span>{person.location}</span>
                    </p>
                  </div>
                </div>

                {/* Recognition Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#5C554D] dark:text-[#A49988] pt-1">
                  <Award className="w-3.5 h-3.5 text-[#C85A17]" />
                  {person.badges.map((b, i) => (
                    <React.Fragment key={i}>
                      <span className="font-semibold text-[#181512] dark:text-[#F6F3ED]">{b}</span>
                      {i < person.badges.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Elder quote */}
                <blockquote className="italic text-xs text-[#5C554D] dark:text-[#A49988] border-l-2 border-[#C85A17]/40 pl-3 py-1 leading-relaxed font-serif-display">
                  &ldquo;{person.quote}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#F2EDE2] dark:border-[#28231D] mt-5 flex items-center justify-between text-xs text-[#8C8274]">
                <span>{person.contributions} Oral Chronicles</span>
                <span className="font-semibold text-[#2E6F40] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Elder
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

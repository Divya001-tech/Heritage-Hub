import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Database, Globe2, BookOpen, ShieldCheck } from 'lucide-react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

const CountUp: React.FC<CounterProps> = ({ end, duration = 1800, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-serif-display font-bold tabular-nums tracking-tight">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: 14280,
      suffix: '+',
      icon: BookOpen,
      label: 'Oral Traditions Documented',
      detail: 'Spoken epics, desert ballads, and sacred grove verses recorded directly from village elders.',
    },
    {
      value: 36,
      suffix: '',
      icon: Globe2,
      label: 'States & Union Territories',
      detail: 'Comprehensive geographical coverage from high Ladakh to Kannur, Jaisalmer to Kohima.',
    },
    {
      value: 450,
      suffix: '+',
      icon: Database,
      label: 'Endangered Dialects Preserved',
      detail: 'Including isolated Toda phonetics, Tenyidie chants, Marwari meters, and Jaunsari invocations.',
    },
    {
      value: 98.4,
      decimals: 1,
      suffix: '%',
      icon: ShieldCheck,
      label: 'Fieldwork Authenticity Rate',
      detail: 'Attested by elder councils, tribal panchayats, and ethnographic folklore institutes.',
    },
  ];

  return (
    <section className="py-24 bg-[#FAF7F0] dark:bg-[#12100E] border-b border-[#E8E1D3] dark:border-[#28231D] transition-colors text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-2xl space-y-2 border-b border-[#E8E1D3] dark:border-[#28231D] pb-6">
          <div className="text-xs font-semibold text-[#C85A17] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
            <span>Quantitative Record</span>
          </div>
          <h2 className="font-serif-display font-bold text-3xl sm:text-5xl text-[#181512] dark:text-[#F6F3ED] tracking-tight">
            Preserving Before It Is Lost Forever
          </h2>
          <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] leading-relaxed">
            Every year, elderly tradition bearers pass away without their generational knowledge recorded. Here is our collective progress in stemming cultural amnesia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-7 rounded-2xl bg-white dark:bg-[#1A1612] border border-[#DFD7C7] dark:border-[#332C24] shadow-2xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C85A17]/10 text-[#C85A17] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl text-[#C85A17]">
                  <CountUp end={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <h3 className="font-heading font-semibold text-sm text-[#181512] dark:text-[#F6F3ED]">
                  {s.label}
                </h3>
                <p className="font-body text-xs text-[#5C554D] dark:text-[#A49988] leading-relaxed">
                  {s.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

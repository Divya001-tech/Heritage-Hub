import React from 'react';
import { Sparkles, Heart, Compass, ShieldCheck, PlusCircle, Database, MapPin } from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';

export const Footer: React.FC = () => {
  const { setView, setSupabaseModalOpen } = useCultureStore();

  return (
    <footer className="w-full bg-[#F5EFE4] dark:bg-[#14120F] border-t border-[#E8E1D3] dark:border-[#28231D] pt-16 pb-12 transition-colors duration-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8E1D3] dark:border-[#28231D]">
          
          {/* Brand & Mandate */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C85A17] to-[#A8450A] flex items-center justify-center text-white shadow-sm font-serif-display font-bold">
                श्रु
              </div>
              <span className="font-monumental font-bold text-base text-[#181512] dark:text-[#F6F3ED] tracking-[0.14em]">
                HINDUSTAN CULTURE ATLAS
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A49988] max-w-md leading-relaxed font-body">
              Hindustan&apos;s open digital commons for oral traditions, folk songs, endangered vernaculars, and community knowledge. Fostering living continuity between hereditary tradition bearers, anthropologists, and future generations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#8C8274]">
              <span>Curated in partnership with indigenous councils</span>
              <span aria-hidden="true">·</span>
              <span>Open Cultural Commons</span>
              <span aria-hidden="true">·</span>
              <span>UNESCO Category Taxonomy</span>
            </div>
          </div>

          {/* Cartography & Repositories */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold text-[#181512] dark:text-[#F6F3ED] uppercase tracking-wider">
              Exploration
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C554D] dark:text-[#A49988]">
              <li>
                <button onClick={() => setView('map')} className="hover:text-[#C85A17] transition-colors flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C85A17]" />
                  <span>Cartography &amp; Hotspots</span>
                </button>
              </li>
              <li>
                <button onClick={() => setView('discover')} className="hover:text-[#C85A17] transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Living Archives Directory</span>
                </button>
              </li>
              <li>
                <button onClick={() => setView('contribute')} className="hover:text-[#2E6F40] transition-colors flex items-center gap-2">
                  <PlusCircle className="w-3.5 h-3.5 text-[#2E6F40]" />
                  <span>Fieldwork Recording Desk</span>
                </button>
              </li>
              <li>
                <button onClick={() => setView('moderation')} className="hover:text-[#1E3A8A] transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>Archival Council Queue</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-semibold text-[#181512] dark:text-[#F6F3ED] uppercase tracking-wider">
              Architecture &amp; Cloud
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C554D] dark:text-[#A49988]">
              <li>
                <button 
                  onClick={() => setSupabaseModalOpen(true)}
                  className="hover:text-[#C85A17] transition-colors flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase Schema &amp; RLS</span>
                </button>
              </li>
              <li>
                <span className="text-[#8C8274]">Gemini 3.8 Flash Multimodal AI</span>
              </li>
              <li>
                <span className="text-[#8C8274]">OpenStreetMap &amp; React Leaflet</span>
              </li>
              <li>
                <span className="text-[#8C8274]">Zustand Reactive State Engine</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Editorial Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8274]">
          <div>
            &copy; {new Date().getFullYear()} Hindustan Culture Atlas. All copyrights reserved to The First Iteration. Dedicated to the living heritage, oral traditions, and unsung storytellers of India.
          </div>
          <div className="flex items-center gap-4">
            <span>WCAG AA Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Non-Commercial Cultural Repository</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

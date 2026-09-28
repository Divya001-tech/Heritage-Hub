import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, Home, MapPin, Compass, BookOpen, Layers } from 'lucide-react';
import { useNavigation } from './NavigationProvider';
import { useCultureStore } from '../../store/useCultureStore';

export const BreadcrumbSystem: React.FC = () => {
  const { canGoBack, goBack, backLabel } = useNavigation();
  const { currentView, setView, selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, selectedEntry, setSelectedEntry } = useCultureStore();

  // If on homepage and no modals open, don't clutter the view
  if (currentView === 'home' && !selectedEntry) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-[#FAF7F0]/90 dark:bg-[#15120F]/90 backdrop-blur-md border-b border-[#E8E1D3] dark:border-[#28231D] px-4 sm:px-6 lg:px-8 py-2.5 z-20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Animated Universal Back Button */}
        <div className="flex items-center gap-2">
          {canGoBack && (
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1914] border border-[#DFD7C7] dark:border-[#332C24] text-stone-800 dark:text-stone-200 text-xs font-semibold uppercase tracking-wider hover:border-[#C85A17] hover:text-[#C85A17] transition-all shadow-2xs cursor-pointer group"
              title="Press Backspace, Escape, or Alt+Left Arrow"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C85A17] transition-transform group-hover:-translate-x-0.5" />
              <span>{backLabel || 'Back'}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
                esc
              </kbd>
            </motion.button>
          )}
        </div>

        {/* Trail Breadcrumbs */}
        <ol className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <li>
            <button
              onClick={() => {
                setSelectedEntry(null);
                setSelectedDistrict(null);
                setSelectedState(null);
                setView('home');
              }}
              className="hover:text-[#C85A17] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </li>

          {currentView === 'map' && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li>
                <button
                  onClick={() => {
                    setSelectedDistrict(null);
                    setSelectedState(null);
                  }}
                  className={`hover:text-[#C85A17] transition-colors cursor-pointer ${
                    !selectedState ? 'font-semibold text-stone-900 dark:text-stone-100' : ''
                  }`}
                >
                  Interactive Atlas
                </button>
              </li>
            </>
          )}

          {currentView === 'discover' && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li className="font-semibold text-stone-900 dark:text-stone-100">
                Archive Exploration
              </li>
            </>
          )}

          {currentView === 'contribute' && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li className="font-semibold text-stone-900 dark:text-stone-100">
                Field Intake Portal
              </li>
            </>
          )}

          {currentView === 'moderation' && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li className="font-semibold text-stone-900 dark:text-stone-100">
                Archival Council
              </li>
            </>
          )}

          {currentView === 'bookmarks' && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li className="font-semibold text-stone-900 dark:text-stone-100">
                Folio Bookmarks
              </li>
            </>
          )}

          {selectedState && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className={`hover:text-[#C85A17] transition-colors cursor-pointer ${
                    !selectedDistrict ? 'font-semibold text-[#C85A17]' : ''
                  }`}
                >
                  {selectedState.name}
                </button>
              </li>
            </>
          )}

          {selectedDistrict && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li className="font-semibold text-[#2E6F40]">
                {selectedDistrict.name} District
              </li>
            </>
          )}

          {selectedEntry && (
            <>
              <li><ChevronRight className="w-3 h-3 text-stone-400" /></li>
              <li className="font-semibold text-stone-900 dark:text-stone-100 truncate max-w-xs">
                {selectedEntry.title}
              </li>
            </>
          )}
        </ol>

      </div>
    </nav>
  );
};

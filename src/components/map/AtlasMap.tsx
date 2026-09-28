import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Volume2,
  Bookmark,
  Sparkles,
  ChevronRight,
  X,
  Play,
  Pause,
  Compass,
  Headphones,
  Award,
  RotateCcw,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { useCultureStore } from '../../store/useCultureStore';
import { INDIAN_STATES, CATEGORIES } from '../../data/seedData';
import { CulturalEntry, StateEntity, DistrictEntity } from '../../types';
import { StateBoundaryLayer } from './StateBoundaryLayer';
import { DistrictLayer, CULTURAL_DISTRICTS } from './DistrictLayer';
import { CultureMarkers } from './CultureMarkers';
import { SkeletonMap } from '../common/SkeletonCard';
import { toast } from '../../lib/useToast';

// Programmatic map camera controller (0.8s smooth duration per prompt specification)
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 0.8,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);

  return null;
};

export const AtlasMap: React.FC = () => {
  const {
    entries,
    setSelectedEntry,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    playAudio,
    pauseAudio,
    audioPlayer,
    toggleBookmark,
    isBookmarked,
  } = useCultureStore();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [selectedMapPinEntry, setSelectedMapPinEntry] = useState<CulturalEntry | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Geographic regional belts
  const regionalBelts = [
    { name: 'National Overview', lat: 22.9734, lng: 78.6569, zoom: 5 },
    { name: 'Northern Himalayas', lat: 32.5, lng: 76.5, zoom: 7 },
    { name: 'Thar & Western Plains', lat: 26.5, lng: 72.0, zoom: 7 },
    { name: 'Malabar & Southern Coasts', lat: 11.2, lng: 76.2, zoom: 7 },
    { name: 'North-Eastern Hills', lat: 26.2, lng: 93.0, zoom: 7 },
    { name: 'Gangetic & Eastern Delta', lat: 23.5, lng: 86.5, zoom: 7 },
  ];

  // Count approved entries by state
  const entriesCountByState = useMemo(() => {
    const acc: Record<string, number> = {};
    entries.forEach((e) => {
      if (e.status === 'Approved') {
        acc[e.state] = (acc[e.state] || 0) + 1;
      }
    });
    return acc;
  }, [entries]);

  // Filtered entries for map markers
  const filteredMapEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (entry.status !== 'Approved') return false;
      const matchCategory =
        activeCategoryFilter === 'All' || entry.category === activeCategoryFilter;
      const matchState = !selectedState || entry.state === selectedState.name;
      const matchDistrict =
        !selectedDistrict ||
        entry.district.toLowerCase().includes(selectedDistrict.name.toLowerCase()) ||
        selectedDistrict.name.toLowerCase().includes(entry.district.toLowerCase());
      return matchCategory && matchState && matchDistrict;
    });
  }, [entries, activeCategoryFilter, selectedState, selectedDistrict]);

  // District entries for drawer panel
  const activeDistrictEntries = useMemo(() => {
    if (!selectedDistrict) return [];
    return entries.filter(
      (e) =>
        e.district.toLowerCase().includes(selectedDistrict.name.toLowerCase()) ||
        selectedDistrict.name.toLowerCase().includes(e.district.toLowerCase())
    );
  }, [entries, selectedDistrict]);

  // Map camera position
  const currentCenter: [number, number] = useMemo(() => {
    if (selectedDistrict) {
      return [selectedDistrict.latitude, selectedDistrict.longitude];
    }
    if (selectedState) {
      return [selectedState.lat, selectedState.lng];
    }
    return [22.9734, 78.6569];
  }, [selectedState, selectedDistrict]);

  const currentZoom = useMemo(() => {
    if (selectedDistrict) return 9;
    if (selectedState) return selectedState.zoom || 7;
    return 5;
  }, [selectedState, selectedDistrict]);

  const handleStateClick = (state: StateEntity) => {
    setSelectedState(state);
    setSelectedDistrict(null);
    setSelectedMapPinEntry(null);
    toast.info(`Exploring ${state.name}`, `${entriesCountByState[state.name] || 0} oral records documented.`);
  };

  const handleDistrictClick = (district: DistrictEntity) => {
    setSelectedDistrict(district);
    setSelectedMapPinEntry(null);
    toast.info(`District Focused: ${district.name}`, `Opening local oral archives...`);
  };

  const handleResetToNational = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedMapPinEntry(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] min-h-[640px] bg-[#FAF7F0] dark:bg-[#12100E] overflow-hidden flex flex-col">
      
      {/* Top Filter & Exploration Ribbon */}
      <div className="bg-white/95 dark:bg-[#1A1612]/95 backdrop-blur-md border-b border-[#E8E1D3] dark:border-[#28231D] px-4 py-3 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Active Navigation & Scope */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={handleResetToNational}
              className={`px-3 py-1.5 rounded-lg font-heading font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                !selectedState && !selectedDistrict
                  ? 'bg-[#C85A17] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>National Atlas</span>
            </button>

            {selectedState && (
              <>
                <span className="text-stone-400">/</span>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className={`px-3 py-1.5 rounded-lg font-heading font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedState && !selectedDistrict
                      ? 'bg-[#C85A17] text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedState.name}</span>
                </button>
              </>
            )}

            {selectedDistrict && (
              <>
                <span className="text-stone-400">/</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#2E6F40] text-white font-heading font-semibold text-xs uppercase tracking-wider flex items-center gap-1">
                  <span>{selectedDistrict.name} District</span>
                </span>
              </>
            )}

            {(selectedState || selectedDistrict) && (
              <button
                onClick={handleResetToNational}
                className="text-[11px] text-stone-500 hover:text-[#C85A17] underline ml-1 cursor-pointer"
              >
                Reset to India View
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategoryFilter('All')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeCategoryFilter === 'All'
                  ? 'bg-[#181512] dark:bg-white text-white dark:text-[#181512]'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              All Categories ({filteredMapEntries.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.name)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === cat.name
                    ? 'bg-[#C85A17] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Map View Area */}
      <div className="relative flex-1 w-full h-full">
        {!mapReady ? (
          <SkeletonMap />
        ) : mapError ? (
          <div className="w-full h-full flex items-center justify-center p-8 bg-[#FAF7F0] dark:bg-[#12100E] text-center">
            <div className="max-w-md space-y-4">
              <Compass className="w-12 h-12 text-[#C85A17] mx-auto animate-pulse" />
              <h3 className="font-serif-display text-xl font-bold text-stone-900 dark:text-stone-100">
                Cartographic Layer Calibration Error
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Unable to load map tile stream. Check your connection or retry initialization.
              </p>
              <button
                onClick={() => {
                  setMapError(false);
                  setMapReady(false);
                  setTimeout(() => setMapReady(true), 300);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#C85A17] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-md"
              >
                Retry Map Stream
              </button>
            </div>
          </div>
        ) : (
          <MapContainer
            center={currentCenter}
            zoom={currentZoom}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
            attributionControl={false}
          >
            <MapController center={currentCenter} zoom={currentZoom} />

            {/* Parchment Styled CartoDB Voyager Tile Layer with OpenStreetMap Fallback */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              maxZoom={19}
              eventHandlers={{
                tileerror: () => {
                  // Fallback tile logging without crashing
                  console.warn('Carto tile error, relying on cache');
                },
              }}
            />

            {/* Layer 1: Indian State Boundaries */}
            <StateBoundaryLayer
              selectedState={selectedState}
              onSelectState={handleStateClick}
              entriesCountByState={entriesCountByState}
            />

            {/* Layer 2: District Exploration Points */}
            <DistrictLayer
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={handleDistrictClick}
              entries={entries}
            />

            {/* Layer 3: Cultural Hotspot Seal Markers */}
            <CultureMarkers
              entries={filteredMapEntries}
              selectedEntryId={selectedMapPinEntry?.id}
              onSelectEntry={(entry) => setSelectedMapPinEntry(entry)}
            />
          </MapContainer>
        )}

        {/* Floating Quick Regional Jump Pod */}
        <div className="absolute top-4 right-4 z-20 hidden lg:flex flex-col gap-1.5 bg-white/90 dark:bg-[#1A1612]/90 backdrop-blur-md p-3 rounded-2xl border border-[#DFD7C7] dark:border-[#332C24] shadow-lg max-w-[210px]">
          <p className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[#C85A17] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Regional Belts</span>
          </p>
          <div className="space-y-1 pt-1">
            {regionalBelts.map((belt) => (
              <button
                key={belt.name}
                onClick={() => {
                  setSelectedState(null);
                  setSelectedDistrict(null);
                  setSelectedMapPinEntry(null);
                }}
                className="w-full text-left px-2 py-1 rounded text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{belt.name}</span>
                <ChevronRight className="w-3 h-3 text-stone-400" />
              </button>
            ))}
          </div>
        </div>

        {/* DISTRICT EXPEDITION DRAWER PANEL (Sliding Left Panel) */}
        <AnimatePresence>
          {selectedDistrict && (
            <motion.div
              initial={{ x: -360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -360, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-4 left-4 z-20 w-80 sm:w-96 max-h-[calc(100%-2rem)] bg-white/95 dark:bg-[#1A1612]/95 backdrop-blur-md rounded-2xl border border-[#DFD7C7] dark:border-[#332C24] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#E8E1D3] dark:border-[#28231D] flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#C85A17]">
                    <MapPin className="w-3 h-3" />
                    <span>District Archive</span>
                  </div>
                  <h3 className="font-serif-display font-bold text-base text-stone-900 dark:text-stone-100">
                    {selectedDistrict.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                  aria-label="Close district panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Entries list inside this district */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                <p className="text-[11px] text-stone-500 font-mono">
                  {activeDistrictEntries.length} Documented Tradition{activeDistrictEntries.length === 1 ? '' : 's'}
                </p>

                {activeDistrictEntries.length === 0 ? (
                  <div className="p-6 text-center space-y-2 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      No oral archives registered yet in {selectedDistrict.name}.
                    </p>
                    <p className="text-[11px] text-[#C85A17] font-semibold">
                      Be the first to record an elder in this district!
                    </p>
                  </div>
                ) : (
                  activeDistrictEntries.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="p-3 rounded-xl border border-stone-200 dark:border-[#332C24] hover:border-[#C85A17]/60 bg-white dark:bg-[#201B16] hover:shadow-md transition-all cursor-pointer group space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={entry.cover_image}
                          alt={entry.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-[#C85A17] uppercase tracking-wide">
                            {entry.category}
                          </span>
                          <h4 className="font-serif-display font-semibold text-xs text-stone-900 dark:text-stone-100 truncate group-hover:text-[#C85A17] transition-colors">
                            {entry.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">
                            Dialect: {entry.language}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SELECTED MARKER POPUP DOSSIER (Bottom Center Floating Card) */}
        <AnimatePresence>
          {selectedMapPinEntry && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-lg bg-white dark:bg-[#1A1612] border border-[#DFD7C7] dark:border-[#332C24] rounded-2xl p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMapPinEntry.cover_image}
                    alt={selectedMapPinEntry.title}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-[#C85A17]">
                      <span>{selectedMapPinEntry.category}</span>
                      <span>·</span>
                      <span>{selectedMapPinEntry.district}, {selectedMapPinEntry.state}</span>
                    </div>
                    <h4 className="font-serif-display font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                      {selectedMapPinEntry.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      Preserved by {selectedMapPinEntry.created_by_name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMapPinEntry(null)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                  aria-label="Close dossier card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    if (audioPlayer.isPlaying && audioPlayer.entryId === selectedMapPinEntry.id) {
                      pauseAudio();
                    } else {
                      playAudio({
                        url: selectedMapPinEntry.audio_url || 'https://cdn.freesound.org/previews/456/456123_5121236-lq.mp3',
                        title: selectedMapPinEntry.title,
                        contributor: selectedMapPinEntry.created_by_name,
                        cover: selectedMapPinEntry.cover_image,
                        entryId: selectedMapPinEntry.id,
                      });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#A8450A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {audioPlayer.isPlaying && audioPlayer.entryId === selectedMapPinEntry.id ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Listen Snippet</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(selectedMapPinEntry.id)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                    aria-label="Bookmark entry"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked(selectedMapPinEntry.id)
                          ? 'fill-[#C85A17] text-[#C85A17]'
                          : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEntry(selectedMapPinEntry);
                      setSelectedMapPinEntry(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Open Dossier &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

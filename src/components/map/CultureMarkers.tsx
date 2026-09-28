import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { CulturalEntry } from '../../types';

interface CultureMarkersProps {
  entries: CulturalEntry[];
  selectedEntryId?: string | null;
  onSelectEntry: (entry: CulturalEntry) => void;
}

// Custom hand-cast bronze medallion map icon with acoustic pulse
function createHandcraftedMapSeal(category: string, isSelected: boolean) {
  let primaryTone = '#C85A17'; // Heritage saffron-orange
  let symbolChar = '♫';
  if (category.includes('Ritual')) {
    primaryTone = '#2E6F40';
    symbolChar = '✦';
  } else if (category.includes('Dialect') || category.includes('Language')) {
    primaryTone = '#7C3AED';
    symbolChar = 'अ';
  } else if (category.includes('Craft') || category.includes('Knowledge')) {
    primaryTone = '#B45309';
    symbolChar = '𖡡';
  } else if (category.includes('Celebration') || category.includes('Festival')) {
    primaryTone = '#DC2626';
    symbolChar = '☼';
  }

  const html = `
    <div class="relative group cursor-pointer marker-hover-bounce select-none">
      <div class="absolute -inset-1.5 rounded-full hotspot-pulse" style="background-color: ${primaryTone}33;"></div>
      <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-white font-serif-display font-bold text-sm shadow-md transition-transform duration-200 transform group-hover:scale-125 border border-white/60 ${
        isSelected ? 'ring-4 ring-[#C85A17] scale-110' : ''
      }" style="background: radial-gradient(circle at 35% 35%, ${primaryTone}, #181512); box-shadow: 0 4px 14px ${primaryTone}70;">
        <span>${symbolChar}</span>
      </div>
      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-handcrafted-seal',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export const CultureMarkers: React.FC<CultureMarkersProps> = ({
  entries,
  selectedEntryId,
  onSelectEntry,
}) => {
  return (
    <>
      {entries.map((entry) => {
        if (!entry.latitude || !entry.longitude) return null;
        const isSelected = selectedEntryId === entry.id;

        return (
          <Marker
            key={entry.id}
            position={[entry.latitude, entry.longitude]}
            icon={createHandcraftedMapSeal(entry.category, isSelected)}
            eventHandlers={{
              click: () => onSelectEntry(entry),
            }}
          >
            <Tooltip direction="top" offset={[0, -28]} className="custom-archival-tooltip">
              <div className="p-2 max-w-xs space-y-1 font-body text-stone-900">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-[#C85A17]">
                  <span>{entry.category}</span>
                  <span>·</span>
                  <span>{entry.district}, {entry.state}</span>
                </div>
                <p className="font-serif-display font-bold text-xs text-stone-950 line-clamp-1">
                  {entry.title}
                </p>
                <p className="text-[11px] text-stone-600 line-clamp-2">
                  {entry.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>Dialect: {entry.language}</span>
                  <span className="text-[#2E6F40] font-semibold">Click for Dossier &rarr;</span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

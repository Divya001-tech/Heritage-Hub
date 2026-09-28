import React from 'react';
import { CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { StateEntity, DistrictEntity, CulturalEntry } from '../../types';

interface DistrictLayerProps {
  selectedState: StateEntity | null;
  selectedDistrict: DistrictEntity | null;
  onSelectDistrict: (district: DistrictEntity) => void;
  entries: CulturalEntry[];
}

export const CULTURAL_DISTRICTS: DistrictEntity[] = [
  // Rajasthan
  { id: 'dst-jaisalmer', state_id: 'st-rj', name: 'Jaisalmer', latitude: 26.9157, longitude: 70.9083 },
  { id: 'dst-barmer', state_id: 'st-rj', name: 'Barmer', latitude: 25.7532, longitude: 71.3967 },
  { id: 'dst-jodhpur', state_id: 'st-rj', name: 'Jodhpur', latitude: 26.2389, longitude: 73.0243 },
  { id: 'dst-shekhawati', state_id: 'st-rj', name: 'Jhunjhunu (Shekhawati)', latitude: 28.1289, longitude: 75.3995 },

  // Kerala
  { id: 'dst-kannur', state_id: 'st-kl', name: 'Kannur', latitude: 11.8745, longitude: 75.3704 },
  { id: 'dst-kasaragod', state_id: 'st-kl', name: 'Kasaragod', latitude: 12.5102, longitude: 74.9852 },
  { id: 'dst-wayanad', state_id: 'st-kl', name: 'Wayanad', latitude: 11.6854, longitude: 76.1320 },
  { id: 'dst-thrissur', state_id: 'st-kl', name: 'Thrissur', latitude: 10.5276, longitude: 76.2144 },

  // Ladakh
  { id: 'dst-leh', state_id: 'st-ladakh', name: 'Leh', latitude: 34.1526, longitude: 77.5771 },
  { id: 'dst-kargil', state_id: 'st-ladakh', name: 'Kargil', latitude: 34.5539, longitude: 76.1349 },

  // Himachal Pradesh
  { id: 'dst-kullu', state_id: 'st-hp', name: 'Kullu', latitude: 31.9579, longitude: 77.1095 },
  { id: 'dst-spiti', state_id: 'st-hp', name: 'Lahaul & Spiti', latitude: 32.3278, longitude: 77.6322 },
  { id: 'dst-chamba', state_id: 'st-hp', name: 'Chamba', latitude: 32.5534, longitude: 76.1258 },

  // Assam
  { id: 'dst-majuli', state_id: 'st-as', name: 'Majuli Island', latitude: 26.9535, longitude: 94.2045 },
  { id: 'dst-kamrup', state_id: 'st-as', name: 'Kamrup', latitude: 26.3161, longitude: 91.5984 },

  // West Bengal
  { id: 'dst-purulia', state_id: 'st-wb', name: 'Purulia', latitude: 23.3322, longitude: 86.3652 },
  { id: 'dst-birbhum', state_id: 'st-wb', name: 'Birbhum (Santiniketan)', latitude: 23.8404, longitude: 87.6186 },

  // Tamil Nadu
  { id: 'dst-madurai', state_id: 'st-tn', name: 'Madurai', latitude: 9.9252, longitude: 78.1198 },
  { id: 'dst-thanjavur', state_id: 'st-tn', name: 'Thanjavur', latitude: 10.7870, longitude: 79.1378 },

  // Gujarat
  { id: 'dst-kutch', state_id: 'st-gj', name: 'Kutch', latitude: 23.7337, longitude: 69.8597 },

  // Uttar Pradesh
  { id: 'dst-varanasi', state_id: 'st-up', name: 'Varanasi', latitude: 25.3176, longitude: 82.9739 },
  { id: 'dst-braj', state_id: 'st-up', name: 'Mathura (Braj)', latitude: 27.4924, longitude: 77.6737 },

  // Nagaland
  { id: 'dst-mon', state_id: 'st-nl', name: 'Mon (Konyak territory)', latitude: 26.7441, longitude: 95.0487 },
];

export const DistrictLayer: React.FC<DistrictLayerProps> = ({
  selectedState,
  selectedDistrict,
  onSelectDistrict,
  entries,
}) => {
  const map = useMap();

  // If a state is selected, filter districts by that state or show all cultural hubs
  const visibleDistricts = selectedState
    ? CULTURAL_DISTRICTS.filter((d) => d.state_id === selectedState.id)
    : CULTURAL_DISTRICTS;

  return (
    <>
      {visibleDistricts.map((district) => {
        const isSelected = selectedDistrict?.id === district.id;
        const districtEntries = entries.filter(
          (e) =>
            e.district.toLowerCase().includes(district.name.toLowerCase()) ||
            district.name.toLowerCase().includes(e.district.toLowerCase())
        );
        const count = districtEntries.length;

        return (
          <CircleMarker
            key={district.id}
            center={[district.latitude, district.longitude]}
            radius={isSelected ? 10 : count > 0 ? 8 : 5}
            pathOptions={{
              color: isSelected ? '#C85A17' : count > 0 ? '#2E6F40' : '#8C8274',
              weight: isSelected ? 3 : 1.5,
              fillColor: isSelected ? '#F59E0B' : count > 0 ? '#10B981' : '#E8E1D3',
              fillOpacity: isSelected ? 0.95 : 0.8,
            }}
            eventHandlers={{
              click: () => {
                onSelectDistrict(district);
                map.flyTo([district.latitude, district.longitude], 10, {
                  duration: 0.8,
                });
              },
            }}
          >
            <Tooltip sticky direction="top" className="custom-archival-tooltip">
              <div className="p-1 font-heading text-xs space-y-0.5 text-stone-900">
                <p className="font-bold text-[#C85A17]">{district.name} District</p>
                <p className="text-[10px] text-stone-600">
                  {count} Documented {count === 1 ? 'Oral Tradition' : 'Oral Traditions'}
                </p>
                <p className="text-[9px] text-[#2E6F40] font-semibold">Click to open District Dossier Panel &rarr;</p>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
};

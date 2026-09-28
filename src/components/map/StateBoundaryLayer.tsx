import React from 'react';
import { Polygon, Tooltip, useMap } from 'react-leaflet';
import { INDIAN_STATES } from '../../data/seedData';
import { StateEntity } from '../../types';

interface StateBoundaryLayerProps {
  selectedState: StateEntity | null;
  onSelectState: (state: StateEntity) => void;
  entriesCountByState: Record<string, number>;
}

// Bounding polygons approximate bounding boxes for key Indian cultural states
const STATE_POLYGONS: Record<string, [number, number][]> = {
  Rajasthan: [
    [29.5, 73.0], [30.1, 75.3], [28.5, 77.0], [27.0, 77.8],
    [26.0, 78.2], [24.5, 76.5], [23.8, 74.2], [24.5, 72.8],
    [26.0, 70.2], [27.8, 69.8], [29.5, 73.0]
  ],
  Kerala: [
    [12.8, 74.9], [12.4, 75.2], [11.8, 75.5], [10.8, 76.0],
    [9.5, 76.4], [8.3, 77.0], [8.5, 77.4], [9.3, 77.2],
    [10.2, 76.9], [11.5, 76.2], [12.8, 74.9]
  ],
  Ladakh: [
    [35.8, 76.5], [35.5, 79.5], [34.0, 79.8], [32.8, 78.5],
    [32.6, 76.8], [33.8, 75.8], [35.0, 76.0], [35.8, 76.5]
  ],
  'Himachal Pradesh': [
    [33.2, 76.0], [33.0, 77.5], [32.0, 79.0], [31.1, 78.8],
    [30.4, 77.6], [31.2, 75.8], [32.3, 75.7], [33.2, 76.0]
  ],
  Assam: [
    [27.9, 95.5], [27.0, 96.0], [26.0, 94.0], [24.8, 93.2],
    [25.0, 92.4], [26.2, 90.0], [26.8, 90.5], [27.9, 95.5]
  ],
  'West Bengal': [
    [27.2, 88.3], [26.5, 89.8], [24.0, 88.5], [22.0, 88.8],
    [21.6, 87.5], [23.5, 86.8], [25.0, 87.8], [27.2, 88.3]
  ],
  'Tamil Nadu': [
    [13.4, 80.3], [12.0, 79.8], [10.5, 79.8], [9.2, 79.2],
    [8.1, 77.5], [9.0, 77.2], [11.0, 77.0], [12.5, 78.5],
    [13.4, 80.3]
  ],
  Gujarat: [
    [24.5, 71.0], [24.6, 73.0], [23.5, 74.3], [21.5, 73.2],
    [20.5, 72.8], [21.0, 70.0], [22.4, 69.0], [23.8, 68.5],
    [24.5, 71.0]
  ],
  Maharashtra: [
    [21.8, 74.0], [21.5, 78.5], [21.0, 80.8], [19.0, 80.2],
    [16.5, 74.2], [18.0, 73.0], [20.0, 72.8], [21.8, 74.0]
  ],
  Karnataka: [
    [18.4, 77.0], [16.5, 77.5], [14.0, 77.8], [12.0, 77.0],
    [11.8, 75.5], [14.0, 74.2], [16.0, 74.0], [18.4, 77.0]
  ],
  'Uttar Pradesh': [
    [30.2, 77.5], [28.5, 80.5], [27.5, 84.0], [24.5, 83.0],
    [24.0, 81.5], [26.0, 78.5], [28.0, 77.5], [30.2, 77.5]
  ]
};

export const StateBoundaryLayer: React.FC<StateBoundaryLayerProps> = ({
  selectedState,
  onSelectState,
  entriesCountByState,
}) => {
  const map = useMap();

  return (
    <>
      {INDIAN_STATES.map((state) => {
        const polygon = STATE_POLYGONS[state.name];
        const count = entriesCountByState[state.name] || 0;
        const isSelected = selectedState?.name === state.name;

        if (!polygon) {
          return null;
        }

        return (
          <Polygon
            key={state.id}
            positions={polygon}
            pathOptions={{
              color: isSelected ? '#C85A17' : '#8C8274',
              weight: isSelected ? 3.5 : 1.5,
              opacity: isSelected ? 0.95 : 0.6,
              fillColor: isSelected ? '#C85A17' : '#E07A1F',
              fillOpacity: isSelected ? 0.28 : count > 0 ? 0.12 : 0.04,
              dashArray: isSelected ? undefined : '4, 4',
            }}
            eventHandlers={{
              click: () => {
                onSelectState(state);
                map.flyTo([state.lat, state.lng], state.zoom || 7, {
                  duration: 0.8,
                });
              },
              mouseover: (e) => {
                const layer = e.target;
                if (!isSelected) {
                  layer.setStyle({
                    weight: 2.5,
                    fillOpacity: 0.22,
                    color: '#C85A17',
                  });
                }
              },
              mouseout: (e) => {
                const layer = e.target;
                if (!isSelected) {
                  layer.setStyle({
                    weight: 1.5,
                    fillOpacity: count > 0 ? 0.12 : 0.04,
                    color: '#8C8274',
                  });
                }
              },
            }}
          >
            <Tooltip sticky direction="top" className="custom-archival-tooltip">
              <div className="p-1 font-heading text-xs space-y-0.5 text-stone-900">
                <p className="font-bold text-[#C85A17]">{state.name}</p>
                <p className="text-[10px] text-stone-600">
                  {state.region} Region · {count} Cultural {count === 1 ? 'Archive' : 'Archives'}
                </p>
                <p className="text-[9px] text-stone-500 italic">Click to zoom and explore districts</p>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};


import React from 'react';
import { territories, EMPIRE_COLORS } from '../data/mapData';

const ColonialLegend: React.FC = () => {
  return (
    <div 
        className="absolute bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg w-full max-w-[180px] pointer-events-auto"
        style={{ top: '10px', right: '10px', zIndex: 9999 }}
    >
        <h3 className="font-bold text-base mb-2 text-gray-800 border-b pb-1">Gyarmati területek</h3>
        <ul className="space-y-1.5 mt-2">
          {territories.map(territory => (
            <li key={territory.name} className="flex items-center">
              <span 
                  className="w-4 h-4 rounded-sm mr-2 border border-gray-400/50" 
                  style={{ backgroundColor: EMPIRE_COLORS[territory.id] }}
              ></span>
              <span className="text-sm text-gray-700">{territory.power}</span>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default ColonialLegend;

import React from 'react';
import type { Territory } from '../types';

interface LegendProps {
  territories: Territory[];
}

const Legend: React.FC<LegendProps> = ({ 
  territories,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">Jelmagyarázat</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-700">Gyarmati területek</h4>
            <ul className="space-y-1 mt-1">
              {territories.map(territory => (
                <li key={territory.name} className="flex items-center">
                  <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: territory.color }}></span>
                  <span className="text-sm text-gray-600">{territory.power}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;

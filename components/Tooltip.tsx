
import React from 'react';
import type { Concept } from '../types';

interface TooltipProps {
  tooltip: {
    data: {
      name: string;
      description: string;
      type?: string;
    };
    position: {
      x: number;
      y: number;
    };
  };
  onClose: () => void;
  onSaveConcept: (concept: Omit<Concept, 'id' | 'createdAt'>) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip, onClose, onSaveConcept }) => {
  const { data, position } = tooltip;

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x + 15}px`,
    top: `${position.y + 15}px`,
    transform: 'translateY(-100%)',
    pointerEvents: 'auto',
  };

  const handleSave = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSaveConcept({
          name: data.name,
          definition: data.description,
          category: data.type === 'empire' ? 'Gyarmat' : 'Város'
      });
  };

  return (
    <div
      style={tooltipStyle}
      className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl z-20 w-full max-w-xs"
    >
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-700"
        aria-label="Bezárás"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex justify-between items-start mb-2 pr-5">
        <h4 className="font-bold text-md text-gray-800">{data.name}</h4>
        <button 
            onClick={handleSave}
            className="text-blue-400 hover:text-blue-600 transition-colors"
            title="Mentés a fogalom naplóba"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </button>
      </div>
      <p className="text-sm text-gray-600">{data.description}</p>
    </div>
  );
};

export default Tooltip;

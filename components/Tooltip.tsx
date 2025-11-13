import React from 'react';

interface TooltipProps {
  tooltip: {
    data: {
      name: string;
      description: string;
    };
    position: {
      x: number;
      y: number;
    };
  };
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip, onClose }) => {
  const { data, position } = tooltip;

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x + 15}px`,
    top: `${position.y + 15}px`,
    transform: 'translateY(-100%)',
    pointerEvents: 'auto',
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
      <h4 className="font-bold text-md text-gray-800 mb-2">{data.name}</h4>
      <p className="text-sm text-gray-600">{data.description}</p>
    </div>
  );
};

export default Tooltip;

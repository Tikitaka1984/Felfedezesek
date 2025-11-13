import React from 'react';
import type { Route } from '../types';

interface InfoPanelProps {
  route: Route;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ route, onClose }) => {
  const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  // Display an image only if there is a bio (i.e., it's an explorer), using a placeholder if a specific image isn't provided.
  const displayImage = route.explorerBio ? (route.explorerImage || placeholderImage) : null;

  return (
    <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl z-20 w-full max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        aria-label="Bezárás"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="space-y-4">
        {displayImage && (
          <div className="flex justify-center mb-2">
            <img 
              src={displayImage}
              alt={route.explorer}
              className="w-32 h-40 object-cover rounded-md shadow-lg border-2 border-white"
              onError={(e) => { e.currentTarget.src = placeholderImage; e.currentTarget.onerror = null; }}
            />
          </div>
        )}

        <div className={`border-b pb-3 mb-3 ${displayImage ? 'text-center' : ''}`}>
           <p className="text-lg"><strong className="font-semibold text-gray-600">Név:</strong> <span className="font-bold text-gray-800 text-xl ml-2">{route.explorer}</span></p>
           <p className="text-md"><strong className="font-semibold text-gray-600">Időszak/év:</strong><span className="text-gray-700 ml-2">{route.year}</span></p>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Kiinduló és fő állomások:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {route.stops.map(stop => (
                <li key={stop.name}>{stop.name}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 mb-1">Cél/rövid leírás:</p>
            <p className="text-base text-gray-700">{route.description}</p>
          </div>

          {route.explorerBio && (
            <div>
              <p className="font-semibold text-gray-700 mb-1">Az felfedezőről:</p>
              <p className="text-base text-gray-700">{route.explorerBio}</p>
            </div>
          )}
          
          <div>
            <p className="font-semibold text-gray-700 mb-1">Következmények/jelentőség Európában és a világkereskedelemben:</p>
            <p className="text-base text-gray-700">{route.consequences}</p>
          </div>
          
          <div>
            <p className="font-semibold text-gray-700 mb-2">Kulcsszavak:</p>
            <div className="flex flex-wrap gap-2">
              {route.keywords.map(keyword => (
                <span key={keyword} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;

import React from 'react';
import type { Route } from '../types';

interface LayerToggleProps {
  routes: Route[];
  visibleRouteIds: string[];
  onRouteToggle: (routeId: string) => void;
  onExplorerSelect: (explorerId: string) => void;
  showTerritories: boolean;
  setShowTerritories: (show: boolean) => void;
  showCities: boolean;
  setShowCities: (show: boolean) => void;
  showEmpires: boolean;
  setShowEmpires: (show: boolean) => void;
  is3DView: boolean;
  setIs3DView: (is3D: boolean) => void;
  onToggleJournal: () => void;
  onStartQuiz: () => void;
}

const getRouteDisplayName = (route: Route): string => {
    switch(route.id) {
        case 'diaz': return 'Diaz útja';
        case 'columbus1': return 'Kolumbusz 1. út';
        case 'columbus_other': return 'Kolumbusz további útjai';
        case 'dagama': return 'Vasco da Gama';
        case 'magellan': return 'Magellán';
        case 'vespucci': return 'Amerigo Vespucci (1499–1502)';
        case 'cortez': return 'Cortés';
        case 'pizarro': return 'Pizarro';
        default: return route.explorer;
    }
};

const LayerToggle: React.FC<LayerToggleProps> = ({
  routes,
  visibleRouteIds,
  onRouteToggle,
  onExplorerSelect,
  showTerritories,
  setShowTerritories,
  showCities,
  setShowCities,
  showEmpires,
  setShowEmpires,
  is3DView,
  setIs3DView,
  onToggleJournal,
  onStartQuiz
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs space-y-3 z-10 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="font-bold text-lg text-gray-800">Vezérlők</h3>
        <div className="flex gap-2">
          <button 
            onClick={onStartQuiz}
            className="p-1.5 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
            title="Kvíz Indítása"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
          <button 
            onClick={onToggleJournal}
            className="p-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
            title="Fogalom Napló"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        </div>
      </div>

      {/* View Section */}
      <div className="pb-2 border-b mb-2">
        <label className="flex items-center cursor-pointer p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
          <input
            type="checkbox"
            checked={is3DView}
            onChange={(e) => setIs3DView(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 font-semibold text-blue-900">3D Gömb Nézet</span>
        </label>
      </div>
      
      {/* Routes Section */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-600 mb-1">Felfedezők útjai</h4>
        <div className="space-y-1">
          {routes.map(route => {
            const isVisible = visibleRouteIds.includes(route.id);
            return (
              <div key={route.id} className={`flex items-center p-1 rounded-md transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => onRouteToggle(route.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <svg width="20" height="10" className="mx-2 flex-shrink-0">
                  <line 
                    x1="0" y1="5" x2="20" y2="5" 
                    stroke={route.color} 
                    strokeWidth={route.id === 'tordesillas' ? 2.5 : 2}
                    strokeDasharray={route.id === 'tordesillas' ? '3,3' : route.type === 'dashed' ? '4,2' : route.type === 'dotted' ? '1,2' : 'none'}
                  />
                </svg>
                <span 
                  className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 hover:underline"
                  onClick={() => onExplorerSelect(route.id)}
                >
                  {getRouteDisplayName(route)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Other Layers Section */}
      <div className="pt-2 border-t mt-2">
        <h4 className="font-semibold text-sm text-gray-600">Egyéb rétegek</h4>
        <div className="space-y-1 mt-1">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showTerritories}
                onChange={(e) => setShowTerritories(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Gyarmati területek</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showCities}
                onChange={(e) => setShowCities(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Fontos városok</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showEmpires}
                onChange={(e) => setShowEmpires(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Birodalmak</span>
            </label>
        </div>
      </div>
    </div>
  );
};

export default LayerToggle;

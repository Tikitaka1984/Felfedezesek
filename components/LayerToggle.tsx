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
        case 'tordesillas': return 'Tordesillasi szerződés';
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
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs space-y-3 z-10 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-2">Vezérlők</h3>
      
      {/* Routes Section */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-600 mb-1">Felfedezők útjai</h4>
        <div className="space-y-1">
          {routes.map(route => {
            const isVisible = visibleRouteIds.includes(route.id);
            const isSelectable = route.id !== 'tordesillas';
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
                  className={`text-sm text-gray-700 ${isSelectable ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                  onClick={isSelectable ? () => onExplorerSelect(route.id) : undefined}
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

      {/* View Section */}
      <div className="pt-2 border-t mt-2">
        <h4 className="font-semibold text-sm text-gray-600">Nézet</h4>
         <label className="flex items-center cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={is3DView}
            onChange={(e) => setIs3DView(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">3D Gömb Nézet</span>
        </label>
      </div>
    </div>
  );
};

export default LayerToggle;
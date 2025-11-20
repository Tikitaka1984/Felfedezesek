
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import LayerToggle from './components/LayerToggle';
import Tooltip from './components/Tooltip';
import EducationalPanel from './components/EducationalPanel';
import { routes } from './data/mapData';
import type { Empire } from './types';
import ColonialLegend from './components/ColonialLegend';
import TimelineControls from './components/TimelineControls';

const App: React.FC = () => {
  const [worldData, setWorldData] = useState<any>(null);
  const [visibleRouteIds, setVisibleRouteIds] = useState<string[]>(() => routes.map(r => r.id));
  const [showTerritories, setShowTerritories] = useState(true);
  const [is3DView, setIs3DView] = useState(false);
  const [showCities, setShowCities] = useState(true);
  const [showEmpires, setShowEmpires] = useState(true);
  const [tooltip, setTooltip] = useState<{ data: { name: string; description: string; }, position: { x: number; y: number; } } | null>(null);
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);
  
  // Timeline state
  // Default to a year before the main action or the start of the era
  const [currentYear, setCurrentYear] = useState<number>(1485);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => setWorldData(data));
  }, []);

  useEffect(() => {
    if (selectedExplorerId && !visibleRouteIds.includes(selectedExplorerId)) {
      setSelectedExplorerId(null);
    }
  }, [visibleRouteIds, selectedExplorerId]);

  const handleExplorerSelect = (explorerId: string) => {
    setTooltip(null);
    setSelectedExplorerId(explorerId);
    setIsPlaying(false); // Stop timeline if specific explorer is selected manually
  };
  
  const handleEmpireClick = (empire: Empire, event: MouseEvent) => {
    setSelectedExplorerId(null);
    setTooltip({
      data: empire,
      position: { x: event.pageX, y: event.pageY }
    });
  };
  
  const handleCloseTooltip = () => {
    setTooltip(null);
  };
  
  const handleCloseEducationalPanel = () => {
      setSelectedExplorerId(null);
  };

  const handleRouteToggle = (routeId: string) => {
    setVisibleRouteIds(prev =>
      prev.includes(routeId) ? prev.filter(id => id !== routeId) : [...prev, routeId]
    );
  };

  if (!worldData) {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <p className="text-xl text-gray-700">Térkép betöltése...</p>
        </div>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-100">
      <Map
        worldData={worldData}
        onExplorerSelect={handleExplorerSelect}
        onEmpireClick={handleEmpireClick}
        visibleRouteIds={visibleRouteIds}
        showTerritories={showTerritories}
        selectedExplorerId={selectedExplorerId}
        is3DView={is3DView}
        showCities={showCities}
        showEmpires={showEmpires}
        currentYear={currentYear}
      />
      
      <ColonialLegend />

      <EducationalPanel selectedExplorerId={selectedExplorerId} onClose={handleCloseEducationalPanel} />
      
      {tooltip && (
        <Tooltip tooltip={tooltip} onClose={handleCloseTooltip} />
      )}

      <LayerToggle
        routes={routes}
        visibleRouteIds={visibleRouteIds}
        onRouteToggle={handleRouteToggle}
        onExplorerSelect={handleExplorerSelect}
        showTerritories={showTerritories}
        setShowTerritories={setShowTerritories}
        showCities={showCities}
        setShowCities={setShowCities}
        showEmpires={showEmpires}
        setShowEmpires={setShowEmpires}
        is3DView={is3DView}
        setIs3DView={setIs3DView}
      />

      <TimelineControls 
        currentYear={currentYear} 
        setCurrentYear={setCurrentYear} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </main>
  );
};

export default App;

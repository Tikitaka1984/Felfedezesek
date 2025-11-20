
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Globe3D from './components/Globe3D';
import LayerToggle from './components/LayerToggle';
import Tooltip from './components/Tooltip';
import EducationalPanel from './components/EducationalPanel';
import { routes } from './data/mapData';
import type { Empire, Concept } from './types';
import ColonialLegend from './components/ColonialLegend';
import TimelineControls from './components/TimelineControls';
import ConceptJournal from './components/ConceptJournal';
import Quiz from './components/Quiz';

const App: React.FC = () => {
  const [worldData, setWorldData] = useState<any>(null);
  const [visibleRouteIds, setVisibleRouteIds] = useState<string[]>(() => routes.map(r => r.id));
  const [showTerritories, setShowTerritories] = useState(true);
  const [is3DView, setIs3DView] = useState(false);
  const [showCities, setShowCities] = useState(true);
  const [showEmpires, setShowEmpires] = useState(true);
  const [tooltip, setTooltip] = useState<{ data: { name: string; description: string; type?: string }; position: { x: number; y: number; } } | null>(null);
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);
  
  // Timeline state
  const [currentYear, setCurrentYear] = useState<number>(1485);
  const [isPlaying, setIsPlaying] = useState(false);

  // Concept Journal State
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>(() => {
    try {
      const saved = localStorage.getItem('conceptJournal');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Persist concepts
  useEffect(() => {
    localStorage.setItem('conceptJournal', JSON.stringify(concepts));
  }, [concepts]);

  const handleAddConcept = (conceptData: Omit<Concept, 'id' | 'createdAt'>) => {
    const newConcept: Concept = {
      ...conceptData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setConcepts(prev => [newConcept, ...prev]);
  };

  const handleDeleteConcept = (id: string) => {
    setConcepts(prev => prev.filter(c => c.id !== id));
  };

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
    setIsPlaying(false); 
  };
  
  const handleEmpireClick = (empire: Empire, event: MouseEvent) => {
    setSelectedExplorerId(null);
    setTooltip({
      data: { ...empire, type: 'empire' },
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

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-100">
      {is3DView ? (
        <Globe3D
          onExplorerSelect={handleExplorerSelect}
          visibleRouteIds={visibleRouteIds}
          selectedExplorerId={selectedExplorerId}
          showCities={showCities}
          showEmpires={showEmpires}
          currentYear={currentYear}
          showTerritories={showTerritories}
        />
      ) : (
        worldData ? (
          <Map
            worldData={worldData}
            onExplorerSelect={handleExplorerSelect}
            onEmpireClick={handleEmpireClick}
            visibleRouteIds={visibleRouteIds}
            showTerritories={showTerritories}
            selectedExplorerId={selectedExplorerId}
            showCities={showCities}
            showEmpires={showEmpires}
            currentYear={currentYear}
          />
        ) : (
           <div className="flex items-center justify-center w-screen h-screen">
              <p className="text-xl text-gray-700">Térkép betöltése...</p>
          </div>
        )
      )}
      
      <ColonialLegend />

      <EducationalPanel 
        selectedExplorerId={selectedExplorerId} 
        onClose={handleCloseEducationalPanel} 
        onSaveConcept={handleAddConcept}
      />
      
      {tooltip && (
        <Tooltip 
          tooltip={tooltip} 
          onClose={handleCloseTooltip} 
          onSaveConcept={handleAddConcept}
        />
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
        onToggleJournal={() => setIsJournalOpen(true)}
        onStartQuiz={() => setIsQuizOpen(true)}
      />

      <TimelineControls 
        currentYear={currentYear} 
        setCurrentYear={setCurrentYear} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onSaveConcept={handleAddConcept}
      />

      <ConceptJournal 
        isOpen={isJournalOpen} 
        onClose={() => setIsJournalOpen(false)} 
        concepts={concepts}
        onDelete={handleDeleteConcept}
      />

      <Quiz 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </main>
  );
};

export default App;

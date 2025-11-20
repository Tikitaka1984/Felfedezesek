
import React, { useEffect, useState } from "react";
import { routes } from "../data/mapData";

interface TimelineControlsProps {
  currentYear: number;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentYear,
  setCurrentYear,
  isPlaying,
  setIsPlaying,
}) => {
  const [speed, setSpeed] = useState(1);
  const minYear = 1485;
  const maxYear = 1540;

  // Find active events for the current year to display info
  const activeEvents = routes.filter((route) => {
    const years = route.year.split("-").map((y) => parseInt(y, 10));
    const start = years[0];
    const end = years[1] || start;
    return currentYear >= start && currentYear <= end;
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= maxYear) {
            setIsPlaying(false);
            return minYear;
          }
          return prev + 1;
        });
      }, 2000 / speed); // Base speed: 1 year per 2 seconds
    }

    return () => clearInterval(interval);
  }, [isPlaying, speed, setCurrentYear, setIsPlaying]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentYear(parseInt(e.target.value, 10));
    // Optional: Pause when dragging slider manually
    // setIsPlaying(false); 
  };

  const togglePlay = () => {
    if (currentYear >= maxYear) {
        setCurrentYear(minYear);
    }
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    if (speed === 1) setSpeed(2);
    else if (speed === 2) setSpeed(0.5);
    else setSpeed(1);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full p-4 z-20 flex justify-center pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-4 w-full max-w-3xl pointer-events-auto border border-gray-200">
        
        {/* Header Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-4xl font-bold text-blue-900 font-serif">{currentYear}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Események</div>
          </div>
          
          <div className="flex-1 ml-6 h-16 overflow-y-auto scrollbar-thin">
            {activeEvents.length > 0 ? (
              <ul className="space-y-1">
                {activeEvents.map((event) => (
                  <li key={event.id} className="text-sm flex items-center text-gray-700 animate-fade-in">
                     <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: event.color }}></span>
                     <span className="font-medium mr-1">{event.explorer}:</span> 
                     <span className="truncate opacity-80">{event.year}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic mt-1">Ebben az évben nincs rögzített fő esemény.</p>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label={isPlaying ? "Szünet" : "Lejátszás"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            )}
          </button>

          {/* Slider */}
          <div className="flex-1 relative group">
            <input
              type="range"
              min={minYear}
              max={maxYear}
              value={currentYear}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1 font-mono">
                <span>{minYear}</span>
                <span>{maxYear}</span>
            </div>
          </div>

          {/* Speed Control */}
          <button
            onClick={cycleSpeed}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-bold text-xs shadow-sm"
            title="Lejátszási sebesség"
          >
            <span>{speed}x</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default TimelineControls;

'use client';

import { useEffect, useState, useMemo } from 'react';
import GlobeCanvas from '@/components/GlobeCanvas';
import HUD from '@/components/HUD';
import Timebar from '@/components/Timebar';
import ClimateControlPanel from '@/components/ClimateControlPanel';
import Legend from '@/components/Legend';
import Charts from '@/components/Charts';
import InfoPanel from '@/components/InfoPanel';
import { loadData } from '@/lib/dataLoader';
import { nasaDataFetcher } from '@/lib/nasaOfficialData';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [seaLevelData, setSeaLevelData] = useState<any>(null);
  const [tIndex, setTIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  
  // Climate control states
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  
  // Data layer visibility states
  const [showSeaLevelDots, setShowSeaLevelDots] = useState(true);
  const [showChlorophyllDots, setShowChlorophyllDots] = useState(true);
  const [showFloodVisualization, setShowFloodVisualization] = useState(true);
  
  // Charts modal state
  const [isChartsOpen, setIsChartsOpen] = useState(false);

  // Load data
  useEffect(() => {
    loadData().then((loadedData) => {
      console.log('📊 Main: Data loaded', {
        hasData: !!loadedData,
        hasMeta: !!loadedData?.meta,
        hasDataArray: !!loadedData?.data,
        dataLength: loadedData?.data?.length,
        timestamps: loadedData?.meta?.timestamps?.length,
        variable: loadedData?.meta?.variable,
        units: loadedData?.meta?.units,
        min: loadedData?.meta?.min,
        max: loadedData?.meta?.max
      });
      setData(loadedData);
    });

        // Load official NASA sea level data
        nasaDataFetcher.fetchSeaLevelData()
          .then(setSeaLevelData)
          .catch(error => {
            console.error('❌ Failed to load NASA sea level data:', error);
            // Fallback to local data
            fetch('/sea_level_data.json')
              .then(res => res.json())
              .then(setSeaLevelData);
          });
  }, []);

  // Calculate statistics for charts and legend
  const floodStats = useMemo(() => {
    if (!seaLevelData) return { totalAffected: 0, floodedRegions: 0, totalPopulation: 0 };
    
    const yearIndex = seaLevelData.timeline.years.indexOf(selectedYear);
    if (yearIndex === -1) return { totalAffected: 0, floodedRegions: 0, totalPopulation: 0 };
    
    const seaLevelRise = seaLevelData.timeline.currentRate.seaLevelRise[yearIndex] * 
      seaLevelData.projections.scenarios[selectedScenario].seaLevelRiseMultiplier;
    
    const seaLevelMeters = seaLevelRise / 1000;
    
    const coastalRegions = [
      { elevation: 1.2, population: 92000 },
      { elevation: 0.8, population: 55000 },
      { elevation: 2.0, population: 5000000 },
      { elevation: 1.0, population: 540000 },
      { elevation: 3.0, population: 8000000 },
      { elevation: -1.0, population: 872680 },
      { elevation: 2.0, population: 2000000 },
      { elevation: 2.5, population: 5000000 },
      { elevation: 1.0, population: 10000000 },
      { elevation: 3.0, population: 20000000 }
    ];
    
    let totalAffected = 0;
    let floodedRegions = 0;
    
    coastalRegions.forEach(region => {
      const floodDepth = Math.max(0, seaLevelMeters - region.elevation);
      if (floodDepth > 0.1) {
        floodedRegions++;
        totalAffected += Math.floor(region.population * Math.min(1, floodDepth / 2));
      }
    });
    
    return { totalAffected, floodedRegions, totalPopulation: 50000000 };
  }, [seaLevelData, selectedYear, selectedScenario]);

  const iceStats = useMemo(() => {
    const yearsPassed = selectedYear - 2024;
    const scenarioMultiplier = 1 + (selectedScenario * 0.5);
    
    const iceRegions = [
      { meltRate: 0.3, seaLevelContribution: 0.7 },
      { meltRate: 0.4, seaLevelContribution: 0.8 },
      { meltRate: 2.5, seaLevelContribution: 0.1 },
      { meltRate: 1.8, seaLevelContribution: 0.05 },
      { meltRate: 3.0, seaLevelContribution: 0.02 },
      { meltRate: 2.0, seaLevelContribution: 0.03 }
    ];
    
    let totalMelted = 0;
    let totalContribution = 0;
    let criticalRegions = 0;
    
    iceRegions.forEach(region => {
      const meltedAmount = Math.min(100, region.meltRate * scenarioMultiplier * yearsPassed);
      const currentSize = Math.max(0, 100 - meltedAmount);
      
      totalMelted += meltedAmount;
      totalContribution += meltedAmount * region.seaLevelContribution / 100;
      
      if (currentSize < 30) criticalRegions++;
    });
    
    return {
      totalMelted: totalMelted / iceRegions.length,
      criticalRegions,
      seaLevelContribution: totalContribution
    };
  }, [selectedYear, selectedScenario]);

  const currentSeaLevelRise = useMemo(() => {
    if (!seaLevelData) return 0;
    
    const yearIndex = seaLevelData.timeline.years.indexOf(selectedYear);
    if (yearIndex === -1) return 0;
    
    return seaLevelData.timeline.currentRate.seaLevelRise[yearIndex] * 
      seaLevelData.projections.scenarios[selectedScenario].seaLevelRiseMultiplier;
  }, [seaLevelData, selectedYear, selectedScenario]);

  // Audio state and controls
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio('/ocean_heartbeat.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    setAudioRef(audio);

    // Enable audio on first user interaction
    const enableAudio = () => {
      if (!audioEnabled) {
        audio.play().catch(console.log);
        setAudioEnabled(true);
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
      }
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    return () => {
      audio.pause();
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, [audioEnabled]);

  // Control audio based on playing state
  useEffect(() => {
    if (audioRef) {
      if (playing && audioEnabled) {
        audioRef.play().catch(console.log);
      } else {
        audioRef.pause();
      }
    }
  }, [playing, audioEnabled, audioRef]);

  // Auto-play animation
  useEffect(() => {
    if (!playing || !data) return;
    const id = setInterval(() => {
      setTIndex(v => (v + 1) % data.meta.timestamps.length);
    }, 900);
    return () => clearInterval(id);
  }, [playing, data]);

  return (
    <main className="w-full h-screen bg-black">
      {/* 3D Globe Canvas */}
          <GlobeCanvas
            data={data}
            tIndex={tIndex}
            seaLevelData={seaLevelData}
            selectedScenario={selectedScenario}
            selectedYear={selectedYear}
            onLocationClick={setSelectedLocation}
            showSeaLevelDots={showSeaLevelDots}
            showChlorophyllDots={showChlorophyllDots}
            showFloodVisualization={showFloodVisualization}
            playing={playing}
          />
      
      {/* UI Components */}
          <HUD 
            playing={playing} 
            setPlaying={setPlaying} 
            tIndex={tIndex} 
            data={data}
            showSeaLevelDots={showSeaLevelDots}
            setShowSeaLevelDots={setShowSeaLevelDots}
            showChlorophyllDots={showChlorophyllDots}
            setShowChlorophyllDots={setShowChlorophyllDots}
            showFloodVisualization={showFloodVisualization}
            setShowFloodVisualization={setShowFloodVisualization}
            onOpenCharts={() => setIsChartsOpen(true)}
            audioEnabled={audioEnabled}
            onToggleAudio={() => {
              if (audioRef) {
                if (audioEnabled) {
                  audioRef.pause();
                  setAudioEnabled(false);
                } else {
                  audioRef.play().catch(console.log);
                  setAudioEnabled(true);
                }
              }
            }}
          />
      <Timebar data={data} tIndex={tIndex} setT={setTIndex} />
      
      {/* Climate Control Panel */}
      <ClimateControlPanel
        data={seaLevelData}
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        playing={playing}
        setPlaying={setPlaying}
      />

      {/* Legend */}
      <Legend
        showChlorophyllDots={showChlorophyllDots}
        showSeaLevelDots={showSeaLevelDots}
        showFloodVisualization={showFloodVisualization}
        selectedYear={selectedYear}
        selectedScenario={selectedScenario}
        seaLevelRise={currentSeaLevelRise}
        floodStats={floodStats}
        iceStats={iceStats}
        data={data}
        tIndex={tIndex}
      />

      {/* Info Panel */}
      <InfoPanel data={data} tIndex={tIndex} />

      {/* Charts Modal */}
      <Charts
        selectedYear={selectedYear}
        selectedScenario={selectedScenario}
        seaLevelData={seaLevelData}
        floodStats={floodStats}
        iceStats={iceStats}
        isOpen={isChartsOpen}
        onClose={() => setIsChartsOpen(false)}
      />
    </main>
  );
}
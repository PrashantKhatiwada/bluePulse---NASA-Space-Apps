'use client';

import { useEffect, useState } from 'react';
import GlobeCanvas from '@/components/GlobeCanvas';
import HUD from '@/components/HUD';
import Timebar from '@/components/Timebar';
import ClimateControlPanel from '@/components/ClimateControlPanel';
import { loadData } from '@/lib/dataLoader';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [seaLevelData, setSeaLevelData] = useState<any>(null);
  const [tIndex, setTIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  
  // Climate control states
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Load data
  useEffect(() => {
    loadData().then(setData);
    
    // Load sea level data
    fetch('/sea_level_data.json')
      .then(res => res.json())
      .then(setSeaLevelData);
  }, []);

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
      {/* Ambient Audio */}
      <audio 
        src="/ocean_heartbeat.mp3" 
        autoPlay 
        loop 
        controls={false} 
        style={{ display: "none" }} 
        volume={0.3}
      />
      
      {/* 3D Globe Canvas */}
      <GlobeCanvas 
        data={data} 
        tIndex={tIndex} 
        seaLevelData={seaLevelData}
        selectedScenario={selectedScenario}
        selectedYear={selectedYear}
        onLocationClick={setSelectedLocation}
      />
      
      {/* UI Components */}
      <HUD 
        playing={playing} 
        setPlaying={setPlaying} 
        tIndex={tIndex} 
        data={data} 
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
    </main>
  );
}
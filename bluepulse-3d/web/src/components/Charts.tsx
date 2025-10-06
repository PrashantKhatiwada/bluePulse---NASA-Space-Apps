"use client";
import React, { useState, useMemo } from "react";

interface ChartsProps {
  selectedYear: number;
  selectedScenario: number;
  seaLevelData: any;
  floodStats: {
    totalAffected: number;
    floodedRegions: number;
    totalPopulation: number;
  };
  iceStats: {
    totalMelted: number;
    criticalRegions: number;
    seaLevelContribution: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function Charts({
  selectedYear,
  selectedScenario,
  seaLevelData,
  floodStats,
  iceStats,
  isOpen,
  onClose,
}: ChartsProps) {
  const [activeChart, setActiveChart] = useState<'seaLevel' | 'flooding' | 'ice' | 'population'>('seaLevel');

  // Debug logging
  console.log('📊 Charts component rendered:', { isOpen, selectedYear, selectedScenario, seaLevelData: !!seaLevelData });

  // Calculate sea level rise over time
  const seaLevelTimeline = useMemo(() => {
    if (!seaLevelData) return [];
    
    return seaLevelData.timeline.years.map((year: number, index: number) => {
      const rise = seaLevelData.timeline.currentRate.seaLevelRise[index];
      const scenario = seaLevelData.projections.scenarios[selectedScenario];
      return {
        year,
        rise: rise * scenario.seaLevelRiseMultiplier
      };
    });
  }, [seaLevelData, selectedScenario]);

  // Calculate flood impact over time
  const floodTimeline = useMemo(() => {
    if (!seaLevelData) return [];
    
    const coastalRegions = [
      { name: "Miami Beach", elevation: 1.2, population: 92000 },
      { name: "Venice", elevation: 0.8, population: 55000 },
      { name: "Bangladesh Delta", elevation: 2.0, population: 5000000 },
      { name: "Maldives", elevation: 1.0, population: 540000 },
      { name: "Tokyo Bay", elevation: 3.0, population: 8000000 },
      { name: "Amsterdam", elevation: -1.0, population: 872680 },
      { name: "Manhattan", elevation: 2.0, population: 2000000 },
      { name: "Shanghai", elevation: 2.5, population: 5000000 },
      { name: "Jakarta", elevation: 1.0, population: 10000000 },
      { name: "Mumbai", elevation: 3.0, population: 20000000 }
    ];

    return seaLevelData.timeline.years.map((year: number, index: number) => {
      const seaLevelMeters = (seaLevelData.timeline.currentRate.seaLevelRise[index] * 
        seaLevelData.projections.scenarios[selectedScenario].seaLevelRiseMultiplier) / 1000;
      
      let totalAffected = 0;
      let floodedRegions = 0;
      
      coastalRegions.forEach(region => {
        const floodDepth = Math.max(0, seaLevelMeters - region.elevation);
        if (floodDepth > 0.1) { // 10cm threshold
          floodedRegions++;
          totalAffected += Math.floor(region.population * Math.min(1, floodDepth / 2));
        }
      });
      
      return {
        year,
        affected: totalAffected,
        regions: floodedRegions
      };
    });
  }, [seaLevelData, selectedScenario]);

  // Calculate ice melt over time
  const iceTimeline = useMemo(() => {
    if (!seaLevelData) return [];
    
    const iceRegions = [
      { name: "Greenland", meltRate: 0.3, seaLevelContribution: 0.7 },
      { name: "Antarctica", meltRate: 0.4, seaLevelContribution: 0.8 },
      { name: "Arctic Sea Ice", meltRate: 2.5, seaLevelContribution: 0.1 },
      { name: "Himalayan Glaciers", meltRate: 1.8, seaLevelContribution: 0.05 },
      { name: "Alpine Glaciers", meltRate: 3.0, seaLevelContribution: 0.02 },
      { name: "Patagonian Ice", meltRate: 2.0, seaLevelContribution: 0.03 }
    ];

    return seaLevelData.timeline.years.map((year: number) => {
      const yearsPassed = year - 2024;
      const scenarioMultiplier = 1 + (selectedScenario * 0.5);
      
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
        year,
        melted: totalMelted / iceRegions.length,
        contribution: totalContribution,
        critical: criticalRegions
      };
    });
  }, [seaLevelData, selectedScenario]);

  const chartButtons = [
    { id: 'seaLevel', label: 'Sea Level Rise', color: '#00d4ff' },
    { id: 'flooding', label: 'Flood Impact', color: '#ff6600' },
    { id: 'ice', label: 'Ice Melting', color: '#ffffff' },
    { id: 'population', label: 'Population Impact', color: '#ff0000' }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'seaLevel':
        return (
          <div>
            <h4 style={{ color: '#00d4ff', marginBottom: '10px' }}>Sea Level Rise Over Time</h4>
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '4px' }}>
              {seaLevelTimeline.map((point, index) => {
                const height = (point.rise / Math.max(...seaLevelTimeline.map(p => p.rise))) * 180;
                const isCurrent = point.year === selectedYear;
                return (
                  <div key={point.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '20px',
                        height: `${height}px`,
                        background: isCurrent ? '#00d4ff' : '#0066cc',
                        borderRadius: '2px 2px 0 0',
                        border: isCurrent ? '2px solid #ffffff' : 'none'
                      }}
                    />
                    <div style={{ fontSize: '10px', marginTop: '4px', writingMode: 'vertical-rl' }}>
                      {point.year}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
              Current: {seaLevelTimeline.find(p => p.year === selectedYear)?.rise.toFixed(1)} mm
            </div>
          </div>
        );

      case 'flooding':
        return (
          <div>
            <h4 style={{ color: '#ff6600', marginBottom: '10px' }}>Coastal Flooding Impact</h4>
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '4px' }}>
              {floodTimeline.map((point, index) => {
                const maxAffected = Math.max(...floodTimeline.map(p => p.affected));
                const height = maxAffected > 0 ? (point.affected / maxAffected) * 180 : 0;
                const isCurrent = point.year === selectedYear;
                return (
                  <div key={point.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '20px',
                        height: `${height}px`,
                        background: isCurrent ? '#ff6600' : '#ff4400',
                        borderRadius: '2px 2px 0 0',
                        border: isCurrent ? '2px solid #ffffff' : 'none'
                      }}
                    />
                    <div style={{ fontSize: '10px', marginTop: '4px', writingMode: 'vertical-rl' }}>
                      {point.year}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
              Current: {floodTimeline.find(p => p.year === selectedYear)?.affected.toLocaleString()} people affected
            </div>
          </div>
        );

      case 'ice':
        return (
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '10px' }}>Ice Sheet Melting</h4>
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '4px' }}>
              {iceTimeline.map((point, index) => {
                const height = (point.melted / 100) * 180;
                const isCurrent = point.year === selectedYear;
                return (
                  <div key={point.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '20px',
                        height: `${height}px`,
                        background: isCurrent ? '#ffffff' : '#cccccc',
                        borderRadius: '2px 2px 0 0',
                        border: isCurrent ? '2px solid #00aaff' : 'none'
                      }}
                    />
                    <div style={{ fontSize: '10px', marginTop: '4px', writingMode: 'vertical-rl' }}>
                      {point.year}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
              Current: {iceTimeline.find(p => p.year === selectedYear)?.melted.toFixed(1)}% melted
            </div>
          </div>
        );

      case 'population':
        return (
          <div>
            <h4 style={{ color: '#ff0000', marginBottom: '10px' }}>Population Impact</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
              <div style={{ background: 'rgba(255, 0, 0, 0.1)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontWeight: 'bold', color: '#ff0000' }}>Flood Impact</div>
                <div>Affected: {floodStats.totalAffected.toLocaleString()}</div>
                <div>Regions: {floodStats.floodedRegions}</div>
              </div>
              <div style={{ background: 'rgba(0, 170, 255, 0.1)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontWeight: 'bold', color: '#00aaff' }}>Ice Impact</div>
                <div>Melted: {iceStats.totalMelted.toFixed(1)}%</div>
                <div>Critical: {iceStats.criticalRegions}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.9)",
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          {/* Modal Content */}
          <div style={{
            width: "90%",
            maxWidth: "800px",
            height: "80%",
            maxHeight: "600px",
            background: "rgba(0, 0, 0, 0.95)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            padding: "20px",
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "#ff4444",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* Modal Header */}
            <div style={{
              marginBottom: "20px",
              paddingRight: "50px"
            }}>
                  <h2 style={{ 
                    color: "#00d4ff", 
                    margin: "0 0 10px 0", 
                    fontSize: "24px",
                    fontWeight: "bold"
                  }}>
                    🛰️ NASA Climate Impact Analytics
                  </h2>
                  <p style={{ 
                    color: "#ccc", 
                    margin: 0, 
                    fontSize: "14px" 
                  }}>
                    Official NASA JPL & Ocean Color Web data analysis
                  </p>
            </div>

            {/* Chart Type Buttons */}
            <div style={{ 
              display: "flex", 
              gap: "8px", 
              marginBottom: "20px",
              flexWrap: "wrap"
            }}>
              {chartButtons.map(button => (
                <button
                  key={button.id}
                  onClick={() => setActiveChart(button.id as any)}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: activeChart === button.id ? button.color : "#444",
                    color: activeChart === button.id ? 
                      (button.color === '#ffffff' ? '#000000' : 'white') : 'white',
                    fontSize: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.2s ease"
                  }}
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Chart Content */}
            <div style={{ 
              height: "calc(100% - 120px)",
              overflow: "auto",
              padding: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px"
            }}>
              {renderChart()}
            </div>

            {/* Current Scenario Info */}
            <div style={{ 
              position: "absolute",
              bottom: "15px",
              left: "20px",
              right: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)", 
              paddingTop: "10px",
              fontSize: "12px",
              color: "#888"
            }}>
              <div>Scenario: <strong style={{ color: "#00d4ff" }}>+{selectedScenario}°C Warming</strong></div>
              <div>Year: <strong style={{ color: "#00d4ff" }}>{selectedYear}</strong></div>
              <div style={{ marginTop: "5px", opacity: 0.8 }}>
                Use the climate control panel to change scenarios and years
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

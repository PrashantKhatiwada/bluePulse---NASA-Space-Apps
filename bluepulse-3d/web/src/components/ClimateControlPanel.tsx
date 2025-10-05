"use client";
import { useState, useEffect } from "react";

interface SeaLevelData {
  metadata: {
    title: string;
    currentYear: number;
    currentGlobalTemp: number;
    seaLevelRiseRate: number;
  };
  locations: Array<{
    id: string;
    name: string;
    coordinates: { longitude: number; latitude: number };
    currentSeaLevel: number;
    seaLevelRise: number;
    vulnerability: string;
    population: number;
    description: string;
  }>;
  projections: {
    scenarios: Array<{
      name: string;
      description: string;
      tempIncrease: number;
      seaLevelRiseMultiplier: number;
    }>;
  };
  timeline: {
    years: number[];
    currentRate: {
      seaLevelRise: number[];
    };
  };
}

interface ClimateControlPanelProps {
  data: SeaLevelData | null;
  selectedScenario: number;
  setSelectedScenario: (scenario: number) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedLocation: any;
  setSelectedLocation: (location: any) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

export default function ClimateControlPanel({
  data,
  selectedScenario,
  setSelectedScenario,
  selectedYear,
  setSelectedYear,
  selectedLocation,
  setSelectedLocation,
  playing,
  setPlaying,
}: ClimateControlPanelProps) {
  const [showProjections, setShowProjections] = useState(false);

  if (!data) {
    return (
      <div className="climate-panel">
        <div style={{ color: "white", padding: "20px" }}>
          Loading climate data...
        </div>
      </div>
    );
  }

  const currentScenario = data.projections.scenarios[selectedScenario];
  const yearIndex = data.timeline.years.indexOf(selectedYear);
  const projectedRise = yearIndex >= 0 ? 
    data.timeline.currentRate.seaLevelRise[yearIndex] * currentScenario.seaLevelRiseMultiplier : 0;

  return (
    <div className="climate-panel">
      <div className="panel-header">
        <h2 style={{ color: "#00d4ff", margin: 0, fontSize: "18px", fontWeight: "bold" }}>
          🌍 Climate Impact Simulator
        </h2>
        <p style={{ color: "#ccc", margin: "5px 0", fontSize: "12px" }}>
          Interactive sea level rise projections
        </p>
      </div>

      {/* Current Global Temperature */}
      <div className="temperature-display">
        <div style={{ color: "#ff6b6b", fontSize: "14px", fontWeight: "bold" }}>
          Current Global Temperature: {data.metadata.currentGlobalTemp}°C
        </div>
        <div style={{ color: "#ff6b6b", fontSize: "10px", opacity: 0.8 }}>
          Sea Level Rise Rate: {data.metadata.seaLevelRiseRate} mm/year
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="scenario-controls">
        <label style={{ color: "white", fontSize: "12px", marginBottom: "8px", display: "block" }}>
          Temperature Scenario:
        </label>
        <select
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(parseInt(e.target.value))}
          style={{
            width: "100%",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#222",
            color: "white",
            fontSize: "11px"
          }}
        >
          {data.projections.scenarios.map((scenario, index) => (
            <option key={index} value={index}>
              {scenario.name} - {scenario.description}
            </option>
          ))}
        </select>
      </div>

      {/* Year Selection */}
      <div className="year-controls">
        <label style={{ color: "white", fontSize: "12px", marginBottom: "8px", display: "block" }}>
          Projection Year: {selectedYear}
        </label>
        <input
          type="range"
          min="0"
          max={data.timeline.years.length - 1}
          value={data.timeline.years.indexOf(selectedYear)}
          onChange={(e) => setSelectedYear(data.timeline.years[parseInt(e.target.value)])}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#888" }}>
          <span>{data.timeline.years[0]}</span>
          <span>{data.timeline.years[data.timeline.years.length - 1]}</span>
        </div>
      </div>

      {/* Projection Display */}
      <div className="projection-display">
        <div style={{ color: "#00d4ff", fontSize: "14px", fontWeight: "bold" }}>
          Projected Sea Level Rise: {projectedRise.toFixed(1)} mm
        </div>
        <div style={{ color: "#ff6b6b", fontSize: "12px" }}>
          Temperature Increase: +{currentScenario.tempIncrease}°C
        </div>
        <div style={{ color: "#ffaa44", fontSize: "11px" }}>
          Multiplier: {currentScenario.seaLevelRiseMultiplier}x current rate
        </div>
      </div>

      {/* Location Information */}
      {selectedLocation && (
        <div className="location-info">
          <h3 style={{ color: "#00d4ff", fontSize: "14px", margin: "10px 0 5px 0" }}>
            {selectedLocation.name}
          </h3>
          <div style={{ color: "#ccc", fontSize: "11px", lineHeight: "1.4" }}>
            <div>Population: {selectedLocation.population.toLocaleString()}</div>
            <div>Vulnerability: <span style={{ 
              color: selectedLocation.vulnerability === "extreme" ? "#ff4444" : 
                     selectedLocation.vulnerability === "high" ? "#ff8844" : "#44ff44"
            }}>{selectedLocation.vulnerability}</span></div>
            <div style={{ marginTop: "5px", fontStyle: "italic" }}>
              {selectedLocation.description}
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            background: playing ? "#ff6b6b" : "#00d4ff",
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
            cursor: "pointer",
            marginRight: "8px"
          }}
        >
          {playing ? "⏸️ Pause" : "▶️ Play"}
        </button>
        <button
          onClick={() => setShowProjections(!showProjections)}
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            background: showProjections ? "#ffaa44" : "#666",
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          📊 Projections
        </button>
      </div>

      {/* Awareness Message */}
      <div className="awareness-message">
        <div style={{ 
          background: "rgba(255, 107, 107, 0.1)", 
          border: "1px solid #ff6b6b", 
          borderRadius: "6px", 
          padding: "10px", 
          marginTop: "15px" 
        }}>
          <div style={{ color: "#ff6b6b", fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>
            ⚠️ Climate Alert
          </div>
          <div style={{ color: "#ccc", fontSize: "10px", lineHeight: "1.4" }}>
            Sea levels are rising at an accelerating rate due to global warming. 
            Coastal cities worldwide face increasing flood risks. 
            <strong style={{ color: "#ff6b6b" }}> Immediate action is needed!</strong>
          </div>
        </div>
      </div>

      <style jsx>{`
        .climate-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 280px;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 15px;
          backdrop-filter: blur(10px);
          z-index: 1000;
        }
        
        .panel-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .temperature-display {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 15px;
        }
        
        .scenario-controls, .year-controls {
          margin-bottom: 15px;
        }
        
        .projection-display {
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 15px;
        }
        
        .location-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 15px;
        }
        
        .control-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .awareness-message {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}

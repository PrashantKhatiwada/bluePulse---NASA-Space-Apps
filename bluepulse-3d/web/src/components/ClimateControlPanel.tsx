"use client";
import React, { useState, useEffect } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);

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
  const projectedRise = yearIndex >= 0 ? data.timeline.currentRate.seaLevelRise[yearIndex] * currentScenario.seaLevelRiseMultiplier : 0;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      left: "20px",
      width: "280px",
      maxHeight: "calc(100vh - 40px)",
      background: "rgba(0, 0, 0, 0.9)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      backdropFilter: "blur(15px)",
      zIndex: 1000,
      overflow: "hidden",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
    }}>
      {/* Collapsible Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: "12px 15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(0, 212, 255, 0.1)",
          borderBottom: isExpanded ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
        }}
      >
        <div>
          <h2 style={{ color: "#00d4ff", margin: 0, fontSize: "16px", fontWeight: "bold" }}>
            🛰️ Climate Simulator
          </h2>
          <p style={{ color: "#ccc", margin: "2px 0 0 0", fontSize: "10px" }}>
            NASA JPL • {selectedYear} • +{selectedScenario}°C
          </p>
        </div>
        <div style={{ fontSize: 16, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
          ▼
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
          <div style={{ padding: "15px", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>

      {/* Current Global Temperature */}
      <div style={{
        background: "rgba(255, 107, 107, 0.1)",
        border: "1px solid rgba(255, 107, 107, 0.3)",
        borderRadius: "6px",
        padding: "8px",
        marginBottom: "15px"
      }}>
        <div style={{ color: "#ff6b6b", fontSize: "14px", fontWeight: "bold" }}>
          Current Global Temperature: {data.metadata.currentGlobalTemp}°C
        </div>
        <div style={{ color: "#ff6b6b", fontSize: "10px", opacity: 0.8 }}>
          Sea Level Rise Rate: {data.metadata.seaLevelRiseRate} mm/year
        </div>
      </div>

      {/* Scenario Selection */}
      <div style={{ marginBottom: "15px" }}>
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
      <div style={{ marginBottom: "15px" }}>
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
      <div style={{
        background: "rgba(0, 212, 255, 0.1)",
        border: "1px solid rgba(0, 212, 255, 0.3)",
        borderRadius: "6px",
        padding: "8px",
        marginBottom: "15px"
      }}>
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
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "6px",
          padding: "10px",
          marginBottom: "15px"
        }}>
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
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
          📊 {showProjections ? "Hide" : "Show"} Projections
        </button>
      </div>

      {/* Projection Details - Only show when projections are enabled */}
      {showProjections && (
        <div style={{
          background: "rgba(255, 170, 68, 0.1)",
          border: "1px solid rgba(255, 170, 68, 0.3)",
          borderRadius: "6px",
          padding: "8px",
          marginBottom: "15px"
        }}>
          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
            📈 Projection Details
          </div>
          <div style={{ color: "#ccc", fontSize: 11, lineHeight: "1.4" }}>
            <div>Current Year: {selectedYear}</div>
            <div>Scenario: {currentScenario.name}</div>
            <div>Projected Rise: {projectedRise.toFixed(1)} mm</div>
            <div>Rate Multiplier: {currentScenario.seaLevelRiseMultiplier}x</div>
          </div>
        </div>
      )}

      {/* Awareness Message */}
      <div style={{ fontSize: "10px" }}>
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

        </div>
      )}
    </div>
  );
}
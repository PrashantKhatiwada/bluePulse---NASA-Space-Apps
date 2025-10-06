"use client";
import React from "react";

interface LegendProps {
  showChlorophyllDots: boolean;
  showSeaLevelDots: boolean;
  showFloodVisualization: boolean;
  selectedYear: number;
  selectedScenario: number;
  seaLevelRise: number;
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
  data?: any;
  tIndex?: number;
}

export default function Legend({
  showChlorophyllDots,
  showSeaLevelDots,
  showFloodVisualization,
  selectedYear,
  selectedScenario,
  seaLevelRise,
  floodStats,
  iceStats,
  data = null,
  tIndex = 0,
}: LegendProps) {
  // Safety check for data
  if (!data) {
    console.warn('Legend: No data provided');
  }

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "280px",
      maxHeight: "calc(100vh - 40px)",
      background: "rgba(0, 0, 0, 0.9)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      padding: "15px",
      backdropFilter: "blur(15px)",
      zIndex: 1000,
      fontSize: "11px",
      color: "white",
      overflowY: "auto",
      overflowX: "hidden",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
    }}>
          <h3 style={{ color: "#00d4ff", margin: "0 0 10px 0", fontSize: "14px" }}>
            🛰️ Official NASA Data Legend
          </h3>

      {/* Chlorophyll Legend */}
      {showChlorophyllDots && (
        <div style={{ marginBottom: "6px" }}>
          <div style={{ color: "#0ea5e9", fontWeight: "bold", marginBottom: "4px" }}>
            🌊 NASA MODIS Aqua Chlorophyll-a (mg/m³)
          </div>
          <div style={{ display: "flex", gap: "2px", marginBottom: "3px" }}>
            {Array.from({ length: 8 }, (_, i) => {
              const hue = 180 + (i / 7) * 60; // Blue to cyan
              return (
                <div
                  key={i}
                  style={{
                    width: "20px",
                    height: "12px",
                    background: `hsl(${hue}, 80%, 60%)`,
                    borderRadius: "2px"
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", opacity: 0.8 }}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}

      {/* Sea Level Markers Legend */}
      {showSeaLevelDots && (
        <div style={{ marginBottom: "6px" }}>
          <div style={{ color: "#ff6600", fontWeight: "bold", marginBottom: "4px" }}>
            ⚠️ NASA JPL Sea Level Risk Locations
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#ff2222", borderRadius: "50%" }} />
              <span style={{ fontSize: "11px" }}>Extreme Risk</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#ff6600", borderRadius: "50%" }} />
              <span style={{ fontSize: "11px" }}>High Risk</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#00ff44", borderRadius: "50%" }} />
              <span style={{ fontSize: "11px" }}>Low Risk</span>
            </div>
          </div>
        </div>
      )}

      {/* Flood Visualization Legend */}
      {showFloodVisualization && (
        <div style={{ marginBottom: "6px" }}>
          <div style={{ color: "#ff0000", fontWeight: "bold", marginBottom: "4px" }}>
            🌊 Coastal Flooding
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#ff0000", borderRadius: "50%" }} />
              <span style={{ fontSize: "11px" }}>Flooded Areas</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#ff6600", borderRadius: "50%" }} />
              <span style={{ fontSize: "11px" }}>At Risk Areas</span>
            </div>
            <div style={{ fontSize: "10px", opacity: 0.8, marginTop: "4px" }}>
              Current Sea Level Rise: <strong>{seaLevelRise.toFixed(1)} mm</strong>
            </div>
          </div>
        </div>
      )}

          {/* Current Statistics */}
          <div style={{ 
            borderTop: "1px solid rgba(255, 255, 255, 0.1)", 
            paddingTop: "6px",
            marginTop: "6px"
          }}>
        <div style={{ color: "#00d4ff", fontWeight: "bold", marginBottom: "4px" }}>
          📈 Current Impact Stats
        </div>
        
          <div style={{ fontSize: "11px", lineHeight: "1.3" }}>
            <div>Year: <strong>{selectedYear}</strong></div>
            <div>Scenario: <strong>+{selectedScenario}°C</strong></div>
            <div>Sea Level Rise: <strong>{seaLevelRise.toFixed(1)} mm</strong></div>
            
                {/* Current Chlorophyll Data Info */}
                {data && data.meta && (
                  <div style={{ marginTop: "4px", color: "#00aaff" }}>
                <div>Current Date: <strong>{data.meta.timestamps?.[tIndex || 0] ? new Date(data.meta.timestamps[tIndex || 0]).toLocaleDateString() : 'Unknown'}</strong></div>
                <div>Data Points: <strong>{data.data?.length || 0}</strong></div>
                <div>Variable: <strong>{data.meta.variable || 'chlorophyll-a'}</strong></div>
                <div>Units: <strong>{data.meta.units || 'mg/m³'}</strong></div>
              </div>
            )}
            
                {showFloodVisualization && (
                  <>
                    <div style={{ marginTop: "4px", color: "#ff6600" }}>
                  <div>Flooded Regions: <strong>{floodStats.floodedRegions}</strong></div>
                  <div>Affected Population: <strong>{floodStats.totalAffected.toLocaleString()}</strong></div>
                </div>
              </>
            )}
            
                <div style={{ marginTop: "4px", color: "#00aaff" }}>
              <div>Ice Melted: <strong>{iceStats.totalMelted.toFixed(1)}%</strong></div>
              <div>Critical Regions: <strong>{iceStats.criticalRegions}</strong></div>
              <div>Sea Level Contribution: <strong>{iceStats.seaLevelContribution.toFixed(2)} mm</strong></div>
            </div>
          </div>
      </div>
    </div>
  );
}
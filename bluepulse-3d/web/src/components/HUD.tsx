"use client";
import { useEffect, useState } from "react";
import { debugCoordinates } from "@/lib/lonlat";

export default function HUD({
  playing,
  setPlaying,
  tIndex,
  data,
  showSeaLevelDots = true,
  setShowSeaLevelDots,
  showChlorophyllDots = true,
  setShowChlorophyllDots,
  showFloodVisualization = true,
  setShowFloodVisualization,
  onOpenCharts,
  audioEnabled = false,
  onToggleAudio,
}: {
  playing: boolean;
  setPlaying: (value: boolean | ((prev: boolean) => boolean)) => void;
  tIndex: number;
  data: any;
  showSeaLevelDots?: boolean;
  setShowSeaLevelDots?: (show: boolean | ((prev: boolean) => boolean)) => void;
  showChlorophyllDots?: boolean;
  setShowChlorophyllDots?: (show: boolean | ((prev: boolean) => boolean)) => void;
  showFloodVisualization?: boolean;
  setShowFloodVisualization?: (show: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCharts?: () => void;
  audioEnabled?: boolean;
  onToggleAudio?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {}, []);
  const fly = (lon: number, lat: number, dist = 2.6) => {
    (globalThis as any).__flyToLonLat?.(lon, lat, dist);
  };
  return (
    <>
      {/* Collapsible Controls */}
      <div style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.9)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(15px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        transition: "all 0.3s ease"
      }}>
        {/* Header - Always Visible */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0, 212, 255, 0.1)",
            borderBottom: isExpanded ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.4 }}>
              BluePulse 3D
            </div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              🛰️ NASA Data • {playing ? "▶️ Playing" : "⏸️ Paused"}
            </div>
          </div>
          <div style={{ fontSize: 18, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
            ▼
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div style={{ padding: "15px", maxHeight: "400px", overflowY: "auto" }}>
            {/* Main Controls */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button
                onClick={() => setPlaying((p) => !p)}
                style={{
                  padding: "8px 12px",
                  border: 0,
                  borderRadius: 8,
                  background: "#0ea5e9",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "12px"
                }}
              >
                {playing ? "⏸️ Pause" : "▶️ Play"}
              </button>
              
              <button
                onClick={() => onToggleAudio?.()}
                style={{
                  padding: "8px 12px",
                  border: 0,
                  borderRadius: 8,
                  background: audioEnabled ? "#00ff44" : "#666",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "12px"
                }}
              >
                {audioEnabled ? "🔊 Audio" : "🔇 Audio"}
              </button>
            </div>

            {/* Data Layer Toggles */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: "6px", color: "#00d4ff" }}>
                📊 Data Layers
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                <button
                  onClick={() => setShowChlorophyllDots?.(!showChlorophyllDots)}
                  style={{
                    padding: "6px 8px",
                    border: 0,
                    borderRadius: 6,
                    background: showChlorophyllDots ? "#0ea5e9" : "#666",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600
                  }}
                >
                  🌊 Chlorophyll
                </button>
                <button
                  onClick={() => setShowSeaLevelDots?.(!showSeaLevelDots)}
                  style={{
                    padding: "6px 8px",
                    border: 0,
                    borderRadius: 6,
                    background: showSeaLevelDots ? "#ff6600" : "#666",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600
                  }}
                >
                  ⚠️ Sea Level
                </button>
                <button
                  onClick={() => setShowFloodVisualization?.(!showFloodVisualization)}
                  style={{
                    padding: "6px 8px",
                    border: 0,
                    borderRadius: 6,
                    background: showFloodVisualization ? "#ff0000" : "#666",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 600
                  }}
                >
                  🌊 Flood
                </button>
              </div>
            </div>

            {/* Quick Locations */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: "6px", color: "#00d4ff" }}>
                🌍 Quick Locations
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                <button onClick={() => fly(147.6992, -18.2871, 2.4)} style={{...btn, fontSize: 9}}>
                  Great Barrier Reef
                </button>
                <button onClick={() => fly(-15.0, -25.0, 2.5)} style={{...btn, fontSize: 9}}>
                  Atlantic Gyre
                </button>
                <button onClick={() => fly(-80.1918, 25.7617, 2.4)} style={{...btn, fontSize: 9}}>
                  Miami, FL
                </button>
                <button onClick={() => fly(12.3155, 45.4408, 2.4)} style={{...btn, fontSize: 9}}>
                  Venice, Italy
                </button>
              </div>
            </div>

            {/* Current Data Info */}
            <div style={{ fontSize: 10, opacity: 0.8, marginBottom: "8px" }}>
              {data ? new Date(data.meta.timestamps[tIndex]).toLocaleDateString() : "Loading…"}
            </div>

            {/* Debug Button */}
            <button
              onClick={() => debugCoordinates()}
              style={{...btn, fontSize: 9, background: "#ff6b6b", width: "100%"}}
            >
              🐛 Debug Coordinates
            </button>
          </div>
        )}
      </div>

      {/* Floating Charts Button - Lower Middle */}
      <div style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000
      }}>
        <button
          onClick={() => {
            console.log('📊 Charts button clicked');
            onOpenCharts?.();
          }}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #00d4ff, #0099cc)",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
            transition: "all 0.3s ease",
            border: "2px solid rgba(255, 255, 255, 0.2)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 212, 255, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 212, 255, 0.3)";
          }}
        >
          📊 Open Charts & Analytics
        </button>
      </div>

      <div className="legend">
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
          {data?.meta.variable || "chlorophyll"} (
          {data?.meta.units || "mg m^-3"})
        </div>
        <div style={{ display: "flex", gap: 1 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const t = i / 7,
              hue = 180 + 60 * t; // Blue to cyan for chlorophyll
            return (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 8,
                  background: `hsl(${hue} 80% 60%)`,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            opacity: 0.8,
            marginTop: 4,
          }}
        >
          <span>{data?.meta.min?.toFixed?.(2) ?? "min"}</span>
          <span>{data?.meta.max?.toFixed?.(2) ?? "max"}</span>
        </div>
        
        {/* Sea Level Legend */}
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 12, marginBottom: 6 }}>
          Sea Level Risk
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, background: "#ff2222", borderRadius: "50%" }} />
            <span style={{ fontSize: 10, opacity: 0.8 }}>Extreme</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, background: "#ff6600", borderRadius: "50%" }} />
            <span style={{ fontSize: 10, opacity: 0.8 }}>High</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, background: "#00ff44", borderRadius: "50%" }} />
            <span style={{ fontSize: 10, opacity: 0.8 }}>Low</span>
          </div>
        </div>
      </div>
    </>
  );
}
const btn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,.2)",
  background: "rgba(0,0,0,.25)",
  color: "white",
  fontSize: 12,
  textAlign: "left",
};
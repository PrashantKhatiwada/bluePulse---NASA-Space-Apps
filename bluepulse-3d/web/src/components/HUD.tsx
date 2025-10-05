"use client";
import { useEffect } from "react";
import { debugCoordinates } from "@/lib/lonlat";

export default function HUD({
  playing,
  setPlaying,
  tIndex,
  data,
}: {
  playing: boolean;
  setPlaying: (b: boolean) => void;
  tIndex: number;
  data: any;
}) {
  useEffect(() => {}, []);
  const fly = (lon: number, lat: number, dist = 2.6) => {
    (globalThis as any).__flyToLonLat?.(lon, lat, dist);
  };
  return (
    <>
      <div className="controls">
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.4 }}>
          BluePulse 3D
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8 }}>
          The ocean's heartbeat • NASA data
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{
            padding: "6px 10px",
            border: 0,
            borderRadius: 8,
            background: "#0ea5e9",
            color: "white",
            fontWeight: 700,
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div style={{ height: 8 }} />
        <div style={{ display: "grid", gap: 6 }}>
          <button onClick={() => fly(147.485962, -18.156290, 2.4)} style={btn}>
            Great Barrier Reef
          </button>
          <button onClick={() => fly(-30.0, -40.0, 2.5)} style={btn}>
            South Atlantic Gyre
          </button>
          <button onClick={() => fly(-74.0, 40.7, 2.4)} style={btn}>
            NY Bight
          </button>
        </div>
        <div style={{ height: 8 }} />
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
          🌊 Sea Level Locations
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          <button onClick={() => fly(-80.1918, 25.7617, 2.4)} style={{...btn, fontSize: 10}}>
            Miami, FL
          </button>
          <button onClick={() => fly(12.3155, 45.4408, 2.4)} style={{...btn, fontSize: 10}}>
            Venice, Italy
          </button>
          <button onClick={() => fly(90.4125, 23.8103, 2.4)} style={{...btn, fontSize: 10}}>
            Dhaka, Bangladesh
          </button>
          <button onClick={() => fly(73.5361, 4.1755, 2.4)} style={{...btn, fontSize: 10}}>
            Maldives
          </button>
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
          {data
            ? new Date(data.meta.timestamps[tIndex]).toUTCString()
            : "Loading…"}
        </div>
        <div style={{ height: 8 }} />
        <button 
          onClick={() => debugCoordinates()} 
          style={{...btn, fontSize: 10, background: "#ff6b6b"}}
        >
          🐛 Debug Coordinates
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
              hue = 200 - 200 * t;
            return (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 8,
                  background: `hsl(${hue} 80% 55%)`,
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
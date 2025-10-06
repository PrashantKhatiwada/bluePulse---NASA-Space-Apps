"use client";
import React, { useState } from "react";

interface InfoPanelProps {
  data: any;
  tIndex: number;
}

export default function InfoPanel({ data, tIndex }: InfoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Safety check for data
  if (!data) {
    console.warn('InfoPanel: No data provided');
    return null;
  }

  const currentTimestamp = data.meta?.timestamps?.[tIndex];
  const currentDate = currentTimestamp ? new Date(currentTimestamp).toLocaleDateString() : 'Unknown';
  
  // Calculate some statistics
  const allValues = data.data?.flatMap((point: any) => point.values) || [];
  const currentValues = data.data?.map((point: any) => point.values[tIndex]).filter((v: any) => v != null) || [];
  const avgChlorophyll = currentValues.length > 0 ? currentValues.reduce((a: number, b: number) => a + b, 0) / currentValues.length : 0;
  const maxChlorophyll = Math.max(...currentValues);
  const minChlorophyll = Math.min(...currentValues);

  return (
    <>
      {/* Info Button */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "320px",
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "6px 12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "15px",
            background: isOpen ? "#00d4ff" : "rgba(0, 0, 0, 0.7)",
            color: "white",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            backdropFilter: "blur(10px)"
          }}
        >
          {isOpen ? "📊 Hide Info" : "ℹ️ NASA Data Info"}
        </button>
      </div>

      {/* Info Panel */}
      {isOpen && (
            <div style={{
              position: "fixed",
              top: "60px",
              right: "320px",
              width: "400px",
              maxHeight: "calc(100vh - 80px)",
              background: "rgba(0, 0, 0, 0.9)",
              border: "2px solid rgba(0, 212, 255, 0.3)",
              borderRadius: "12px",
              padding: "20px",
              backdropFilter: "blur(20px)",
              zIndex: 1000,
              color: "white",
              fontSize: "14px",
              lineHeight: "1.6",
              overflowY: "auto",
              overflowX: "hidden"
            }}>
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#ff4444",
              border: "none",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ×
          </button>

          <h2 style={{ color: "#00d4ff", margin: "0 0 15px 0", fontSize: "18px" }}>
            🛰️ Official NASA Multi-Mission Data Visualization
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#00ff80", margin: "0 0 8px 0", fontSize: "16px" }}>
              What is Chlorophyll-a?
            </h3>
            <p style={{ margin: "0 0 10px 0" }}>
              Chlorophyll-a is the primary pigment used by phytoplankton (microscopic marine plants) 
              for photosynthesis. It's a key indicator of ocean productivity and marine ecosystem health.
            </p>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Higher concentrations</strong> indicate more productive waters with abundant marine life.
              <strong>Lower concentrations</strong> indicate oligotrophic (nutrient-poor) waters.
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#00ff80", margin: "0 0 8px 0", fontSize: "16px" }}>
              🛰️ Official NASA Data Sources
            </h3>
            <p style={{ margin: "0 0 10px 0" }}>
              This visualization integrates multiple official NASA datasets:
            </p>
            
            <div style={{ marginBottom: "10px" }}>
              <h4 style={{ color: "#00aaff", margin: "0 0 5px 0", fontSize: "14px" }}>
                🌊 Ocean Color Web (Chlorophyll-a)
              </h4>
              <ul style={{ margin: "0 0 10px 0", paddingLeft: "20px", fontSize: "12px" }}>
                <li><strong>Satellite:</strong> MODIS Aqua</li>
                <li><strong>Algorithm:</strong> OC3M (Ocean Color 3-band Maximum Band Ratio)</li>
                <li><strong>Resolution:</strong> 4km spatial resolution</li>
                <li><strong>API:</strong> NASA ERDDAP</li>
                <li><strong>Documentation:</strong> oceancolor.gsfc.nasa.gov</li>
              </ul>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <h4 style={{ color: "#ff6600", margin: "0 0 5px 0", fontSize: "14px" }}>
                📈 Sea Level Rise (GRACE/GRACE-FO)
              </h4>
              <ul style={{ margin: "0 0 10px 0", paddingLeft: "20px", fontSize: "12px" }}>
                <li><strong>Satellites:</strong> GRACE & GRACE-FO</li>
                <li><strong>Algorithm:</strong> MASCON (Mass Concentration)</li>
                <li><strong>Resolution:</strong> 1° x 1°</li>
                <li><strong>Source:</strong> NASA JPL PODAAC</li>
                <li><strong>Coverage:</strong> 2002-present</li>
              </ul>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <h4 style={{ color: "#ffaa00", margin: "0 0 5px 0", fontSize: "14px" }}>
                🌡️ Climate Data (GISS)
              </h4>
              <ul style={{ margin: "0 0 10px 0", paddingLeft: "20px", fontSize: "12px" }}>
                <li><strong>Source:</strong> NASA GISS Surface Temperature Analysis</li>
                <li><strong>Coverage:</strong> 1880-present</li>
                <li><strong>Resolution:</strong> Global average</li>
                <li><strong>Documentation:</strong> data.giss.nasa.gov/gistemp</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#00ff80", margin: "0 0 8px 0", fontSize: "16px" }}>
              🎨 Color Coding
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "12px", background: "#000080", borderRadius: "50%" }} />
                <span style={{ fontSize: "12px" }}>Low (0.01-0.1 mg/m³)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "12px", background: "#0080FF", borderRadius: "50%" }} />
                <span style={{ fontSize: "12px" }}>Medium-Low (0.1-0.3 mg/m³)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "12px", background: "#00FF80", borderRadius: "50%" }} />
                <span style={{ fontSize: "12px" }}>Medium (0.3-0.6 mg/m³)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "12px", background: "#80FF00", borderRadius: "50%" }} />
                <span style={{ fontSize: "12px" }}>High (0.6-1.0 mg/m³)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "12px", background: "#FF4000", borderRadius: "50%" }} />
                <span style={{ fontSize: "12px" }}>Very High (&gt;1.0 mg/m³)</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#00ff80", margin: "0 0 8px 0", fontSize: "16px" }}>
              📊 Current Data (Date: {currentDate})
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
              <div style={{ background: "rgba(0, 255, 128, 0.1)", padding: "8px", borderRadius: "4px" }}>
                <strong>Average:</strong> {avgChlorophyll.toFixed(3)} mg/m³
              </div>
              <div style={{ background: "rgba(0, 255, 128, 0.1)", padding: "8px", borderRadius: "4px" }}>
                <strong>Maximum:</strong> {maxChlorophyll.toFixed(3)} mg/m³
              </div>
              <div style={{ background: "rgba(0, 255, 128, 0.1)", padding: "8px", borderRadius: "4px" }}>
                <strong>Minimum:</strong> {minChlorophyll.toFixed(3)} mg/m³
              </div>
              <div style={{ background: "rgba(0, 255, 128, 0.1)", padding: "8px", borderRadius: "4px" }}>
                <strong>Locations:</strong> {data.data?.length || 0}
              </div>
            </div>
          </div>

          <div style={{ 
            background: "rgba(0, 212, 255, 0.1)", 
            border: "1px solid rgba(0, 212, 255, 0.3)", 
            borderRadius: "6px", 
            padding: "10px",
            fontSize: "12px"
          }}>
            <strong>💡 Tip:</strong> Watch how chlorophyll concentrations change seasonally! 
            Coastal areas typically show higher values due to nutrient runoff, while open ocean 
            gyres show lower values. The animation shows monthly progression through 2024.
          </div>
        </div>
      )}
    </>
  );
}

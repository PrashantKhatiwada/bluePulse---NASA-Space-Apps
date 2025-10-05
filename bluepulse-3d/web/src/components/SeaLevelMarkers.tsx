"use client";
import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { lonLatToVec3 } from "@/lib/lonlat";

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

interface SeaLevelMarkersProps {
  data: SeaLevelData | null;
  selectedScenario: number;
  selectedYear: number;
  onLocationClick: (location: any) => void;
}

export default function SeaLevelMarkers({
  data,
  selectedScenario,
  selectedYear,
  onLocationClick,
}: SeaLevelMarkersProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const { positions, colors, sizes, labels } = useMemo(() => {
    if (!data) {
      return {
        positions: new Float32Array(0),
        colors: new Float32Array(0),
        sizes: new Float32Array(0),
        labels: [],
      };
    }

    const locations = data.locations;
    const scenario = data.projections.scenarios[selectedScenario];
    const yearIndex = data.timeline.years.indexOf(selectedYear);
    
    if (yearIndex === -1) return {
      positions: new Float32Array(0),
      colors: new Float32Array(0),
      sizes: new Float32Array(0),
      labels: [],
    };

    const N = locations.length;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const siz = new Float32Array(N);
    const lab: Array<{ name: string; position: THREE.Vector3; vulnerability: string }> = [];

    for (let i = 0; i < N; i++) {
      const location = locations[i];
      const vec = lonLatToVec3(location.coordinates.longitude, location.coordinates.latitude, 1.08);
      pos.set([vec.x, vec.y, vec.z], i * 3);

      // Calculate projected sea level rise
      const projectedRise = data.timeline.currentRate.seaLevelRise[yearIndex] * scenario.seaLevelRiseMultiplier;
      
      // Color based on vulnerability and projected impact
      let color: THREE.Color;
      switch (location.vulnerability) {
        case "extreme":
          color = new THREE.Color(0xff4444); // Red
          break;
        case "high":
          color = new THREE.Color(0xff8844); // Orange
          break;
        case "medium":
          color = new THREE.Color(0xffaa44); // Yellow-orange
          break;
        default:
          color = new THREE.Color(0x44ff44); // Green
      }

      // Adjust color intensity based on projected sea level rise
      const intensity = Math.min(1.0, projectedRise / 200); // Normalize to max 200mm
      color.multiplyScalar(0.5 + intensity * 0.5);

      col.set([color.r, color.g, color.b], i * 3);

      // Size based on population and vulnerability
      const baseSize = 0.015;
      const populationFactor = Math.log10(location.population) / 7; // Normalize to 10M
      const vulnerabilityFactor = location.vulnerability === "extreme" ? 1.5 : 
                                 location.vulnerability === "high" ? 1.2 : 1.0;
      
      siz[i] = baseSize + 0.01 * populationFactor * vulnerabilityFactor;

      lab.push({
        name: location.name,
        position: vec.clone(),
        vulnerability: location.vulnerability,
      });
    }

    return { positions: pos, colors: col, sizes: siz, labels: lab };
  }, [data, selectedScenario, selectedYear]);

  const handleMarkerClick = (index: number) => {
    if (data) {
      // Stop Earth rotation and reset to known position when clicking on a marker
      (globalThis as any).__setEarthRotation?.(false);
      (globalThis as any).__resetEarthRotation?.();
      
      onLocationClick(data.locations[index]);
      
      // Resume rotation after a delay
      setTimeout(() => {
        (globalThis as any).__setEarthRotation?.(true);
      }, 2000);
    }
  };

  return (
    <group>
      {/* Sea level markers */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.15} 
          sizeAttenuation 
          vertexColors 
          transparent 
          opacity={0.8}
          onPointerOver={(e) => {
            const index = Math.floor(e.faceIndex! / 3);
            setHoveredLocation(data?.locations[index]?.name || null);
          }}
          onPointerOut={() => setHoveredLocation(null)}
          onClick={(e) => {
            const index = Math.floor(e.faceIndex! / 3);
            handleMarkerClick(index);
          }}
        />
      </points>

      {/* Location labels */}
      {labels.map((label, index) => (
        <mesh key={index} position={label.position.clone().multiplyScalar(1.1)}>
          <planeGeometry args={[0.1, 0.05]} />
          <meshBasicMaterial 
            color={label.vulnerability === "extreme" ? "#ff4444" : 
                   label.vulnerability === "high" ? "#ff8844" : "#44ff44"}
            transparent 
            opacity={hoveredLocation === label.name ? 1.0 : 0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

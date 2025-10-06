"use client";
import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { lonLatToVec3Corrected } from "@/lib/lonlat";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      {/* Interactive sea level markers as individual spheres */}
      {data && data.locations.map((location, index) => {
        const vec = lonLatToVec3Corrected(location.coordinates.longitude, location.coordinates.latitude, 1.08);
        const scenario = data.projections.scenarios[selectedScenario];
        const yearIndex = data.timeline.years.indexOf(selectedYear);
        const projectedRise = yearIndex >= 0 ? 
          data.timeline.currentRate.seaLevelRise[yearIndex] * scenario.seaLevelRiseMultiplier : 0;
        
        // Enhanced color scheme for sea level markers
        let color: THREE.Color;
        const isHovered = hoveredIndex === index;
        
        switch (location.vulnerability) {
          case "extreme":
            color = new THREE.Color(0xff2222); // Bright red
            break;
          case "high":
            color = new THREE.Color(0xff6600); // Orange-red
            break;
          case "medium":
            color = new THREE.Color(0xffaa00); // Yellow-orange
            break;
          default:
            color = new THREE.Color(0x00ff44); // Green
        }

        // Add pulsing effect for hovered markers
        if (isHovered) {
          const pulse = 0.3 * Math.sin(Date.now() * 0.01);
          color.offsetHSL(0, 0, pulse);
        }

        // Adjust color intensity based on projected sea level rise
        const intensity = Math.min(1.0, projectedRise / 200); // Normalize to max 200mm
        color.multiplyScalar(0.6 + intensity * 0.4);

        // Enhanced sizing with hover effects
        const baseSize = 0.02;
        const populationFactor = Math.log10(location.population) / 7; // Normalize to 10M
        const vulnerabilityFactor = location.vulnerability === "extreme" ? 1.8 : 
                                   location.vulnerability === "high" ? 1.4 : 1.0;
        const hoverFactor = isHovered ? 1.5 : 1.0;
        
        const size = (baseSize + 0.015 * populationFactor * vulnerabilityFactor) * hoverFactor;

        return (
          <mesh
            key={location.id}
            position={vec}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(index);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredLocation(location.name);
              setHoveredIndex(index);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredLocation(null);
              setHoveredIndex(null);
            }}
          >
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.9}
            />
          </mesh>
        );
      })}

    </group>
  );
}

"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { lonLatToVec3Corrected } from "@/lib/lonlat";

interface FloodVisualizationProps {
  seaLevelRise: number; // in mm
  isPlaying: boolean;
}

interface CoastalRegion {
  id: string;
  name: string;
  coordinates: { longitude: number; latitude: number };
  elevation: number; // meters above sea level
  population: number;
  area: number; // km²
  floodRisk: "low" | "medium" | "high" | "extreme";
}

export default function FloodVisualization({
  seaLevelRise,
  isPlaying
}: FloodVisualizationProps) {
  const [floodAnimation, setFloodAnimation] = useState(0);
  const animationRef = useRef<number>();

  // Major coastal regions at risk
  const coastalRegions: CoastalRegion[] = useMemo(() => [
    {
      id: "miami_beach",
      name: "Miami Beach",
      coordinates: { longitude: -80.1300, latitude: 25.7907 },
      elevation: 1.2,
      population: 92000,
      area: 18.7,
      floodRisk: "extreme"
    },
    {
      id: "venice_historic",
      name: "Venice Historic Center",
      coordinates: { longitude: 12.3155, latitude: 45.4408 },
      elevation: 0.8,
      population: 55000,
      area: 5.2,
      floodRisk: "extreme"
    },
    {
      id: "bangladesh_delta",
      name: "Bangladesh Delta",
      coordinates: { longitude: 90.4125, latitude: 23.8103 },
      elevation: 2.0,
      population: 5000000,
      area: 147570,
      floodRisk: "extreme"
    },
    {
      id: "maldives_atolls",
      name: "Maldives Atolls",
      coordinates: { longitude: 73.5093, latitude: 4.1755 },
      elevation: 1.0,
      population: 540000,
      area: 298,
      floodRisk: "extreme"
    },
    {
      id: "tokyo_bay",
      name: "Tokyo Bay Area",
      coordinates: { longitude: 139.6917, latitude: 35.6895 },
      elevation: 3.0,
      population: 8000000,
      area: 13500,
      floodRisk: "high"
    },
    {
      id: "amsterdam_city",
      name: "Amsterdam City",
      coordinates: { longitude: 4.8952, latitude: 52.3702 },
      elevation: -1.0,
      population: 872680,
      area: 219,
      floodRisk: "extreme"
    },
    {
      id: "manhattan",
      name: "Lower Manhattan",
      coordinates: { longitude: -74.0060, latitude: 40.7128 },
      elevation: 2.0,
      population: 2000000,
      area: 59,
      floodRisk: "high"
    },
    {
      id: "shanghai_pudong",
      name: "Shanghai Pudong",
      coordinates: { longitude: 121.4737, latitude: 31.2304 },
      elevation: 2.5,
      population: 5000000,
      area: 1210,
      floodRisk: "high"
    },
    {
      id: "jakarta_north",
      name: "North Jakarta",
      coordinates: { longitude: 106.8451, latitude: -6.2088 },
      elevation: 1.0,
      population: 10000000,
      area: 664,
      floodRisk: "extreme"
    },
    {
      id: "mumbai_coastal",
      name: "Mumbai Coastal",
      coordinates: { longitude: 72.8777, latitude: 19.0760 },
      elevation: 3.0,
      population: 20000000,
      area: 603,
      floodRisk: "high"
    }
  ], []);

  // Calculate flood status for each region
  const floodStatus = useMemo(() => {
    return coastalRegions.map(region => {
      const seaLevelMeters = seaLevelRise / 1000; // convert mm to meters
      const floodDepth = Math.max(0, seaLevelMeters - region.elevation);
      const isFlooded = floodDepth > 0.1; // 10cm threshold
      const floodSeverity = Math.min(1, floodDepth / 2); // normalize to 2m max
      
      return {
        ...region,
        floodDepth,
        isFlooded,
        floodSeverity,
        affectedPopulation: isFlooded ? Math.floor(region.population * floodSeverity) : 0
      };
    });
  }, [coastalRegions, seaLevelRise]);

  // Animation loop for flood effects
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      setFloodAnimation(prev => prev + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <group>
      {/* Flooded regions visualization */}
      {floodStatus.map((region, index) => {
        const vec = lonLatToVec3Corrected(region.coordinates.longitude, region.coordinates.latitude, 1.08);
        
        if (!region.isFlooded) return null;

        const pulseIntensity = 0.3 * Math.sin(floodAnimation + index * 0.5);
        const floodColor = region.floodRisk === "extreme" ? "#ff0000" : 
                          region.floodRisk === "high" ? "#ff6600" : "#ffaa00";

        return (
          <group key={region.id}>
            {/* Flood water effect */}
            <mesh position={vec}>
              <sphereGeometry args={[0.02 + region.floodSeverity * 0.01, 16, 16]} />
              <meshBasicMaterial 
                color={floodColor}
                transparent 
                opacity={0.6 + region.floodSeverity * 0.3 + pulseIntensity}
              />
            </mesh>
            
            {/* Flood ripple effect */}
            <mesh position={vec.clone().multiplyScalar(1.05)}>
              <sphereGeometry args={[0.03 + region.floodSeverity * 0.02, 16, 16]} />
              <meshBasicMaterial 
                color={floodColor}
                transparent 
                opacity={0.3 + region.floodSeverity * 0.2}
              />
            </mesh>
            
          </group>
        );
      })}

    </group>
  );
}

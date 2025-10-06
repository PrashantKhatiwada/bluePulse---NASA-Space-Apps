"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { lonLatToVec3Corrected } from "@/lib/lonlat";

interface IceMeltingProps {
  selectedYear: number;
  selectedScenario: number;
  isPlaying: boolean;
}

interface IceRegion {
  id: string;
  name: string;
  coordinates: { longitude: number; latitude: number };
  initialSize: number; // percentage
  meltRate: number; // percentage per year
  seaLevelContribution: number; // mm per year
  criticalThreshold: number; // percentage when critical melting occurs
}

export default function IceMelting({
  selectedYear,
  selectedScenario,
  isPlaying
}: IceMeltingProps) {
  const [meltAnimation, setMeltAnimation] = useState(0);
  const animationRef = useRef<number>();

  // Major ice regions
  const iceRegions: IceRegion[] = useMemo(() => [
    {
      id: "greenland_interior",
      name: "Greenland Interior Ice",
      coordinates: { longitude: -42.0, latitude: 72.0 },
      initialSize: 100,
      meltRate: 0.3,
      seaLevelContribution: 0.7,
      criticalThreshold: 70
    },
    {
      id: "greenland_coastal",
      name: "Greenland Coastal Ice",
      coordinates: { longitude: -50.0, latitude: 70.0 },
      initialSize: 100,
      meltRate: 1.2,
      seaLevelContribution: 0.3,
      criticalThreshold: 50
    },
    {
      id: "antarctica_west",
      name: "West Antarctic Ice Sheet",
      coordinates: { longitude: -100.0, latitude: -75.0 },
      initialSize: 100,
      meltRate: 0.4,
      seaLevelContribution: 0.8,
      criticalThreshold: 80
    },
    {
      id: "antarctica_east",
      name: "East Antarctic Ice Sheet",
      coordinates: { longitude: 100.0, latitude: -80.0 },
      initialSize: 100,
      meltRate: 0.1,
      seaLevelContribution: 0.2,
      criticalThreshold: 90
    },
    {
      id: "arctic_sea_ice",
      name: "Arctic Sea Ice",
      coordinates: { longitude: 0.0, latitude: 85.0 },
      initialSize: 100,
      meltRate: 2.5,
      seaLevelContribution: 0.1,
      criticalThreshold: 30
    },
    {
      id: "himalayan_glaciers",
      name: "Himalayan Glaciers",
      coordinates: { longitude: 86.0, latitude: 28.0 },
      initialSize: 100,
      meltRate: 1.8,
      seaLevelContribution: 0.05,
      criticalThreshold: 40
    },
    {
      id: "alpine_glaciers",
      name: "Alpine Glaciers",
      coordinates: { longitude: 8.0, latitude: 46.0 },
      initialSize: 100,
      meltRate: 3.0,
      seaLevelContribution: 0.02,
      criticalThreshold: 20
    },
    {
      id: "patagonian_ice",
      name: "Patagonian Ice Fields",
      coordinates: { longitude: -73.0, latitude: -50.0 },
      initialSize: 100,
      meltRate: 2.0,
      seaLevelContribution: 0.03,
      criticalThreshold: 25
    }
  ], []);

  // Calculate ice melt based on year and scenario
  const iceMeltStatus = useMemo(() => {
    const yearsPassed = selectedYear - 2024;
    const scenarioMultiplier = 1 + (selectedScenario * 0.5); // increase melt rate with higher scenarios
    
    return iceRegions.map(region => {
      const totalMeltRate = region.meltRate * scenarioMultiplier;
      const meltedAmount = Math.min(region.initialSize, totalMeltRate * yearsPassed);
      const currentSize = Math.max(0, region.initialSize - meltedAmount);
      const meltPercentage = meltedAmount / region.initialSize;
      const isCritical = currentSize < region.criticalThreshold;
      
      return {
        ...region,
        currentSize,
        meltPercentage,
        isCritical,
        totalSeaLevelContribution: meltedAmount * region.seaLevelContribution / 100
      };
    });
  }, [iceRegions, selectedYear, selectedScenario]);

  // Animation loop for melting effects
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      setMeltAnimation(prev => prev + 0.01);
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
      {/* Ice regions visualization */}
      {iceMeltStatus.map((region, index) => {
        const vec = lonLatToVec3Corrected(region.coordinates.longitude, region.coordinates.latitude, 1.05);
        
        const sizeMultiplier = region.currentSize / 100;
        const meltIntensity = region.meltPercentage;
        const pulseIntensity = 0.2 * Math.sin(meltAnimation + index * 0.3);
        
        // Color based on melt status
        const iceColor = region.isCritical ? "#ff4444" : 
                        meltIntensity > 0.5 ? "#ffaa44" : "#ffffff";
        
        return (
          <group key={region.id}>
            {/* Ice sheet - larger and more visible */}
            <mesh position={vec}>
              <sphereGeometry args={[0.04 * sizeMultiplier, 20, 20]} />
              <meshBasicMaterial 
                color={iceColor}
                transparent 
                opacity={0.9 * sizeMultiplier + pulseIntensity}
              />
            </mesh>
            
            {/* Melt water effect - more prominent */}
            {meltIntensity > 0.05 && (
              <mesh position={vec.clone().multiplyScalar(1.1)}>
                <sphereGeometry args={[0.025 * meltIntensity, 16, 16]} />
                <meshBasicMaterial 
                  color="#00aaff"
                  transparent 
                  opacity={0.7 * meltIntensity}
                />
              </mesh>
            )}
            
            {/* Melt droplets effect */}
            {meltIntensity > 0.2 && (
              <mesh position={vec.clone().multiplyScalar(1.15)}>
                <sphereGeometry args={[0.01 * meltIntensity, 8, 8]} />
                <meshBasicMaterial 
                  color="#66ccff"
                  transparent 
                  opacity={0.8 * meltIntensity}
                />
              </mesh>
            )}
            
            {/* Critical melt warning - more visible */}
            {region.isCritical && (
              <mesh position={vec.clone().multiplyScalar(1.2)}>
                <planeGeometry args={[0.15, 0.08]} />
                <meshBasicMaterial 
                  color="#ff0000"
                  transparent 
                  opacity={0.9}
                />
              </mesh>
            )}
            
            {/* Melt progress indicator */}
            {meltIntensity > 0.1 && (
              <mesh position={vec.clone().multiplyScalar(1.25)}>
                <planeGeometry args={[0.12, 0.06]} />
                <meshBasicMaterial 
                  color="#ffaa44"
                  transparent 
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Global ice melt summary */}
      <mesh position={[0, 0, 1.7]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshBasicMaterial 
          color="#000000"
          transparent 
          opacity={0.7}
        />
      </mesh>
      
      {/* Ice melt text */}
      <mesh position={[0, 0, 1.72]}>
        <planeGeometry args={[0.55, 0.25]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent 
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

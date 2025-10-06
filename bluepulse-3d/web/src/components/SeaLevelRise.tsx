"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { lonLatToVec3Corrected } from "@/lib/lonlat";

interface SeaLevelRiseProps {
  data: any;
  selectedScenario: number;
  selectedYear: number;
  isPlaying: boolean;
  animationSpeed?: number;
}

interface FloodZone {
  id: string;
  name: string;
  coordinates: { longitude: number; latitude: number };
  elevation: number; // meters above sea level
  population: number;
  floodThreshold: number; // sea level rise that causes flooding (mm)
  currentFloodLevel: number; // current flood level (mm)
  isFlooded: boolean;
}

interface IceSheet {
  id: string;
  name: string;
  coordinates: { longitude: number; latitude: number };
  currentSize: number; // percentage of original size
  meltRate: number; // percentage per year
  seaLevelContribution: number; // mm of sea level rise per year
}

export default function SeaLevelRise({
  data,
  selectedScenario,
  selectedYear,
  isPlaying,
  animationSpeed = 1
}: SeaLevelRiseProps) {
  const [currentSeaLevel, setCurrentSeaLevel] = useState(0); // mm
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef<number>();

  // Flood zones data - major coastal areas at risk
  const floodZones: FloodZone[] = useMemo(() => [
    {
      id: "miami",
      name: "Miami, Florida",
      coordinates: { longitude: -80.1918, latitude: 25.7617 },
      elevation: 2.0, // meters
      population: 470914,
      floodThreshold: 100, // 100mm = 10cm
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "venice",
      name: "Venice, Italy",
      coordinates: { longitude: 12.3155, latitude: 45.4408 },
      elevation: 1.0,
      population: 261905,
      floodThreshold: 50,
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "bangladesh",
      name: "Dhaka, Bangladesh",
      coordinates: { longitude: 90.4125, latitude: 23.8103 },
      elevation: 4.0,
      population: 21000000,
      floodThreshold: 200,
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "maldives",
      name: "Malé, Maldives",
      coordinates: { longitude: 73.5093, latitude: 4.1755 },
      elevation: 1.5,
      population: 133412,
      floodThreshold: 30,
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "tokyo",
      name: "Tokyo, Japan",
      coordinates: { longitude: 139.6917, latitude: 35.6895 },
      elevation: 5.0,
      population: 13960000,
      floodThreshold: 300,
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "amsterdam",
      name: "Amsterdam, Netherlands",
      coordinates: { longitude: 4.8952, latitude: 52.3702 },
      elevation: -2.0, // below sea level
      population: 872680,
      floodThreshold: 0,
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "newyork",
      name: "New York City",
      coordinates: { longitude: -74.0060, latitude: 40.7128 },
      elevation: 10.0,
      population: 8336817,
      floodThreshold: 500,
      currentFloodLevel: 0,
      isFlooded: false
    },
    {
      id: "shanghai",
      name: "Shanghai, China",
      coordinates: { longitude: 121.4737, latitude: 31.2304 },
      elevation: 4.0,
      population: 24870895,
      floodThreshold: 200,
      currentFloodLevel: 0,
      isFlooded: false
    }
  ], []);

  // Ice sheets data
  const iceSheets: IceSheet[] = useMemo(() => [
    {
      id: "greenland",
      name: "Greenland Ice Sheet",
      coordinates: { longitude: -42.0, latitude: 72.0 },
      currentSize: 100, // percentage
      meltRate: 0.5, // percentage per year
      seaLevelContribution: 0.7 // mm per year
    },
    {
      id: "antarctica",
      name: "Antarctic Ice Sheet",
      coordinates: { longitude: 0.0, latitude: -82.0 },
      currentSize: 100,
      meltRate: 0.2,
      seaLevelContribution: 0.3
    },
    {
      id: "arctic",
      name: "Arctic Sea Ice",
      coordinates: { longitude: 0.0, latitude: 85.0 },
      currentSize: 100,
      meltRate: 2.0,
      seaLevelContribution: 0.1
    }
  ], []);

  // Calculate current sea level rise based on scenario and year
  const calculateSeaLevelRise = useMemo(() => {
    if (!data) return 0;
    
    const scenario = data.projections.scenarios[selectedScenario];
    const yearIndex = data.timeline.years.indexOf(selectedYear);
    
    if (yearIndex === -1) return 0;
    
    return data.timeline.currentRate.seaLevelRise[yearIndex] * scenario.seaLevelRiseMultiplier;
  }, [data, selectedScenario, selectedYear]);

  // Update flood zones based on current sea level
  const updatedFloodZones = useMemo(() => {
    return floodZones.map(zone => {
      const floodLevel = Math.max(0, currentSeaLevel - zone.elevation * 1000); // convert meters to mm
      const isFlooded = floodLevel > zone.floodThreshold;
      
      return {
        ...zone,
        currentFloodLevel: floodLevel,
        isFlooded
      };
    });
  }, [floodZones, currentSeaLevel]);

  // Update ice sheets based on time progression
  const updatedIceSheets = useMemo(() => {
    const yearsPassed = selectedYear - 2024;
    return iceSheets.map(sheet => {
      const meltedSize = Math.max(0, sheet.currentSize - (sheet.meltRate * yearsPassed));
      return {
        ...sheet,
        currentSize: meltedSize
      };
    });
  }, [iceSheets, selectedYear]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      setAnimationFrame(prev => {
        const newFrame = prev + 1;
        
        // Animate sea level rising
        const targetSeaLevel = calculateSeaLevelRise;
        const currentLevel = currentSeaLevel;
        const newSeaLevel = currentLevel + (targetSeaLevel - currentLevel) * 0.02;
        
        setCurrentSeaLevel(newSeaLevel);
        
        return newFrame;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, calculateSeaLevelRise, currentSeaLevel]);

  // Reset sea level when year/scenario changes
  useEffect(() => {
    setCurrentSeaLevel(0);
  }, [selectedYear, selectedScenario]);

  return (
    <group>
      {/* Sea Level Rise Visualization */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.01 + (currentSeaLevel / 100000), 64, 64]} />
        <meshBasicMaterial 
          color="#0066cc" 
          transparent 
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Flood Zone Markers */}
      {updatedFloodZones.map((zone, index) => {
        const vec = lonLatToVec3Corrected(zone.coordinates.longitude, zone.coordinates.latitude, 1.08);
        const floodIntensity = Math.min(1, zone.currentFloodLevel / 1000); // normalize to 1000mm
        
        return (
          <group key={zone.id}>
            {/* Base marker */}
            <mesh position={vec}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshBasicMaterial 
                color={zone.isFlooded ? "#ff0000" : "#ffaa00"}
                transparent 
                opacity={0.8}
              />
            </mesh>
            
            {/* Flood effect */}
            {zone.isFlooded && (
              <mesh position={vec.clone().multiplyScalar(1.05)}>
                <sphereGeometry args={[0.025 * (1 + floodIntensity), 16, 16]} />
                <meshBasicMaterial 
                  color="#ff0000"
                  transparent 
                  opacity={0.4 * floodIntensity}
                />
              </mesh>
            )}
            
            {/* Flood level indicator */}
            {zone.isFlooded && (
              <mesh position={vec.clone().multiplyScalar(1.1)}>
                <planeGeometry args={[0.15, 0.08]} />
                <meshBasicMaterial 
                  color="#ff0000"
                  transparent 
                  opacity={0.9}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Ice Sheet Markers */}
      {updatedIceSheets.map((sheet, index) => {
        const vec = lonLatToVec3Corrected(sheet.coordinates.longitude, sheet.coordinates.latitude, 1.05);
        const meltIntensity = 1 - (sheet.currentSize / 100);
        
        return (
          <group key={sheet.id}>
            {/* Ice sheet */}
            <mesh position={vec}>
              <sphereGeometry args={[0.02 * (sheet.currentSize / 100), 16, 16]} />
              <meshBasicMaterial 
                color="#ffffff"
                transparent 
                opacity={0.7 * (sheet.currentSize / 100)}
              />
            </mesh>
            
            {/* Melt effect */}
            {meltIntensity > 0.1 && (
              <mesh position={vec.clone().multiplyScalar(1.08)}>
                <sphereGeometry args={[0.03 * meltIntensity, 16, 16]} />
                <meshBasicMaterial 
                  color="#00aaff"
                  transparent 
                  opacity={0.5 * meltIntensity}
                />
              </mesh>
            )}
            
            {/* Melt indicator */}
            {meltIntensity > 0.2 && (
              <mesh position={vec.clone().multiplyScalar(1.12)}>
                <planeGeometry args={[0.12, 0.06]} />
                <meshBasicMaterial 
                  color="#00aaff"
                  transparent 
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        );
      })}

    </group>
  );
}

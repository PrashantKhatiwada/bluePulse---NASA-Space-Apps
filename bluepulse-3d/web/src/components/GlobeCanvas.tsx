"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Globe from "./Globe";
import Atmosphere from "./Atmosphere";
import DataDots from "./DataDots";
import SeaLevelMarkers from "./SeaLevelMarkers";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useCamStore } from "@/lib/store";
import { computeFlyPath } from "@/lib/fly";

function RotatingEarth({ 
  data, 
  tIndex, 
  seaLevelData, 
  selectedScenario, 
  selectedYear, 
  onLocationClick 
}: { 
  data: any; 
  tIndex: number;
  seaLevelData: any;
  selectedScenario: number;
  selectedYear: number;
  onLocationClick: (location: any) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isRotating, setIsRotating] = useState(true);
  
  useFrame(() => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Expose rotation control globally
  useEffect(() => {
    (globalThis as any).__setEarthRotation = (rotating: boolean) => {
      setIsRotating(rotating);
    };
    
    // Expose function to reset Earth rotation to a known position
    (globalThis as any).__resetEarthRotation = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y = 0; // Reset to 0 degrees
      }
    };
  }, []);
  
  return (
    <group ref={groupRef}>
      <Globe radius={1} rotationSpeed={0} />
      <Atmosphere />
      {data && <DataDots data={data} tIndex={tIndex} />}
      {seaLevelData && (
        <SeaLevelMarkers
          data={seaLevelData}
          selectedScenario={selectedScenario}
          selectedYear={selectedYear}
          onLocationClick={onLocationClick}
        />
      )}
    </group>
  );
}

function CameraTweener() {
  const { camera } = useThree();
  const [intro, setIntro] = useState(true);
  const tweenRef = useRef<THREE.Vector3[] | null>(null);
  const idxRef = useRef(0);

  // Intro zoom (one-time)
  useFrame((_, dt) => {
    if (intro) {
      camera.position.lerp(new THREE.Vector3(0, 0, 2.6), 0.03);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(new THREE.Vector3(0, 0, 2.6)) < 0.01)
        setIntro(false);
      return;
    }
    // Active tween path (from flyTo)
    if (tweenRef.current) {
      const path = tweenRef.current;
      if (idxRef.current < path.length) {
        camera.position.copy(path[idxRef.current++]);
        camera.lookAt(0, 0, 0);
      } else {
        tweenRef.current = null;
        idxRef.current = 0;
      }
    }
  });

  // Subscribe to store target changes to start a tween
  const setPath = (p: THREE.Vector3[]) => {
    tweenRef.current = p;
    idxRef.current = 0;
  };
  const setTarget = (t: [number, number, number]) => {}; // noop
  const store = useCamStore;

  useEffect(() => {
    const unsub = store.subscribe((s) => {
      // s.target is world coords; we'll set via computeFlyPath outside
    });
    return () => unsub();
  }, []);

  // Expose an imperative helper for buttons via window (simple)
  (globalThis as any).__flyToLonLat = (lon: number, lat: number, dist = 2.6) => {
    // Stop Earth rotation and reset to known position
    (globalThis as any).__setEarthRotation?.(false);
    (globalThis as any).__resetEarthRotation?.();
    
    const { path } = computeFlyPath(camera.position.clone(), lon, lat, dist, 90);
    setPath(path);
    
    // Resume Earth rotation after flight completes
    setTimeout(() => {
      (globalThis as any).__setEarthRotation?.(true);
    }, path.length * 16 + 1000); // Approximate flight duration + buffer
  };

  return null;
}

export default function GlobeCanvas({
  data,
  tIndex,
  seaLevelData,
  selectedScenario,
  selectedYear,
  onLocationClick,
}: {
  data: any;
  tIndex: number;
  seaLevelData: any;
  selectedScenario: number;
  selectedYear: number;
  onLocationClick: (location: any) => void;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 3.1], fov: 42 }} dpr={[1, 2]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 2]} intensity={1.2} />
      <RotatingEarth 
        data={data} 
        tIndex={tIndex} 
        seaLevelData={seaLevelData}
        selectedScenario={selectedScenario}
        selectedYear={selectedYear}
        onLocationClick={onLocationClick}
      />
      <Stars radius={100} depth={50} factor={2} fade speed={0.6} />
      <CameraTweener />
      <OrbitControls enablePan={false} enableZoom minDistance={2.2} maxDistance={6} />
    </Canvas>
  );
}
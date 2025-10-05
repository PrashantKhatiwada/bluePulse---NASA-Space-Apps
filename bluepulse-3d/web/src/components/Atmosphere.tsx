'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface AtmosphereProps {
  radius?: number;
  opacity?: number;
  color?: string;
  glowIntensity?: number;
}

export default function Atmosphere({ 
  radius = 1.02, 
  opacity = 0.3,
  color = '#4A90E2',
  glowIntensity = 0.5
}: AtmosphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create atmosphere material
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
  }, [color, opacity]);
  
  // Create subtle pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = Math.sin(time * 0.5) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
      
      // Subtle opacity variation
      if (material.opacity !== undefined) {
        material.opacity = opacity + Math.sin(time * 0.3) * 0.05;
      }
    }
  });
  
  return (
    <Sphere ref={meshRef} args={[radius, 32, 32]} material={material} />
  );
}

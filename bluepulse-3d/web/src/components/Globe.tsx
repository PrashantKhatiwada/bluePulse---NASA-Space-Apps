'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Globe({ radius = 1, rotationSpeed = 0.001 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  // Load Earth texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    loader.load(
      '/earth_day_8k.jpg',
      (loadedTexture) => {
        console.log('✅ Earth texture loaded successfully');
        setTexture(loadedTexture);
        setTextureLoaded(true);
      },
      undefined,
      (error) => {
        console.log('❌ Earth texture failed to load:', error);
        setTextureLoaded(false);
      }
    );
  }, []);
  
  // Create material with texture or fallback
  const material = useMemo(() => {
    if (textureLoaded && texture) {
      console.log('🎨 Using Earth texture');
      return new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 100,
        specular: 0x222222
      });
    } else {
      console.log('🔄 Using blue fallback');
      return new THREE.MeshPhongMaterial({
        color: 0x1E3A8A, // Deep blue
        shininess: 100,
        specular: 0x222222
      });
    }
  }, [textureLoaded, texture]);
  
  // Note: Rotation is now handled by the parent group in GlobeCanvas
  // This prevents double rotation and coordinate misalignment
  
  return (
    <Sphere ref={meshRef} args={[radius, 64, 64]} material={material} />
  );
}
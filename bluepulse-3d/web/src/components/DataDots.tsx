"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { lonLatToVec3Corrected } from "@/lib/lonlat";
import { colorFor } from "@/lib/colormap";

export default function DataDots({
  data,
  tIndex,
}: {
  data: any;
  tIndex: number;
}) {
  const { positions, colors, sizes } = useMemo(() => {
    if (!data || !data.data)
      return {
        positions: new Float32Array(0),
        colors: new Float32Array(0),
        sizes: new Float32Array(0),
      };
    
    console.log('📊 DataDots: Processing data', { 
      dataPoints: data.data.length, 
      tIndex, 
      timestamps: data.meta?.timestamps?.length,
      currentTimestamp: data.meta?.timestamps?.[tIndex]
    });
    
    const pts = data.data as {
      lon: number;
      lat: number;
      values: number[];
    }[];
    
    const N = pts.length;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const siz = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const p = pts[i];
      const v = p.values[tIndex];
      const vec = lonLatToVec3Corrected(p.lon, p.lat, 1.05);
      pos.set([vec.x, vec.y, vec.z], i * 3);

      // Enhanced chlorophyll color scheme
      let c: THREE.Color;
      
      if (v == null || v === undefined) {
        c = new THREE.Color(0x333333); // Gray for missing data
      } else {
        // Normalize value between min and max
        const normalizedVal = Math.max(0, Math.min(1, (v - data.meta.min) / (data.meta.max - data.meta.min + 1e-9)));
        
        // Create color based on chlorophyll concentration
        // Low (blue) -> Medium (green) -> High (yellow/red)
        if (normalizedVal < 0.2) {
          c = new THREE.Color(0x000080); // Deep blue for low chlorophyll
        } else if (normalizedVal < 0.4) {
          c = new THREE.Color(0x0080FF); // Blue-green
        } else if (normalizedVal < 0.6) {
          c = new THREE.Color(0x00FF80); // Green
        } else if (normalizedVal < 0.8) {
          c = new THREE.Color(0x80FF00); // Yellow-green
        } else {
          c = new THREE.Color(0xFF4000); // Red for high chlorophyll
        }
      }
      
      // Add shimmer effect for animation
      const l = 0.1 * Math.sin(tIndex * 0.3 + i * 0.2);
      c.offsetHSL(0, 0, l);
      col.set([c.r, c.g, c.b], i * 3);

      // Size based on chlorophyll concentration
      const baseSize = 0.008;
      const sizeMultiplier = v == null ? 0.5 : Math.max(0.5, Math.min(2.0, (v - data.meta.min) / (data.meta.max - data.meta.min + 1e-9) * 1.5 + 0.5));
      siz[i] = baseSize * sizeMultiplier;
    }
    
    console.log('📊 DataDots: Generated', { 
      positions: pos.length, 
      colors: col.length, 
      sizes: siz.length,
      sampleValue: pts[0]?.values[tIndex],
      sampleColor: [col[0], col[1], col[2]]
    });
    
    return { positions: pos, colors: col, sizes: siz };
  }, [data, tIndex]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        sizeAttenuation 
        vertexColors 
        transparent 
        opacity={0.6} // More transparent than sea level dots
      />
    </points>
  );
}
"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { lonLatToVec3 } from "@/lib/lonlat";
import { colorFor } from "@/lib/colormap";

export default function DataDots({
  data,
  tIndex,
}: {
  data: any;
  tIndex: number;
}) {
  const { positions, colors, sizes } = useMemo(() => {
    if (!data)
      return {
        positions: new Float32Array(0),
        colors: new Float32Array(0),
        sizes: new Float32Array(0),
      };
    const pts = data.points as {
      lon: number;
      lat: number;
      vals: (number | null)[];
    }[];
    const N = pts.length;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const siz = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const p = pts[i],
        v = p.vals[tIndex];
      const vec = lonLatToVec3(p.lon, p.lat, 1.08);
      pos.set([vec.x, vec.y, vec.z], i * 3);

      const c = new THREE.Color(colorFor(v, data.meta.min, data.meta.max));
      // shimmer by index + time
      const l = 0.04 * Math.sin(tIndex * 0.25 + i * 0.15);
      c.offsetHSL(0, 0, l);
      col.set([c.r, c.g, c.b], i * 3);

      const base = 0.008;
      const t =
        v == null
          ? 0
          : Math.max(
              0,
              Math.min(
                1,
                (v - data.meta.min) / (data.meta.max - data.meta.min + 1e-9)
              )
            );
      siz[i] = base + 0.022 * t;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [data, tIndex]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} sizeAttenuation vertexColors transparent opacity={0.4} />
    </points>
  );
}
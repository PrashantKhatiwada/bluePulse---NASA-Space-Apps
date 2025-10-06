import * as THREE from "three";
import { easeInOut } from "./easing";
import { lonLatToVec3Corrected } from "./lonlat";

export function computeFlyPath(
  cameraPos: THREE.Vector3,
  lon: number,
  lat: number,
  distance = 2.6, // closer = more dramatic
  frames = 60
) {
  const look = new THREE.Vector3(0, 0, 0);
  const goal = lonLatToVec3Corrected(lon, lat, 1.0).normalize().multiplyScalar(distance);
  const start = cameraPos.clone();
  const path: THREE.Vector3[] = [];
  for (let i = 0; i < frames; i++) {
    const t = easeInOut(i / (frames - 1));
    path.push(
      start.clone().multiplyScalar(1 - t).add(goal.clone().multiplyScalar(t))
    );
  }
  return { path, look };
}

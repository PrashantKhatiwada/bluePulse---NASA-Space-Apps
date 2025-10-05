import * as THREE from 'three';

export function lonLatToVec3(lon: number, lat: number, radius = 1.01) {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180); // colatitude (0 to π)
  const theta = lon * (Math.PI / 180); // longitude (-π to π)
  
  // Standard spherical to Cartesian conversion
  // Note: This assumes the Earth texture is oriented with:
  // - Longitude 0° at the front (positive Z-axis)
  // - Latitude 0° at the equator
  // - Positive longitude going east (counter-clockwise when viewed from above)
  
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Debug function to test coordinate accuracy
export function debugCoordinates() {
  const testLocations = [
    { name: "Greenwich (0°, 51.5°)", lon: 0, lat: 51.5 },
    { name: "New York (-74°, 40.7°)", lon: -74, lat: 40.7 },
    { name: "Tokyo (139.7°, 35.7°)", lon: 139.7, lat: 35.7 },
    { name: "Sydney (151.2°, -33.9°)", lon: 151.2, lat: -33.9 }
  ];
  
  console.log("🌍 Coordinate Debug Test:");
  testLocations.forEach(loc => {
    const vec = lonLatToVec3(loc.lon, loc.lat);
    console.log(`${loc.name}:`, vec);
  });
}
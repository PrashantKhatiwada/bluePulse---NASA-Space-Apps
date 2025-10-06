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

// Corrected coordinate function for the Earth texture orientation
export function lonLatToVec3Corrected(lon: number, lat: number, radius = 1.01) {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180); // colatitude (0 to π)
  const theta = (-lon) * (Math.PI / 180); // longitude flipped for texture orientation
  
  // Corrected mapping for the Earth texture
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Alternative coordinate function that might account for texture orientation
export function lonLatToVec3Adjusted(lon: number, lat: number, radius = 1.01) {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180); // colatitude (0 to π)
  const theta = (lon + 180) * (Math.PI / 180); // longitude adjusted for texture orientation
  
  // Alternative mapping that might match the Earth texture better
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Debug function to test coordinate accuracy
export function debugCoordinates() {
  const testLocations = [
    { name: "Great Barrier Reef (147.6992°, -18.2871°)", lon: 147.6992, lat: -18.2871 },
    { name: "South Atlantic Gyre (-15°, -25°)", lon: -15, lat: -25 },
    { name: "NY Bight (-73.5°, 40.5°)", lon: -73.5, lat: 40.5 },
    { name: "Miami, FL (-80.1918°, 25.7617°)", lon: -80.1918, lat: 25.7617 },
    { name: "Venice, Italy (12.3155°, 45.4408°)", lon: 12.3155, lat: 45.4408 },
    { name: "Dhaka, Bangladesh (90.4125°, 23.8103°)", lon: 90.4125, lat: 23.8103 },
    { name: "Maldives (73.5093°, 4.1755°)", lon: 73.5093, lat: 4.1755 }
  ];
  
  console.log("🌍 Coordinate Debug Test with Correct Coordinates:");
  testLocations.forEach(loc => {
    const vec = lonLatToVec3(loc.lon, loc.lat);
    const vecCorr = lonLatToVec3Corrected(loc.lon, loc.lat);
    const vecAdj = lonLatToVec3Adjusted(loc.lon, loc.lat);
    console.log(`${loc.name}:`);
    console.log(`  Standard:`, vec);
    console.log(`  Corrected:`, vecCorr);
    console.log(`  Adjusted:`, vecAdj);
  });
}
import { nasaDataFetcher } from './nasaOfficialData';

export async function loadData() {
  try {
    console.log('🛰️ Loading official NASA Ocean Color Web data...');
    
    // Define key ocean locations for NASA data collection
    const oceanLocations = [
      { lon: 147.6992, lat: -18.2871 }, // Great Barrier Reef
      { lon: -15.0, lat: -25.0 },       // South Atlantic Gyre
      { lon: -73.5, lat: 40.5 },        // New York Bight
      { lon: -80.1918, lat: 25.7617 },  // Miami, FL
      { lon: 12.3155, lat: 45.4408 },   // Venice, Italy
      { lon: 90.4125, lat: 23.8103 },   // Dhaka, Bangladesh
      { lon: 73.5093, lat: 4.1755 },    // Maldives
      { lon: 139.7, lat: 35.6 },        // Tokyo Bay
      { lon: 4.9, lat: 52.3 },          // Amsterdam
      { lon: -74.0, lat: 40.7 },        // Manhattan
      { lon: 121.4, lat: 31.2 },        // Shanghai
      { lon: 106.8, lat: -6.2 },        // Jakarta
      { lon: 72.8, lat: 19.0 },         // Mumbai
      { lon: -122.4, lat: 37.8 },       // San Francisco Bay
      { lon: 2.2, lat: 48.9 },          // Paris (Seine)
      { lon: 151.2, lat: -33.9 },       // Sydney Harbor
      { lon: -43.2, lat: -22.9 },       // Rio de Janeiro
      { lon: 31.2, lat: 30.0 },         // Alexandria, Egypt
      { lon: 55.3, lat: 25.2 },         // Dubai
      { lon: -0.1, lat: 51.5 },         // London (Thames)
      { lon: 103.8, lat: 1.3 },         // Singapore
      { lon: 100.5, lat: 13.8 },        // Bangkok
      { lon: 77.2, lat: 28.6 },         // New Delhi
      { lon: 88.4, lat: 22.6 },         // Kolkata
      { lon: 80.2, lat: 13.1 },         // Chennai
      { lon: 78.5, lat: 17.4 },         // Hyderabad
      { lon: 75.8, lat: 26.9 },         // Jaipur
      { lon: 72.6, lat: 23.0 },         // Ahmedabad
      { lon: 77.6, lat: 12.9 },         // Bangalore
      { lon: 76.3, lat: 9.9 },          // Kochi
      { lon: 74.8, lat: 34.1 }          // Srinagar
    ];
    
    // Fetch official NASA chlorophyll data
    const nasaData = await nasaDataFetcher.fetchChlorophyllData(
      '2024-01-01', 
      '2024-12-31', 
      oceanLocations
    );
    
    console.log('✅ Official NASA data loaded successfully:', {
      source: nasaData.meta.source,
      dataPoints: nasaData.data.length,
      timestamps: nasaData.meta.timestamps.length,
      documentation: nasaData.meta.officialDocumentation
    });
    
    return nasaData;
    
  } catch (error) {
    console.error('❌ Failed to load official NASA data, falling back to local data:', error);
    
    // Fallback to local data if NASA API fails
    try {
      const res = await fetch('/chlorophyll_data.json');
      const localData = await res.json();
      console.log('📊 Using local fallback data');
      return localData;
    } catch (fallbackError) {
      console.error('❌ Fallback data also failed:', fallbackError);
      throw new Error('Unable to load any data source');
    }
  }
}
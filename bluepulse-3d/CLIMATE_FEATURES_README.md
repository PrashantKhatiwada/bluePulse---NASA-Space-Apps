# BluePulse 3D - Climate Impact Simulator

An interactive 3D visualization tool that raises awareness about global warming and sea level rise through immersive data visualization.

## 🌍 Features

### Core Visualization
- **3D Earth Globe**: Interactive rotating Earth with realistic textures
- **Ocean Data**: Real-time ocean temperature and chlorophyll data visualization
- **Atmospheric Effects**: Dynamic atmosphere rendering for immersive experience

### Climate Impact Features
- **Sea Level Rise Projections**: Interactive simulation of sea level rise scenarios
- **Global Temperature Display**: Current world surface temperature monitoring
- **Vulnerable Locations**: 6 key global locations at risk from sea level rise:
  - Miami, Florida (High vulnerability)
  - Venice, Italy (Extreme vulnerability)
  - Dhaka, Bangladesh (Extreme vulnerability)
  - Maldives (Extreme vulnerability)
  - Tokyo, Japan (High vulnerability)
  - Amsterdam, Netherlands (High vulnerability)

### Interactive Controls
- **Temperature Scenarios**: Choose from different global warming scenarios (+1°C to +4°C)
- **Time Projections**: Project sea level rise from 2024 to 2100
- **Location Navigation**: Click on locations to view detailed information
- **Play/Pause Controls**: Control animation playback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bluepulse-3d/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Use

### Basic Navigation
- **Mouse**: Click and drag to rotate the Earth
- **Scroll**: Zoom in/out
- **Location Buttons**: Click buttons in the left panel to fly to specific locations

### Climate Simulation
1. **Select Temperature Scenario**: Use the dropdown in the right panel to choose a warming scenario
2. **Adjust Timeline**: Use the slider to project sea level rise for different years
3. **View Projections**: See real-time calculations of projected sea level rise
4. **Click Locations**: Click on colored markers on the globe to view location details

### Understanding the Data
- **Red Markers**: Extreme vulnerability locations
- **Orange Markers**: High vulnerability locations
- **Marker Size**: Proportional to population at risk
- **Projected Rise**: Calculated based on current rates and temperature scenarios

## 📊 Data Sources

The application uses scientifically-based projections for:
- Current global temperature: 14.8°C
- Sea level rise rate: 3.3 mm/year
- Location-specific vulnerability assessments
- IPCC-based temperature scenario multipliers

## 🎯 Educational Purpose

This tool is designed to:
- **Raise Awareness**: Make climate change impacts tangible and visible
- **Interactive Learning**: Allow users to explore different scenarios
- **Global Perspective**: Show worldwide impacts of sea level rise
- **Urgency Communication**: Highlight the need for immediate action

## 🛠️ Technical Details

### Built With
- **Next.js 14**: React framework
- **Three.js**: 3D graphics rendering
- **React Three Fiber**: React integration for Three.js
- **TypeScript**: Type-safe development

### Key Components
- `GlobeCanvas.tsx`: Main 3D scene management
- `SeaLevelMarkers.tsx`: Sea level visualization markers
- `ClimateControlPanel.tsx`: Interactive control interface
- `DataDots.tsx`: Ocean data visualization

### Data Structure
- `sea_level_data.json`: Location data and projections
- `sample_ocean.json`: Ocean temperature data

## 🌟 Features in Detail

### Sea Level Rise Simulation
- **Current Rate**: Based on 3.3mm/year global average
- **Scenario Multipliers**: 
  - +1°C: 1.5x current rate
  - +2°C: 2.2x current rate
  - +3°C: 3.5x current rate
  - +4°C: 5.0x current rate

### Location Vulnerability Assessment
- **Population Data**: Real population figures for impact assessment
- **Elevation Risk**: Based on actual elevation data
- **Historical Context**: Known flooding events and risks

### Interactive Timeline
- **2024-2100**: 76-year projection window
- **Real-time Updates**: Instant recalculation of projections
- **Visual Feedback**: Color-coded risk levels

## 🎨 Customization

### Adding New Locations
Edit `sea_level_data.json` to add new vulnerable locations:
```json
{
  "id": "new_location",
  "name": "City Name",
  "coordinates": { "longitude": 0.0, "latitude": 0.0 },
  "currentSeaLevel": 0.0,
  "seaLevelRise": 3.0,
  "vulnerability": "high",
  "population": 1000000,
  "description": "Location description"
}
```

### Modifying Scenarios
Update temperature scenarios in the data file:
```json
{
  "name": "Custom Scenario",
  "description": "Custom description",
  "tempIncrease": 2.5,
  "seaLevelRiseMultiplier": 2.8
}
```

## 🚨 Climate Alert

This visualization demonstrates the urgent need for climate action. The projections shown are based on current scientific understanding and highlight the critical importance of:

- **Reducing Emissions**: Immediate action needed
- **Adaptation Planning**: Coastal cities must prepare
- **Global Cooperation**: International climate agreements essential
- **Public Awareness**: Education and engagement crucial

## 📈 Future Enhancements

- Real-time data integration
- Additional climate variables
- More detailed regional projections
- VR/AR support
- Mobile optimization

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional vulnerable locations
- Enhanced data visualization
- Improved mobile experience
- Accessibility features
- Performance optimizations

## 📄 License

This project is created for educational and awareness purposes. Please use responsibly and cite appropriately when using climate data.

---

**Remember**: This is a visualization tool for awareness and education. For official climate data and projections, please refer to authoritative sources like IPCC, NOAA, and NASA.

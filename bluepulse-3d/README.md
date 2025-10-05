# BluePulse 3D 🌊🌍

A stunning, interactive 3D ocean data visualization built with React, Next.js, and Three.js. Experience ocean temperature anomalies on a beautiful spinning globe with atmospheric effects and animated data points.

![BluePulse 3D](https://img.shields.io/badge/React-18-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Three.js](https://img.shields.io/badge/Three.js-0.158-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- **🌍 Interactive 3D Globe**: Spinning Earth with realistic textures and atmospheric glow
- **📊 Animated Data Visualization**: Ocean temperature data points that animate over time
- **🎮 Camera Presets**: Dramatic storytelling with predefined camera positions
- **⏯️ Play/Pause Controls**: Control the animation timeline with intuitive controls
- **📈 Real-time Statistics**: Live statistics panel showing min/max/average values
- **🎨 Beautiful UI**: Modern glass-morphism design with smooth animations
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd bluepulse-3d/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add Earth texture (recommended for realistic look):**
   - **Option A**: Run the download script: `download_earth_texture.bat` (Windows) or `download_earth_texture.sh` (Mac/Linux)
   - **Option B**: Manual download from [NASA Visible Earth](https://visibleearth.nasa.gov/images/73934/blue-marble-2012)
   - **Option C**: Use any equirectangular Earth texture and place it in `web/public/earth_day_8k.jpg`
   - **Note**: Without a texture, the globe will show a blue ocean fallback (still looks good!)

4. **Add space background (optional):**
   - Download a starfield/space background image
   - Place it in `web/public/space_bg.jpg`

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
bluepulse-3d/
├── README.md                 # This file
├── data/                     # Sample data
│   └── sample_ocean.json    # Ocean temperature data (copied to web/public/)
└── web/                      # Next.js application
    ├── package.json
    ├── next.config.mjs
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/                # Static assets
    │   ├── earth_day_8k.jpg   # Earth texture (you need to add this)
    │   ├── space_bg.jpg       # Space background (optional)
    │   └── sample_ocean.json  # Ocean data (copied from data/)
    └── src/
        ├── app/              # Next.js app directory
        │   ├── layout.tsx
        │   ├── page.tsx
        │   └── globals.css
        ├── components/       # React components
        │   ├── GlobeCanvas.tsx    # Main 3D canvas
        │   ├── Globe.tsx          # Earth sphere
        │   ├── Atmosphere.tsx     # Atmospheric glow
        │   ├── DataDots.tsx       # Animated data points
        │   ├── HUD.tsx           # User interface overlay
        │   └── Timebar.tsx       # Timeline controls
        └── lib/              # Utility functions
            ├── lonlat.ts         # Coordinate conversion
            ├── colormap.ts       # Color mapping
            ├── dataLoader.ts     # Data loading utilities
            └── easing.ts        # Animation easing functions
```

## 🎮 Controls

### Mouse/Touch Controls
- **Rotate**: Click and drag to rotate the globe
- **Zoom**: Scroll wheel or pinch to zoom in/out
- **Pan**: Right-click and drag (disabled by default for better UX)

### UI Controls
- **▶️ Play/Pause**: Start or stop the animation
- **Timeline Slider**: Jump to any point in time
- **Camera Presets**: Switch between different viewing angles
  - Overview: Default wide view
  - North Pole: Top-down Arctic view
  - Pacific: Focus on Pacific Ocean
  - Atlantic: Focus on Atlantic Ocean

## 📊 Data Format

The application expects ocean data in the following JSON format:

```json
{
  "metadata": {
    "title": "Ocean Temperature Anomalies",
    "description": "Description of your data",
    "timeRange": {
      "start": "2023-01-01",
      "end": "2023-12-31",
      "interval": "monthly"
    },
    "dataType": "temperature_anomaly",
    "unit": "celsius"
  },
  "timestamps": [
    "2023-01-01T00:00:00Z",
    "2023-02-01T00:00:00Z"
  ],
  "dataPoints": [
    {
      "id": "unique_id",
      "name": "Location Name",
      "coordinates": {
        "longitude": -40.0,
        "latitude": 50.0
      },
      "values": [0.8, 0.6, 0.4]
    }
  ]
}
```

## 🎨 Customization

### Colors and Styling
- Modify `src/lib/colormap.ts` to change the temperature color scheme
- Update `src/app/globals.css` for custom styling
- Adjust UI colors in component files

### Animation Speed
- Change `animationSpeed` prop in `DataDots` component
- Modify `rotationSpeed` in `Globe` component
- Adjust timeline interval in `Timebar` component

### Camera Presets
- Add new camera positions in `GlobeCanvas.tsx`
- Modify existing presets for different viewing angles

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Data Types**: Extend the data format and update color mapping
2. **Additional Visualizations**: Create new components in `src/components/`
3. **New Camera Modes**: Add camera presets and transitions
4. **Enhanced UI**: Modify HUD and Timebar components

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Troubleshooting

### Common Issues

1. **Globe not loading**: Make sure you've added `earth_day_8k.jpg` to the `web/public` folder
2. **Data not displaying**: Check that `sample_ocean.json` is in the `web/public` folder
3. **"Failed to load data" error**: Ensure the data file is in `web/public/sample_ocean.json`
4. **Performance issues**: Reduce the number of data points or lower texture resolution
5. **Mobile issues**: Ensure touch controls are working properly

### Performance Tips

- Use lower resolution textures for better performance
- Reduce the number of data points for smoother animation
- Enable hardware acceleration in your browser
- Close other tabs to free up memory

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for ocean data visualization**

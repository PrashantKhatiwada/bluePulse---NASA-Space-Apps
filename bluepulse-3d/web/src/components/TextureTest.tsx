'use client';

import { useEffect, useState } from 'react';

export default function TextureTest() {
  const [textureStatus, setTextureStatus] = useState('Checking...');

  useEffect(() => {
    // Simple check - just try to create an image element
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Image loaded successfully');
      setTextureStatus('✅ Image accessible');
    };
    
    img.onerror = () => {
      console.log('❌ Image failed to load');
      setTextureStatus('❌ Image not found');
    };
    
    img.src = '/earth_day_8k.jpg';
  }, []);

  return (
    <div className="text-xs text-gray-400 mt-2">
      Texture: {textureStatus}
    </div>
  );
}

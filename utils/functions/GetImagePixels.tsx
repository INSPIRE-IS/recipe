import { useState, useEffect } from 'react';

interface PixelData {
  width: number;
  height: number;
  data: Uint8Array;
}

const useImagePixels = (image: string) => {
  const [pixelData, setPixelData] = useState<PixelData | null>(null);

  useEffect(() => {
    const getImagePixels = async () => {
      if (!image) {
        console.log('No image selected');
        return;
      }

      try {
        // Your image processing logic goes here

        // Example: Setting pixel data
        const width = 100; // Example width
        const height = 100; // Example height
        const data = new Uint8Array(width * height); // Example pixel data
        setPixelData({ width, height, data });
      } catch (error) {
        console.log('Error processing image:', error);
      }
    };

    getImagePixels();
  }, [image]);

  return pixelData;
};

export default useImagePixels;

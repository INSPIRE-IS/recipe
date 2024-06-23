import { useRef, useEffect } from 'react';
import { Image } from 'react-native';

const CCanvasContext = (base64ImageData) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    console.log('component canvas context');
    const loadImage = async () => {
        console.log('base64ImageData', base64ImageData);
      if (!base64ImageData) return;

      // Create a new Image object
      const img = new Image();
      
      img.onload = () => {
        // Get the context of the canvas
        const ctx = canvasRef.current.getContext('2d');
        
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, 304, 100);

        // Save the canvas context
        contextRef.current = ctx;
      };
      console.log('base64ImageData', base64ImageData);
      // Set the source of the image to the base64 data
      img.src = 'data:image/png;base64,' + base64ImageData;
    };

    loadImage();
  }, [base64ImageData]);

  const getContext = () => {
    return contextRef.current;
  };

  return getContext;
};

export default CCanvasContext;
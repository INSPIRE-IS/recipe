import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import Canvas from 'react-native-canvas';

const CSignatureCanvas = ({imageUrl: string=''}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawSignature = async (ctx) => {
      // Load the signature PNG image
      if (imageUrl != '') return; // If no image URL is provided, do nothing
        const image = new Image();

        image.src = imageUrl;// './path/to/signature.png'

        // Wait for the image to load
        await new Promise(resolve => {
          image.onload = resolve;
        });

        // Draw the signature image onto the canvas
        ctx.drawImage(image, 0, 0);

        // Example: Draw additional elements on top of the signature
        ctx.font = '20px Arial';
        ctx.fillText('Additional text', 10, 30);

    };
    console.log('canvas ', 'canvas');
    const canvas = canvasRef.current;
    console.log('canvas ', canvas);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      console.log('ctx ', ctx);
      if (ctx) {
        drawSignature(ctx);
      }
    }
  }, [imageUrl]);

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        ref={canvasRef}
        style={{ flex: 1 }}
        // Specify canvas dimensions if necessary
        // width={300}
        // height={150}
      />
    </View>
  );
};

export default CSignatureCanvas;
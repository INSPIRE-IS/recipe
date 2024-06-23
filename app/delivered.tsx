import React, { useRef, useEffect, useState } from 'react';
import {TextInput,  View, Alert,StyleSheet,Image } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';
import { btoa, atob, fromByteArray, toByteArray } from 'react-native-quick-base64';
import resizeImage from '../utils/functions/ResizeImage';
import getImageDimensions from '../utils/functions/GetImageDimensions';
import useImagePixels from '../utils/functions/GetImagePixels';

import CButton from '@/components/CButton';

const Page = () => {
  const [image, setImage] = useState('');
  const pixelData = useImagePixels(image);
  const canvasRef = useRef<Canvas>(null);
  const signatureRef = useRef<SignatureViewRef>(null);
  const [name, setName] = useState<string>('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleOK = async (signature: string) => {
    if (signature === 'Empty') {
      Alert.alert('Signature required!', 'Please provide a signature.');
      return;
    }
    const newWidth = 304; // New width for the resized image
    const newHeight = 100; // New height for the resized image
    const base64String = signature; // "your_base64_image_string_here";

    setImage(signature); // Set the captured signature as the image


    resizeImage(base64String, newWidth, newHeight)
    .then(resizedBase64 => {
      const dataUrl = `data:image/png;base64, ${resizedBase64}`;          

      setSignatureData(dataUrl);
      const mimeType = "image/png"; // or "image/jpeg", or whichever format your image is in
      getImageDimensions(dataUrl, mimeType)
      .then(dimensions => {
        console.log("Image out dimensions:", dimensions);
      })
      .catch(error => {
        console.error("Error getting image dimensions:", error);
      });
    })
    .catch(error => {
      console.error('Error resizing image:', error);
    });
    //setSignatureData(signature);
  };

  const handleClear = () => {
    setSignatureData(null);
    signatureRef.current?.clearSignature();
  };
  
 useEffect(() => {
    if (canvasRef.current && signatureData) {
      const drawImage = async (canvas: Canvas) => {
        const ctx = canvas.getContext('2d');
        canvas.width = 304;
        canvas.height = 100;
        const image = new CanvasImage(canvas);
        image.src = signatureData;
      
        image.addEventListener('load', async () => {
          ctx.drawImage(image, 0, 0, 304, 100);
      
          console.log('Canvas:', canvas);
      
          try {
            const imageDataPromise = ctx.getImageData(0, 0, 304, 100);
            const imageData = await imageDataPromise;
      
            const { data } = imageData;
            console.log('Pixel data length:', data.length);
      
            //if (data) {
              for (let i = 0; i < data.length; i += 4) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
              }
              // Create a new ImageData object with the modified pixel data
              const modifiedImageData = new ImageData(data, imageData.width, imageData.height);

              // Put the modified image data back onto the canvas
              ctx.putImageData(modifiedImageData, 0, 0);      
              const pixelsArray = new Uint8ClampedArray(data);
              console.log('Pixels array:', pixelsArray);
            //}
          } catch (error) {
            console.error('Error obtaining ImageData:', error);
          }
        });
      };
      
    }
  }, [signatureData]);

  // useEffect(() => {
  //   if (canvasRef.current && signatureData) {
  //     const drawImage = async (canvas: Canvas) => {
  //       const ctx = canvas.getContext('2d');
  //       canvas.width = 304;
  //       canvas.height = 100;
  //       const image = new CanvasImage(canvas);
  //       image.src = signatureData;
  
  //       // Wait for the image to load
  //       image.addEventListener('load', async () => {
  //         // Draw the image onto the canvas
  //         ctx.drawImage(image, 0, 0, 304, 100);
  
  //         // Log the canvas element
  //         console.log('Canvas:', canvas);
  
  //         // Retrieve the pixel data
  //         // const imageData: import('react-native-canvas').ImageData = await new Promise<ImageData>((resolve) => {
  //         //   resolve(ctx.getImageData(0, 0, 304, 100) as any); // Cast to any to avoid type mismatch
  //         // });

  //         // Retrieve the pixel data
  //         // const imageData: any = await new Promise<any>((resolve) => {
  //         //   resolve(ctx.getImageData(0, 0, 304, 100) as any); // Cast to any to avoid type mismatch
  //         // });
  //         // const imageDataPromise = new Promise<ImageData>((resolve) => {
  //         //   ctx.getImageData(0, 0, 304, 100).then((imageData: any) => { // Cast to any to avoid type mismatch
  //         //     resolve(imageData);
  //         //   });
  //         // });
  //         // const imageData: ImageData = await imageDataPromise;          
  //         //const imageData = ctx.getImageData(0, 0, 304, 100);
  //         // Log the imageData object
  //         //console.log('ImageData:', imageData);
  //         // Access pixel data from imageData
  //         //const { data } = imageData;
  //         const imageDataPromise = ctx.getImageData(0, 0, 304, 100);

  //         imageDataPromise.then((imageData: any) => {
  //           // Now, imageData should be of type ImageData without any issues.
  //           const { data } = imageData;
  //           console.log('Pixel data length:', data.length);
  //           // Check if data is available before manipulation
  //           if (data) {
  //             // Manipulate the pixel data if needed
  //             for (let i = 0; i < data.length; i += 4) {
  //               data[i] = 0;   // Red
  //               data[i + 1] = 0; // Green
  //               data[i + 2] = 0; // Blue
  //             }

  //             // Create a new ImageData object with the modified pixel data
  //             //const modifiedImageData = new ImageData(data, imageData.width, imageData.height);

  //             // Put the modified image data back onto the canvas
  //             //ctx.putImageData(modifiedImageData, 0, 0);

  //             // Convert pixel data to Uint8ClampedArray
  //             const pixelsArray = new Uint8ClampedArray(data);
  //             console.log('Pixels array:', pixelsArray);
  //           }

  //         }).catch((error) => {
  //           console.error('Error obtaining ImageData:', error);
  //         });
  //       });
  //     };
  //     drawImage(canvasRef.current);
  //   }
  // }, [signatureData]);
  
  
  


  const handleSubmit = async() => {
    try {
      if (name === '' || signatureData === '') {
        alert("Name and Signature required.");
        return;
      }
  
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
  
        // Ensure that the canvas has content
        if (ctx) {
          // Wait for any pending rendering to finish
          await new Promise(resolve => {
            requestAnimationFrame(resolve);
          });
          console.log('ctx:', ctx);
  
          const imageData = await ctx.getImageData(0, 0, canvas.width, canvas.height);
  
          // Log the imageData object to inspect its contents
          console.log('ImageData:', imageData);
  
          // Access pixel data from imageData
          const { data } = imageData;
  
          // Log the length of pixel data array to verify if it's empty or not
          console.log('Pixel data length:', data.length);
  
          // Manipulate the pixel data if needed
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 0;   // Red
            data[i + 1] = 0; // Green
            data[i + 2] = 0; // Blue
          }
  
          // Create a new ImageData object with the modified pixel data
          const modifiedImageData = new ImageData(data, imageData.width, imageData.height);
  
          // Put the modified image data back onto the canvas
          ctx.putImageData(modifiedImageData, 0, 0);
  
          // Convert pixel data to Uint8ClampedArray
          const pixelsArray = new Uint8ClampedArray(data);
          console.log('Pixels array:', pixelsArray);

        } else {
          console.error('Canvas context not available.');
        }
      } else {
        console.error('Canvas reference not available.');
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };
  

  return (
    <View style={styles.container}>
      {!signatureData ? (
        <View style={{ width: 304, height: 400, borderWidth: 2, borderColor: '#999', marginBottom: 210 }}>
          <SignatureCanvas
            ref={signatureRef}
            onOK={handleOK}
            penColor='black'
            backgroundColor="#FFFFFF"
            autoClear={true}
            descriptionText={'Approval Signature'}
          />
        </View>
      ) : (
        <View style={{ width: 304, height: 400, marginBottom: 210, backgroundColor:'black' }}>
        <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#999"
        onChangeText={text => setName(text)}
      />
{imageSrc && <Image source={{ uri: imageSrc }} style={styles.image} />}
          <Canvas ref={canvasRef} />
          <View style={{marginBottom:200,flexDirection:'row'}}>
                    <CButton icon='trash-can' title='Clear' onPress={handleClear} marginRight={10} ></CButton>
                    <CButton icon='check-bold' title='Done' onPress={handleSubmit} ></CButton>
                </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    width:'80%'
},
image: {
    width: 304,
    height: 200,
},
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#222',
    color: '#fff',
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 50,
    marginBottom: 20,
  },
});

export default Page;

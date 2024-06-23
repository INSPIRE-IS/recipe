// import { ImageManipulator } from 'expo-image-utils';

// // Function to convert base64 string to image pixels
// const getPixelsFromBase64 = async (base64String: string): Promise<Uint8ClampedArray | null> => {
//   try {
//     // Manipulate the image to extract pixel data
//     const result = await ImageManipulator.manipulateAsync(
//       base64String,
//       [{ grayscale: true }], // You can add other manipulations if needed
//       { format: 'png', base64: true }
//     );

//     // Check if manipulation was successful and extract pixel data
//     if (result.base64) {
//       // Decode base64 string to Uint8ClampedArray
//       const binaryString = atob(result.base64);
//       const length = binaryString.length;
//       const bytes = new Uint8Array(length);

//       for (let i = 0; i < length; i++) {
//         bytes[i] = binaryString.charCodeAt(i);
//       }

//       return bytes;
//     } else {
//       console.error('Image manipulation failed.');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error processing image:', error);
//     return null;
//   }
// };
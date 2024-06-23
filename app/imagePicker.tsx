import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { btoa, atob, fromByteArray, toByteArray } from 'react-native-quick-base64';
interface PixelData {
  width: number;
  height: number;
  data: Uint8Array;
}

const Page = () => {
  const [image, setImage] = useState<string | null>(null);
  const [pixelData, setPixelData] = useState<PixelData | null>(null);

  const getImagePixels = async () => {
    if (!image) {
      console.log('No image selected');
      return;
    }
    //console.log('image ', image);
    try {
      const response = await fetch(image);
      //console.log('-------------- response -----------------', response);
      const blob = await response.blob();
      //console.log('--------------blob ----------------', blob);
      let base64String = await blobToBase64(blob);
      if(base64String.length % 4 == 3){base64String = base64String + '='}
      else if(base64String.length % 4 == 2){base64String = base64String + '=='}
      else if(base64String.length % 4 == 1){base64String = base64String + '==='}




      // Decode base64 string
      const bytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
      // console.log('----------------------base64String ', base64String);
      // console.log('----------------------base64String ', base64String.length % 4);      
      // return;
      // Assuming image is PNG format
      if(true){
          const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
          const pngHeader = bytes.slice(0, 8);
          console.log(pngSignature);
          console.log(pngHeader);
          if (arraysEqual(pngSignature, pngHeader)) {
            // Extract width and height from PNG header
            const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
            console.log('----------------------width ', width);
            const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
            console.log('----------------------height ', height);
            // Pixel data starts at byte offset 33 in PNG format
            const pixelData = bytes.slice(33);
            setPixelData({ width, height, data: pixelData });
          } else {
            console.log('Unsupported image format');
          }        
      }
      if(false){
        const jpegSignature = new Uint8Array([255, 216, 255]); // JPEG signature
        const jpegHeader = bytes.slice(0, 3); // Extract the first 3 bytes
        
        if (arraysEqual(jpegSignature, jpegHeader)) { 
          let offset = 4; // Start after the SOI marker

          while (offset < bytes.length) {
              const marker = bytes[offset] << 8 | bytes[offset + 1];
      
              if (marker === 0xFFE1) { // APP1 marker
                  const length = bytes[offset + 2] << 8 | bytes[offset + 3];
                  const identifier = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
                  
                  if (identifier === "Exif") {
                      // Found the Exif APP1 marker containing metadata
                      const byteOrder = String.fromCharCode(...bytes.slice(offset + 10, offset + 12));
                      const isLittleEndian = byteOrder === "II"; // "II" indicates little endian, "MM" indicates big endian
                      
                      // You need to parse the Exif metadata to extract width and height
                      // This involves reading the IFD (Image File Directory) structure
                      
                      // Example: extract width and height from Exif IFD
                      const tagCount = bytes[offset + 14] << 8 | bytes[offset + 15];
                      let currentOffset = offset + 16; // Start of IFD
                      let width, height;
      
                      for (let i = 0; i < tagCount; i++) {
                          // Read each tag and extract relevant information
                          // You need to identify the tags containing width and height information
                          // Usually, they have tag IDs 0x0100 (for width) and 0x0101 (for height)
      
                          // Example code to extract width and height from Exif IFD
                          const tagId = bytes[currentOffset] << 8 | bytes[currentOffset + 1];
                          const format = bytes[currentOffset + 2] << 8 | bytes[currentOffset + 3];
                          const components = bytes[currentOffset + 4] << 24 | bytes[currentOffset + 5] << 16 | bytes[currentOffset + 6] << 8 | bytes[currentOffset + 7];
                          const valueOffset = bytes[currentOffset + 8] << 24 | bytes[currentOffset + 9] << 16 | bytes[currentOffset + 10] << 8 | bytes[currentOffset + 11];
                          
                          if (tagId === 0x0100) { // Width tag
                              if (format === 3 && components === 1) { // Unsigned short (16-bit) format
                                  width = isLittleEndian ? (bytes[valueOffset] << 8 | bytes[valueOffset + 1]) : (bytes[valueOffset + 1] << 8 | bytes[valueOffset]);
                              }
                          } else if (tagId === 0x0101) { // Height tag
                              if (format === 3 && components === 1) { // Unsigned short (16-bit) format
                                  height = isLittleEndian ? (bytes[valueOffset] << 8 | bytes[valueOffset + 1]) : (bytes[valueOffset + 1] << 8 | bytes[valueOffset]);
                              }
                          }
      
                          currentOffset += 12; // Move to the next tag
                      }
      
                      if (width !== undefined && height !== undefined && pixelData != null) {
                          //setPixelData({ width, height, data: pixelData });
                          break; // Exit the loop since width and height are found
                      }
                  }
              }
      
              offset += 2 + (bytes[offset + 2] << 8 | bytes[offset + 3]); // Move to the next marker
          }
      
          //console.log('----------------------width ', width);
          //console.log('----------------------height ', height);
        } else {
          console.log('Unsupported image format');
        }         
      }



    } catch (error) {
      console.log('Error processing image:', error);
    }
  };

  const arraysEqual = (a: Uint8Array, b: Uint8Array) => {
    const response = JSON.stringify(Array.from(a)) === JSON.stringify(Array.from(b));
    return (response);
  };

  const blobToBase64 = async (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('-------------------reader-------------');
        console.log('-------------------reader-------------', typeof reader.result);
        if (typeof reader.result === 'string') {
          //let out = reader.readAsDataURL(blob);
          console.log('-------------out------------', blob);
          resolve(reader.result);
        } else {
          reject('Failed to convert blob to base64');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("result ", result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);//
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Get Image Pixels" onPress={getImagePixels} />
      {pixelData && (
        <View>
          <Text>Width: {pixelData.width}</Text>
          <Text>Height: {pixelData.height}</Text>
          {/* Render pixel data or use it as needed */}
        </View>
      )}
    </View>
  );
}

export default Page;

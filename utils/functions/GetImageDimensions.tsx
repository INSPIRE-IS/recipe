import { Image } from 'react-native';

const getImageDimensions = (base64String: string, mimeType: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
      //const dataUri = `data:${mimeType};base64,${base64String}`;
      Image.getSize(base64String, (width, height) => {
        resolve({ width, height });
      }, error => {
        reject(error);
      });
    });
  };

export default getImageDimensions;
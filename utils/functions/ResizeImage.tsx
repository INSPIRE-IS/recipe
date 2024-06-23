import * as ImageManipulator from 'expo-image-manipulator';

const resizeImage = async (base64String: string, width: number, height: number): Promise<string> => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(base64String, [{ resize: { width, height } }], 
        {
      compress: 1, // 1 means no compression, adjust as needed
      // format: 'jpeg', // Output format, can be 'jpeg' or 'png'
      base64: true, // Return base64 representation
    });
    return resizedImage.base64!;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export default resizeImage;
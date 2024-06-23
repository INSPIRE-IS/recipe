import React from 'react';
import { View, Image } from 'react-native';

class BlobImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null
    };
  }

  componentDidMount() {
    // Assuming 'blob' contains the Blob object
    const { blob } = this.props;
    
    // Check if blob has data
    if (blob.size > 0) {
      // Convert Blob to URL
      const imageUrl = URL.createObjectURL(blob);
      this.setState({ imageUrl });
    }
  }

  render() {
    const { imageUrl } = this.state;

    return (
      <View>
        {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }
}

export default BlobImage;
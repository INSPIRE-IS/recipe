// SignatureCanvas.tsx

import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import SignatureCanvas, {SignatureViewRef} from 'react-native-signature-canvas';


interface SignatureCanvasProps {
  onGetData: (dataUrl: string) => void;
}

const SignatureCanvasComponent: React.FC<SignatureCanvasProps> = ({ onGetData }) => {
    //const signatureRef = useRef<SignatureViewRef>(null);
    const signatureRef = useRef<SignatureViewRef>(null);

  const handleGetData = async () => {
    if (signatureRef.current) {
      signatureRef.current.readSignature();

    }
  };

  const handleSignature = (dataUrl: string) => {
    onGetData(dataUrl);
  };

  return (
    <View style={{ flex: 1,backgroundColor:'blue',width:'100%' }}>
      <SignatureCanvas
        ref={signatureRef}
        onOK={handleSignature}
        onEmpty={() => console.log('empty')}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={`.m-signature-pad--footer {display: none;}`}
        style={{backgroundColor:'white',width:'100%'}}
        backgroundColor="#FFFFFF"
        //strokeColor="#000000"
        //minStrokeWidth={5}
        //maxStrokeWidth={5}
        //canvasProps={{ width: 500, height: 200 }}
      />
      <Button title="Get Signature Data" onPress={handleGetData} />
    </View>
  );
};

export default SignatureCanvasComponent;

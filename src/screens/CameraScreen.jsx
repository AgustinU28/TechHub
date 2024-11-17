import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Camera } from 'expo-camera';  

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('back'); 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();  
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View><Text>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} />  {/* Usamos el valor 'back' o 'front' directamente */}
      <Button
        title="Flip Camera"
        onPress={() => {
         
          setType(type === 'back' ? 'front' : 'back');  
        }}
      />
    </View>
  );
};

export default CameraScreen;

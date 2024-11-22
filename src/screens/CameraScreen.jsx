import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CameraScreen() {
  const [image, setImage] = useState(null);

  // Solicitar permisos para acceder a la cámara
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  // Función para abrir la cámara y tomar una foto
  const openCamera = async () => {
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) {
      alert('Permission to access camera is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3], // Puedes ajustar el aspecto de la imagen
      quality: 1, // Calidad de la imagen
    });

    if (!result.canceled) {
      setImage(result.uri); // Aquí se almacena la URI de la imagen tomada
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={openCamera} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

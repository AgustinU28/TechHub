import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera'; 
import * as MediaLibrary from 'expo-media-library';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  let camera; 

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync(); 
      await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se concedieron permisos para la cámara.</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const photoData = await camera.takePictureAsync();
      setPhoto(photoData.uri);
    }
  };

  const savePhoto = async () => {
    if (photo) {
      await MediaLibrary.createAssetAsync(photo);
      alert('Foto guardada en la galería');
      setPhoto(null);
    }
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back} // Usar expo-camera para especificar la cámara
            ref={(ref) => { camera = ref; }} // Agregar la referencia
          />
          <TouchableOpacity onPress={takePicture} style={styles.button}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.previewText}>Vista previa</Text>
          <TouchableOpacity onPress={savePhoto} style={styles.button}>
            <Text style={styles.buttonText}>Guardar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPhoto(null)} style={styles.button}>
            <Text style={styles.buttonText}>Tomar otra foto</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '70%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default CameraScreen;

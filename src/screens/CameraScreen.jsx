import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="camera" size={60} color="#fff" />
          <Text style={styles.title}>Cámara</Text>
          <Text style={styles.subtitle}>Toma una foto increíble</Text>
        </View>

        <View style={styles.imageContainer}>
          {image ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={80} color="#ffffff60" />
              <Text style={styles.placeholderText}>Tu foto aparecerá aquí</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={openCamera}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.buttonGradient}
          >
            <Ionicons name="camera" size={28} color="#fff" />
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </LinearGradient>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setImage(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.retakeButtonText}>Tomar otra foto</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff90',
    marginTop: 5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffffff20',
    borderRadius: 25,
    padding: 5,
  },
  placeholderContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#ffffff20',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff30',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#ffffff70',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  cameraButton: {
    width: '100%',
    marginBottom: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  retakeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
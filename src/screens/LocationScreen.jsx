import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import Config from 'react-native-config';  

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación denegado');
        setErrorMsg('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (currentLocation) {
        setLocation(currentLocation);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error obteniendo la ubicación:", err);
      setErrorMsg('Error obteniendo la ubicación');
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (searchQuery.trim()) {
      try {
        // Usa la variable de entorno OPENCAGE_API_KEY
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=${Config.OPENCAGE_API_KEY}`);
        const data = await response.json();
        const firstResult = data.results[0];
        if (firstResult) {
          const { lat, lng } = firstResult.geometry;
          setSearchedLocation({ latitude: lat, longitude: lng });
        } else {
          Alert.alert('Ubicación no encontrada');
        }
      } catch (error) {
        console.error("Error al buscar ubicación:", error);
        Alert.alert('Error al buscar ubicación');
      }
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ubicación"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Buscar" onPress={searchLocation} />
      
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: searchedLocation ? searchedLocation.latitude : location.coords.latitude,
            longitude: searchedLocation ? searchedLocation.longitude : location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: searchedLocation ? searchedLocation.latitude : location.coords.latitude,
              longitude: searchedLocation ? searchedLocation.longitude : location.coords.longitude,
            }}
            title="Ubicación"
            description={searchedLocation ? "Ubicación buscada" : "Tu ubicación actual"}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 8,
  },
});

export default LocationScreen;

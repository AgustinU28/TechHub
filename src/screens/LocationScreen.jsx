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

  useEffect(() => {
    let locationSubscription;

    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Necesitamos permisos de ubicación para continuar');
          setErrorMsg('Permiso de ubicación denegado');
          setLoading(false);
          return;
        }

        const locationEnabled = await Location.hasServicesEnabledAsync();
        if (!locationEnabled) {
          Alert.alert('Error', 'Por favor activa el GPS');
          setErrorMsg('GPS desactivado');
          setLoading(false);
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            console.log('Nueva ubicación:', newLocation);
            setLocation(newLocation);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Error detallado:", err);
        setErrorMsg('Error obteniendo la ubicación: ' + err.message);
        setLoading(false);
      }
    };

    startLocationUpdates();

    // Limpieza al desmontar el componente
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const searchLocation = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=${Config.OPENCAGE_API_KEY}`
        );
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
        <Text style={styles.coordsText}>
          Lat: {location.coords.latitude.toFixed(4)}, 
          Lon: {location.coords.longitude.toFixed(4)}
        </Text>
      )}
      
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: searchedLocation ? searchedLocation.latitude : location.coords.latitude,
            longitude: searchedLocation ? searchedLocation.longitude : location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Marker
            coordinate={{
              latitude: searchedLocation ? searchedLocation.latitude : location.coords.latitude,
              longitude: searchedLocation ? searchedLocation.longitude : location.coords.longitude,
            }}
            title={searchedLocation ? "Ubicación buscada" : "Mi ubicación"}
            description={searchedLocation ? "Ubicación encontrada" : "Ubicación actual"}
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
  coordsText: {
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 1,
  },
});

export default LocationScreen;
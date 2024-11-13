import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AuthContext } from './AuthProvider'; // Asegúrate de que la ruta sea correcta

const LogoutButton = () => {
  const { signOut } = useContext(AuthContext); // Función para cerrar sesión

  const handleLogout = () => {
    signOut(); // Llama a la función para cerrar sesión
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.buttonText}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red', // Color de fondo rojo
    paddingVertical: 6, // Tamaño pequeño
    paddingHorizontal: 12, // Tamaño pequeño
    borderRadius: 12, // Bordes redondeados
    position: 'absolute', // Posición absoluta
    top: 10, // Colocarlo cerca de la parte superior
    right: 10, // Colocarlo cerca de la derecha
  },
  buttonText: {
    color: 'white', // Texto blanco
    fontSize: 14, // Fuente pequeña
    fontWeight: '600',
  },
});

export default LogoutButton;

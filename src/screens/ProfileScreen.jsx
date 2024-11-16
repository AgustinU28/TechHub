import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../components/AuthProvider';

const ProfileScreen = () => {
  const { currentUser, signOutUser } = useContext(AuthContext);

  const handleLogout = () => {
    signOutUser();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Bienvenido</Text>
      {currentUser && (
        <>
          <Text style={styles.info}> {currentUser.email}</Text>
        </>
      )}
      <Button title="Cerrar sesión" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProfileScreen;

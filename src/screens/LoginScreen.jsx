import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../components/AuthProvider';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (email === '' || password === '') {
      setError('Por favor, complete todos los campos');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      console.log('Usuario autenticado exitosamente');
      // Redirigir a CategorieScreen 
      navigation.replace('Categories');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.link}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

// Botón redondo con estilos ajustados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(92, 80, 91)', // Gris con RGB(92, 80, 91)
  },
  logo: {
    width: '80%',
    height: 150,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#333',
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25, // Esto hace que el botón sea redondeado
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    height: 50,  // Agregado para asegurar que el botón tenga altura y sea más "circular"
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
    color: 'white',
    textDecorationLine: 'underline',
  },
});


export default LoginScreen;

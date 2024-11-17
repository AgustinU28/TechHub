import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen.jsx';
import RegisterScreen from '../screens/RegisterScreen.jsx';
import ProductsScreen from '../screens/ProductsScreens.jsx'; 
import ProductDetailsScreen from '../screens/ProductDetailsScreen.jsx';
import TabNavigator from './TabNavigator.jsx'; 
import SearchScreen from '../screens/SearchScreen.jsx';  

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Pantalla de inicio de sesión */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Pantalla de registro */}
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ title: 'Registrarse' }}
      />

      {/* TabNavigator como pantalla principal post-login */}
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Pantallas adicionales que no están en el TabNavigator */}
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Buscar Productos' }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Detalles del Producto' }}
      />

      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Productos' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
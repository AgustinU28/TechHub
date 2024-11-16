import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen.jsx';
import RegisterScreen from '../screens/RegisterScreen.jsx';
import CategoriesScreen from '../screens/CategoriesScreens.jsx'; 
import ProductsScreen from '../screens/ProductsScreens.jsx'; 
import ProductDetailsScreen from '../screens/ProductDetailsScreen.jsx';
import TabNavigator from './TabNavigator.jsx'; 
import CartScreen from '../screens/CartScreen.jsx';  
import SearchScreen from '../screens/SearchScreen.jsx';  
import ProfileScreen from '../screens/ProfileScreen.jsx';
import CameraScreen from '../screens/CameraScreen.jsx';
import ReceiptScreen from '../screens/ReceiptScreen.jsx';  

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

      {/* Esto asegura que TabNavigator sea la primera pantalla que se muestre */}
  <Stack.Screen
    name="Categories"
    component={CategoriesScreen}
    options={{ headerShown: false }}
  />

  {/* TabNavigator se muestra directamente después de Categories */}
  <Stack.Screen
    name="TabNavigator"
    component={TabNavigator}
    options={{ headerShown: false }}
  />
      {/* Pantalla de búsqueda */}
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Buscar Productos' }}
      />

      {/* Pantalla de detalles del producto */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Detalles del Producto' }}
      />

      {/* Pantalla de carrito */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Carrito' }}
      />

      {/* Pantalla de Perfil */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />

      {/* Pantalla de Cámara */}
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Cámara' }}
      />

      {/* Pantalla de Receipt */}
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{ title: 'Recibo' }}  // Cambia el título si es necesario
      />

      {/* Pantalla de productos */}
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Productos' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;

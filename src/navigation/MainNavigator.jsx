import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CategoriesScreen from '../screens/CategoriesScreens.jsx'; 
import ProductsScreen from '../screens/ProductsScreens.jsx'; 
import ProductDetailsScreen from '../screens/ProductDetailsScreen.jsx';
import TabNavigator from './TabNavigator'; 
import CartScreen from '../screens/CartScreen';  
import SearchScreen from '../screens/SearchScreen';  // Importa tu SearchScreen

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

    

      {/* Pantalla de categorías que redirige al TabNavigator */}
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categorías' }}  // Título para la pantalla de categorías
      />

      {/* Esta es la pantalla de TabNavigator que será visible después de CategoriesScreen */}
      <Stack.Screen
        name="TabNavigator"  // Renombramos la pantalla a TabNavigator
        component={TabNavigator}
        options={{ headerShown: false }}  // Esconde el header en TabNavigator
      />

      {/* Pantalla de búsqueda */}
      <Stack.Screen
        name="Search"
        component={SearchScreen}  // Pantalla de búsqueda
        options={{ title: 'Buscar Productos' }}  // Título de la pantalla de búsqueda
      />

      {/* Pantalla de detalles del producto */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen} // Pantalla de detalles de productos
        options={{ title: 'Detalles del Producto' }}
      />

      {/* Pantalla de carrito */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}  // Pantalla de carrito
        options={{ title: 'Carrito' }}
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

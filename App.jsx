import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/components/CartContext';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/components/AuthProvider';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#6200ea" />
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

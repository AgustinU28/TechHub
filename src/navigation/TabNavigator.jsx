import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CategoriesScreen from '../screens/CategoriesScreens';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CameraScreen from '../screens/CameraScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import { AuthContext } from '../components/AuthProvider';
import LocationScreen from '../screens/LocationScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Categories') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Receipt') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {!currentUser && (
        <Tab.Screen
          name="Login"
          component={require('../screens/LoginScreen').default}
          options={{ tabBarLabel: 'Iniciar Sesión' }}
        />
      )}

      {currentUser && (
        <>
          <Tab.Screen name="Categories" component={CategoriesScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
          <Tab.Screen name="Camera" component={CameraScreen} options={{ tabBarLabel: 'Cámara' }} />
          <Tab.Screen name="Receipt" component={ReceiptScreen} options={{ tabBarLabel: 'Recibo' }} />
          <Tab.Screen 
  name="Location" 
  component={LocationScreen} 
  options={{ 
    tabBarLabel: 'Ubicación',
    tabBarIcon: ({ focused, color, size }) => {
      const iconName = focused ? 'location' : 'location-outline';
      return <Ionicons name={iconName} size={size} color={color} />;
    }
  }} 
/>
          
        </>
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;

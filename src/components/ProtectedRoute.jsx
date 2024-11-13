import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './AuthProvider';
import{ LoginScreen } from '../screens/LoginScreen.jsx';
import { CategoriesScreen } from '../screens/CategoriesScreen.jsx';

const Stack = createNativeStackNavigator();

const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <Stack.Screen
            name="Categories"
            component={CategoriesScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProtectedRoute;

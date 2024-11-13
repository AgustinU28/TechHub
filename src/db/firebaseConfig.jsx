import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';  // Solo importamos getDatabase

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBL_klK_Tm8VuDJR9UbbE1rWAWqGCdxOU",
  authDomain: "techhub-e1d6c.firebaseapp.com",
  databaseURL: "https://techhub-e1d6c-default-rtdb.firebaseio.com/",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar autenticación con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Inicializar base de datos
const database = getDatabase(app);  // Solo exportamos la instancia de la base de datos

// Exportar las instancias necesarias
export { auth, database };

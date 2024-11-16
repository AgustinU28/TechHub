import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  getReactNativePersistence 
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBL_klK_Tm8VuDJR9UbbE1rWAWqGCdxOU",
  authDomain: "techhub-e1d6c.firebaseapp.com",
  databaseURL: "https://techhub-e1d6c-default-rtdb.firebaseio.com/",
  projectId: "techhub-e1d6c",
  storageBucket: "techhub-e1d6c.appspot.com",
  messagingSenderId: "640860647955",
  appId: "1:640860647955:web:f3586812d4628d8a34c5e6"
};

// Inicializar Firebase App solo si no está inicializado
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializar Auth con persistencia solo si no está inicializado
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Inicializar Database
const db = getDatabase(app);

export { auth, db };
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyCgMei2Ex5N_2Pv8MaDAxsQVOJkOSzVpRY",
  authDomain: "ping-s6.firebaseapp.com",
  projectId: "ping-s6",
  storageBucket: "ping-s6.firebasestorage.app",
  messagingSenderId: "221732707599",
  appId: "1:221732707599:web:290e07dd8987c8c390b27a",
  measurementId: "G-SKHF0ENGKN",
};

// Initialize app once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Auth initialization that works with Expo / React Native hot reloads
let auth;
try {
  // If Auth already initialized, this returns it
  // auth = getAuth(app);

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // Otherwise, initialize it with persistence
  // auth = initializeAuth(app, {
  //   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  // });
}

export { auth };
export const db = getFirestore(app);

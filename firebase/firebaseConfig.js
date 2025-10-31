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
  apiKey: "ENTER_YOUR_API_KEY_HERE",
  authDomain: "ENTER_YOUR_AUTH_DOMAIN_HERE",
  projectId: "ENTER_YOUR_PROJECT_ID_HERE",
  storageBucket: "ENTER_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "ENTER_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "ENTER_YOUR_APP_ID_HERE",
  measurementId: "ENTER_YOUR_MEASUREMENT_ID_HERE",
};

// Initialize app once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

//Auth initialization that works with Expo / React Native hot reloads
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {}

export { auth };
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBG1p31Eu5yu5uKdgpD5_JOvcLhEoGnClo",
  authDomain: "messaging-1085d.firebaseapp.com",
  projectId: "messaging-1085d",
  storageBucket: "messaging-1085d.firebasestorage.app",
  messagingSenderId: "477384879299",
  appId: "1:477384879299:web:0b2ca2d5c7db9f98884676",
  measurementId: "G-Z9QSFLTWMR"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app); 
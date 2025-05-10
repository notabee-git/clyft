// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs} from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGQB7yVij76xemD6TXmdAAyoJIxi2cq5Q",
  authDomain: "clyft-b1b3c.firebaseapp.com",
  projectId: "clyft-b1b3c",
  storageBucket: "clyft-b1b3c.firebasestorage.app",
  messagingSenderId: "1031487130849",
  appId: "1:1031487130849:web:a54f96f4c9d9d0add8fba0",
  measurementId: "G-20ZKPS3WZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const db = getFirestore(app);

export { app, auth, db, collection, getDocs };


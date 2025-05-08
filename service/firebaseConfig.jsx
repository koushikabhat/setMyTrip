// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAp12E2IPZunfC17pVXwB_3JF6LYaaefWA",
  authDomain: "setmytrip-691b2.firebaseapp.com",
  projectId: "setmytrip-691b2",
  storageBucket: "setmytrip-691b2.firebasestorage.app",
  messagingSenderId: "180430907258",
  appId: "1:180430907258:web:8e34544d668e3d64c718c3",
  measurementId: "G-W8R3H00Y64"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
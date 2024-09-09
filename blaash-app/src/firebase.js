// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyByQcdQIFiKfiEnZ4wiXC1fGt6Qr2tas-s",
  authDomain: "dragndrop-36f11.firebaseapp.com",
  projectId: "dragndrop-36f11",
  storageBucket: "dragndrop-36f11.appspot.com",
  messagingSenderId: "988919501867",
  appId: "1:988919501867:web:d8dcdc0d92327d7987866e",
  measurementId: "G-SLWQQKYZZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
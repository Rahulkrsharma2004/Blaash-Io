// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCGsbx8tGZjwu349VL9duyjPiH1akwum1s",
    authDomain: "blaash-app-3a08c.firebaseapp.com",
    projectId: "blaash-app-3a08c",
    storageBucket: "blaash-app-3a08c.appspot.com",
    messagingSenderId: "383576728244",
    appId: "1:383576728244:web:ab8359bb3b4f6bd5fd2de1",
    measurementId: "G-D2LGES1C0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
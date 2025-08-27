// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔹 importa o Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAUOPWkhgq2lZdNksIPBGhCjZHTg3lEbbI",
  authDomain: "cyberguard-8e85b.firebaseapp.com",
  projectId: "cyberguard-8e85b",
  storageBucket: "cyberguard-8e85b.firebasestorage.app",
  messagingSenderId: "50772002803",
  appId: "1:50772002803:web:6cad7e3a8e9eb96f937486",
  measurementId: "G-VPCZBGTB9B"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

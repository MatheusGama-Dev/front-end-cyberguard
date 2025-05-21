// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUOPWkhgq2lZdNksIPBGhCjZHTg3lEbbI",
  authDomain: "cyberguard-8e85b.firebaseapp.com",
  projectId: "cyberguard-8e85b",
  storageBucket: "cyberguard-8e85b.firebasestorage.app",
  messagingSenderId: "50772002803",
  appId: "1:50772002803:web:6cad7e3a8e9eb96f937486",
  measurementId: "G-VPCZBGTB9B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

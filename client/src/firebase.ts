// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "cadence-finance.firebaseapp.com",
  projectId: "cadence-finance",
  storageBucket: "cadence-finance.firebasestorage.app",
  messagingSenderId: "169544041202",
  appId: "1:169544041202:web:d69df40b44c43537cfc66b",
  measurementId: "G-6L6CYVBVC4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

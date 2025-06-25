// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // Analytics can be added if needed

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDefxmW4h76fC8-R3sKMIW8ngr4iCt-FNM",
  authDomain: "fir-veilnet.firebaseapp.com",
  projectId: "firebase-veilnet",
  storageBucket: "firebase-veilnet.firebasestorage.app",
  messagingSenderId: "785697647146",
  appId: "1:785697647146:web:ab4c9d90c2e0cd6becb153",
  measurementId: "G-FNJ36PCZFN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app); // If you need analytics, uncomment and export

export { db, auth, app };

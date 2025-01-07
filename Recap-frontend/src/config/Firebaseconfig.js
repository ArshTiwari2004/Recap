import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA4BvlZv5Vi_vA-UrJ619XEJ3jIY1sjcBg",
  authDomain: "recap-f87b5.firebaseapp.com",
  projectId: "recap-f87b5",
  storageBucket: "recap-f87b5.firebasestorage.app",
  messagingSenderId: "343285138249",
  appId: "1:343285138249:web:59e2c5fe00daa46b02d098",
  measurementId: "G-3P95V9C8VL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
export const fireDB = getFirestore(app);
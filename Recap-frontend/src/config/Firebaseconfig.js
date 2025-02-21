import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // apiKey: "AIzaSyA4BvlZv5Vi_vA-UrJ619XEJ3jIY1sjcBg",
  // authDomain: "recap-f87b5.firebaseapp.com",
  // projectId: "recap-f87b5",
  // storageBucket: "recap-f87b5.firebasestorage.app",
  // messagingSenderId: "343285138249",
  // appId: "1:343285138249:web:59e2c5fe00daa46b02d098",
  // measurementId: "G-3P95V9C8VL"
  
  // apiKey: "AIzaSyAC1iIAlxZK9BQc0m0h9q0qZ3HthRUS-JA",
  // authDomain: "imagedb-d1403.firebaseapp.com",
  // projectId: "imagedb-d1403",
  // storageBucket: "imagedb-d1403.appspot.com",
  // messagingSenderId: "899179594417",
  // appId: "1:899179594417:web:9ff6d674e2874458d25890"
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,

  // apiKey: "AIzaSyC4xCBrVL1XIS0MzUXk8RPE4SurvonOeMo",
  // authDomain: "recap-82c2f.firebaseapp.com",
  // projectId: "recap-82c2f",
  // storageBucket: "recap-82c2f.firebasestorage.app",
  // messagingSenderId: "556043552922",
  // appId: "1:556043552922:web:5a6dadc56ee41373dc7723"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
export const fireDB = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
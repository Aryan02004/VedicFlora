// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC02-C6Dpx0gaF_YMFZXqaX0ZGvY2S67rg",
  authDomain: "vedicflora-demo.firebaseapp.com",
  projectId: "vedicflora-demo",
  storageBucket: "vedicflora-demo.firebasestorage.app",
  messagingSenderId: "240355294138",
  appId: "1:240355294138:web:734376d07f0b4822d37b83",
  measurementId: "G-NDG2QQDPB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { db, auth };
const analytics = getAnalytics(app);
export { analytics };
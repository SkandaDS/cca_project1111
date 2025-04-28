// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYTLDvnqSu7Z_Pw1W1yTb2RsTbWjAuULQ",
  authDomain: "chatbot-f2d4d.firebaseapp.com",
  projectId: "chatbot-f2d4d",
  storageBucket: "chatbot-f2d4d.appspot.com",
  messagingSenderId: "682017161685",
  appId: "1:682017161685:web:4e62d38a283500c5ed7d5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNuICR1ViH0lGChZQVhCYZqozaEW8ELgo",
  authDomain: "student-app-5d0ef.firebaseapp.com",
  projectId: "student-app-5d0ef",
  storageBucket: "student-app-5d0ef.firebasestorage.app",
  messagingSenderId: "535484627407",
  appId: "1:535484627407:web:77ef6587eafa38fe01baba",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Firestore（你專題真正會用到的）
export const db = getFirestore(app);
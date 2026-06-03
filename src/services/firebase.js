import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNuICR1ViH0lGChZQVhCYZqozaEW8ELgo",
  authDomain: "student-app-5d0ef.firebaseapp.com",
  projectId: "student-app-5d0ef",
  storageBucket: "student-app-5d0ef.firebasestorage.app",
  messagingSenderId: "535484627407",
  appId: "1:535484627407:web:77ef6587eafa38fe01baba",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
import {
    collection,
    addDoc,
    getDocs,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  // 🔥 存 task
  export const addTaskToFirebase = async (task) => {
    await addDoc(collection(db, "tasks"), task);
  };
  
  // 🔥 讀 task
  export const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "tasks"));
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  
  import { db }
    from "./firebase";
  
  export const saveTask = async (
    uid,
    task
  ) => {
  
    await addDoc(
      collection(
        db,
        "users",
        uid,
        "tasks"
      ),
      task
    );
  };
  
  export const saveCourse = async (
    uid,
    course
  ) => {
  
    await addDoc(
      collection(
        db,
        "users",
        uid,
        "courses"
      ),
      course
    );
  };
  
  export const loadTasks = async (
    uid
  ) => {
  
    const snapshot =
      await getDocs(
        collection(
          db,
          "users",
          uid,
          "tasks"
        )
      );
  
    return snapshot.docs.map(
      (doc) => ({
        firebaseId: doc.id,
        ...doc.data(),
      })
    );
  };
  
  export const loadCourses =
    async (uid) => {
  
      const snapshot =
        await getDocs(
          collection(
            db,
            "users",
            uid,
            "courses"
          )
        );
  
      return snapshot.docs.map(
        (doc) => ({
          firebaseId: doc.id,
          ...doc.data(),
        })
      );
    };
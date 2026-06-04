import { create } from "zustand";

const calculateStress = (tasks) => {
  let stress = 0;

  tasks.forEach((task) => {
    const daysLeft =
      (new Date(task.deadline) - new Date()) /
      (1000 * 60 * 60 * 24);

    stress += (task.difficulty || 1) * 10;

    if (daysLeft <= 7) stress += 20;
    if (daysLeft <= 3) stress += 30;
    if (daysLeft <= 1) stress += 40;
  });

  return Math.min(Math.max(stress, 0), 100);
};

const useStore = create((set, get) => ({
  // ====================
  // USER
  // ====================
  user: null,

  setUser: (user) => set({ user }),

  // ====================
  // TASKS
  // ====================
  tasks: [],

  setTasks: (tasks) =>
    set({
      tasks,
      stress: calculateStress(tasks),
    }),

  // ====================
  // COURSES
  // ====================
  courses: [],

  setCourses: (courses) =>
    set({
      courses,
    }),

  // ====================
  // STRESS
  // ====================
  stress: 0,

  // ====================
  // STUDY PLAN
  // ====================
  studyPlans: [],

  setStudyPlans: (plans) =>
    set({
      studyPlans: plans,
    }),

  // ====================
  // MAP POSTS
  // ====================
  mapPosts: [],

  setMapPosts: (posts) =>
    set({
      mapPosts: posts,
    }),

  // ====================
  // RESET
  // ====================
  resetAll: () =>
    set({
      user: null,
      tasks: [],
      courses: [],
      stress: 0,
      studyPlans: [],
      mapPosts: [],
    }),
}));

export default useStore;
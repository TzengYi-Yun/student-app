import { create } from "zustand";

const savedTasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

const savedCourses =
  JSON.parse(localStorage.getItem("courses")) || [];

// 🔥 壓力計算（優化版）
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

const syncTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const syncCourses = (courses) => {
  localStorage.setItem("courses", JSON.stringify(courses));
};

const useStore = create((set, get) => ({
  // =====================
  // STATE
  // =====================
  tasks: savedTasks,
  courses: savedCourses,
  stress: calculateStress(savedTasks),
  studyPlans: [],

  // =====================
  // TASKS
  // =====================
  addTask: (task) => {
    const updated = [...get().tasks, task];

    syncTasks(updated);

    set({
      tasks: updated,
      stress: calculateStress(updated),
    });
  },

  deleteTask: (id) => {
    const updated = get().tasks.filter((t) => t.id !== id);

    syncTasks(updated);

    set({
      tasks: updated,
      stress: calculateStress(updated),
    });
  },

  // =====================
  // COURSES
  // =====================
  addCourse: (course) => {
    const updated = [...get().courses, course];

    syncCourses(updated);

    set({ courses: updated });
  },

  deleteCourse: (id) => {
    const updated = get().courses.filter((c) => c.id !== id);

    syncCourses(updated);

    set({ courses: updated });
  },

  // =====================
  // AI STUDY PLAN
  // =====================
  setStudyPlans: (plans) => {
    set({ studyPlans: plans });
  },

  // =====================
  // RESET
  // =====================
  resetAll: () => {
    localStorage.clear();

    set({
      tasks: [],
      courses: [],
      stress: 0,
      studyPlans: [],
    });
  },
}));

export default useStore;
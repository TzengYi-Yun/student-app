import { useEffect, useState } from "react";
import useStore from "../store/useStore";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../services/firebase";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const colors = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-orange-500",
];

function Schedule() {
  const { user, courses, setCourses } = useStore();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Mon");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "courses"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setCourses(list);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, setCourses]);

  const handleAddCourse = async () => {
    if (!title || !startTime || !endTime || !room || !user) return;

    const conflict = courses.some(
      (course) =>
        course.day === day &&
        startTime < course.endTime &&
        endTime > course.startTime
    );

    if (conflict) {
      alert("⚠️ 課程時間衝突！");
      return;
    }

    try {
      await addDoc(collection(db, "courses"), {
        title,
        day,
        startTime,
        endTime,
        room,
        color:
          colors[Math.floor(Math.random() * colors.length)],
        uid: user.uid,
        createdAt: Date.now(),
      });

      setTitle("");
      setStartTime("");
      setEndTime("");
      setRoom("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await deleteDoc(doc(db, "courses", id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        載入中...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          課表系統
        </h1>
        <p className="text-gray-400">
          Firebase 即時同步
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">

        <input
          type="text"
          placeholder="課程名稱"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>

        <input
          type="text"
          placeholder="教室"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <button
          onClick={handleAddCourse}
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
        >
          新增課程
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {days.map((d) => (
          <div
            key={d}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-4"
          >
            <h2 className="text-xl font-bold mb-4">
              {d}
            </h2>

            <div className="space-y-3">

              {courses
                .filter((course) => course.day === d)
                .sort((a, b) =>
                  a.startTime.localeCompare(b.startTime)
                )
                .map((course) => (
                  <div
                    key={course.id}
                    className={`${course.color} p-3 rounded-xl`}
                  >
                    <h3 className="font-bold">
                      {course.title}
                    </h3>

                    <p className="text-sm">
                      {course.startTime} - {course.endTime}
                    </p>

                    <p className="text-sm">
                      {course.room}
                    </p>

                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="mt-2 text-xs bg-black/20 px-2 py-1 rounded"
                    >
                      刪除
                    </button>
                  </div>
                ))}

              {courses.filter((course) => course.day === d).length === 0 && (
                <p className="text-gray-500 text-sm">
                  沒有課程
                </p>
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Schedule;
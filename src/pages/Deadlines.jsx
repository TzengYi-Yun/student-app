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

function Deadlines() {
  const { user, tasks, setTasks } = useStore();

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
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

        setTasks(list);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, setTasks]);

  const handleAddTask = async () => {
    if (!title || !deadline || !user) return;

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        deadline,
        difficulty,
        uid: user.uid,
        createdAt: Date.now(),
      });

      setTitle("");
      setDeadline("");
      setDifficulty(1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error(err);
    }
  };

  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div className="text-white p-6">載入中...</div>;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          DDL 管理系統
        </h1>
        <p className="text-gray-400">
          Firebase 即時同步作業
        </p>
      </div>

      {/* 新增作業 */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">

        <input
          type="text"
          placeholder="作業名稱"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        >
          <option value={1}>簡單</option>
          <option value={2}>普通</option>
          <option value={3}>困難</option>
          <option value={4}>地獄</option>
        </select>

        <button
          onClick={handleAddTask}
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
        >
          新增作業
        </button>
      </div>

      {/* 作業列表 */}
      <div className="space-y-4">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-900 p-5 rounded-2xl border border-gray-800 flex justify-between items-center"
          >

            <div>
              <h2 className="text-xl font-bold">
                {task.title}
              </h2>

              <p className="text-gray-400">
                截止：{task.deadline}
              </p>

              <p className="text-red-400">
                剩餘：{getDaysLeft(task.deadline)} 天
              </p>
            </div>

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              刪除
            </button>

          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-500 text-center">
            目前沒有作業
          </p>
        )}

      </div>
    </div>
  );
}

export default Deadlines;
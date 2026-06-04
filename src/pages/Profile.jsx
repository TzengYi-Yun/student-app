import { useEffect, useState } from "react";
import useStore from "../store/useStore";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../services/firebase";

function Profile() {
  const { user, setUser } = useStore();

  const [loading, setLoading] = useState(true);

  // =========================
  // AUTH LISTENER
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-white p-6">載入中...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-gray-400">
        尚未登入
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold">
          個人檔案
        </h1>
        <p className="text-gray-400">
          Firebase 使用者資訊
        </p>
      </div>

      {/* USER CARD */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">

        {/* EMAIL */}
        <div>
          <p className="text-gray-400 text-sm">
            Email
          </p>
          <p className="text-white font-bold">
            {user.email}
          </p>
        </div>

        {/* UID */}
        <div>
          <p className="text-gray-400 text-sm">
            UID
          </p>
          <p className="text-xs text-gray-300 break-all">
            {user.uid}
          </p>
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-green-400 text-sm">
            已登入
          </p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg font-bold"
        >
          登出
        </button>
      </div>

    </div>
  );
}

export default Profile;
import { useEffect, useState } from "react";
import useStore from "../store/useStore";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../services/firebase";

function MapPage() {
  const { user, mapPosts, setMapPosts } = useStore();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================
  // 🔥 即時同步貼文
  // ======================
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMapPosts(list);
    });

    return () => unsub();
  }, []);

  // ======================
  // ➕ 發文（已修好）
  // ======================
  const handlePost = async () => {
    console.log("click post button");

    if (!text.trim()) {
      alert("不能空白發文");
      return;
    }

    if (!user) {
      alert("請先登入");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        text: text.trim(),
        uid: user.uid,
        userName: user.displayName || "匿名",
        photoURL: user.photoURL || "",
        createdAt: Date.now(),
      });

      setText("");
    } catch (err) {
      console.error("post error:", err);
      alert("發文失敗");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">

      {/* 標題 */}
      <h1 className="text-2xl font-bold">
        🔥 校園討論牆
      </h1>

      {/* 發文區 */}
      <div className="bg-gray-900 p-4 rounded-xl space-y-2">

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="想撈人 / 抱怨 / 找同學 / 問問題..."
          className="w-full p-3 rounded bg-gray-800 min-h-[100px]"
        />

        <button
          onClick={handlePost}
          disabled={loading}
          className="w-full bg-purple-600 p-2 rounded font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "發送中..." : "發布貼文"}
        </button>
      </div>

      {/* 貼文列表 */}
      <div className="space-y-3">

        {mapPosts?.length === 0 ? (
          <p className="text-gray-500">還沒有貼文</p>
        ) : (
          mapPosts?.map((post) => (
            <div
              key={post.id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-800"
            >

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <img
                  src={post.photoURL || "https://i.pravatar.cc/30"}
                  className="w-6 h-6 rounded-full"
                />
                {post.userName}
              </div>

              <div className="mt-2 text-white whitespace-pre-wrap">
                {post.text}
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default MapPage;
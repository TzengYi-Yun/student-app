import { useEffect, useState } from "react";
import useStore from "../store/useStore";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

import { db } from "../services/firebase";

function Map() {
  const { user, mapPosts, setMapPosts } = useStore();

  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // =========================
  // POSTS
  // =========================
  useEffect(() => {
    const q = query(
      collection(db, "mapPosts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMapPosts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // =========================
  // COMMENTS
  // =========================
  useEffect(() => {
    if (!selectedPost?.id) {
      setComments([]);
      return;
    }

    const q = query(
      collection(db, "mapPosts", selectedPost.id, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [selectedPost?.id]);

  // =========================
  // ADD POST
  // =========================
  const handleAddPost = async () => {
    if (!user) return console.log("❌ no user");
    if (!text || !location) return console.log("❌ empty");

    try {
      await addDoc(collection(db, "mapPosts"), {
        text,
        location,
        uid: user.uid,
        email: user.email,
        likes: [],
        likeCount: 0,
        createdAt: Date.now(),
      });

      setText("");
      setLocation("");
    } catch (err) {
      console.error("POST ERROR:", err);
    }
  };

  // =========================
  // LIKE (FIXED)
  // =========================
  const handleLike = async (post) => {
    if (!user) return;

    const ref = doc(db, "mapPosts", post.id);
    const hasLiked = post.likes?.includes(user.uid);

    try {
      await updateDoc(ref, {
        likes: hasLiked
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid),
        likeCount: increment(hasLiked ? -1 : 1),
      });
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  // =========================
  // COMMENT (FIXED + DEBUG)
  // =========================
  const handleAddComment = async () => {
    console.log("🔥 click comment");

    if (!user) return console.log("❌ no user");
    if (!selectedPost?.id) return console.log("❌ no post");
    if (!comment) return console.log("❌ empty comment");

    try {
      await addDoc(
        collection(db, "mapPosts", selectedPost.id, "comments"),
        {
          text: comment,
          uid: user.uid,
          email: user.email,
          createdAt: Date.now(),
        }
      );

      setComment("");
      console.log("✅ comment sent");
    } catch (err) {
      console.error("COMMENT ERROR:", err.code, err.message);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (post) => {
    if (post.uid !== user?.uid) return;

    await deleteDoc(doc(db, "mapPosts", post.id));
  };

  if (loading) return <div className="text-white p-6">載入中...</div>;

  return (
    <div className="space-y-6 text-white">

      <h1 className="text-3xl font-bold">Map 社群牆</h1>

      {/* INPUT */}
      <div className="bg-gray-900 p-5 rounded-2xl space-y-3">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="你想說什麼？"
          className="w-full p-3 bg-gray-800 rounded"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="地點"
          className="w-full p-3 bg-gray-800 rounded"
        />

        <button
          onClick={handleAddPost}
          className="w-full bg-purple-600 p-3 rounded font-bold"
        >
          發布貼文
        </button>
      </div>

      {/* POSTS */}
      <div className="space-y-4">
        {mapPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-blue-900"
          >

            <div className="text-xs">{post.email}</div>

            <div className="text-lg font-bold">
              {post.text}
            </div>

            <div className="text-sm">
              📍 {post.location}
            </div>

            {/* LIKE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike(post);
              }}
              className="mt-3 flex gap-2 items-center active:scale-125 transition"
            >
              ❤️ {post.likeCount || 0}
            </button>

            {/* DELETE */}
            {user?.uid === post.uid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(post);
                }}
                className="mt-2 text-xs bg-red-500 px-3 py-1 rounded"
              >
                刪除
              </button>
            )}
          </div>
        ))}
      </div>

      {/* COMMENTS PANEL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 flex items-end">

          <div className="w-full bg-gray-900 p-5 rounded-t-2xl">

            <button
              onClick={() => setSelectedPost(null)}
              className="text-gray-400 mb-3"
            >
              關閉
            </button>

            <h2 className="text-xl font-bold mb-3">
              {selectedPost.text}
            </h2>

            {/* COMMENTS */}
            <div className="space-y-2 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-400">
                    {c.email}
                  </div>
                  <div>{c.text}</div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="留言..."
                className="flex-1 p-3 bg-gray-800 rounded"
              />

              <button
                onClick={handleAddComment}
                className="bg-purple-600 px-4 rounded"
              >
                送出
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Map;
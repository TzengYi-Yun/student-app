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

  const [replyTo, setReplyTo] = useState(null);

  // =====================
  // POSTS
  // =====================
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

  // =====================
  // COMMENTS
  // =====================
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

  // =====================
  // POST
  // =====================
  const handleAddPost = async () => {
    if (!user) return;
    if (!text || !location) return;

    await addDoc(collection(db, "mapPosts"), {
      text,
      location,
      uid: user.uid,
      email: user.email,
      likes: [],
      likeCount: 0,
      commentCount: 0,
      createdAt: Date.now(),
    });

    setText("");
    setLocation("");
  };

  // =====================
  // LIKE
  // =====================
  const handleLike = async (post) => {
    if (!user) return;

    const ref = doc(db, "mapPosts", post.id);
    const hasLiked = post.likes?.includes(user.uid);

    await updateDoc(ref, {
      likes: hasLiked
        ? arrayRemove(user.uid)
        : arrayUnion(user.uid),
      likeCount: increment(hasLiked ? -1 : 1),
    });
  };

  // =====================
  // COMMENT / REPLY
  // =====================
  const handleAddComment = async () => {
    if (!user) return;
    if (!selectedPost?.id) return;
    if (!comment) return;

    await addDoc(
      collection(db, "mapPosts", selectedPost.id, "comments"),
      {
        text: comment,
        uid: user.uid,
        email: user.email,
        createdAt: Date.now(),
        replyTo: replyTo || null,
      }
    );

    await updateDoc(doc(db, "mapPosts", selectedPost.id), {
      commentCount: increment(1),
    });

    setComment("");
    setReplyTo(null);
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (post) => {
    if (post.uid !== user?.uid) return;
    await deleteDoc(doc(db, "mapPosts", post.id));
  };

  if (loading) {
    return <div className="text-white p-6">載入中...</div>;
  }

  return (
    <div className="space-y-6 text-white">

      <h1 className="text-3xl font-bold">Map 社群牆</h1>

      {/* INPUT */}
      <div className="bg-zinc-900 p-5 rounded-2xl space-y-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="你想說什麼？"
          className="w-full p-3 bg-zinc-800 rounded"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="地點"
          className="w-full p-3 bg-zinc-800 rounded"
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
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 hover:bg-zinc-900 transition cursor-pointer"
          >

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                {(post.email || "A")[0].toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="font-bold">
                  {post.email?.split("@")[0]}
                </div>

                <div className="mt-2 whitespace-pre-wrap">
                  {post.text}
                </div>

                {post.location && (
                  <div className="mt-2 inline-block bg-zinc-800 px-2 py-1 rounded-full text-xs">
                    📍 {post.location}
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-6 mt-4 border-t border-zinc-800 pt-3">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post);
                }}
                className={`flex items-center gap-2 ${
                  post.likes?.includes(user?.uid)
                    ? "text-red-500"
                    : "text-zinc-400"
                }`}
              >
                ❤️ {post.likeCount || 0}
              </button>

              <div className="text-zinc-400">
                💬 {post.commentCount || 0}
              </div>

              {/* OPEN COMMENT */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPost(post);
                }}
                className="text-blue-400"
              >
                回覆
              </button>

            </div>

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

          <div className="w-full bg-zinc-900 p-5 rounded-t-2xl">

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
                <div
                  key={c.id}
                  className={`bg-zinc-800 p-3 rounded ${
                    c.replyTo ? "ml-6 border-l-2 border-purple-500" : ""
                  }`}
                >
                  <div className="text-xs text-gray-400">
                    {c.email}
                  </div>

                  <div>{c.text}</div>

                  <button
                    onClick={() => setReplyTo(c.id)}
                    className="text-xs text-blue-400 mt-1"
                  >
                    回覆
                  </button>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  replyTo ? "回覆留言中..." : "留言..."
                }
                className="flex-1 p-3 bg-zinc-800 rounded"
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
import { useAuth }
  from "../context/AuthContext";

import useStore
  from "../store/useStore";

function Profile() {

  const { user, login, logout } =
    useAuth();

  const {
    tasks,
    courses,
    stress,
  } = useStore();

  if (!user) {
    return (
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          帳號中心
        </h1>

        <button
          onClick={login}
          className="bg-purple-600 px-5 py-3 rounded-xl"
        >
          Google 登入
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        個人資料
      </h1>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

        <img
          src={user.photoURL}
          alt=""
          className="w-20 h-20 rounded-full mb-4"
        />

        <p>
          名稱：
          {user.displayName}
        </p>

        <p>
          Email：
          {user.email}
        </p>

      </div>

      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

        <h2 className="text-xl font-bold mb-4">
          Survival OS 統計
        </h2>

        <p>
          課程數：
          {courses.length}
        </p>

        <p>
          作業數：
          {tasks.length}
        </p>

        <p>
          壓力值：
          {stress}%
        </p>

      </div>

      <button
        onClick={logout}
        className="bg-red-600 px-5 py-3 rounded-xl"
      >
        登出
      </button>

    </div>
  );
}

export default Profile;
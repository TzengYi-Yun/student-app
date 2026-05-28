import { useState } from "react";
import useStore from "../store/useStore";

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
];

const colors = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-orange-500",
];

function Schedule() {
  const {
    courses,
    addCourse,
    deleteCourse,
  } = useStore();

  const [title, setTitle] = useState("");
  const [day, setDay] = useState("Mon");
  const [startTime, setStartTime] =
    useState("");
  const [endTime, setEndTime] =
    useState("");
  const [room, setRoom] = useState("");

  const handleAddCourse = () => {
    if (
      !title ||
      !startTime ||
      !endTime ||
      !room
    ) {
      return;
    }

    // 時間衝突檢查
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

    addCourse({
      id: Date.now(),
      title,
      day,
      startTime,
      endTime,
      room,
      color:
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ],
    });

    // 清空
    setTitle("");
    setStartTime("");
    setEndTime("");
    setRoom("");
  };

  const getScheduleAnalysis = () => {
    if (courses.length === 0) {
      return "目前沒有課程。";
    }

    if (courses.length < 4) {
      return "這學期感覺很輕鬆。";
    }

    if (courses.length < 8) {
      return "你的課程量正常。";
    }

    return "⚠️ 這學期可能會很痛苦。";
  };

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h1 className="text-3xl font-bold">
          課表系統
        </h1>

        <p className="text-gray-400">
          管理你的大學人生。
        </p>
      </div>

      {/* AI分析 */}
      <div className="bg-purple-600 p-5 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">
          AI 課表分析
        </h2>

        <p>{getScheduleAnalysis()}</p>
      </div>

      {/* 新增課程 */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
        <input
          type="text"
          placeholder="課程名稱"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <select
          value={day}
          onChange={(e) =>
            setDay(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        >
          {days.map((d) => (
            <option
              key={d}
              value={d}
            >
              {d}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) =>
              setEndTime(e.target.value)
            }
            className="p-3 rounded-lg bg-gray-800 border border-gray-700"
          />
        </div>

        <input
          type="text"
          placeholder="教室"
          value={room}
          onChange={(e) =>
            setRoom(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <button
          onClick={handleAddCourse}
          className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg font-bold"
        >
          新增課程
        </button>
      </div>

      {/* 課表 */}
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
                .filter(
                  (course) =>
                    course.day === d
                )
                .sort((a, b) =>
                  a.startTime.localeCompare(
                    b.startTime
                  )
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
                      {course.startTime} -{" "}
                      {course.endTime}
                    </p>

                    <p className="text-sm">
                      {course.room}
                    </p>

                    <button
                      onClick={() =>
                        deleteCourse(
                          course.id
                        )
                      }
                      className="mt-2 text-xs bg-black/20 px-2 py-1 rounded hover:bg-black/40"
                    >
                      刪除
                    </button>
                  </div>
                ))}

              {courses.filter(
                (course) =>
                  course.day === d
              ).length === 0 && (
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
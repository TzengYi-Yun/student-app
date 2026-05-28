import CourseCard from "../components/CourseCard";
import StressChart from "../components/StressChart";
import DeadlineList from "../components/DeadlineList";
import AIWidget from "../components/AIWidget";

import useStore from "../store/useStore";

const dayMap = {
  Sun: "Sun",
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
};

function Dashboard() {
  const { tasks, stress, courses } = useStore();

  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "short",
    });

  const todayCourses = courses.filter(
    (c) => c.day === today
  );

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          今天也努力活下去。
        </p>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400">
            作業數
          </h2>
          <p className="text-4xl font-bold">
            {tasks.length}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400">
            課程數
          </h2>
          <p className="text-4xl font-bold text-blue-400">
            {courses.length}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
          <h2 className="text-gray-400">
            壓力
          </h2>
          <p className="text-4xl font-bold text-red-400">
            {stress}%
          </p>
        </div>
      </div>

      {/* AI */}
      <AIWidget />

      {/* 今日課表 */}
      <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-3">
          今日課表
        </h2>

        {todayCourses.length === 0 ? (
          <p className="text-gray-400">
            今天沒有課 🎉
          </p>
        ) : (
          todayCourses.map((c) => (
            <div
              key={c.id}
              className="bg-gray-800 p-3 rounded-lg mb-2"
            >
              <div className="font-bold">
                {c.title}
              </div>
              <div className="text-gray-400 text-sm">
                {c.startTime} - {c.endTime}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 課程 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.length === 0 ? (
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            尚未新增課程
          </div>
        ) : (
          courses.slice(0, 2).map((c) => (
            <CourseCard
              key={c.id}
              title={c.title}
              time={`${c.startTime} - ${c.endTime}`}
              room={c.room}
            />
          ))
        )}
      </div>

      {/* 圖表 + 作業 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StressChart />
        <DeadlineList />
      </div>
    </div>
  );
}

export default Dashboard;
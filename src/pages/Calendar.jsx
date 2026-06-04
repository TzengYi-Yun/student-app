import { useEffect, useMemo, useState } from "react";
import useStore from "../store/useStore";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const {
    user,
    tasks,
    courses,
    stress,
    setStudyPlans,
  } = useStore();

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = useMemo(() => new Date(), []);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendar = useMemo(() => {
    const arr = [];

    for (let i = 0; i < firstDay; i++) {
      arr.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(new Date(year, month, d));
    }

    return arr;
  }, [year, month, firstDay, daysInMonth]);

  // ======================
  // COURSE FILTER
  // ======================
  const getCourses = (dateObj) => {
    if (!dateObj) return [];

    const dayName = weekDays[dateObj.getDay()];

    return (courses || []).filter((c) => c.day === dayName);
  };

  // ======================
  // TASK FILTER
  // ======================
  const getTasks = (dateObj) => {
    if (!dateObj) return [];

    return (tasks || []).filter((t) => {
      if (!t.deadline) return false;

      const d = new Date(t.deadline);

      return (
        d.getFullYear() === dateObj.getFullYear() &&
        d.getMonth() === dateObj.getMonth() &&
        d.getDate() === dateObj.getDate()
      );
    });
  };

  // ======================
  // COLOR LOGIC
  // ======================
  const getLoadColor = (count) => {
    if (count === 0) return "bg-gray-900";
    if (count <= 2) return "bg-green-900";
    if (count <= 4) return "bg-yellow-900";
    return "bg-red-900";
  };

  // ======================
  // MONTH CONTROL
  // ======================
  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
    setSelectedDate(null);
  };

  // ======================
  // AI PLAN
  // ======================
  const handleAIPlan = () => {
    if (!setStudyPlans) return;

    const plans = (tasks || []).map((t) => ({
      id: "ai-" + t.id,
      title: "📚 Study " + t.title,
      date: t.deadline,
    }));

    setStudyPlans(plans);
  };

  // ======================
  // SELECTED DATA
  // ======================
  const selectedCourses = selectedDate ? getCourses(selectedDate) : [];
  const selectedTasks = selectedDate ? getTasks(selectedDate) : [];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-400">
            Stress Level: {stress ?? 0}/100
          </p>
        </div>

        <button
          onClick={handleAIPlan}
          className="px-3 py-2 bg-purple-600 rounded"
        >
          🤖 AI 排讀書時間
        </button>
      </div>

      {/* MONTH CONTROL */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 bg-gray-800 rounded"
        >
          ◀
        </button>

        <div className="font-bold">
          {year} / {month + 1}
        </div>

        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 bg-gray-800 rounded"
        >
          ▶
        </button>
      </div>

      {/* WEEK HEADER */}
      <div className="grid grid-cols-7 text-center text-gray-400 font-bold">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {calendar.map((dateObj, i) => {
          if (!dateObj) return <div key={i} className="h-24" />;

          const c = getCourses(dateObj);
          const t = getTasks(dateObj);

          const total = c.length + t.length;

          const isToday =
            dateObj.toDateString() === today.toDateString();

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(dateObj)}
              className={`h-24 p-2 rounded border border-gray-800 cursor-pointer transition
                ${getLoadColor(total)}
                ${isToday ? "ring-2 ring-purple-500" : ""}
              `}
            >
              <div className="font-bold">
                {dateObj.getDate()}
              </div>

              {/* course preview */}
              {c.slice(0, 1).map((x) => (
                <div key={x.id} className="text-xs text-blue-300">
                  {x.title}
                </div>
              ))}

              {/* task preview */}
              {t.slice(0, 1).map((x) => (
                <div key={x.id} className="text-xs text-red-300">
                  {x.title}
                </div>
              ))}

              {total > 2 && (
                <div className="text-xs text-white/70">
                  +{total - 2}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DETAIL PANEL */}
      <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">

        {selectedDate ? (
          <>
            <h2 className="text-xl font-bold mb-3">
              {selectedDate.toLocaleDateString()}
            </h2>

            {/* COURSES */}
            <div className="mb-4">
              <h3 className="text-blue-400 font-bold mb-2">
                課程
              </h3>

              {selectedCourses.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  沒有課程
                </p>
              ) : (
                selectedCourses.map((c) => (
                  <div key={c.id} className="bg-gray-800 p-2 rounded mb-2">
                    {c.title} ({c.startTime} - {c.endTime})
                  </div>
                ))
              )}
            </div>

            {/* TASKS */}
            <div>
              <h3 className="text-red-400 font-bold mb-2">
                作業
              </h3>

              {selectedTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  沒有作業
                </p>
              ) : (
                selectedTasks.map((t) => (
                  <div key={t.id} className="bg-gray-800 p-2 rounded mb-2">
                    {t.title}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-400">
            點選日期查看課程與作業
          </p>
        )}
      </div>
    </div>
  );
}

export default Calendar;
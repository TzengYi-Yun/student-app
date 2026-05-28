import useStore from "../store/useStore";

function DeadlineList() {
  const { tasks, deleteTask } = useStore();

  const getDaysLeft = (deadline) => {
    return Math.ceil(
      (new Date(deadline) - new Date()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getStatus = (days) => {
    if (days <= 1)
      return "text-red-400";
    if (days <= 3)
      return "text-yellow-400";
    return "text-green-400";
  };

  const getLabel = (days) => {
    if (days <= 1) return "🔥 明天截止";
    if (days <= 3) return "⚠️ 即將到期";
    return "✔ 安全";
  };

  return (
    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4">
        Deadline
      </h2>

      {tasks.length === 0 ? (
        <p className="text-gray-400">
          目前沒有作業 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {tasks
            .sort(
              (a, b) =>
                new Date(a.deadline) -
                new Date(b.deadline)
            )
            .map((task) => {
              const days = getDaysLeft(
                task.deadline
              );

              return (
                <div
                  key={task.id}
                  className="bg-gray-800 p-3 rounded-lg"
                >
                  {/* 標題 */}
                  <div className="font-bold">
                    {task.title}
                  </div>

                  {/* 日期 */}
                  <div className="text-sm text-gray-400">
                    {task.deadline}
                  </div>

                  {/* 倒數 */}
                  <div
                    className={`text-sm font-bold ${getStatus(
                      days
                    )}`}
                  >
                    剩餘 {days} 天
                  </div>

                  {/* 狀態標籤 */}
                  <div
                    className={`text-xs mt-1 ${getStatus(
                      days
                    )}`}
                  >
                    {getLabel(days)}
                  </div>

                  {/* 刪除 */}
                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    className="text-xs mt-2 bg-black/30 px-2 py-1 rounded hover:bg-black/50"
                  >
                    刪除
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default DeadlineList;
import useStore from "../store/useStore";

function AIWidget() {
  const { stress, tasks, courses } = useStore();

  const getMessage = () => {
    const total = tasks.length + courses.length;

    if (total === 0)
      return "目前沒有壓力，可以好好休息。";

    if (stress < 40)
      return "狀態良好，可以正常生活。";

    if (stress < 70)
      return "開始變忙，注意時間管理。";

    return "⚠️ 高壓狀態，建議減少娛樂。";
  };

  return (
    <div className="bg-purple-600 p-5 rounded-2xl">
      <h2 className="text-xl font-bold mb-2">
        AI 生存分析
      </h2>

      <p>{getMessage()}</p>

      <p className="text-sm mt-2 opacity-80">
        作業：{tasks.length} / 課程：{courses.length}
      </p>
    </div>
  );
}

export default AIWidget;
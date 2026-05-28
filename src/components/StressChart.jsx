import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  import useStore from "../store/useStore";
  
  function StressChart() {
    const { tasks } = useStore();
  
    const data = tasks.map((task, index) => ({
      name: task.title,
      stress: task.difficulty * 25,
    }));
  
    return (
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 h-80">
        <h2 className="text-xl font-bold mb-4">
          作業壓力分析
        </h2>
  
        {data.length === 0 ? (
          <p className="text-gray-400">
            目前沒有資料。
          </p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
  
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#a855f7"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }
  
  export default StressChart;
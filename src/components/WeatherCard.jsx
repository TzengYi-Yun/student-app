import { useEffect, useState } from "react";
import { getWeather } from "../api/weather";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getWeather("臺南市");
      setWeather(data);
    };

    load();
  }, []);

  if (!weather) {
    return <div className="text-white">載入天氣中...</div>;
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white border border-gray-800">
      <h2 className="text-xl font-bold">🌤️ 今日天氣 ({weather.city})</h2>

      <p className="mt-2">{weather.description}</p>

      <div className="mt-2 text-sm text-gray-300">
        🌡️ {weather.minT}°C ~ {weather.maxT}°C
      </div>

      <div className="text-sm text-gray-300">
        🌧️ 降雨機率 {weather.rain}%
      </div>
    </div>
  );
}
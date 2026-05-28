import MapCard from "../components/MapCard";

function Map() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        校園神器地圖
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MapCard
          title="圖書館 3F"
          description="安靜、有插座、冷氣強"
        />

        <MapCard
          title="活動中心"
          description="適合睡覺"
        />
      </div>
    </div>
  );
}

export default Map;
function CourseCard({ title, time, room }) {
    return (
      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
  
        <p className="text-gray-400">時間：{time}</p>
        <p className="text-gray-400">教室：{room}</p>
      </div>
    );
  }
  
  export default CourseCard;
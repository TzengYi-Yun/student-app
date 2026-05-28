import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Schedule", path: "/schedule" },
    { name: "Deadlines", path: "/deadlines" },
    { name: "Calendar", path: "/calendar" }, // ✅ 新增
    { name: "Campus Map", path: "/map" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
      <h2 className="text-2xl font-bold mb-8 text-purple-400">
        Survival OS
      </h2>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-purple-600"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
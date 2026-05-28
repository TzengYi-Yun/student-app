import useStore from "../store/useStore";

function Navbar() {
  const { stress } = useStore();

  const getStressColor = () => {
    if (stress < 40) return "text-green-400";
    if (stress < 70) return "text-yellow-400";

    return "text-red-400";
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold">
          Campus Survival OS
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`text-sm font-bold ${getStressColor()}`}
        >
          壓力指數：{stress}%
        </div>

        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}

export default Navbar;
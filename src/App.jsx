import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Deadlines from "./pages/Deadlines";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 text-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/deadlines" element={<Deadlines />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/map" element={<Map />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
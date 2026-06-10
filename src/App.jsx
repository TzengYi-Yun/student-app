import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Deadlines from "./pages/Deadlines";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter basename="/student-app">
      <div className="flex h-screen bg-gray-950 text-white">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/schedule"
                element={<Schedule />}
              />

              <Route
                path="/deadlines"
                element={<Deadlines />}
              />

              <Route
                path="/calendar"
                element={<Calendar />}
              />

              <Route
                path="/map"
                element={<Map />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
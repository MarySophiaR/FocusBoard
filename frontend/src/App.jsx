import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import Completed from "./pages/Completed";
import Pending from "./pages/Pending";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reminder from "./pages/Reminder";
import DueReminders from "./pages/DueReminders";
import Insights from "./pages/Insights";
function App() {
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const hideLayout =
    location.pathname === "/register" ||
    location.pathname === "/login";
  return (
    <div className={`app ${dark ? "dark" : ""}`}>
      {!hideLayout && (
        <Navbar
          dark={dark}
          setDark={setDark}
        />
      )}
      {!hideLayout && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard
                dark={dark}
                setDark={setDark}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all"
          element={
            <ProtectedRoute>
            <AllTasks />
           </ProtectedRoute>
          }
        />
        <Route
          path="/completed"
          element={
            <ProtectedRoute>
              <Completed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pending"
          element={
            <ProtectedRoute>
              <Pending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/due-reminders" element={<DueReminders />} />
        <Route
          path="/insights"
          element={<Insights dark={dark} />}
        />
      </Routes>
    </div>
  );
}
export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Navbar from "./components/Common/Navbar";
import Signup from "./pages/Signup";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";
import LivePolls from "./components/User/LivePolls";
import Profile from "./components/User/Profile";
import CreatePoll from "./components/Admin/CreatePoll";

const App = () => {
  const isAuthorized = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Admin Routes */}
        {/* User Routes */}
        {/* Common Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/live-polls" element={<LivePolls />} /> */}
        {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
        <Route path="/" element={<CreatePoll />} />
        <Route
          path="*"
          element={<Navigate to={isAuthorized ? "/" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

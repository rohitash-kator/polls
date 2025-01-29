import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import Login from "./pages/Login";
import Navbar from "./components/Common/Navbar";
import Signup from "./pages/Signup";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";
import LivePolls from "./components/User/LivePolls";
import Profile from "./components/User/Profile";
import CreatePoll from "./components/Admin/CreatePoll";
import Polls from "./components/Admin/Polls.jsx";
import PollForm from "./components/Common/PollForm.jsx";
import PollResult from "./components/Admin/PollResult.jsx";

const App = () => {
  const isAuthorized = !!localStorage.getItem("authToken");

  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/live" element={<LivePolls />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/create-poll" element={<CreatePoll />} />
            <Route path="result/:id" element={<PollResult />} />
            <Route path="poll/:id" element={<PollForm />} />
            <Route path="/all" element={<Polls />} />
            <Route path="/" element={<LivePolls />} />
            <Route
              path="*"
              element={<Navigate to={isAuthorized ? "/" : "/login"} />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;

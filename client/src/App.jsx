import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import AvailableJobs from './pages/AvailableJobs';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import FindWorkers from './pages/FindWorkers';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import VerifyOTP from './pages/VerifyOTP';
import AdminDashboard from './pages/AdminDashboard';
import WorkProofUpload from './pages/WorkProofUpload';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/jobs" element={<AvailableJobs />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/find-workers" element={<FindWorkers />} />
            <Route path="/chat-list" element={<ChatList />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/upload-work" element={<WorkProofUpload />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;

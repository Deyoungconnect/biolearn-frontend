import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import TopicsPage from './pages/TopicsPage';
import LessonsPage from './pages/LessonsPage';
import QuizPage from './pages/QuizPage';
import AIPage from './pages/AIPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminQuiz from './pages/AdminQuiz';
import Footer from './components/Footer';
import Logo from './components/Logo';

// ========== NAVBAR DELETED - Now Dashboard has its own navbar ==========

// Layout for authenticated users (NO duplicate navbar)
function AuthenticatedLayout() {
  return (
    <>
      {/* AppNavBar REMOVED - Dashboard now has its own navbar */}
      <div className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/lessons/:topic" element={<LessonsPage />} />
          <Route path="/quiz/:topic" element={<QuizPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/admin/quiz" element={<AdminQuiz />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route path="/*" element={
        isAuthenticated ? <AuthenticatedLayout /> : <Navigate to="/" />
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
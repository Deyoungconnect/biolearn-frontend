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

// Navigation bar - only shown when logged in
function AppNavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Logo size="large" />
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition font-medium">
              📊 Dashboard
            </Link>
            <Link to="/topics" className="text-gray-700 hover:text-green-600 transition font-medium">
              📚 Topics
            </Link>
            <Link to="/ai" className="text-gray-700 hover:text-green-600 transition font-medium">
              🤖 AI Assistant
            </Link>
            <div className="flex items-center space-x-3 border-l pl-4 ml-2">
              <span className="text-sm text-gray-600">👋 {user?.fullName || user?.username}</span>
              <button 
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Layout for authenticated users
function AuthenticatedLayout() {
  return (
    <>
      <AppNavBar />
      <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-200px)]">
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
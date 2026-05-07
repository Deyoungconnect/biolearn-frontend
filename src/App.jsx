import React, { useState } from 'react';
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

// Navigation bar - UPDATED with hamburger menu for mobile
function AppNavBar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo - YOUR ORIGINAL */}
          <Logo size="large" />
          
          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Hamburger Button - Only shows on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Shows when hamburger is clicked */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <Link 
              to="/dashboard" 
              className="block py-2 text-gray-700 hover:text-green-600 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/topics" 
              className="block py-2 text-gray-700 hover:text-green-600 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              📚 Topics
            </Link>
            <Link 
              to="/ai" 
              className="block py-2 text-gray-700 hover:text-green-600 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              🤖 AI Assistant
            </Link>
            <div className="pt-3 border-t border-gray-200">
              <div className="py-2 text-sm text-gray-600">
                👋 {user?.fullName || user?.username}
              </div>
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
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
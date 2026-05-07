import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Logo from '../components/Logo'; // IMPORT YOUR LOGO COMPONENT

const API_URL = 'https://biolearn-api.onrender.com/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzesTaken: 0,
    quizzesPassed: 0,
    averageScore: 0,
    totalLessonsCompleted: 0,
    topicsProgress: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/progress/dashboard`, {
        headers: { 'x-auth-token': token }
      });
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== NAVBAR WITH YOUR ORIGINAL LOGO AND DESIGN ========== */}
      <nav className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* YOUR ORIGINAL LOGO COMPONENT */}
            <Link to="/dashboard" className="flex items-center">
              <Logo size="medium" /> {/* Using your actual Logo component */}
            </Link>

            {/* Desktop Menu - Your original links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="hover:text-green-200 transition font-medium">Dashboard</Link>
              <Link to="/topics" className="hover:text-green-200 transition font-medium">Topics</Link>
              <Link to="/ai" className="hover:text-green-200 transition font-medium">AI Assistant</Link>
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium">👋 {user?.fullName?.split(' ')[0] || user?.username || 'Student'}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button (Hamburger - 3 lines) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-green-700 transition focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
              <Link
                to="/dashboard"
                className="block py-3 px-3 hover:bg-green-700 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/topics"
                className="block py-3 px-3 hover:bg-green-700 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📚 Topics
              </Link>
              <Link
                to="/ai"
                className="block py-3 px-3 hover:bg-green-700 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🤖 AI Assistant
              </Link>
              <div className="pt-3 border-t border-green-500">
                <div className="py-2 px-3 text-sm text-green-100">
                  👋 {user?.fullName?.split(' ')[0] || user?.username || 'Student'}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 px-3 bg-red-500 hover:bg-red-600 rounded-lg transition mt-2"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ========== MAIN CONTENT (same as before) ========== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Hello, {user?.fullName || user?.username || 'Student'}! 👋</h1>
          <p className="mt-2 opacity-90 text-sm sm:text-base">Welcome to your BioLearn dashboard. Track your progress and continue your biology journey!</p>
          <div className="mt-4">
            <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm">
              Class: {user?.class || 'SS3'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📚</div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalLessonsCompleted || 0}</div>
            <div className="text-gray-500 text-xs sm:text-sm">Lessons Completed</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📝</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalQuizzesTaken || 0}</div>
            <div className="text-gray-500 text-xs sm:text-sm">Quizzes Taken</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✅</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.quizzesPassed || 0}</div>
            <div className="text-gray-500 text-xs sm:text-sm">Quizzes Passed</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⭐</div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{Math.round(stats.averageScore || 0)}%</div>
            <div className="text-gray-500 text-xs sm:text-sm">Average Score</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Link to="/topics" className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition border border-gray-100">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📚</div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Continue Learning</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Browse and study topics</p>
          </Link>
          
          <Link to="/ai" className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition border border-gray-100">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🤖</div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">AI Assistant</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Get help with biology questions</p>
          </Link>
          
          <Link to="/dashboard" className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center hover:shadow-lg transition border border-gray-100">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🏆</div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Certificates</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Earn certificates for your achievements</p>
          </Link>
        </div>

        {/* Topics Progress Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">📖 Your Study Progress</h2>
          
          {stats.topicsProgress && stats.topicsProgress.length > 0 ? (
            <div className="space-y-4">
              {stats.topicsProgress.map((topic, idx) => (
                <div key={idx} className="border-b pb-4 last:border-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <span className="font-medium text-gray-800">{topic.topic}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${topic.quizPassed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {topic.quizPassed ? '✓ PASSED' : '📝 IN PROGRESS'}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between text-xs sm:text-sm text-gray-500 mb-2 gap-2">
                    <span>Best Score: {topic.bestQuizScore || 0}%</span>
                    <span>Quizzes: {topic.quizAttempts?.length || 0}</span>
                    <span>Lessons: {topic.completedLessons?.length || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${topic.bestQuizScore || 0}%` }}
                    ></div>
                  </div>
                  <div className="mt-2">
                    <Link to={`/quiz/${encodeURIComponent(topic.topic)}`} className="text-sm text-blue-600 hover:underline">
                      Take Quiz →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-3">🎯</div>
              <p>No progress yet. Start learning to see your progress!</p>
              <Link to="/topics" className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Start Learning Now →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🧬</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Master Biology with BioLearn
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete SS1, SS2, SS3 Biology Curriculum • Interactive Lessons • Practice Quizzes • AI Assistant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
                🚀 Get Started Free
              </Link>
              <Link to="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition text-lg">
                📖 Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Why Choose BioLearn?</h2>
          <p className="text-gray-600 mt-2">Complete Biology learning platform for Nigerian secondary school students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">24 Complete Topics</h3>
            <p className="text-gray-600">Full SS1, SS2, SS3 curriculum covering all biology topics</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">480 Practice Questions</h3>
            <p className="text-gray-600">20 questions per topic with instant feedback and explanations</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
            <p className="text-gray-600">Get instant explanations and answers to your biology questions</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning progress and quiz scores</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Certificates</h3>
            <p className="text-gray-600">Earn certificates after completing each class level</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Exam Ready</h3>
            <p className="text-gray-600">Prepare for WAEC, NECO, JAMB and other exams</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">24+</div>
              <div className="opacity-90">Topics</div>
            </div>
            <div>
              <div className="text-4xl font-bold">480+</div>
              <div className="opacity-90">Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100+</div>
              <div className="opacity-90">Lessons</div>
            </div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="opacity-90">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Master Biology?</h2>
        <p className="text-gray-600 mb-8">Join thousands of students learning Biology with BioLearn</p>
        <Link to="/signup" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg inline-block">
          Start Learning Now 🚀
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
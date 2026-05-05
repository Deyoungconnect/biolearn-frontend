import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://biolearn-api.onrender.com/api';

function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      // ✅ THIS IS THE ONLY LINE THAT CHANGED
      const response = await axios.get(`${API_URL}/quiz`);
      setTopics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setLoading(false);
    }
  };

  // Get class for each topic (you can adjust based on your data)
  const getTopicClass = (topicName) => {
    const ss1Topics = ['Introduction to Biology', 'Cell Biology', 'Classification', 'Nutrition', 'Photosynthesis', 'Microorganisms', 'Growth and Development', 'Irritability and Response', 'Population Studies', 'Ecological Management', 'Pests and Diseases', 'Health and Disease'];
    const ss3Topics = ['Genetics', 'Evolution', 'Ecology', 'Biotechnology', 'Pollution'];
    
    if (ss1Topics.includes(topicName)) return 'SS1';
    if (ss3Topics.includes(topicName)) return 'SS3';
    return 'SS2';
  };

  const getClassColor = (className) => {
    switch(className) {
      case 'SS1': return 'from-green-500 to-emerald-600';
      case 'SS2': return 'from-blue-500 to-indigo-600';
      case 'SS3': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getClassBadgeColor = (className) => {
    switch(className) {
      case 'SS1': return 'bg-green-100 text-green-700';
      case 'SS2': return 'bg-blue-100 text-blue-700';
      case 'SS3': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || getTopicClass(topic.topic) === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading topics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Explore Biology Topics</h1>
        <p className="text-gray-600 text-lg">Master biology with our comprehensive SS1, SS2, and SS3 curriculum</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedClass('all')}
              className={`px-5 py-2 rounded-lg font-medium transition ${selectedClass === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All Classes
            </button>
            <button
              onClick={() => setSelectedClass('SS1')}
              className={`px-5 py-2 rounded-lg font-medium transition ${selectedClass === 'SS1' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
            >
              SS1
            </button>
            <button
              onClick={() => setSelectedClass('SS2')}
              className={`px-5 py-2 rounded-lg font-medium transition ${selectedClass === 'SS2' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
            >
              SS2
            </button>
            <button
              onClick={() => setSelectedClass('SS3')}
              className={`px-5 py-2 rounded-lg font-medium transition ${selectedClass === 'SS3' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
            >
              SS3
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-500">{filteredTopics.length} topics found</p>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No topics found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, index) => {
            const topicClass = getTopicClass(topic.topic);
            const classColor = getClassColor(topicClass);
            const badgeColor = getClassBadgeColor(topicClass);
            
            return (
              <div 
                key={topic.topic} 
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${classColor} p-5 text-white relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{topic.topic}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor} bg-opacity-90`}>
                            {topicClass}
                          </span>
                          <span className="text-sm opacity-90">20 questions</span>
                        </div>
                      </div>
                      <div className="text-3xl opacity-80">📖</div>
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                    {topic.topic === 'Introduction to Biology' && 'Learn the fundamentals of biology, branches, and characteristics of living things.'}
                    {topic.topic === 'Cell Biology' && 'Explore the structure, function, and organization of cells - the basic unit of life.'}
                    {topic.topic === 'Genetics' && 'Understand heredity, DNA, genes, and how traits are passed from parents to offspring.'}
                    {topic.topic === 'Evolution' && 'Discover how species change over time through natural selection and adaptation.'}
                    {!['Introduction to Biology', 'Cell Biology', 'Genetics', 'Evolution'].includes(topic.topic) && `Master ${topic.topic.toLowerCase()} with comprehensive lessons and practice quizzes.`}
                  </p>
                  
                  <div className="flex gap-3">
                    <Link 
                      to={`/quiz/${encodeURIComponent(topic.topic)}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 group"
                    >
                      <span>✨</span>
                      <span>Take Quiz</span>
                    </Link>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="px-5 pb-4 pt-0">
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span>✓ 20 practice questions</span>
                    <span>•</span>
                    <span>📊 Track progress</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats Section */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">{topics.length}+</div>
            <div className="text-sm text-gray-600">Topics Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">480+</div>
            <div className="text-sm text-gray-600">Practice Questions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">100+</div>
            <div className="text-sm text-gray-600">Interactive Lessons</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">AI Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicsPage;git add .
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://biolearn-api.onrender.com/api';

function LessonsPage() {
  const { topic } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDiagram, setShowDiagram] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const decodedTopic = decodeURIComponent(topic);
    axios.get(`${API_URL}/lessons/topic/${encodeURIComponent(decodedTopic)}`)
      .then(res => {
        setLessons(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [topic]);

  // Mark lesson as complete
  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.post(`${API_URL}/progress/lesson-complete`, 
        { topic: decodeURIComponent(topic), lessonId },
        { headers: { 'x-auth-token': token } }
      );
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    }
  };

  // Handle next lesson with progress tracking
  const handleNextLesson = async () => {
    if (currentIndex < lessons.length - 1) {
      await markLessonComplete(lessons[currentIndex]._id);
      setCurrentIndex(prev => prev + 1);
      setShowDiagram(false);
      setImgError(false);
      setShowFullImage(false);
    }
  };

  // Handle previous lesson
  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowDiagram(false);
      setImgError(false);
      setShowFullImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading lessons...</div>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-red-600 mb-4">No lessons found. Please seed the database first!</p>
          <Link to="/topics">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">Back to Topics</button>
          </Link>
        </div>
      </div>
    );
  }

  const lesson = lessons[currentIndex];
  const progress = ((currentIndex + 1) / lessons.length) * 100;

  // Construct the full image URL
  const imageUrl = lesson.diagramUrl 
    ? `http://localhost:5000${lesson.diagramUrl}`
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Lesson {currentIndex + 1} of {lessons.length}</span>
          <span className="text-green-600 font-semibold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{lesson.subtopic}</h1>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{lesson.content}</div>

        {/* Key Terms */}
        {lesson.keyTerms && lesson.keyTerms.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">🔑 Key Terms</h3>
            <div className="flex flex-wrap gap-2">
              {lesson.keyTerms.map((term, idx) => (
                <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">{term}</span>
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        {lesson.funFacts && lesson.funFacts.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Fun Facts</h3>
            <ul className="list-disc list-inside text-yellow-800">
              {lesson.funFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Diagram Section */}
        {imageUrl && (
          <div className="mb-6">
            <button 
              onClick={() => setShowDiagram(!showDiagram)} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <span>{showDiagram ? '🔒' : '🖼️'}</span>
              <span>{showDiagram ? 'Hide Diagram' : 'Show Diagram'}</span>
            </button>
            
            {showDiagram && (
              <div className="mt-4 bg-gray-100 rounded-lg p-4">
                <div className="flex justify-center items-center">
                  <img 
                    src={imgError ? 'https://via.placeholder.com/600x400?text=Diagram+Not+Available' : imageUrl}
                    alt={lesson.subtopic}
                    className="rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '450px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                    onClick={() => setShowFullImage(true)}
                    onError={() => {
                      console.log('Image failed to load:', imageUrl);
                      setImgError(true);
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  💡 Click on the diagram to zoom in • Diagram: {lesson.subtopic}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Full Screen Image Modal */}
        {showFullImage && imageUrl && !imgError && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center cursor-pointer"
            onClick={() => setShowFullImage(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white text-2xl bg-red-600 w-10 h-10 rounded-full hover:bg-red-700 transition z-10"
              onClick={() => setShowFullImage(false)}
            >
              ✕
            </button>
            <button 
              className="absolute top-4 left-4 text-white text-2xl bg-gray-600 w-10 h-10 rounded-full hover:bg-gray-700 transition z-10"
              onClick={() => setShowFullImage(false)}
            >
              ←
            </button>
            <img 
              src={imageUrl}
              alt={lesson.subtopic}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 py-2 mx-auto w-fit px-4 rounded-full">
              {lesson.subtopic} - Click anywhere to close
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t mt-4">
          <button 
            onClick={handlePrevLesson} 
            disabled={currentIndex === 0} 
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition font-medium"
          >
            ← Previous Lesson
          </button>
          {currentIndex === lessons.length - 1 ? (
            <Link to={`/quiz/${encodeURIComponent(topic)}`}>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold animate-pulse">
                🎯 Take Quiz Now!
              </button>
            </Link>
          ) : (
            <button 
              onClick={handleNextLesson} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Next Lesson →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
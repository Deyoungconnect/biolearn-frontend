import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function LessonsPage() {
  const { topic } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDiagram, setShowDiagram] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
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
          <Link to="/">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">Back to Topics</button>
          </Link>
        </div>
      </div>
    );
  }

  const lesson = lessons[currentIndex];
  const progress = ((currentIndex + 1) / lessons.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Lesson {currentIndex + 1} of {lessons.length}</span>
          <span className="text-green-600 font-semibold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{lesson.subtopic}</h1>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{lesson.content}</div>

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

        {lesson.diagramUrl && (
          <div className="mb-6">
            <button onClick={() => setShowDiagram(!showDiagram)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              {showDiagram ? 'Hide Diagram 📊' : 'Show Visual Diagram 📊'}
            </button>
            {showDiagram && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <img src={lesson.diagramUrl} alt={lesson.subtopic} className="w-full rounded-lg shadow-md" />
                <p className="text-sm text-gray-500 mt-2 text-center">Diagram: {lesson.subtopic}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition">
            ← Previous
          </button>
          {currentIndex === lessons.length - 1 ? (
            <Link to={`/quiz/${encodeURIComponent(topic)}`}>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold animate-pulse">🎯 Take Quiz Now!</button>
            </Link>
          ) : (
            <button onClick={() => setCurrentIndex(prev => prev + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Next Lesson →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
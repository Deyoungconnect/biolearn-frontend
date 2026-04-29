import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function QuizPage() {
  const { topic } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const decodedTopic = decodeURIComponent(topic);
    axios.get(`${API_URL}/quiz/topic/${encodeURIComponent(decodedTopic)}`)
      .then(res => {
        setQuiz(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [topic]);

  const handleAnswer = (qIndex, aIndex) => {
    setAnswers({ ...answers, [qIndex]: aIndex });
  };

  const handleSubmit = async () => {
    const answerArray = quiz.questions.map((_, idx) => answers[idx]);
    const decodedTopic = decodeURIComponent(topic);
    
    try {
      const res = await axios.post(`${API_URL}/quiz/submit`, {
        answers: answerArray,
        topic: decodedTopic
      });
      setResults(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Error submitting quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-xl text-gray-600">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-yellow-600 mb-4">Quiz not available yet.</p>
          <Link to="/"><button className="bg-green-600 text-white px-6 py-2 rounded-lg">Back to Topics</button></Link>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Quiz Results 🎉</h1>
            <div className={`text-6xl font-bold mb-4 ${results.passed ? 'text-green-600' : 'text-orange-600'}`}>
              {results.percentage}%
            </div>
            <p className="text-xl mb-2">You got {results.score} out of {results.total} correct!</p>
            {results.passed ? (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">🎓 Great job! You passed!</div>
            ) : (
              <div className="bg-orange-100 text-orange-700 p-3 rounded-lg mb-4">📚 Keep learning! Try again.</div>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            <Link to={`/lessons/${topic}`}>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">📚 Review Lessons</button>
            </Link>
            <button 
              onClick={() => { setSubmitted(false); setAnswers({}); setResults(null); setCurrentQuestion(0); }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🔄 Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📝 {decodeURIComponent(topic)} Quiz</h1>
          <p className="text-gray-600">Test your knowledge! You need 70% to pass.</p>
          <div className="mt-4 text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">{currentQ.question}</h3>
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => (
              <label key={optIdx} className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition ${answers[currentQuestion] === optIdx ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="question"
                  value={optIdx}
                  checked={answers[currentQuestion] === optIdx}
                  onChange={() => handleAnswer(currentQuestion, optIdx)}
                  className="w-5 h-5 text-green-600"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
          >
            ← Previous
          </button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
            >
              Submit Quiz ✅
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Next Question →
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://biolearn-api.onrender.com/api';

function AdminQuiz() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all topics
  useEffect(() => {
    axios.get(`${API_URL}/lessons/topics`)
      .then(res => setTopics(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load existing quiz for selected topic
  const loadQuiz = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/quiz/topic/${encodeURIComponent(selectedTopic)}`);
      if (res.data.questions) {
        setQuestions(res.data.questions);
        setMessage(`Loaded ${res.data.questions.length} questions for ${selectedTopic}`);
      } else {
        setQuestions([]);
        setMessage(`No quiz found for ${selectedTopic}. Create new questions.`);
      }
    } catch (err) {
      setQuestions([]);
      setMessage(`No quiz found. Create new questions for ${selectedTopic}.`);
    }
    setLoading(false);
  };

  // Add current question to the list
  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      setMessage('Please enter a question');
      return;
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      setMessage('Please fill all 4 options');
      return;
    }
    
    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setMessage(`Question added. Total: ${questions.length + 1}`);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    setMessage(`Question removed. Total: ${newQuestions.length}`);
  };

  // Update a specific field of current question
  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // Save quiz to database
  const saveQuiz = async () => {
    if (questions.length < 5) {
      setMessage('Please add at least 5 questions before saving');
      return;
    }
    
    setLoading(true);
    try {
      const quizData = {
        topic: selectedTopic,
        class: "SS2",
        term: "First",
        timeLimit: 30,
        passingScore: 70,
        totalQuestions: questions.length,
        questions: questions.map((q, idx) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: idx < 7 ? "easy" : (idx < 14 ? "medium" : "hard")
        }))
      };
      
      await axios.post(`${API_URL}/quiz/admin/update`, quizData);
      setMessage(`✅ SUCCESS! Saved ${questions.length} questions for ${selectedTopic}`);
    } catch (err) {
      setMessage(`❌ Error saving: ${err.response?.data?.error || err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">📝 Quiz Admin Panel</h1>
      
      {/* Topic Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Select Topic:</label>
        <div className="flex gap-4">
          <select 
            className="flex-1 border rounded-lg p-2"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">-- Select a topic --</option>
            {topics.map(t => (
              <option key={t.topic} value={t.topic}>{t.topic} ({t.lessonCount} lessons)</option>
            ))}
          </select>
          <button 
            onClick={loadQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Load Quiz
          </button>
        </div>
      </div>

      {/* Add Question Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">➕ Add New Question</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Question:</label>
          <input 
            type="text"
            className="w-full border rounded-lg p-2"
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
            placeholder="Enter your question here..."
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Options:</label>
          {currentQuestion.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <span className="w-8 font-bold">{String.fromCharCode(65+idx)}.</span>
              <input 
                type="text"
                className="flex-1 border rounded-lg p-2"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65+idx)}`}
              />
              <button 
                className={`px-3 py-1 rounded ${currentQuestion.correctAnswer === idx ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
              >
                {currentQuestion.correctAnswer === idx ? '✓ Correct' : 'Set Correct'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Explanation:</label>
          <textarea 
            className="w-full border rounded-lg p-2"
            rows="2"
            value={currentQuestion.explanation}
            onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
            placeholder="Explain why the correct answer is right..."
          />
        </div>
        
        <button 
          onClick={addQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">📋 Questions ({questions.length}/20)</h2>
        <div className="max-h-96 overflow-y-auto">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No questions added yet. Use the form above to add questions.</p>
          ) : (
            questions.map((q, idx) => (
              <div key={idx} className="border-b py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{idx+1}. {q.question}</span>
                  <button 
                    onClick={() => removeQuestion(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="text-sm text-gray-600 ml-4">
                  Correct: {String.fromCharCode(65+q.correctAnswer)}. {q.options[q.correctAnswer]}
                </div>
                {q.explanation && (
                  <div className="text-xs text-gray-500 ml-4 mt-1">💡 {q.explanation}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button 
          onClick={saveQuiz}
          disabled={loading || questions.length < 5}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-bold"
        >
          {loading ? '💾 Saving...' : `💾 Save Quiz (${questions.length} questions)`}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : message.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {message}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Tip: You need at least 5 questions to save. Build up to 20 questions for each topic!</p>
        <p className="mt-1">🔒 Admin access only. Add real questions, one by one, for each topic.</p>
      </div>
    </div>
  );
}

export default AdminQuiz;

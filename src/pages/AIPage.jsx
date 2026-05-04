import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://biolearn-api.onrender.com/api';

function AIPage() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([
    { type: 'ai', message: "Hello! I'm your Biology AI Assistant. Ask me anything about the digestive system, organs, or any biology concept!" }
  ]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    
    setChat([...chat, { type: 'user', message: question }]);
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/ai/explain`, { question });
      setChat(prev => [...prev, { type: 'ai', message: res.data.explanation }]);
    } catch (err) {
      setChat(prev => [...prev, { type: 'ai', message: "Sorry, I couldn't process that. Try asking about stomach, digestion, or enzymes!" }]);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      askAI();
    }
  };

  const suggestedQuestions = [
    "What is the function of the stomach?",
    "How does the small intestine absorb nutrients?",
    "What are digestive enzymes?",
    "Explain peristalsis",
    "What does the liver do?",
    "How long is the digestive system?"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">🤖 AI Biology Assistant</h1>
          <p className="text-purple-100">Ask me anything about biology - I'll explain it in simple terms!</p>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {chat.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3/4 p-4 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow'}`}>
                <div className="font-semibold mb-1">{msg.type === 'user' ? 'You' : '🤖 BioAI'}</div>
                <div className="whitespace-pre-wrap">{msg.message}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-100 border-t">
          <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(sq)}
                className="text-xs bg-white text-purple-600 px-3 py-1 rounded-full hover:bg-purple-50 transition"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a biology question..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-semibold"
            >
              Ask AI 🤖
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPage;

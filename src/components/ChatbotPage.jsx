import React, { useState, useRef, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Send, Bot } from 'lucide-react';

export function ChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Career Assistant. Ask me anything about skill development or matching market demands.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await API.post('/chatbot', 
        { message: currentInput },
        { headers: { 'x-auth-token': token } }
      );
      
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      console.error("Chatbot connection error details:", err);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ✂️ REMOVED: Outer flex container layouts and the local sidebar block entirely */
    <div className="flex flex-col h-screen bg-slate-50 w-full">
      
      {/* Structural Title Frame */}
      <div className="p-8 border-b border-slate-200 bg-white shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bot className="text-indigo-600 h-6 w-6" /> AI Career Counselor
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">Ask questions or receive personalized path recommendations.</p>
      </div>

      {/* Message Scrolling Body */}
      <div className="flex-1 p-8 overflow-y-auto space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-4 rounded-2xl text-sm ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-600/10' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-400 border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs animate-pulse font-medium">
              AI Counselor is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Messaging Input Tray Area Form */}
      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about jobs abroad, technical certifications, skill paths..."
            className="flex-1 border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all shadow-md shadow-indigo-600/10">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
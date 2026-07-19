import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// 🚀 Explicitly exported as a named function to satisfy your App.jsx import requirements
export function ChatbotPage() {
  // State to handle ongoing message history logs
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! Ask me anything about skills, jobs, or guidance!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat view when a new bubble appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const userQuery = input;
    setInput("");
    setLoading(true);

    try {
      // Targets your live backend router route:
      const response = await axios.post("http://localhost:5000/api/chat", { 
        message: userQuery 
      });

      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, sender: "bot", text: response.data.reply }
      ]);
    } catch (error) {
      console.error("Chatbot frontend link error:", error);
      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, sender: "bot", text: "Oops! Couldn't connect to the counseling server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[480px] w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mt-4">
      <div className="bg-slate-900 text-white p-3.5 font-semibold text-center tracking-wide">
        🤖 AI Career Assistant
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
              msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-800 border border-slate-200"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-slate-400 italic pl-2 animate-pulse">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type 'how are you' or ask for a recommendation..." 
          className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500" 
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Send
        </button>
      </form>
    </div>
  );
}
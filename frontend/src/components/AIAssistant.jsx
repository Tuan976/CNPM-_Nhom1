import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Trash2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Xin chào! Tôi là trợ lý AI y tế. Tôi có thể giúp bạn tra cứu thông tin thuốc, phân tích tương tác hoặc tư vấn chuyên môn. Bạn cần giúp gì không?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai-analyze', { prompt: userMsg });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.response }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Lỗi kết nối với backend.';
      setMessages(prev => [...prev, { role: 'bot', content: `❌ **Lỗi:** ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', content: 'Xin chào! Tôi là trợ lý AI y tế. Tôi có thể giúp bạn tra cứu thông tin thuốc, phân tích tương tác hoặc tư vấn chuyên môn. Bạn cần giúp gì không?' }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">MediCheck AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">Đang trực tuyến</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          title="Xóa cuộc trò chuyện"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-xl h-fit ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 shadow-sm border border-slate-100'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} className="text-blue-600" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <span className="text-sm text-slate-500 font-medium">AI đang soạn câu trả lời...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi về thuốc hoặc bệnh lý..."
            className="w-full pl-6 pr-16 py-4 bg-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none border-none transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;

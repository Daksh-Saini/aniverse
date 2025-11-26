import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/ai';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Konnichiwa! I'm AniBot, your personal otaku assistant. Ask me for recommendations, plot explanations, or random anime facts!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await getAIResponse(messages, input);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-surface rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
            <Bot className="text-white" size={24} />
        </div>
        <div>
            <h1 className="text-white font-bold text-lg">Otaku Assistant</h1>
            <p className="text-white/80 text-xs flex items-center gap-1">
                <Sparkles size={10} /> Powered by Gemini
            </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={16} className="text-primary" />
                    </div>
                )}
                
                <div 
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-surface border border-white/5 text-slate-200 rounded-tl-none'
                    }`}
                >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} className="text-secondary" />
                    </div>
                )}
            </div>
        ))}
        {loading && (
             <div className="flex gap-3 justify-start">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-primary" />
                </div>
                <div className="bg-surface border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-white/5">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about anime recommendations..."
                className="flex-grow bg-background border border-white/10 rounded-full px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};
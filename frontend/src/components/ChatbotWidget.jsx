import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Minimize2, ChevronRight, Zap } from 'lucide-react';
import './ChatbotWidget.css';

export default function ChatbotWidget({ isHidden = false, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Have a question? I can help you explore InteractAI and its features.',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: '🚀 AI Mock Interview', action: 'interview' },
    { label: '📄 Resume ATS Check', action: 'resume' },
    { label: '💼 Hiring & Internships', action: 'jobs' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Handle Mobile Scroll Lock
  useEffect(() => {
    if (isOpen && window.innerWidth <= 600) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (isHidden) return null;

  const handleSendPrompt = (promptText) => {
    setInputMessage(promptText);
    sendMessage(promptText);
  };

  const sendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Interact.ai combines AI Career Roadmaps, Live Code Execution Mock Interviews, ATS Resume Parsing, and aggregated Job opportunities into one platform.";
      
      const lower = query.toLowerCase();
      if (lower.includes('interview') || lower.includes('mock')) {
        replyText = "To practice AI Mock Interviews with real-time feedback and IDE code execution, register or sign in to your candidate account!";
      } else if (lower.includes('job') || lower.includes('intern')) {
        replyText = "Explore high-growth tech jobs & government opportunities (ISRO, DRDO) on our Jobs & Internships Hub!";
      } else if (lower.includes('resume') || lower.includes('ats')) {
        replyText = "Use our AI Resume Studio to scan your CV against target job descriptions and get actionable ATS optimizations.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Viewport-level backdrop overlay */}
      {isOpen && (
        <div 
          className="chatbot-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`chatbot-widget-wrapper ${isOpen ? 'is-open' : ''}`}>
        {!isOpen ? (
          <button 
            className="chatbot-trigger-btn animate-bounce-subtle"
            onClick={() => setIsOpen(true)}
            title="Ask InteractAI"
          >
            <div className="trigger-pulse-glow"></div>
            <Sparkles size={20} className="sparkle-chat-icon" />
            <span className="trigger-text">Ask InteractAI</span>
            <span className="trigger-badge-dot"></span>
          </button>
        ) : (
          <div className="chatbot-window card">
          {/* Top Header */}
          <div className="chatbot-header">
            <div className="bot-info">
              <div className="bot-avatar-glow">
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <h4 className="bot-title">Ask InteractAI</h4>
                <p className="bot-status">
                  <span className="status-dot-green"></span> AI Assistant
                </p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} title="Close">
              <X size={20} />
            </button>
          </div>

          {/* Quick Action Suggestions Header */}
          <div className="chat-quick-chips">
            {quickPrompts.map((p, idx) => (
              <button 
                key={idx} 
                className="quick-chip-btn"
                onClick={() => handleSendPrompt(p.label)}
              >
                <Zap size={11} /> {p.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="chatbot-body">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'bot-wrapper'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="msg-avatar bot">
                    <Bot size={13} />
                  </div>
                )}
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="msg-avatar user">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form className="chatbot-footer" onSubmit={handleFormSubmit}>
            <input 
              type="text" 
              placeholder="Ask a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" disabled={!inputMessage.trim()} aria-label="Send">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
      </div>
    </>
  );
}

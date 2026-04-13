import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpaceBackground from './components/SpaceBackground';
import SuggestionChips from './components/SuggestionChips';
import MessageBubble from './components/MessageBubble';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOPIC_TABS = [
  { label: 'All',       icon: '🌌' },
  { label: 'Geography', icon: '🌍' },
  { label: 'Space',     icon: '🚀' },
  { label: 'Planets',   icon: '🪐' },
  { label: 'Disasters', icon: '🌋' },
];

export default function App() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: "Hello, explorer! I'm AstroGeo AI powered by Gemini. Ask me anything about Earth's geography or the cosmos — countries, rivers, mountains, space missions, planets, black holes, and more!",
  }]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState('All');
  const [history, setHistory]       = useState([]);
  const bottomRef                   = useRef(null);
  const inputRef                    = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query || loading) return;

    const currentHistory = [...history];
    setMessages(prev => [
      ...prev,
      { role: 'user', text: query },
      { role: 'bot', isLoading: true, text: '' },
    ]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: query,
        history: currentHistory,
      });
      const reply = res.data.reply;
      setHistory(prev => [
        ...prev,
        { role: 'user',  parts: [query] },
        { role: 'model', parts: [reply] },
      ]);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'bot', text: reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'bot', text: 'Unable to reach the backend. Make sure Flask is running on port 5000.' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'bot',
      text: 'Chat cleared! Ask me anything about geography or space.',
    }]);
    setHistory([]);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <SpaceBackground />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', minHeight: '100vh',
        padding: '20px 16px',
      }}>

        {/* ── Header ── */}
        <header style={{
          width: '100%', maxWidth: '760px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '50%',
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.4)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '22px',
            }}>🌌</div>
            <div>
              <h1 style={{
                color: '#e2d9f3', fontSize: '22px',
                fontWeight: 700, letterSpacing: '1px', margin: 0,
              }}>
                Astro<span style={{ color: '#a78bfa' }}>Geo</span> AI
                <span style={{
                  fontSize: '10px', marginLeft: '8px',
                  background: 'rgba(66,133,244,0.2)',
                  color: '#4285f4', padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(66,133,244,0.3)',
                  verticalAlign: 'middle',
                }}>Gemini</span>
              </h1>
              <p style={{ color: '#7c6fa0', fontSize: '11px', margin: 0 }}>
                Earth · Space · Intelligence
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={clearChat}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', padding: '5px 14px',
                color: '#7c6fa0', fontSize: '11px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#e2d9f3'}
              onMouseLeave={e => e.currentTarget.style.color = '#7c6fa0'}
            >
              🗑 Clear
            </button>
            <span style={{
              fontSize: '11px',
              background: 'rgba(93,202,165,0.1)',
              color: '#5dcaa5', padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(93,202,165,0.3)',
            }}>● Online</span>
          </div>
        </header>

        {/* ── Topic Tabs ── */}
        <div style={{
          display: 'flex', gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {TOPIC_TABS.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                background: activeTab === tab.label
                  ? 'rgba(167,139,250,0.2)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === tab.label
                  ? 'rgba(167,139,250,0.6)'
                  : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '20px', padding: '6px 16px',
                color: activeTab === tab.label ? '#e2d9f3' : '#7c6fa0',
                fontSize: '12px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Chat Window ── */}
        <div style={{
          width: '100%', maxWidth: '760px',
          background: 'rgba(3,0,30,0.78)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: '20px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 240px)',
          minHeight: '420px',
        }}>

          {/* Messages area */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '20px 16px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {/* Suggestion chips — shown only at start */}
            {messages.length === 1 && (
              <div style={{ marginTop: '12px' }}>
                <p style={{
                  color: '#7c6fa0', fontSize: '12px',
                  textAlign: 'center', marginBottom: '14px',
                }}>
                  ✨ Try asking one of these:
                </p>
                <SuggestionChips onSelect={sendMessage} />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            borderTop: '1px solid rgba(167,139,250,0.15)',
            padding: '14px 16px',
            background: 'rgba(3,0,30,0.6)',
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about space or Earth geography..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  borderRadius: '24px',
                  padding: '11px 20px',
                  color: '#e2d9f3',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: '46px', height: '46px',
                  borderRadius: '50%',
                  background: loading || !input.trim()
                    ? 'rgba(109,40,217,0.25)'
                    : 'linear-gradient(135deg, #6d28d9, #a78bfa)',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  boxShadow: loading || !input.trim()
                    ? 'none'
                    : '0 0 16px rgba(167,139,250,0.4)',
                }}
              >
                {loading ? '⏳' : '🚀'}
              </button>
            </div>
            <p style={{
              color: '#4a3f6b', fontSize: '11px',
              marginTop: '8px', textAlign: 'center',
            }}>
              Powered by LLaMA 3 · Groq · {messages.filter(m => m.role === 'user').length} questions asked
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        input::placeholder { color: #4a3f6b; }
        input:focus {
          border-color: rgba(167,139,250,0.6) !important;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.08);
        }
      `}</style>
    </div>
  );
}
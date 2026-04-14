import { useState } from 'react';

function formatText(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return (
      <div key={i} style={{ color: '#a78bfa', fontWeight: 700, fontSize: '13px', marginTop: '10px' }}>
        {line.slice(4)}
      </div>
    );
    if (line.startsWith('## ')) return (
      <div key={i} style={{ color: '#a78bfa', fontWeight: 700, fontSize: '14px', marginTop: '10px' }}>
        {line.slice(3)}
      </div>
    );
    if (line.startsWith('**') && line.endsWith('**')) return (
      <div key={i} style={{ fontWeight: 700, color: '#e2d9f3', marginTop: '6px' }}>
        {line.slice(2, -2)}
      </div>
    );
    if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) return (
      <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <span style={{ color: '#a78bfa', flexShrink: 0 }}>•</span>
        <span>{line.slice(2)}</span>
      </div>
    );
    if (/^\d+\./.test(line)) {
      const dot = line.indexOf('.');
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <span style={{ color: '#a78bfa', flexShrink: 0, minWidth: '18px' }}>{line.slice(0, dot + 1)}</span>
          <span>{line.slice(dot + 1).trim()}</span>
        </div>
      );
    }
    if (line === '') return <div key={i} style={{ height: '6px' }} />;
    return <div key={i}>{line}</div>;
  });
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }) {
  const isBot = message.role === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex', gap: '10px',
      alignItems: 'flex-start',
      flexDirection: isBot ? 'row' : 'row-reverse',
      animation: 'slideUp 0.3s ease-out both',
    }}>
      {/* Avatar */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
        background: isBot ? 'rgba(167,139,250,0.15)' : 'rgba(93,202,165,0.15)',
        border: `1px solid ${isBot ? 'rgba(167,139,250,0.4)' : 'rgba(93,202,165,0.4)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
      }}>
        {isBot ? '🌌' : '👤'}
      </div>

      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Bubble */}
        <div style={{
          background: isBot ? 'rgba(255,255,255,0.06)' : 'rgba(93,202,165,0.1)',
          border: `1px solid ${isBot ? 'rgba(167,139,250,0.2)' : 'rgba(93,202,165,0.25)'}`,
          borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
          padding: '12px 16px',
          position: 'relative',
        }}>
          {message.isLoading ? (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', height: '20px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#a78bfa',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
              <span style={{ color: '#7c6fa0', fontSize: '11px', marginLeft: '6px' }}>
                Thinking...
              </span>
            </div>
          ) : (
            <div style={{ color: isBot ? '#e2d9f3' : '#9fe1cb', fontSize: '13.5px', lineHeight: '1.75' }}>
              {isBot ? formatText(message.text) : message.text}
            </div>
          )}
        </div>

        {/* Footer — timestamp + copy */}
        {!message.isLoading && message.text && (
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '8px', paddingLeft: isBot ? '4px' : '0',
            justifyContent: isBot ? 'flex-start' : 'flex-end',
          }}>
            <span style={{ fontSize: '10px', color: '#4a3f6b' }}>
              {message.time || ''}
            </span>
            {isBot && (
              <>
                <span style={{ fontSize: '10px', color: '#4a3f6b' }}>✨ LLaMA 3.3</span>
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'none', border: 'none',
                    color: copied ? '#5dcaa5' : '#4a3f6b',
                    fontSize: '10px', cursor: 'pointer',
                    padding: '0', transition: 'color 0.2s',
                  }}
                >
                  {copied ? '✓ Copied' : '⧉ Copy'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
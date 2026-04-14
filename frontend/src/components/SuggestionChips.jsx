const ALL_SUGGESTIONS = [
  { icon: '🏔️', text: 'What is the tallest mountain in the world?',   topic: 'Geography' },
  { icon: '🌍', text: 'Which countries border France?',                topic: 'Geography' },
  { icon: '🌊', text: 'What is the deepest ocean in the world?',       topic: 'Geography' },
  { icon: '🌋', text: 'What are the most active volcanoes on Earth?',  topic: 'Disasters' },
  { icon: '🏜️', text: 'What is the largest desert in the world?',     topic: 'Geography' },
  { icon: '🌐', text: 'Which is the longest river in the world?',      topic: 'Geography' },
  { icon: '🚀', text: 'Tell me about the Apollo 11 mission',           topic: 'Space'     },
  { icon: '🪐', text: 'How many moons does Jupiter have?',             topic: 'Planets'   },
  { icon: '☀️', text: 'What causes a solar flare?',                   topic: 'Space'     },
  { icon: '🌌', text: 'What is a black hole?',                         topic: 'Space'     },
  { icon: '🛸', text: 'What was the first satellite in space?',        topic: 'Space'     },
  { icon: '🌑', text: 'How was the Moon formed?',                      topic: 'Planets'   },
  { icon: '💫', text: 'How many galaxies are in the universe?',        topic: 'Space'     },
  { icon: '🌪️', text: 'What causes earthquakes?',                     topic: 'Disasters' },
];

export default function SuggestionChips({ onSelect, activeTab = 'All' }) {
  const filtered = activeTab === 'All'
    ? ALL_SUGGESTIONS
    : ALL_SUGGESTIONS.filter(s => s.topic === activeTab);

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap',
      gap: '8px', justifyContent: 'center',
      padding: '0 12px',
    }}>
      {filtered.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s.text)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '20px', padding: '6px 14px',
            color: '#b8a9d9', fontSize: '12px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(167,139,250,0.15)';
            e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)';
            e.currentTarget.style.color = '#e2d9f3';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(167,139,250,0.25)';
            e.currentTarget.style.color = '#b8a9d9';
          }}
        >
          <span style={{ fontSize: '14px' }}>{s.icon}</span>
          {s.text}
        </button>
      ))}
    </div>
  );
}
import { useEffect, useMemo, useState } from 'react';
import { getVocabularyWords } from '../api/api';
import RenderRTE from '../utils/renderRTE';

export default function Flashcards() {
  const [difficulty, setDifficulty] = useState('all');
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState({}); // uid -> boolean

  useEffect(() => {
    setLoading(true);
    getVocabularyWords(difficulty)
      .then(setWords)
      .finally(() => setLoading(false));
  }, [difficulty]);

  const items = useMemo(() => words ?? [], [words]);

  return (
    <div>
      <h1 style={{ marginBottom: 6 }}>Flashcards</h1>
      <p style={{ marginTop: 0, color: '#666' }}>
        Tap a card to flip. Filter by difficulty.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['all', 'easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid #ddd',
              fontWeight: difficulty === d ? 700 : 400,
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No words found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {items.map((w) => {
            const isFlipped = !!flipped[w.uid];
            return (
              <div
                key={w.uid}
                onClick={() =>
                  setFlipped((prev) => ({ ...prev, [w.uid]: !prev[w.uid] }))
                }
                style={{
                  border: '1px solid #eee',
                  borderRadius: 12,
                  padding: 14,
                  cursor: 'pointer',
                  minHeight: 140,
                }}
                title="Click to flip"
              >
                {!isFlipped ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#777' }}>
                        {w.difficult}
                      </span>
                      <span style={{ fontSize: 12, color: '#777' }}>front</span>
                    </div>
                    <h2 style={{ marginBottom: 0 }}>{w.title}</h2>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#777' }}>
                        {w.difficult}
                      </span>
                      <span style={{ fontSize: 12, color: '#777' }}>back</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Meaning:</strong>
                      <RenderRTE doc={w.meaning} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <strong>Example:</strong>
                      <RenderRTE doc={w.example_usage} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderRTE(val) {
  if (!val) return null;
  if (typeof val === 'string') return <p style={{ marginTop: 6 }}>{val}</p>;
  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(val, null, 2)}</pre>
  );
}

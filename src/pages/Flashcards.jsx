import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVocabularyWords } from '../api/api';
import RenderRTE from '../utils/renderRTE';

export default function Flashcards({ locale }) {
  const [difficulty, setDifficulty] = useState('all');
  const [view, setView] = useState('grid'); // 'grid' | 'single'
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // grid flip state: uid -> boolean
  const [flipped, setFlipped] = useState({});

  // single view state
  const [activeIndex, setActiveIndex] = useState(0);
  const [singleFlipped, setSingleFlipped] = useState(false);

  useEffect(() => {
    setLoading(true);
    getVocabularyWords(difficulty, locale)
      .then((data) => {
        setWords(data || []);
        // reset single view index when data changes
        setActiveIndex(0);
        setSingleFlipped(false);
      })
      .finally(() => setLoading(false));
  }, [difficulty, locale]);

  const items = useMemo(() => words ?? [], [words]);
  const activeWord = items[activeIndex];

  const goPrev = useCallback(() => {
    setSingleFlipped(false);
    setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setSingleFlipped(false);
    setActiveIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  useEffect(() => {
    if (view !== 'single') return;
    if (!items.length) return;

    function onKeyDown(e) {
      // prevent scroll on space
      if (e.key === ' ') e.preventDefault();

      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === ' ' || e.key === 'Enter') setSingleFlipped((v) => !v);
      else if (e.key === 'Escape') setSingleFlipped(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [view, items.length, goPrev, goNext]);

  return (
    <div>
      <h1 style={{ marginBottom: 6 }}>Flashcards</h1>
      <p style={{ marginTop: 0, color: '#666' }}>
        Toggle between all cards and a focused single-card practice mode.
      </p>

      {/* Difficulty filter */}
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}
      >
        {['all', 'easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid #ddd',
              fontWeight: difficulty === d ? 700 : 400,
              background: difficulty === d ? '#f7f7f7' : 'white',
            }}
          >
            {d}
          </button>
        ))}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setView('grid')}
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid #ddd',
              fontWeight: view === 'grid' ? 700 : 400,
              background: view === 'grid' ? '#f7f7f7' : 'white',
            }}
          >
            All cards
          </button>
          <button
            onClick={() => setView('single')}
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid #ddd',
              fontWeight: view === 'single' ? 700 : 400,
              background: view === 'single' ? '#f7f7f7' : 'white',
            }}
          >
            Single card
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No words found.</p>
      ) : view === 'grid' ? (
        /* GRID VIEW */
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
                style={gridFlipStyles.scene}
                onClick={() =>
                  setFlipped((prev) => ({ ...prev, [w.uid]: !prev[w.uid] }))
                }
                title="Click to flip"
              >
                <div style={gridFlipStyles.card(isFlipped)}>
                  {/* FRONT */}
                  <div
                    style={{ ...gridFlipStyles.face, ...gridFlipStyles.front }}
                  >
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
                  </div>

                  {/* BACK */}
                  <div
                    style={{ ...gridFlipStyles.face, ...gridFlipStyles.back }}
                  >
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

                    {/* Scrollable content area */}
                    <div
                      style={{
                        marginTop: 8,
                        maxHeight: 120, // adjust if you want
                        overflowY: 'auto',
                        paddingRight: 6, // space for scrollbar
                      }}
                    >
                      <div>
                        <strong>Meaning:</strong>
                        <RenderRTE doc={w.meaning} />
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <strong>Example:</strong>
                        <RenderRTE doc={w.example_usage} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* SINGLE VIEW */
        <div>
          {/* top controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 10,
            }}
          >
            <button
              onClick={goPrev}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #ddd',
              }}
            >
              ← Previous
            </button>

            <div style={{ fontSize: 13, color: '#666' }}>
              {items.length === 0 ? '0' : activeIndex + 1} / {items.length}
            </div>

            <button
              onClick={goNext}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #ddd',
              }}
            >
              Next →
            </button>
          </div>

          {/* big card */}
          <div style={flipStyles.scene}>
            <div
              onClick={() => setSingleFlipped((v) => !v)}
              style={flipStyles.card(singleFlipped)}
              title="Click to flip (Space / Enter also works)"
            >
              {/* FRONT */}
              <div style={{ ...flipStyles.face, ...flipStyles.front }}>
                {!activeWord ? (
                  <p>No word selected.</p>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#777' }}>
                        {activeWord.difficult}
                      </span>
                      <span style={{ fontSize: 12, color: '#777' }}>front</span>
                    </div>

                    <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 34 }}>
                      {activeWord.title}
                    </h2>

                    <p style={{ marginTop: 0, color: '#666' }}>
                      Click to reveal meaning & example.
                    </p>
                  </>
                )}
              </div>

              {/* BACK */}
              <div style={{ ...flipStyles.face, ...flipStyles.back }}>
                {!activeWord ? (
                  <p>No word selected.</p>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#777' }}>
                        {activeWord.difficult}
                      </span>
                      <span style={{ fontSize: 12, color: '#777' }}>back</span>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <strong>Meaning:</strong>
                      <RenderRTE doc={activeWord.meaning} />
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <strong>Example:</strong>
                      <RenderRTE doc={activeWord.example_usage} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* small actions */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 10,
              justifyContent: 'space-between',
            }}
          >
            <div>
              <button
                onClick={() => setSingleFlipped(false)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #ddd',
                }}
              >
                Reset (front)
              </button>

              <button
                onClick={() => {
                  // pick a random card for practice
                  const idx = Math.floor(Math.random() * items.length);
                  setActiveIndex(idx);
                  setSingleFlipped(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #ddd',
                }}
              >
                Random
              </button>
            </div>
            <div style={{ fontSize: 16, color: '#888' }}>
              ←/→ navigate • Space flip • Esc reset
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const flipStyles = {
  scene: {
    perspective: 1200,
  },
  card: (flipped) => ({
    position: 'relative',
    border: '1px solid #eee',
    borderRadius: 16,
    padding: 0, // padding goes inside faces
    cursor: 'pointer',
    minHeight: 280,
    background: 'transparent',
    transformStyle: 'preserve-3d',
    transition: 'transform 840ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }),
  face: {
    position: 'absolute',
    inset: 0,
    borderRadius: 16,
    background: 'white',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    padding: 18,
    overflow: 'hidden',
  },
  front: {
    transform: 'rotateY(0deg)',
  },
  back: {
    transform: 'rotateY(180deg)',
  },
};

const gridFlipStyles = {
  scene: {
    perspective: 900,
  },
  card: (flipped) => ({
    position: 'relative',
    minHeight: 200,
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    transition: 'transform 720ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }),
  face: {
    position: 'absolute',
    inset: 0,
    border: '1px solid #eee',
    borderRadius: 12,
    background: 'white',
    padding: 14,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  front: {
    transform: 'rotateY(0deg)',
  },
  back: {
    transform: 'rotateY(180deg)',
  },
};

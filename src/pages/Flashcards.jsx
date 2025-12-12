import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVocabularyWords } from '../api/api';
import RenderRTE from '../utils/renderRTE';

export default function Flashcards({ locale }) {
  const [difficulty, setDifficulty] = useState('all');
  const [view, setView] = useState('grid'); // 'grid' | 'single'
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [flipped, setFlipped] = useState({}); // uid -> boolean

  const [activeIndex, setActiveIndex] = useState(0);
  const [singleFlipped, setSingleFlipped] = useState(false);

  useEffect(() => {
    setLoading(true);
    getVocabularyWords(difficulty, locale)
      .then((data) => {
        setWords(data || []);
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
      <h1 className="h1">Flashcards</h1>
      <p className="sub">
        Toggle between all cards and a focused single-card practice mode.
      </p>

      {/* Filters + View Toggle */}
      <div className="filters">
        {['all', 'easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`toggle ${difficulty === d ? 'active' : ''}`}
          >
            {d}
          </button>
        ))}

        <div className="spacer" />

        <button
          onClick={() => setView('grid')}
          className={`toggle ${view === 'grid' ? 'active' : ''}`}
        >
          All cards
        </button>
        <button
          onClick={() => setView('single')}
          className={`toggle ${view === 'single' ? 'active' : ''}`}
        >
          Single card
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">No words found.</p>
      ) : view === 'grid' ? (
        /* GRID VIEW */
        <div className="grid">
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
                    <div className="card card-pad" style={{ height: '100%' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <span className="badge">{w.difficulty}</span>
                        <span className="muted" style={{ fontSize: 12 }}>
                          front
                        </span>
                      </div>
                      <h2 style={{ margin: 0, fontSize: 22 }}>{w.title}</h2>
                      <p className="muted" style={{ marginTop: 10 }}>
                        Tap to reveal meaning.
                      </p>
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    style={{ ...gridFlipStyles.face, ...gridFlipStyles.back }}
                  >
                    <div className="card card-pad" style={{ height: '100%' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span className="badge">{w.difficulty}</span>
                        <span className="muted" style={{ fontSize: 12 }}>
                          back
                        </span>
                      </div>

                      {/* scrollable area */}
                      <div
                        style={{
                          marginTop: 10,
                          maxHeight: 135,
                          overflowY: 'auto',
                          paddingRight: 6,
                        }}
                      >
                        <div>
                          <strong>Meaning:</strong>
                          <RenderRTE doc={w.meaning} />
                        </div>

                        <div style={{ marginTop: 10 }}>
                          <strong>Example:</strong>
                          <RenderRTE doc={w.example_usage} />
                        </div>
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
              marginBottom: 12,
            }}
          >
            <button onClick={goPrev} className="btn">
              ← Previous
            </button>

            <div className="muted" style={{ fontSize: 13 }}>
              {activeIndex + 1} / {items.length}
            </div>

            <button onClick={goNext} className="btn">
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
                <div className="card card-pad-lg" style={{ height: '100%' }}>
                  {!activeWord ? (
                    <p className="muted">No word selected.</p>
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
                        <span className="badge">{activeWord.difficult}</span>
                        <span className="muted" style={{ fontSize: 12 }}>
                          front
                        </span>
                      </div>

                      <h2
                        style={{ margin: 0, fontSize: 40, letterSpacing: -0.6 }}
                      >
                        {activeWord.title}
                      </h2>

                      <p className="muted" style={{ marginTop: 10 }}>
                        Click to reveal meaning & example.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* BACK */}
              <div style={{ ...flipStyles.face, ...flipStyles.back }}>
                <div className="card card-pad-lg" style={{ height: '100%' }}>
                  {!activeWord ? (
                    <p className="muted">No word selected.</p>
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
                        <span className="badge">{activeWord.difficult}</span>
                        <span className="muted" style={{ fontSize: 12 }}>
                          back
                        </span>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <strong>Meaning:</strong>
                        <RenderRTE doc={activeWord.meaning} />
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <strong>Example:</strong>
                        <RenderRTE doc={activeWord.example_usage} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* bottom actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginTop: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSingleFlipped(false)} className="btn">
                Reset (front)
              </button>

              <button
                onClick={() => {
                  const idx = Math.floor(Math.random() * items.length);
                  setActiveIndex(idx);
                  setSingleFlipped(false);
                }}
                className="btn btn-primary"
              >
                Random
              </button>
            </div>

            <div className="muted" style={{ fontSize: 13 }}>
              ←/→ navigate • Space flip • Esc reset
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const flipStyles = {
  scene: { perspective: 1200 },
  card: (flipped) => ({
    position: 'relative',
    borderRadius: 18,
    padding: 0,
    cursor: 'pointer',
    minHeight: 320,
    background: 'transparent',
    transformStyle: 'preserve-3d',
    transition: 'transform 1000ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }),
  face: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    background: 'transparent',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  front: { transform: 'rotateY(0deg)' },
  back: { transform: 'rotateY(180deg)' },
};

const gridFlipStyles = {
  scene: { perspective: 900 },
  card: (flipped) => ({
    position: 'relative',
    minHeight: 220,
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    transition: 'transform 1000ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  }),
  face: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  front: { transform: 'rotateY(0deg)' },
  back: { transform: 'rotateY(180deg)' },
};

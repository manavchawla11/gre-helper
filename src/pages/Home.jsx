import { useEffect, useState } from 'react';
import { getWordOfTheDay } from '../api/api';
import RenderRTE from '../utils/renderRTE';

export default function Home() {
  const [wotd, setWotd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWordOfTheDay()
      .then(setWotd)
      .finally(() => setLoading(false));
  }, []);

  // adjust this depending on your reference field uid
  const wordEntry = wotd?.word_ref?.[0];
  console.log('wordEntry', wordEntry);

  return (
    <div>
      <h1 style={{ marginBottom: 6 }}>Word of the Day</h1>
      <p style={{ marginTop: 0, color: '#666' }}>
        Learn one word daily. Build vocab without burnout.
      </p>

      {loading ? (
        <p>Loading…</p>
      ) : !wordEntry ? (
        <p>No Word of the Day set yet.</p>
      ) : (
        <div
          style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>{wordEntry.title}</h2>
            <span
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid #ddd',
              }}
            >
              {wordEntry.difficulty}
            </span>
          </div>

          <div style={{ height: 10 }} />

          <div>
            <h3 style={{ marginBottom: 6 }}>Meaning</h3>
            <div>
              <RenderRTE doc={wordEntry.meaning} />
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div>
            <h3 style={{ marginBottom: 6 }}>Example</h3>
            <RenderRTE doc={wordEntry.example_usage} />
          </div>
        </div>
      )}

      <div style={{ height: 28 }} />

      <div
        id="subscribe"
        style={{ borderTop: '1px solid #eee', paddingTop: 18 }}
      >
        <h2 style={{ marginBottom: 6 }}>Get the word daily</h2>
        <p style={{ marginTop: 0, color: '#666' }}>
          Subscribe to receive the Word of the Day in your inbox.
        </p>

        {/* MVP UI only (we'll wire it up once you decide backend approach) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('We’ll wire this in after the subscriber API is set up.');
          }}
          style={{ display: 'flex', gap: 8, maxWidth: 420 }}
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: '1px solid #ddd',
            }}
          />
          <button style={{ padding: '10px 14px', borderRadius: 10 }}>
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

function renderRTE(val) {
  // MVP: if you're using plain text in RTE, it'll still show as string.
  if (!val) return null;
  if (typeof val === 'string') return <p style={{ marginTop: 0 }}>{val}</p>;

  // If JSON RTE is enabled, you’ll want Contentstack’s JSON RTE renderer later.
  // For now, show a simple fallback:
  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(val, null, 2)}</pre>
  );
}

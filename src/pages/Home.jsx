import { useEffect, useState } from 'react';
import { getWordOfTheDay } from '../api/api';
import { subscribeEmail } from '../api/subscribe';
import RenderRTE from '../utils/renderRTE';

export default function Home({ locale }) {
  const [wotd, setWotd] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getWordOfTheDay(locale)
      .then(setWotd)
      .finally(() => setLoading(false));
  }, [locale]);

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

        {/* Subscription Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setStatus('loading');
            setError('');

            try {
              await subscribeEmail(email);
              setStatus('success');
              setEmail('');
            } catch (err) {
              setStatus('error');
              setError(err.message || 'Something went wrong');
            }
          }}
          style={{ display: 'flex', gap: 8, maxWidth: 420 }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: '1px solid #ddd',
            }}
            disabled={status === 'loading'}
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              opacity: status === 'loading' ? 0.6 : 1,
            }}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p style={{ color: 'green', marginTop: 8 }}>
            🎉 You’re subscribed! Check your inbox soon.
          </p>
        )}

        {status === 'error' && (
          <p style={{ color: 'red', marginTop: 8 }}>
            Something went wrong. Please try again
          </p>
        )}
      </div>
    </div>
  );
}

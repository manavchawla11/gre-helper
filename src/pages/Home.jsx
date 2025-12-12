import { useEffect, useState } from 'react';
import { getWordOfTheDay } from '../api/api';
import { subscribeEmail } from '../api/subscribe';
import Toast from '../components/Toast';
import RenderRTE from '../utils/renderRTE';

export default function Home({ locale }) {
  const [wotd, setWotd] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    getWordOfTheDay(locale)
      .then(setWotd)
      .finally(() => setLoading(false));
  }, [locale]);

  const wordEntry = wotd?.word_ref?.[0];

  async function onSubscribe(e) {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setError('');

    try {
      await subscribeEmail(email.trim());
      setStatus('success');
      setEmail('');

      setToast({
        type: 'success',
        title: 'Subscribed 🎉',
        message: 'You’ll receive the Word of the Day in your inbox.',
      });
    } catch (err) {
      setStatus('error');

      setToast({
        type: 'error',
        title: 'Something went wrong',
        message: err?.message || 'Please try again in a moment.',
      });
    }
  }

  return (
    <div>
      <h1 className="h1">Word of the Day</h1>
      <p className="sub">Learn one word daily. Build vocab without burnout.</p>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : !wordEntry ? (
        <div className="card card-pad">
          <p className="muted" style={{ margin: 0 }}>
            No Word of the Day set yet.
          </p>
        </div>
      ) : (
        <div className="card card-pad-lg">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>{wordEntry.title}</h2>
            <span className="badge">{wordEntry.difficulty}</span>
          </div>

          <div style={{ height: 12 }} />

          <div>
            <h3 style={{ marginBottom: 8 }}>Meaning</h3>
            <RenderRTE doc={wordEntry.meaning} />
          </div>

          <div style={{ height: 14 }} />

          <div>
            <h3 style={{ marginBottom: 8 }}>Example</h3>
            <RenderRTE doc={wordEntry.example_usage} />
          </div>
        </div>
      )}

      <div className="hr" />

      <div id="subscribe">
        <h2 style={{ marginBottom: 6 }}>Get the word daily</h2>
        <p className="sub" style={{ marginBottom: 12 }}>
          Subscribe to receive the Word of the Day in your inbox.
        </p>

        <form className="formrow" onSubmit={onSubscribe}>
          <input
            type="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === 'loading'}
          />

          <button
            type="submit"
            className={`btn ${status === 'loading' ? '' : 'btn-primary'}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>

        {/* {status === 'success' && (
          <p style={{ marginTop: 10, color: 'rgba(180,255,210,.95)' }}>
            🎉 You’re subscribed! Watch your inbox.
          </p>
        )}

        {status === 'error' && (
          <p style={{ marginTop: 10, color: 'rgba(255,160,160,.95)' }}>
            {error}
          </p>
        )} */}
        {toast && (
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

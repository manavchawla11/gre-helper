import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { SUPPORTED_LOCALES, getSavedLocale, saveLocale } from './api/locale';
import LocaleSelect from './components/LocaleSelect';
import Flashcards from './pages/Flashcards';
import Home from './pages/Home';

export default function App() {
  const [locale, setLocale] = useState('en-us');

  useEffect(() => {
    setLocale(getSavedLocale());
  }, []);

  function onChangeLocale(next) {
    setLocale(next);
    saveLocale(next);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: 'none' }}>
          GRE Verbal Helper
        </Link>
        <Link to="/flashcards">Flashcards</Link>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          {/* Language Switcher */}
          <div style={{ display: 'flex', gap: 6 }}>
            <LocaleSelect
              locale={locale}
              locales={SUPPORTED_LOCALES}
              onChange={onChangeLocale}
            />
          </div>

          <Link to="/#subscribe">Subscribe</Link>
        </div>
      </header>

      <div style={{ height: 16 }} />

      <Routes>
        <Route path="/" element={<Home locale={locale} />} />
        <Route path="/flashcards" element={<Flashcards locale={locale} />} />
      </Routes>
    </div>
  );
}

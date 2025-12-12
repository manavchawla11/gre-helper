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
      <div className="header">
        <div className="nav">
          <Link to="/" className="brand">
            <span className="brand-badge" />
            GRE Verbal Helper
          </Link>

          <div className="navlinks">
            <Link to="/flashcards">Flashcards</Link>
            <a href="/#subscribe">Subscribe</a>
          </div>

          <div className="spacer" />

          <LocaleSelect
            locale={locale}
            locales={SUPPORTED_LOCALES}
            onChange={onChangeLocale}
          />
        </div>
      </div>

      <div className="container">
        {/* routes here */}
        <Routes>
          <Route path="/" element={<Home locale={locale} />} />
          <Route path="/flashcards" element={<Flashcards locale={locale} />} />
        </Routes>
      </div>
    </div>
  );
}

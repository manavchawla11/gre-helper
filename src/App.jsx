import { Link, Route, Routes } from 'react-router-dom';
import Flashcards from './pages/Flashcards';
import Home from './pages/Home';

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: 'none' }}>
          GRE Verbal Helper
        </Link>
        <Link to="/flashcards">Flashcards</Link>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/#subscribe">Subscribe</Link>
        </div>
      </header>

      <div style={{ height: 16 }} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
    </div>
  );
}

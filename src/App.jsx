import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScalesPage } from './pages/ScalesPage';
import { TriadsPage } from './pages/TriadsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Guitar Scale Visualizer</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Explore scales, modes, and triads on the fretboard.
          </p>
          <Navigation />
        </header>

        <Routes>
          <Route path="/" element={<ScalesPage />} />
          <Route path="/triads" element={<TriadsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

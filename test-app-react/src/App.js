import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import StaticIframePage from './components/StaticIframePage';
import DynamicIframePage from './components/DynamicIframePage';
import ReloadIframePage from './components/ReloadIframePage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navigation">
          <div className="nav-container">
            <h1>EagleRider Iframe Test</h1>
            <div className="nav-links">
              <Link to="/static" className="nav-link">No Re-render</Link>
              <Link to="/dynamic" className="nav-link">With Dynamic State</Link>
              <Link to="/reload" className="nav-link">Reload on Scroll</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<StaticIframePage />} />
          <Route path="/static" element={<StaticIframePage />} />
          <Route path="/dynamic" element={<DynamicIframePage />} />
          <Route path="/reload" element={<ReloadIframePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

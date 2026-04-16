import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import DashboardPage from './pages/Dashboard';
import DocsDetail from './pages/DocsDetail';

const App = () => {
  // Simple check for simulation, in real app we'd use a context/provider
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return (
    <Router>
      <div className="app-root">
        <Routes>
          <Route path="/" element={<LandingPage onAuthenticate={() => {
            localStorage.setItem('auth', 'true');
            window.location.href = '/dashboard';
          }} />} />
          
          <Route path="/dashboard" element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/" />
          } />

          <Route path="/docs/:slug" element={<DocsDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

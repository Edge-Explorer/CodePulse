import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import DashboardPage from './pages/Dashboard';
import DocsDetail from './pages/DocsDetail';
import AuthCallback from './pages/AuthCallback';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/github/login';
  };

  return (
    <Router>
      <div className="app-root">
        <Routes>
          <Route path="/" element={<LandingPage onAuthenticate={handleLogin} />} />
          <Route path="/callback" element={<AuthCallback />} />
          
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

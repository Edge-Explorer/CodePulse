import React, { useState } from 'react';
import LandingPage from './pages/Landing';
import DashboardPage from './pages/Dashboard';

/**
 * Main Application Component
 * Handles the high-level routing between Authentication (Landing) 
 * and the main Application interface (Dashboard).
 */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app-root">
      {isAuthenticated ? (
        <DashboardPage />
      ) : (
        <LandingPage onAuthenticate={handleAuthentication} />
      )}
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // For now, we simulate a login to see the Dashboard
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Landing onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;

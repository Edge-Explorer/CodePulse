import { useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import DashboardPage from './pages/Dashboard';
import DocsDetail from './pages/DocsDetail';
import AuthCallback from './pages/AuthCallback';

const AppContent = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      window.location.href = 'http://localhost:8000/auth/github/login';
    }
  };

  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<LandingPage onAuthenticate={handleAuthAction} isAuthenticated={isAuthenticated} />} />
        <Route path="/callback" element={<AuthCallback />} />
        
        <Route path="/dashboard" element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/" />
        } />

        <Route path="/docs/:slug" element={<DocsDetail />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

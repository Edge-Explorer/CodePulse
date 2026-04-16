import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global Error Handler to catch hidden crashes
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #991b1b; color: white; font-family: sans-serif;">
        <h2>🚨 GHOST BUG FOUND!</h2>
        <p>${message}</p>
        <pre style="background: rgba(0,0,0,0.2); padding: 10px;">${source}:${lineno}</pre>
      </div>
    `;
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

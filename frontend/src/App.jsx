import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Zap, Shield, Search, Terminal, ChevronRight, BarChart3 } from 'lucide-react';

const App = () => {
  const [repoUrl, setRepoUrl] = useState('');

  return (
    <div className="container">
      {/* Navbar Section */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div className="glass-card" style={{ padding: '8px', display: 'flex' }}>
            <Zap size={22} className="neon-text" />
          </div>
          <h2 className="neon-text" style={{ fontSize: '1.4rem', letterSpacing: '1px' }}>CODEPULSE</h2>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
          style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '10px 20px' }}
        >
          <Github size={18} />
          <span>Login</span>
        </motion.button>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '3.8rem', marginBottom: '16px', lineHeight: 1.1 }}
        >
          Master Your <span className="neon-text">Code Quality</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}
        >
          Autonomous AI analysis for security, performance, and architecture 
          delivered in seconds using Gemini 2.0 Flash.
        </motion.p>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card"
          style={{ 
            maxWidth: '750px', 
            margin: '0 auto', 
            padding: '10px', 
            display: 'flex', 
            gap: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', color: 'var(--text-dim)' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="GitHub Repository URL (e.g., https://github.com/user/repo)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              fontSize: '1rem', 
              outline: 'none',
              padding: '12px 0'
            }}
          />
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            <span>Run Analysis</span>
            <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px' 
      }}>
        {[
          { icon: <Shield size={28} color="#6366f1" />, title: "Vulnerability Scan", desc: "Instantly detect hardcoded secrets, SQL injection risks, and dependency flaws." },
          { icon: <BarChart3 size={28} color="#a855f7" />, title: "System Architecture", desc: "Visualize and audit the internal structure and dependencies of your platform." },
          { icon: <Terminal size={28} color="#22c55e" />, title: "AI Code Reviews", desc: "Expert-level feedback on logic, maintainability, and modern best practices." }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
            className="glass-card"
            style={{ padding: '32px', textAlign: 'left' }}
          >
            <div style={{ marginBottom: '24px' }}>{feature.icon}</div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.3rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default App;

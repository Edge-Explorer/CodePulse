import React from 'react';
import { motion } from 'framer-motion';
import { Github, Zap, Shield, BarChart3, Terminal, ChevronRight } from 'lucide-react';

const Landing = ({ onLogin }) => {
  return (
    <div className="container">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={24} className="neon-text" />
          <h2 className="neon-text" style={{ fontSize: '1.4rem' }}>CODEPULSE</h2>
        </div>
        <button className="btn-primary" onClick={onLogin} style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
          <Github size={18} />
          <span>Login</span>
        </button>
      </nav>

      <div style={{ textAlign: 'center', marginBottom: '100px' }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '4rem', marginBottom: '20px' }}>
          Automate <span className="neon-text">Code Intelligence</span>
        </motion.h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '40px' }}>
          Production-grade AI for security scanning and architecture audits.
        </p>
        <button className="btn-primary" onClick={onLogin} style={{ margin: '0 auto' }}>
          Get Started
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {[
          { icon: <Shield color="#6366f1" />, title: "Security Scanner", desc: "Identify vulnerabilities instantly." },
          { icon: <BarChart3 color="#a855f7" />, title: "Architecture", desc: "Analyze system dependencies." },
          { icon: <Terminal color="#22c55e" />, title: "AI Audits", desc: "Deep code review via Gemini." }
        ].map((f, i) => (
          <div key={i} className="glass-card" style={{ padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p style={{ color: 'var(--text-dim)' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;

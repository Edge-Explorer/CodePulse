import React from 'react';
import { motion } from 'framer-motion';
import { Github, Zap, Shield, Search, Terminal } from 'lucide-react';

/**
 * Landing Page Component
 * The entry point for unauthenticated users.
 */
const Landing = ({ onAuthenticate }) => {
  return (
    <div className="container">
      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '32px 0',
        marginBottom: '64px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={24} className="neon-text" />
          <h2 className="neon-text" style={{ fontSize: '1.5rem', letterSpacing: '1px', fontWeight: 800 }}>
            CODEPULSE
          </h2>
        </div>
        <button 
          className="btn-primary" 
          onClick={onAuthenticate}
          style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}
        >
          <Github size={18} />
          <span>Sign In</span>
        </button>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '40px 0', marginBottom: '80px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}
        >
          Scale Your <span className="neon-text">Software Audits</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ 
            color: 'var(--text-dim)', 
            fontSize: '1.25rem', 
            maxWidth: '650px', 
            margin: '0 auto 48px',
            lineHeight: 1.6
          }}
        >
          The enterprise-grade platform for internal code intelligence, 
          architecture visualization, and automated security scans.
        </motion.p>
        
        <button 
          className="btn-primary" 
          onClick={onAuthenticate}
          style={{ margin: '0 auto', fontSize: '1.1rem', padding: '16px 32px' }}
        >
          <span>Initialize Platform</span>
        </button>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {[
          { icon: <Shield size={32} color="#6366f1" />, title: "Security Engine", desc: "Automated vulnerability detection and credential leak prevention." },
          { icon: <Search size={32} color="#a855f7" />, title: "Structure Insight", desc: "Deep analysis of system dependencies and architectural health." },
          { icon: <Terminal size={32} color="#22c55e" />, title: "AI Reviewer", desc: "Intelligent code reviews powered by advanced language models." }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="glass-card" 
            style={{ padding: '40px', textAlign: 'left' }}
          >
            <div style={{ marginBottom: '24px' }}>{feature.icon}</div>
            <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;

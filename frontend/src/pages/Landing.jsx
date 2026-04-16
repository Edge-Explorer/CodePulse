import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiZap, FiShield, FiSearch, FiTerminal, FiChevronRight } from 'react-icons/fi';
import { AuthButton } from '../components/ui/AuthButton';

const Meteor = ({ index }) => {
  const style = {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${2 + Math.random() * 2}s`
  };
  return <div key={index} className="meteor-effect" style={style} />;
};

const Landing = ({ onAuthenticate }) => {
  const meteors = Array.from({ length: 20 });
  const features = [
    { icon: <FiShield size={32} color="#6366f1" />, title: 'Security Engine',    desc: 'Automated vulnerability detection and leak prevention.' },
    { icon: <FiSearch size={32} color="#a855f7" />, title: 'Structure Insight',  desc: 'Deep analysis of system dependencies and health.' },
    { icon: <FiTerminal size={32} color="#22c55e" />, title: 'AI Reviewer',      desc: 'Intelligent code reviews via Gemini 2.0 Flash.' },
  ];

  return (
    <div className="container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Background Meteor Shower */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: 0.4 }}>
        {meteors.map((_, i) => <Meteor key={i} index={i} />)}
      </div>

      {/* Grid Pattern Overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: -2, 
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
      }} />

      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 0', marginBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiZap size={24} className="neon-text" />
          <h2 className="neon-text" style={{ fontSize: '1.4rem', letterSpacing: '1.5px', fontWeight: 800 }}>CODEPULSE</h2>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 0', marginBottom: '100px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}
        >
          Beta v1.0 Launching Soon
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1, letterSpacing: '-2px' }}
        >
          Master Your <span className="neon-text">Architecture</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          style={{ color: 'var(--text-dim)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.6 }}
        >
          Autonomous code intelligence that visualizes and audits your system 
          structure with surgical AI precision.
        </motion.p>
        
        <AuthButton onClick={onAuthenticate} className="mt-8" />
      </div>

      {/* Featured Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        {features.map((f, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card" 
            style={{ padding: '48px', textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}
          >
            <div style={{ marginBottom: '32px' }}>{f.icon}</div>
            <h3 style={{ marginBottom: '16px', fontSize: '1.5rem', fontWeight: 600 }}>{f.title}</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, fontSize: '1.05rem' }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;

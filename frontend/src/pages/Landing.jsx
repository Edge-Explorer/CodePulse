import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiSearch, FiTerminal } from 'react-icons/fi';
import { AuthButton } from '../components/ui/AuthButton';
import { TextHoverEffect } from '../components/ui/TextHoverEffect';
import { BackgroundRippleEffect } from '../components/ui/BackgroundRippleEffect';

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
    <div className="container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* Background Ripple Effect - NEW HERO FOUNDATION */}
      <div className="absolute inset-x-0 top-0 h-[40rem] z-[2]">
        <BackgroundRippleEffect />
      </div>

      {/* Subtle Meteor Shower Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: 0.15 }}>
        {meteors.map((_, i) => <Meteor key={i} index={i} />)}
      </div>

      {/* Content Layer - pointer-events:none lets clicks pass through to the ripple grid */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
        
        {/* Giant Interactive Brand Name - pointer-events re-enabled for mouse tracking */}
        <div className="w-full h-[15rem] md:h-[25rem] flex items-center justify-center -mt-10 mr-4" style={{ pointerEvents: 'auto' }}>
          <TextHoverEffect text="CODEPULSE" />
        </div>

        {/* GitHub Auth - re-enable pointer events for the button */}
        <div style={{ pointerEvents: 'auto' }}>
          <AuthButton onClick={onAuthenticate} className="-mt-12" />
        </div>
      </div>

      {/* Featured Bento Grid */}
      <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '80px', pointerEvents: 'none' }}>
        {features.map((f, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card" 
            style={{ padding: '40px', textAlign: 'left', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}
          >
            <div style={{ marginBottom: '24px' }}>{f.icon}</div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.4rem', fontWeight: 600 }}>{f.title}</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, fontSize: '1rem' }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;

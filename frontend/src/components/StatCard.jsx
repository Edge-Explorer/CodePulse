import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, trend, delay }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="glass-card" 
      style={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="glass-card" style={{ padding: '8px', display: 'flex', background: 'rgba(255,255,255,0.02)' }}>{icon}</div>
        <span style={{ fontSize: '0.8rem', color: trend.includes('+') ? 'var(--success)' : 'var(--text-dim)' }}>{trend}</span>
      </div>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 400 }}>{label}</h3>
      <p style={{ fontSize: '1.8rem', fontWeight: 600 }}>{value}</p>
    </motion.div>
  );
};

export default StatCard;

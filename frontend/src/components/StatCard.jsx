import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, trend, delay, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="pro-card"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
            width: '36px', height: '36px', 
            borderRadius: '10px', 
            background: 'rgba(255,255,255,0.03)', 
            display: 'grid', placeItems: 'center',
            color: color || 'var(--accent-indigo)'
        }}>
          {icon}
        </div>
        <span style={{ 
            fontSize: '11px', fontWeight: 700, 
            color: trend.startsWith('+') ? 'var(--success-green)' : 'var(--zinc-500)',
            background: trend.startsWith('+') ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
            padding: '4px 8px', borderRadius: '4px'
        }}>
          {trend}
        </span>
      </div>
      
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
        </p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            {value}
        </h3>
      </div>
    </motion.div>
  );
};

export default StatCard;

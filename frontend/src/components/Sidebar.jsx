import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiGrid, FiClock, FiCode, FiShield, FiSettings, FiLogOut } from 'react-icons/fi';

const NAV_ITEMS = [
  { id: 'dashboard', icon: FiGrid, label: 'Overview' },
  { id: 'history',   icon: FiClock, label: 'History' },
  { id: 'projects',  icon: FiCode, label: 'Projects' },
  { id: 'security',  icon: FiShield, label: 'Security' },
];

const Sidebar = ({ view, setView, isOpen }) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{
        width: isOpen ? '260px' : '80px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 16px',
        height: '100vh',
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 12px' }}>
        <div style={{ 
            width: '32px', h: '32px', 
            background: 'var(--accent-indigo)', 
            borderRadius: '8px', 
            display: 'grid', 
            placeItems: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
        }}>
            <FiZap size={18} color="white" />
        </div>
        {isOpen && (
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em', 
            color: 'white' 
          }}>
            CODEPULSE
          </h2>
        )}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id || (view === 'overview' && item.id === 'dashboard');
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--zinc-800)' : 'transparent',
                color: isActive ? 'white' : 'var(--zinc-400)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { if(!isActive) e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { if(!isActive) e.currentTarget.style.color = 'var(--zinc-400)'; }}
            >
              <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
        <button style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', 
            background: 'transparent', color: 'var(--zinc-400)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 
        }}>
          <FiSettings size={18} />
          {isOpen && <span>Settings</span>}
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', 
            background: 'transparent', color: 'var(--error-red)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, opacity: 0.8
          }}
        >
          <FiLogOut size={18} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

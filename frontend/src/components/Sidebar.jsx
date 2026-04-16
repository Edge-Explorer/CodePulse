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
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="glass-card"
      style={{
        width: isOpen ? '260px' : '80px',
        margin: '20px',
        marginRight: '0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        height: 'calc(100vh - 40px)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 8px' }}>
        <FiZap size={22} className="neon-text" />
        {isOpen && (
          <h2 className="neon-text" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            CODEPULSE
          </h2>
        )}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </motion.button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer' }}>
          <FiSettings size={20} />
          {isOpen && <span>Settings</span>}
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}>
          <FiLogOut size={20} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

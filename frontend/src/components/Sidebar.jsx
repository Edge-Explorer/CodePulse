import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, LayoutDashboard, History, 
  Code2, Shield, Settings, LogOut 
} from 'lucide-react';

const Sidebar = ({ view, setView, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { id: 'history', icon: <History size={20} />, label: 'History' },
    { id: 'projects', icon: <Code2 size={20} />, label: 'Projects' },
    { id: 'security', icon: <Shield size={20} />, label: 'Security' },
  ];

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
        height: 'calc(100vh - 40px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 8px' }}>
        <Zap size={24} className="neon-text" />
        {isOpen && <h2 className="neon-text" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>CODEPULSE</h2>}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4, background: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: view === item.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: view === item.id ? 'var(--accent-primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
            onClick={() => setView(item.id)}
          >
            {item.icon}
            {isOpen && <span style={{ fontWeight: 500 }}>{item.label}</span>}
          </motion.button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
         <button className="sidebar-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer' }}>
           <Settings size={20} />
           {isOpen && <span>Settings</span>}
         </button>
         <button className="sidebar-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}>
           <LogOut size={20} />
           {isOpen && <span>Sign Out</span>}
         </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

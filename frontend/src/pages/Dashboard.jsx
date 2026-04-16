import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiShield, FiSearch, FiChevronRight } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-dark)' }}>
      <Sidebar view="dashboard" setView={() => {}} isOpen={true} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '56px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 700 }}>Management Console</h1>
            <p style={{ color: 'var(--text-dim)' }}>Real-time repository analysis and system observability.</p>
          </div>
          <button className="btn-primary">
            <FiZap size={18} />
            <span>New Analysis</span>
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          <StatCard icon={<FiShield size={22} color="#6366f1" />} label="Health Score"  value="98.5%" trend="+0.5%" delay={0.1} />
          <StatCard icon={<FiSearch size={22} color="#a855f7" />} label="Analyses Run"  value="1,240"  trend="+12%"  delay={0.2} />
          <StatCard icon={<FiZap    size={22} color="#22c55e" />} label="Active Scans"  value="0"       trend="Stable" delay={0.3} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ padding: '40px' }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '40px' }}>Active Repositories</h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px 24px' }}>Identity</th>
                <th style={{ padding: '16px 24px' }}>Status</th>
                <th style={{ padding: '16px 24px' }}>Stack</th>
                <th style={{ padding: '16px 24px' }}></th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Edge-Explorer/CodePulse', status: 'Healthy', stack: 'FullStack' },
                { name: 'internal/core-api',       status: 'Healthy', stack: 'Python'    },
              ].map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '24px', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '24px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem',
                      background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '24px', color: 'var(--text-dim)' }}>{item.stack}</td>
                  <td style={{ padding: '24px' }}>
                    <FiChevronRight size={20} style={{ color: 'var(--text-dim)', cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;

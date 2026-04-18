import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiShield, FiSearch, FiChevronRight, FiPlus } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>
      <Sidebar view="dashboard" setView={() => {}} isOpen={true} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white', marginBottom: '8px' }}>
                Management Console
            </h1>
            <p style={{ color: 'var(--zinc-400)', fontSize: '0.95rem' }}>
                Real-time repository analysis and system observability.
            </p>
          </div>
          <button style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'white', color: 'black',
              borderRadius: '8px', fontSize: '13px', fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
          }} onMouseOver={e => e.currentTarget.style.background = '#e4e4e7'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
            <FiPlus size={16} />
            <span>New Analysis</span>
          </button>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          <StatCard icon={<FiShield size={18} />} label="Health Score" value="98.5%" trend="+0.5%" color="var(--accent-indigo)" delay={0.1} />
          <StatCard icon={<FiSearch size={18} />} label="Analyses Run" value="1,240" trend="+12%" color="var(--accent-purple)" delay={0.2} />
          <StatCard icon={<FiZap size={18} />} label="Active Scans" value="0" trend="Stable" color="var(--success-green)" delay={0.3} />
        </div>

        {/* Repositories Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pro-card"
          style={{ overflow: 'hidden' }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Active Repositories</h2>
            <div style={{ fontSize: '12px', color: 'var(--zinc-500)', fontWeight: 500 }}>Showing 2 repositories</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</th>
                    <th style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stack</th>
                    <th style={{ padding: '14px 24px' }}></th>
                </tr>
                </thead>
                <tbody>
                {[
                    { name: 'Edge-Explorer/CodePulse', status: 'Healthy', stack: 'FullStack', type: 'Production' },
                    { name: 'internal/core-api',       status: 'Healthy', stack: 'Python', type: 'Service' },
                ].map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '20px 24px' }}>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: '14px', marginBottom: '2px' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--zinc-500)' }}>{item.type}</div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                            <div className="status-pill" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--success-green)' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                                {item.status}
                            </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', background: 'var(--zinc-800)', color: 'var(--zinc-400)', fontWeight: 600 }}>
                                {item.stack}
                            </span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--zinc-500)', cursor: 'pointer', padding: '4px' }}>
                                <FiChevronRight size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;

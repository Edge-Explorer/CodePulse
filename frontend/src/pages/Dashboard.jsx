import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiShield, FiSearch, FiChevronRight, FiPlus, FiLoader } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/projects/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
          <StatCard icon={<FiShield size={18} />} label="Health Score" value={projects.length > 0 ? "98.5%" : "0%"} trend={projects.length > 0 ? "+0.5%" : "N/A"} color="var(--accent-indigo)" delay={0.1} />
          <StatCard icon={<FiSearch size={18} />} label="Total Projects" value={projects.length.toString()} trend="Active" color="var(--accent-purple)" delay={0.2} />
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
            <div style={{ fontSize: '12px', color: 'var(--zinc-500)', fontWeight: 500 }}>
                {loading ? "Loading..." : `Showing ${projects.length} repositories`}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--zinc-500)' }}>
                    <FiLoader className="animate-spin" size={24} style={{ margin: '0 auto 16px' }} />
                    <p>Fetching your repositories...</p>
                </div>
            ) : projects.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--zinc-500)' }}>
                    <p>No repositories found. Start a new analysis to see them here.</p>
                </div>
            ) : (
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
                    {projects.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '20px 24px' }}>
                                <div style={{ fontWeight: 600, color: 'white', fontSize: '14px', marginBottom: '2px' }}>{item.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--zinc-500)', fontFamily: 'monospace' }}>
                                    {item.repo_url.replace('https://github.com/', '')}
                                </div>
                            </td>
                            <td style={{ padding: '20px 24px' }}>
                                <div className="status-pill" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--success-green)' }}>
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                                    Healthy
                                </div>
                            </td>
                            <td style={{ padding: '20px 24px' }}>
                                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'var(--zinc-800)', color: 'var(--zinc-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                                    {item.language || 'Unknown'}
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
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;

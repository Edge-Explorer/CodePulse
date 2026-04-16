import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Lock, Globe, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-dark)' }}>
      <Sidebar view="dashboard" setView={() => {}} isOpen={true} />
      
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Intelligence Center</h1>
            <p style={{ color: 'var(--text-dim)' }}>Real-time monitoring and analysis overview.</p>
          </div>
          <button className="btn-primary">
            <Zap size={18} />
            <span>New Scan</span>
          </button>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px',
          marginBottom: '48px'
        }}>
          <StatCard icon={<Activity color="#6366f1" size={20} />} label="Health Score" value="94.2%" trend="+2.4%" delay={0.1} />
          <StatCard icon={<Lock color="#a855f7" size={20} />} label="Security Threats" value="0" trend="Stable" delay={0.2} />
          <StatCard icon={<Globe color="#22c55e" size={20} />} label="Total Audits" value="128" trend="+12 this week" delay={0.3} />
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card" 
          style={{ padding: '32px' }}
        >
          <h2 style={{ fontSize: '1.4rem', marginBottom: '32px' }}>Recent Repository Analysis</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px' }}>Repository</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Language</th>
                <th style={{ padding: '16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Edge-Explorer/CodePulse', status: 'Completed', lang: 'Python' },
                { name: 'OpenAI/whisper', status: 'In Progress', lang: 'Python' },
              ].map((repo, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '20px 16px', fontWeight: 500 }}>{repo.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      background: repo.status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                      color: repo.status === 'Completed' ? 'var(--success)' : 'var(--accent-secondary)'
                    }}>
                      {repo.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{repo.lang}</td>
                  <td style={{ padding: '16px' }}><ChevronRight size={18} style={{ color: 'var(--text-dim)' }} /></td>
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

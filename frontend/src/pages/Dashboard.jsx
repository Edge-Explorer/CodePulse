import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiShield, FiSearch, FiChevronRight, FiPlus, FiLoader, FiArrowLeft, FiCode, FiTrash2 } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [view, setView] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New State for Reports
  const [selectedProject, setSelectedProject] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/projects/', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const fetchReport = async (projectId) => {
    try {
      setReportLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/projects/${projectId}/report`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (err) {
      console.error("Failed to fetch report:", err);
    } finally {
      setReportLoading(false);
    }
  };

  const parseAIReport = (rawReport) => {
    if (!rawReport) return null;
    try {
      // Handle cases where Gemini wraps JSON in markdown blocks
      const cleanJson = rawReport.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parsing failed:", e);
      return { explanation: rawReport }; // Fallback
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setView('report');
    fetchReport(project.id);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newRepoUrl) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ repo_url: newRepoUrl })
      });
      if (response.ok) {
        await fetchProjects();
        setShowAddModal(false);
        setNewRepoUrl('');
      }
    } catch (err) {
      console.error("Error adding project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation(); // Don't open the report!
    if (!window.confirm("Are you sure you want to remove this project from your view? All historical data will be preserved for accountability.")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchProjects();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const renderContent = () => {
    if (view === 'report' && selectedProject) {
        const aiData = reportData?.status === 'completed' ? parseAIReport(reportData.report) : null;
        
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Report Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <button 
                        onClick={() => setView('dashboard')}
                        style={{ background: 'var(--zinc-800)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{selectedProject.name} Analysis</h2>
                        <p style={{ color: 'var(--zinc-500)', fontSize: '13px' }}>
                            {reportData?.status === 'completed' ? `Last scanned on ${new Date(reportData.scanned_at).toLocaleDateString()}` : 'Retrieving AI intelligence...'}
                        </p>
                    </div>
                </div>

                {reportLoading ? (
                    <div style={{ padding: '64px', textAlign: 'center' }}>
                        <FiLoader className="animate-spin" size={32} style={{ margin: '0 auto 24px', color: 'var(--zinc-500)' }} />
                        <p style={{ color: 'var(--zinc-400)' }}>Parsing AI analysis and architectural insights...</p>
                    </div>
                ) : reportData?.status === 'pending' ? (
                    <div className="pro-card" style={{ padding: '48px', textAlign: 'center' }}>
                        <FiZap size={48} style={{ color: 'var(--accent-indigo)', marginBottom: '24px', opacity: 0.5 }} />
                        <h3 style={{ color: 'white', marginBottom: '8px' }}>Scan in Progress</h3>
                        <p style={{ color: 'var(--zinc-500)', fontSize: '14px' }}>The AI engine is currently dissecting your repository. Check back in a few moments.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
                        {/* Main Analysis Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Executive Summary / Explanation */}
                            {(aiData?.explanation || aiData?.analysis || aiData?.summary) && (
                                <div className="pro-card" style={{ padding: '32px' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--zinc-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>Architectural Analysis</h3>
                                    <div style={{ color: 'var(--zinc-300)', fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                        {aiData.explanation || aiData.analysis || aiData.summary}
                                    </div>
                                </div>
                            )}
                            
                            {/* Security & Technical Issues */}
                            {(aiData?.security || aiData?.issues) && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--zinc-500)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px' }}>
                                        Technical Findings
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                        {(aiData.security || aiData.issues).map((issue, i) => {
                                            const severity = issue.severity?.toLowerCase() || 'medium';
                                            const sevColor = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#3b82f6';
                                            
                                            return (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="pro-card" 
                                                    style={{ padding: '24px', borderLeft: `4px solid ${sevColor}`, background: 'rgba(255,255,255,0.01)' }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                        <h4 style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{issue.title}</h4>
                                                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', background: `${sevColor}20`, color: sevColor, textTransform: 'uppercase' }}>
                                                            {severity}
                                                        </span>
                                                    </div>
                                                    <p style={{ color: 'var(--zinc-400)', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                                                        {issue.description}
                                                    </p>
                                                    {(issue.file || issue.line) && (
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--zinc-500)', fontSize: '11px', fontFamily: 'monospace', background: 'var(--zinc-900)', padding: '4px 8px', borderRadius: '4px' }}>
                                                                <FiCode size={12} />
                                                                {issue.file || 'Unknown File'}
                                                            </div>
                                                            {issue.line && (
                                                                <div style={{ color: 'var(--zinc-600)', fontSize: '11px', fontWeight: 600 }}>
                                                                    Line {issue.line}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Fallback for raw content if no structured keys found */}
                            {!aiData?.explanation && !aiData?.analysis && !aiData?.summary && !aiData?.security && !aiData?.issues && (
                                <div className="pro-card" style={{ padding: '32px' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--zinc-500)', textTransform: 'uppercase', marginBottom: '20px' }}>Raw Analysis Report</h3>
                                    <pre style={{ color: 'var(--zinc-300)', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' }}>
                                        {typeof aiData === 'string' ? aiData : JSON.stringify(aiData, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="pro-card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--zinc-500)', textTransform: 'uppercase', marginBottom: '16px' }}>Technical Stack</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'var(--zinc-800)', color: 'white', fontWeight: 700 }}>
                                        {selectedProject.language}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }

    if (view === 'dashboard') {
      return (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            <StatCard icon={<FiSearch size={18} />} label="Total Repositories" value={projects.length.toString()} trend="Active" color="var(--accent-indigo)" delay={0.1} />
            <StatCard icon={<FiZap size={18} />} label="System Status" value="Online" trend="Stable" color="var(--success-green)" delay={0.2} />
          </div>

          {/* Repositories Table */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pro-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Active Repositories</h2>
              <div style={{ fontSize: '12px', color: 'var(--zinc-500)', fontWeight: 500 }}>
                  {loading ? "Loading..." : `Showing ${projects.length} repositories`}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                      <FiLoader className="animate-spin" size={24} style={{ margin: '0 auto 16px', color: 'var(--zinc-500)' }} />
                  </div>
              ) : projects.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: 'var(--zinc-500)' }}>
                      <p>No repositories found. Start a new analysis to see them here.</p>
                  </div>
              ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                            <th style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', textTransform: 'uppercase' }}>Identity</th>
                            <th style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--zinc-500)', textTransform: 'uppercase' }}>Stack</th>
                            <th style={{ padding: '14px 24px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((item) => (
                            <tr 
                                key={item.id} 
                                onClick={() => handleProjectClick(item)}
                                style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s', cursor: 'pointer' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{item.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--zinc-500)', fontFamily: 'monospace' }}>{item.repo_url.replace('https://github.com/', '')}</div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div className="status-pill" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--success-green)' }}>
                                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                                        Healthy
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'var(--zinc-800)', color: 'var(--zinc-400)', fontWeight: 700 }}>
                                        {item.language || 'Unknown'}
                                    </span>
                                </td>
                                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                                        <button 
                                            onClick={(e) => handleDeleteProject(e, item.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--zinc-600)', cursor: 'pointer', transition: 'color 0.2s', padding: '4px' }}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--zinc-600)'}
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                        <FiChevronRight size={18} color="var(--zinc-500)" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                      </tbody>
                  </table>
              )}
            </div>
          </motion.section>
        </>
      );
    }
    
    return (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--zinc-500)', border: '1px dashed var(--border-strong)', borderRadius: '12px' }}>
            <h2 style={{ color: 'white', marginBottom: '12px' }}>{view.charAt(0).toUpperCase() + view.slice(1)} View</h2>
            <p>Connection to real-time {view} data established. Awaiting detailed component rendering.</p>
        </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>
      <Sidebar view={view} setView={setView} isOpen={true} />

      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white', marginBottom: '8px' }}>
                {view === 'dashboard' ? 'Management Console' : view.charAt(0).toUpperCase() + view.slice(1)}
            </h1>
            <p style={{ color: 'var(--zinc-400)', fontSize: '0.95rem' }}>
                {view === 'dashboard' ? 'Real-time repository analysis and system observability.' : `System-wide ${view} monitoring and reporting.`}
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: 'white', color: 'black',
              borderRadius: '8px', fontSize: '13px', fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            <FiPlus size={16} />
            <span>New Analysis</span>
          </button>
        </header>

        {renderContent()}

        {/* New Analysis Modal */}
        {showAddModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pro-card" style={{ width: '400px', padding: '32px' }}>
                    <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Start New Analysis</h2>
                    <p style={{ color: 'var(--zinc-400)', fontSize: '13px', marginBottom: '24px' }}>Provide a GitHub repository URL to initiate the AI scanning engine.</p>
                    <form onSubmit={handleAddProject}>
                        <input 
                            autoFocus
                            placeholder="https://github.com/owner/repo"
                            value={newRepoUrl}
                            onChange={(e) => setNewRepoUrl(e.target.value)}
                            style={{ 
                                width: '100%', padding: '12px 16px', borderRadius: '8px', background: 'var(--zinc-950)', 
                                border: '1px solid var(--border-strong)', color: 'white', fontSize: '14px', marginBottom: '24px', outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'transparent', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'white', color: 'black', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                {isSubmitting ? <FiLoader className="animate-spin" size={16} /> : 'Start Scan'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

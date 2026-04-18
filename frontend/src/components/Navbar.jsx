import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { FiGithub, FiStar } from 'react-icons/fi';
import { cn } from '../utils/cn';
import { NoiseBackground } from './ui/NoiseBackground';

import GooeyNav from './ui/GooeyNav';

const Navbar = ({ onConnect }) => {
  const [stars, setStars] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith('/docs/');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Fetch Stars only if needed or keep for consistency
    fetch('https://api.github.com/repos/Edge-Explorer/CodePulse')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(err => console.error("Error fetching stars:", err));

    if (!isDocsPage) {
      const observerOptions = { root: null, threshold: 0.5 };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      }, observerOptions);

      const sections = ['features', 'architecture', 'docs', 'contact'];
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      const handleScroll = () => {
        if (window.scrollY < 100) setActiveSection('home');
      };
      window.addEventListener('scroll', handleScroll);

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isDocsPage]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/github/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Features', id: 'features', href: '#features' },
    { label: 'Architecture', id: 'architecture', href: '#architecture' },
    { label: 'Docs', id: 'docs', href: '#docs' },
    { label: 'Contact', id: 'contact', href: '#contact' }
  ];

  const activeIndex = navItems.findIndex(item => item.id === activeSection);

  const handleNavClick = (item) => {
    if (activeSection === item.id && !isDocsPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    }
    
    // If we are on a different page (like docs), handle the redirect
    if (isDocsPage) {
        window.location.href = `/${item.href}`;
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-8 inset-x-0 z-[50] flex justify-center px-4"
    >
      <NoiseBackground
        containerClassName="rounded-full p-[1px] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        gradientColors={["#6366f1", "#a855f7", "#6366f1"]}
      >
        <div className="relative rounded-full bg-zinc-950/90 backdrop-blur-xl px-2 py-1 flex items-center gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 pl-3">
            <FiZap size={16} className="text-indigo-400" style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))' }} />
            <span className="text-[11px] font-black tracking-widest text-white uppercase">CODEPULSE</span>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Navigation Items */}
          <GooeyNav 
            items={navItems} 
            activeIndex={activeIndex === -1 ? undefined : activeIndex}
            onItemClick={handleNavClick}
          />

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Auth/User Section */}
          <div className="pr-1">
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-all active:scale-95"
              >
                <img 
                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`} 
                    className="w-5 h-5 rounded-full border border-white/10" 
                    alt="avatar" 
                />
                <span className="text-[11px] font-bold tracking-tight">{user.username}</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-tight hover:bg-zinc-200 transition-all active:scale-95"
              >
                <FiGithub size={14} />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>
      </NoiseBackground>
    </motion.div>
  );
};

export default Navbar;

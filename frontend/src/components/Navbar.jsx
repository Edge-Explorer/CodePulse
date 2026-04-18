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
    // Scroll to section
    const element = document.getElementById(item.id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }

    if (activeSection === item.id && !isDocsPage && !element) {
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
        containerClassName="rounded-full p-[1.5px] shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] transition-shadow duration-700"
        gradientColors={["#6366f1", "#a855f7", "#6366f1"]}
      >
        <div className={cn(
          "relative rounded-full bg-zinc-950/90 backdrop-blur-xl px-1 py-1",
          "flex items-center min-w-fit transition-all duration-500",
          isDocsPage ? "px-4" : "sm:px-2"
        )}>
          
          {isDocsPage ? (
            /* Docs Page Navbar - Minimalist */
            <Link to="/" className="flex items-center gap-3 px-4 py-1.5 text-zinc-400 hover:text-white transition-all group">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:-translate-x-1 transition-transform"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              <span className="text-sm font-bold tracking-tight">Back to System Overview</span>
            </Link>
          ) : (
            /* Landing Page Navbar - Full */
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center pl-2">
                <GooeyNav 
                    items={navItems} 
                    activeIndex={activeIndex === -1 ? undefined : activeIndex}
                    onItemClick={handleNavClick}
                />
              </div>

              <div className="h-4 w-px bg-zinc-800 mx-1 sm:mx-2" />

              {user ? (
                <div className="flex items-center gap-3 pr-2">
                   <div className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 text-[11px] font-bold">
                     <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}`} className="w-5 h-5 rounded-full border border-white/20" alt="avatar" />
                     <span>{user.username}</span>
                   </div>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-5 py-2 rounded-full",
                    "bg-white text-black text-[12px] font-bold transition-all duration-300",
                    "hover:bg-zinc-200 active:scale-[0.96]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FiGithub className="w-4 h-4" />
                    <span>Connect GitHub</span>
                  </div>
                  {stars !== null && (
                    <>
                      <div className="h-3 w-[1px] bg-black/20 mx-0.5" />
                      <div className="flex items-center gap-1">
                        <FiStar className="w-3.5 h-3.5 fill-black" />
                        <span>{stars}</span>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
                </button>
              )}
            </div>
          )}
        </div>
      </NoiseBackground>
    </motion.div>
  );
};

export default Navbar;

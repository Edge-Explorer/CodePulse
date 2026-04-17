import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/Edge-Explorer',
      color: 'hover:text-white',
      hoverBg: 'hover:bg-zinc-800'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/in/karan-shelar-779381343',
      color: 'hover:text-blue-400',
      hoverBg: 'hover:bg-blue-500/10'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: 'mailto:karanshelar8775@gmail.com',
      color: 'hover:text-red-400',
      hoverBg: 'hover:bg-red-500/10'
    }
  ];

  return (
    <footer className="relative pb-16 px-6 z-10 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto p-10 rounded-[2.5rem] bg-zinc-950/40 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative"
      >
        {/* Subtle Internal Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-red-500/5 pointer-events-none" />

        {/* Brand & Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-black text-[10px]">CP</div>
            <span className="text-lg font-black tracking-tighter text-white italic">CODEPULSE</span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-relaxed font-medium">
            Designed and Developed by <span className="text-white font-bold">Karan Shelar</span>.
          </p>
        </div>

        {/* Status & Year */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right relative z-10">
          <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </div>
          <p className="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-black">
            © {new Date().getFullYear()} Core Protocol
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;

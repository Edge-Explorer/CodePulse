import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/Edge-Explorer',
      color: 'hover:text-white',
      hoverBg: 'hover:bg-zinc-800'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/karan-shelar-779381343',
      color: 'hover:text-blue-400',
      hoverBg: 'hover:bg-blue-500/10'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:karanshelar8775@gmail.com',
      color: 'hover:text-red-400',
      hoverBg: 'hover:bg-red-500/10'
    }
  ];

  return (
    <footer id="contact" className="relative py-20 px-6 bg-black border-t border-white/[0.05] z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Brand & Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-black text-black">CP</div>
            <span className="text-xl font-black tracking-tighter text-white">CODEPULSE</span>
          </motion.div>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Architecting the future of AI-driven DevOps. 
            Designed and Developed by <span className="text-white font-bold">Karan Shelar</span>.
          </p>
        </div>

        {/* Social Connectivity */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl bg-zinc-900/50 border border-white/[0.05] text-zinc-400 transition-all duration-300 ${link.color} ${link.hoverBg} group`}
            >
              <link.icon className="w-6 h-6" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {link.name}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Status & Year */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </div>
          <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} CodePulse Core
          </p>
        </div>

      </div>

      {/* Background Decorative Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import ShinyText from './ui/ShinyText';
import { NoiseBackground } from './ui/NoiseBackground';
import ContactModal from './ContactModal';
import { cn } from '../utils/cn';

const ContactCard = ({ name, value, url, icon: Icon, colors, onClick, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="pointer-events-auto cursor-pointer"
    onClick={onClick}
  >
    <NoiseBackground
      containerClassName="w-full h-full rounded-[2rem]"
      gradientColors={colors}
    >
      <div className="group relative block p-8 rounded-[2rem] bg-zinc-950/90 backdrop-blur-xl h-full transition-all duration-300">
        <div className="flex items-start justify-between mb-8">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 group-hover:border-white/10 transition-all">
            <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="p-2 rounded-full bg-zinc-900 border border-white/5 group-hover:bg-white group-hover:text-black transition-all">
            <FiExternalLink className="w-4 h-4" />
          </div>
        </div>

        <div className="relative">
          <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{name}</h3>
          <p className="text-white text-lg font-bold tracking-tighter truncate group-hover:text-indigo-400 transition-colors">
            {value}
          </p>
        </div>

        {/* Subtle Bottom Glow */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors[0]}, transparent)`,
          }}
        />
      </div>
    </NoiseBackground>
  </motion.div>
);

const ContactSection = () => {
  const [isMailOpen, setIsMailOpen] = useState(false);

  const contacts = [
    {
      name: 'GitHub Repository',
      value: 'Edge-Explorer',
      url: 'https://github.com/Edge-Explorer',
      icon: FaGithub,
      colors: ["rgb(255, 255, 255)", "rgb(99, 102, 241)", "rgb(168, 85, 247)"],
      delay: 0.1
    },
    {
      name: 'Professional Network',
      value: 'Karan Shelar',
      url: 'https://linkedin.com/in/karan-shelar-779381343',
      icon: FaLinkedin,
      colors: ["rgb(59, 130, 246)", "rgb(37, 99, 235)", "rgb(29, 78, 216)"],
      delay: 0.2
    },
    {
      name: 'Direct Channel',
      value: 'karanshelar8775@gmail.com',
      onClick: () => setIsMailOpen(true),
      icon: FaEnvelope,
      colors: ["rgb(239, 68, 68)", "rgb(225, 29, 72)", "rgb(190, 18, 60)"],
      delay: 0.3
    }
  ];

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-extrabold tracking-tighter text-white mb-6"
        >
          Let's <ShinyText text="Connect" speed={3} color="#ffffff" shineColor="#818cf8" />.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto italic font-medium"
        >
          Architecting the future of AI-driven DevOps. Reach out through any of these premium conduits.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
        {contacts.map((contact) => (
          <ContactCard 
            key={contact.name} 
            {...contact} 
            onClick={contact.onClick || (() => window.open(contact.url, '_blank'))} 
          />
        ))}
      </div>

      <ContactModal 
        isOpen={isMailOpen} 
        onClose={() => setIsMailOpen(false)} 
        recipientEmail="karanshelar8775@gmail.com"
      />
    </section>
  );
};

export default ContactSection;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { NoiseBackground } from './ui/NoiseBackground';
import { cn } from '../utils/cn';
import axios from 'axios';

const ContactModal = ({ isOpen, onClose, recipientEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  // Body Scroll Lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    
    try {
      await axios.post('http://localhost:8000/contact', formData);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (err) {
      console.error('Failed to send email:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getButtonContent = () => {
    switch(status) {
      case 'loading': return <span className="flex items-center gap-2 animate-pulse">Transmitting...</span>;
      case 'success': return <span className="flex items-center gap-2 text-emerald-400 font-bold"><Check className="w-4 h-4" /> Message Sent!</span>;
      case 'error': return <span className="flex items-center gap-2 text-amber-400 font-bold"><AlertCircle className="w-4 h-4" /> Failed - Try Again</span>;
      default: return <>Transmit Conduit <Send className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>;
    }
  };

  const getButtonColors = () => {
    switch(status) {
      case 'success': return ["rgb(16, 185, 129)", "rgb(5, 150, 105)"];
      case 'error': return ["rgb(245, 158, 11)", "rgb(217, 119, 6)"];
      default: return ["rgb(239, 68, 68)", "rgb(225, 29, 72)"];
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Mail className="w-4 h-4 text-red-400" />
                </div>
                <h2 className="text-white font-black text-sm tracking-tight italic">Quick Transmit</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Surgical Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-600 text-[8px] uppercase tracking-widest font-black ml-1">From</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                    <input 
                      required
                      type="text"
                      placeholder="Karan Shelar"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 transition-all"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 text-[8px] uppercase tracking-widest font-black ml-1">Contact</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                    <input 
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-600 text-[8px] uppercase tracking-widest font-black ml-1">Subject</label>
                <input 
                  required
                  type="text"
                  placeholder="Inquiry Topic"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2 px-3 text-[13px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 transition-all"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-600 text-[8px] uppercase tracking-widest font-black ml-1">Message</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Type your message..."
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2 px-3 text-[13px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 transition-all resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <NoiseBackground
                  containerClassName="w-full rounded-lg"
                  gradientColors={getButtonColors()}
                >
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2 text-white font-black uppercase tracking-[0.2em] text-[10px] group disabled:opacity-70"
                  >
                    {getButtonContent()}
                  </button>
                </NoiseBackground>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;

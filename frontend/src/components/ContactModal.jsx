import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, MessageSquare, ChevronRight } from 'lucide-react';
import { NoiseBackground } from './ui/NoiseBackground';
import { cn } from '../utils/cn';

const ContactModal = ({ isOpen, onClose, recipientEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we'll use a mailto as a fallback, but the UI is ready for your SMTP backend
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto"
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

            {/* Tightened Formal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 text-[9px] uppercase tracking-widest font-black ml-1">From</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                    <input 
                      required
                      type="text"
                      placeholder="Karan Shelar"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                    <input 
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-600 text-[9px] uppercase tracking-widest font-black ml-1">Subject</label>
                <input 
                  required
                  type="text"
                  placeholder="Inquiry"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-600 text-[9px] uppercase tracking-widest font-black ml-1">Message</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Enter message..."
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 px-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <NoiseBackground
                  containerClassName="w-full rounded-xl"
                  gradientColors={["rgb(239, 68, 68)", "rgb(225, 29, 72)"]}
                >
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-white font-black uppercase tracking-[0.2em] text-[11px] group"
                  >
                    Transmit
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Header / Command Title */}
            <div className="flex items-center justify-between p-8 border-b border-white/5 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Mail className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-white font-black tracking-tight">New Message</h2>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Secure SMTP Conduit</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formal Email Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                    <input 
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                    <input 
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black ml-1">Subject</label>
                <input 
                  required
                  type="text"
                  placeholder="Collaboration Request"
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black ml-1">Formal Message</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-zinc-600 group-focus-within:text-red-400 transition-colors" />
                  <textarea 
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-[2rem] py-5 pl-12 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30 focus:bg-zinc-900 transition-all resize-none"
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <NoiseBackground
                  containerClassName="w-full rounded-2xl"
                  gradientColors={["rgb(239, 68, 68)", "rgb(225, 29, 72)"]}
                >
                  <button 
                    type="submit"
                    className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-sm group"
                  >
                    Transmit Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

import React from 'react';
import { motion } from 'framer-motion';
import { AuthButton } from '../components/ui/AuthButton';
import { TextHoverEffect } from '../components/ui/TextHoverEffect';
import { BackgroundRippleEffect } from '../components/ui/BackgroundRippleEffect';
import Navbar from '../components/Navbar';
import ArchitectureSection from '../components/ArchitectureSection';
import FeaturesSection from '../components/FeaturesSection';
import DocsOverviewSection from '../components/DocsOverviewSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Meteor = ({ index }) => {
  const style = {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${2 + Math.random() * 2}s`
  };
  return <div key={index} className="meteor-effect" style={style} />;
};

const Landing = ({ onAuthenticate }) => {
  const meteors = Array.from({ length: 20 });

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      
      {/* Floating Navigation */}
      <Navbar onConnect={onAuthenticate} />

      {/* Background Ripple Effect - lowest layer */}
      <div className="fixed inset-0 z-[1]">
        <BackgroundRippleEffect />
      </div>

      {/* Subtle Meteor Shower Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
        {meteors.map((_, i) => <Meteor key={i} index={i} />)}
      </div>

      {/* Hero Content Layer */}
      <div className="relative z-[5] text-center pt-10 flex flex-col items-center pointer-events-none">
        
        {/* Giant Interactive Brand Name */}
        <div className="w-full h-[15rem] md:h-[25rem] flex items-center justify-center -mt-10 mr-4 pointer-events-auto">
          <TextHoverEffect text="CODEPULSE" />
        </div>

        <div className="pointer-events-auto">
          <AuthButton onClick={onAuthenticate} className="-mt-12" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-[5] pointer-events-none">
        <div className="pointer-events-auto">
          <FeaturesSection />
        </div>
      </div>

      {/* Architecture Topology */}
      <ArchitectureSection />

      {/* Technical Documentation Hub */}
      <DocsOverviewSection />

      {/* Prominent Contact Hub */}
      <ContactSection />
      
    </div>
  );
};

export default Landing;

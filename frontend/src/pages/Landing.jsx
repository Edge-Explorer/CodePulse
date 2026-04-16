import React from 'react';
import { motion } from 'framer-motion';
import { AuthButton } from '../components/ui/AuthButton';
import { TextHoverEffect } from '../components/ui/TextHoverEffect';
import { BackgroundRippleEffect } from '../components/ui/BackgroundRippleEffect';
import Navbar from '../components/Navbar';

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
    <div className="container" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      
      {/* Floating Navigation */}
      <Navbar onConnect={onAuthenticate} />

      {/* Background Ripple Effect */}
      <div className="absolute inset-x-0 top-0 h-[40rem] z-[2]">
        <BackgroundRippleEffect />
      </div>

      {/* Subtle Meteor Shower Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: 0.15 }}>
        {meteors.map((_, i) => <Meteor key={i} index={i} />)}
      </div>

      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
        
        {/* Giant Interactive Brand Name */}
        <div className="w-full h-[15rem] md:h-[25rem] flex items-center justify-center -mt-10 mr-4" style={{ pointerEvents: 'auto' }}>
          <TextHoverEffect text="CODEPULSE" />
        </div>

        {/* GitHub Auth */}
        <div style={{ pointerEvents: 'auto' }}>
          <AuthButton onClick={onAuthenticate} className="-mt-12" />
        </div>
      </div>
    </div>
  );
};

export default Landing;


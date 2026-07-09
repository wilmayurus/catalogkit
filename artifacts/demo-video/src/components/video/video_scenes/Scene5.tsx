import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '📸', text: 'Upload photos in seconds' },
  { icon: '💰', text: 'Add name & price per item' },
  { icon: '🔗', text: 'Share one link — anywhere' },
  { icon: '📄', text: 'Download as PDF' },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1),  400),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4500),
      setTimeout(() => setPhase(5), 6200),
      setTimeout(() => setPhase(6), 8000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center overflow-hidden bg-[#0D0D0D]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, #f97316 0%, transparent 65%)' }}
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 0.18 } : {}}
        transition={{ duration: 2 }}
      />

      {/* Market scene overlay */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/market-scene-warm.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 0.07 } : {}}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-[6cqw] py-[2cqh]">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-[2cqw] mb-[2cqh]"
          initial={{ y: 40, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 18 }}
        >
          <div className="w-[7cqw] h-[7cqw] bg-[#FFF8F0] rounded-2xl flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" fill="none" className="w-[4.5cqw] h-[4.5cqw]" stroke="#f97316" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-[7cqw] font-black text-[#FFF8F0] font-display tracking-tight leading-none">
            CatalogKit
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-[2.8cqw] text-[#FFF8F0]/70 font-semibold mb-[2cqh] text-center leading-snug"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Stop flooding WhatsApp groups.<br />
          <span className="text-[#F5A800]">Share a catalog that sells for you.</span>
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-[1.5cqw] mb-[2cqh]"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-[1cqw] bg-white/8 border border-white/15 backdrop-blur-sm px-[2cqw] py-[1cqh] rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 3 ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: i * 0.15, type: 'spring', bounce: 0.4 }}
            >
              <span className="text-[2cqw]">{f.icon}</span>
              <span className="text-[1.6cqw] font-semibold text-white/85">{f.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* FREE badge */}
        <motion.div
          className="bg-[#f97316] text-white px-[5cqw] py-[2.2cqh] rounded-full shadow-2xl mb-[2cqh]"
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={phase >= 4 ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', damping: 16 }}
        >
          <span className="text-[4.5cqw] font-black font-display tracking-wide">FREE TO START</span>
        </motion.div>

        {/* URL */}
        <motion.div
          className="flex items-center gap-[1.5cqw] bg-white/10 border border-white/20 px-[4cqw] py-[1.5cqh] rounded-2xl mb-[1.5cqh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="w-[3cqw] h-[3cqw] bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-[1.8cqw] h-[1.8cqw]">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
          </div>
          <span className="text-[3.5cqw] font-black text-[#FFF8F0] font-display tracking-wide">
            www.catalogkit.org
          </span>
        </motion.div>

      </div>

      {/* Credit */}
      <motion.div
        className="flex-shrink-0 mt-auto w-full text-center pb-[3.5cqh]"
        initial={{ opacity: 0 }}
        animate={phase >= 5 ? { opacity: 0.4 } : {}}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-[1cqw] text-white font-sans">
          Built in Papua New Guinea by Sapphire Consulting Services
        </p>
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '📸', text: 'Upload photos in seconds' },
  { icon: '💰', text: 'Add name & price per item' },
  { icon: '🔗', text: 'Share your catalog link' },
  { icon: '📄', text: 'Or send as a PDF — your choice' },
];

export function Scene5({ portrait }: { portrait?: boolean }) {
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
        animate={phase >= 1 ? { opacity: 0.22 } : {}}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-[6cqw] py-[1cqh]">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-[2cqw] mb-[1cqh]"
          initial={{ y: 40, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 18 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/catalogkit-logo.png`}
            alt="CatalogKit logo"
            className={`${portrait ? 'h-[12cqw]' : 'h-[8cqw]'} object-contain drop-shadow-2xl`}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className={`${portrait ? 'text-[3.5cqw]' : 'text-[2.8cqw]'} text-[#FFF8F0]/70 font-semibold mb-[1cqh] text-center leading-snug`}
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Stop flooding WhatsApp groups.<br />
          <span className="text-[#F5A800]">Share a catalog that sells for you.</span>
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className={`grid grid-cols-2 gap-[1cqw] mb-[1cqh] ${portrait ? 'w-[80cqw]' : 'w-auto'}`}
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-[1cqw] bg-white/8 border border-white/10 rounded-2xl ${portrait ? 'px-[2cqw] py-[0.9cqh]' : 'px-[2cqw] py-[1.2cqh]'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <span className={portrait ? 'text-[3cqw]' : 'text-[2cqw]'}>{f.icon}</span>
              <span className={`${portrait ? 'text-[1.8cqw]' : 'text-[1.6cqw]'} font-semibold text-white/85`}>{f.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* FREE badge */}
        <motion.div
          className={`bg-[#f97316] text-white ${portrait ? 'px-[5cqw] py-[1.6cqh]' : 'px-[5cqw] py-[2.2cqh]'} rounded-full shadow-2xl mb-[1cqh]`}
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={phase >= 4 ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', damping: 16 }}
        >
          <span className={`${portrait ? 'text-[5.5cqw]' : 'text-[4.5cqw]'} font-black font-display tracking-wide`}>FREE TO START</span>
        </motion.div>

        {/* URL */}
        <motion.div
          className={`flex items-center gap-[1.5cqw] bg-white/10 border border-white/20 ${portrait ? 'px-[4cqw] py-[1.2cqh]' : 'px-[4cqw] py-[1.5cqh]'} rounded-2xl mb-[0]`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className={`${portrait ? 'w-[4cqw] h-[4cqw]' : 'w-[3cqw] h-[3cqw]'} bg-[#f97316] rounded-full flex items-center justify-center flex-shrink-0`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={portrait ? 'w-[2.4cqw] h-[2.4cqw]' : 'w-[1.8cqw] h-[1.8cqw]'}>
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span className={`${portrait ? 'text-[4cqw]' : 'text-[3.5cqw]'} font-black text-[#FFF8F0] font-display tracking-wide`}>
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
        <p className={`${portrait ? 'text-[1.4cqw]' : 'text-[1cqw]'} text-white font-sans leading-relaxed`}>
          CatalogKit &copy; &nbsp;|&nbsp; Proudly PNG Made
        </p>
      </motion.div>
    </motion.div>
  );
}

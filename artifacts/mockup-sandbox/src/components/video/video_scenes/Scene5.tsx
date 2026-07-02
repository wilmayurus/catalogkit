import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#2D0B0E]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, #C41230 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Background Market Scene */}
      <motion.img 
        src={`${import.meta.env.BASE_URL}/images/market-scene-warm.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-[2vw] mb-[8vh]"
          initial={{ y: 50, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-[8vw] h-[8vw] bg-[#FFF8F0] rounded-2xl flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" fill="none" className="w-[5vw] h-[5vw] text-[#C41230]" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-[8vw] font-black text-[#FFF8F0] font-display tracking-tight">
            CatalogKit
          </h1>
        </motion.div>

        {/* Text */}
        <motion.h2
          className="text-[7vw] font-black text-[#F5A800] font-display mb-[2vh] leading-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          MORE CUSTOMERS.
        </motion.h2>

        <motion.div
          className="bg-[#C41230] text-white px-[4vw] py-[2vh] rounded-full shadow-2xl mb-[6vh]"
          initial={{ y: 20, opacity: 0 }}
          animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[4vw] font-bold font-display tracking-wide">FREE TO START.</span>
        </motion.div>

        <motion.div
          className="text-[4vw] font-bold text-[#FFF8F0] font-sans"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          www.catalogkit.org
        </motion.div>

      </div>

      {/* Credit — tiny, bottom of screen */}
      <motion.div
        className="absolute bottom-[2vh] w-full text-center"
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 0.45 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <p className="text-[1vw] text-white font-sans">
          Developed by Sapphire Consulting Services, a subsidiary of Trey Holdings Limited
        </p>
      </motion.div>

    </motion.div>
  );
}

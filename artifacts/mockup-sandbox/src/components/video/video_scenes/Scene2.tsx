import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 11000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="absolute inset-0 bg-[#C41230]"
        initial={{ scaleY: 0, transformOrigin: "bottom" }}
        animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div 
        className="absolute inset-0 bg-[#0D0D0D]"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 text-center w-full px-[5vw]">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="flex items-center justify-center gap-[2vw] mb-[4vh]"
        >
          <div className="w-[6vw] h-[6vw] bg-gradient-to-br from-[#C41230] to-[#F5A800] rounded-xl flex items-center justify-center shadow-lg shadow-[#C41230]/50">
            <svg viewBox="0 0 24 24" fill="none" className="w-[4vw] h-[4vw] text-white" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-[8vw] font-['Bebas_Neue'] tracking-wider text-white">CatalogKit</h1>
        </motion.div>

        <motion.p
          className="text-[4vw] font-['Montserrat'] font-light text-[#F5A800] tracking-wide"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 3 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1 }}
        >
          Free digital catalogs
        </motion.p>
        
        <motion.p
          className="text-[3vw] text-[#F5F5F5]/80 mt-[2vh] uppercase tracking-[0.2em]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          For every PNG business
        </motion.p>
      </div>
      
      {/* Decorative bursts */}
      {phase >= 2 && (
        <>
          <motion.div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] border-[1px] border-[#F5A800]/20 rounded-full"
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 2, ease: "easeOut" }} />
          <motion.div className="absolute bottom-[20%] left-[15%] w-[30vw] h-[30vw] border-[1px] border-[#C41230]/30 rounded-full"
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 2, delay: 0.3, ease: "easeOut" }} />
        </>
      )}
    </motion.div>
  );
}

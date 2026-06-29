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
      setTimeout(() => setPhase(5), 11000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#C41230]"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          className="w-[10vw] h-[10vw] bg-white rounded-2xl flex items-center justify-center mb-[4vh] shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-[6vw] h-[6vw] text-[#C41230]" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </motion.div>

        <motion.h1
          className="text-[6vw] font-['Bebas_Neue'] text-white tracking-widest mb-[2vh]"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          CatalogKit
        </motion.h1>

        <motion.p
          className="text-[3vw] font-['Montserrat'] text-[#F5A800] font-medium mb-[6vh]"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        >
          Free digital catalogs for PNG businesses
        </motion.p>

        <motion.div
          className="bg-white px-[4vw] py-[2vh] rounded-full shadow-[0_0_40px_rgba(245,168,0,0.4)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <span className="text-[3vw] font-['Inter'] font-bold text-[#1A1A1A]">www.catalogkit.org</span>
        </motion.div>

        <motion.p
          className="absolute bottom-[-15vh] text-[1.5vw] text-white/60 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
        >
          Built by Trey Holdings Limited
        </motion.p>
      </div>

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1vw] h-[1vw] bg-[#F5A800] rounded-full"
          initial={{ opacity: 0, x: '50vw', y: '50vh' }}
          animate={{
            opacity: [0, 1, 0],
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
          }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </motion.div>
  );
}

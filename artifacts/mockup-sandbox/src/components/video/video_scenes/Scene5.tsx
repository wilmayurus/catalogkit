import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 4000),
      setTimeout(() => setPhase(5), 7000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background floods to red */}
      <motion.div 
        className="absolute inset-0 bg-[#C41230]"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={`${import.meta.env.BASE_URL}images/red-silk.png`} className="w-full h-full object-cover opacity-40 mix-blend-screen" alt="red silk" />
      </motion.div>

      <div className="relative z-10 text-center flex flex-col items-center w-full">
        <motion.div
          className="w-[12vw] h-[12vw] bg-[#F5F5F5] rounded-3xl flex items-center justify-center mb-[4vh] shadow-2xl"
          initial={{ scale: 0, rotate: -90 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-[7vw] h-[7vw] text-[#C41230]" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </motion.div>

        <motion.h1
          className="text-[8vw] font-['Bebas_Neue'] text-[#F5F5F5] tracking-widest mb-[2vh]"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          CatalogKit
        </motion.h1>

        <motion.p
          className="text-[3.5vw] font-['Montserrat'] text-[#F5A800] font-bold mb-[6vh] italic"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 3 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          Free digital catalogs for PNG businesses
        </motion.p>

        <motion.div
          className="bg-white px-[5vw] py-[2.5vh] rounded-full shadow-[0_0_50px_rgba(245,168,0,0.3)] border border-[#F5A800]/20"
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={phase >= 4 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, delay: 0.2 }}
        >
          <span className="text-[3.5vw] font-['Montserrat'] font-bold text-[#C41230]">www.catalogkit.org</span>
        </motion.div>

        <motion.div
          className="absolute bottom-[-15vh] w-full flex flex-col items-center gap-[1vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p className="text-[1.8vw] font-['Montserrat'] text-white/80 tracking-widest uppercase">
            Built by Sapphire Consulting Services
          </p>
          <div className="w-[4vw] h-[1px] bg-white/30" />
          <p className="text-[1.5vw] font-['Montserrat'] text-white/50 tracking-widest uppercase">
            A Trey Holdings Limited Subsidiary
          </p>
        </motion.div>
      </div>

      {/* Cinematic animated rays/light */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] h-[100vh] bg-gradient-to-b from-white/10 to-transparent blur-3xl rounded-[100%]" style={{ transform: 'rotate(15deg) translateY(-50%)' }} />
      </motion.div>
    </motion.div>
  );
}

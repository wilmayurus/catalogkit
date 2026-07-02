import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500), // pricing
      setTimeout(() => setPhase(3), 2500), // url
      setTimeout(() => setPhase(4), 4000), // credits
      setTimeout(() => setPhase(5), 8000), // exit begin
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
      <motion.div 
        className="absolute inset-0 bg-[#C41230]"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay">
        <img src={`${import.meta.env.BASE_URL}images/tech-bg.png`} className="w-full h-full object-cover" alt="bg" />
      </motion.div>

      <div className="relative z-10 text-center flex flex-col items-center w-full">
        {/* Logo Lockup */}
        <motion.div
          className="flex items-center gap-[2vw] mb-[4vh]"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-[6vw] h-[6vw] bg-[#F5F5F5] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,245,245,0.3)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-[4vw] h-[4vw] text-[#C41230]" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-[7vw] font-['Bebas_Neue'] text-[#F5F5F5] tracking-widest">
            CatalogKit
          </h1>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-md px-[4vw] py-[2vh] rounded-2xl border border-white/20 mb-[6vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[3vw] font-['Montserrat'] text-[#F5A800] font-bold">
            Free to start
          </p>
          <p className="text-[1.8vw] text-white/80 font-medium">3 catalogs/month</p>
        </motion.div>

        <motion.div
          className="bg-white px-[5vw] py-[2vh] rounded-full shadow-[0_0_50px_rgba(245,168,0,0.3)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <span className="text-[3.5vw] font-['Montserrat'] font-bold text-[#C41230]">www.catalogkit.org</span>
        </motion.div>

        <motion.div
          className="absolute bottom-[-15vh] w-full flex flex-col items-center gap-[1vh]"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-[1.5vw] font-['Montserrat'] text-white/80 tracking-widest uppercase">
            Sapphire Consulting Services
          </p>
          <div className="w-[3vw] h-[1px] bg-white/30" />
          <p className="text-[1.2vw] font-['Montserrat'] text-white/50 tracking-widest uppercase">
            A Trey Holdings Limited Subsidiary
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
}

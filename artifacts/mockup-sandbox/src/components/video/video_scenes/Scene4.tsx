import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200), // cards
      setTimeout(() => setPhase(3), 3500), // pricing transition
      setTimeout(() => setPhase(4), 4500), // pricing cards
      setTimeout(() => setPhase(5), 7000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const avatars = [
    { label: 'Market Vendors', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { label: 'Garment Sellers', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg> },
    { label: 'Trade Stores', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg> },
    { label: 'Artisans', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> },
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* SECTION 1: Who Benefits (Phase 1-2) */}
      <AnimatePresence mode="popLayout">
        {phase < 3 && (
          <motion.div 
            className="flex flex-col items-center w-full"
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-[4.5vw] font-['Montserrat'] text-white font-bold mb-[8vh]"
              initial={{ y: -30, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
            >
              Built for PNG
            </motion.h2>

            <div className="flex gap-[3vw]">
              {avatars.map((item, i) => (
                <motion.div
                  key={i}
                  className="w-[18vw] h-[22vw] bg-[#1A1A1A] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-[2vw] shadow-lg relative overflow-hidden"
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={phase >= 2 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 100, delay: i * 0.1 }}
                >
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                  <div className="w-[6vw] h-[6vw] text-[#F5A800] mb-[3vh]">
                    {item.icon}
                  </div>
                  <span className="text-[2.2vw] text-center text-white/90 font-medium leading-snug">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 2: Pricing (Phase 3+) */}
      {phase >= 3 && (
        <motion.div 
          className="flex flex-col items-center w-full absolute inset-0 justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-[4.5vw] font-['Montserrat'] text-white font-bold mb-[8vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Accessible to everyone
          </motion.h2>

          <div className="flex items-stretch gap-[2vw] px-[5vw]">
            {/* Free Tier */}
            <motion.div
              className="flex-1 bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 rounded-3xl p-[3vw] flex flex-col items-center text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <h3 className="text-[2.5vw] text-white/70 uppercase tracking-widest mb-[1vh] font-semibold">Starter</h3>
              <div className="text-[4.5vw] font-['Bebas_Neue'] text-white mb-[2vh]">Free to start</div>
              <p className="text-[1.8vw] text-white/50">3 catalogs/month</p>
            </motion.div>

            {/* Basic Tier */}
            <motion.div
              className="flex-1 bg-gradient-to-b from-[#C41230]/20 to-black border border-[#C41230]/50 rounded-3xl p-[3vw] flex flex-col items-center text-center relative transform -translate-y-[2vh]"
              initial={{ opacity: 0, y: 50 }}
              animate={phase >= 4 ? { opacity: 1, y: -20 } : { opacity: 0, y: 50 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <div className="absolute -top-[1.5vh] bg-[#C41230] text-white text-[1.2vw] px-[2vw] py-[0.5vh] rounded-full uppercase tracking-wider font-bold">Popular</div>
              <h3 className="text-[2.5vw] text-[#C41230] uppercase tracking-widest mb-[1vh] font-semibold">Basic</h3>
              <div className="text-[4.5vw] font-['Bebas_Neue'] text-white mb-[2vh]">K20<span className="text-[2vw] text-white/50 font-['Montserrat']">/mo</span></div>
              <p className="text-[1.8vw] text-white/70">20 catalogs/month</p>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              className="flex-1 bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 rounded-3xl p-[3vw] flex flex-col items-center text-center"
              initial={{ opacity: 0, x: 50 }}
              animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <h3 className="text-[2.5vw] text-[#F5A800] uppercase tracking-widest mb-[1vh] font-semibold">Pro</h3>
              <div className="text-[4.5vw] font-['Bebas_Neue'] text-white mb-[2vh]">K50<span className="text-[2vw] text-white/50 font-['Montserrat']">/mo</span></div>
              <p className="text-[1.8vw] text-white/70">Unlimited</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Ensure AnimatePresence is imported in the file that uses it, though we don't strictly need it here if we use conditional rendering correctly with framer-motion
import { AnimatePresence } from 'framer-motion';
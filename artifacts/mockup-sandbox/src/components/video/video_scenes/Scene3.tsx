import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Title
      setTimeout(() => setPhase(2), 1500),  // Step 1
      setTimeout(() => setPhase(3), 5000),  // Step 2
      setTimeout(() => setPhase(4), 9000),  // Step 3
      setTimeout(() => setPhase(5), 15000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 bg-[#0D0D0D] overflow-hidden flex"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-[40%] flex flex-col justify-center pl-[8vw] z-10">
        <motion.h2 
          className="text-[5vw] font-['Montserrat'] font-bold text-white leading-tight mb-[6vh]"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          How It Works
        </motion.h2>

        <div className="space-y-[4vh]">
          {/* Step 1 */}
          <motion.div 
            className={`flex items-center gap-[2vw] transition-opacity duration-500 ${phase >= 2 && phase < 3 ? 'opacity-100' : 'opacity-40'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 2 ? { opacity: phase >= 2 && phase < 3 ? 1 : 0.4, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-[4vw] h-[4vw] rounded-full flex items-center justify-center font-bold text-[1.5vw] ${phase >= 2 && phase < 3 ? 'bg-[#C41230] text-white' : 'border border-white/20 text-white/50'}`}>1</div>
            <p className="text-[2.5vw] text-white">Photo products</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className={`flex items-center gap-[2vw] transition-opacity duration-500 ${phase >= 3 && phase < 4 ? 'opacity-100' : 'opacity-40'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 3 ? { opacity: phase >= 3 && phase < 4 ? 1 : 0.4, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-[4vw] h-[4vw] rounded-full flex items-center justify-center font-bold text-[1.5vw] ${phase >= 3 && phase < 4 ? 'bg-[#F5A800] text-black' : 'border border-white/20 text-white/50'}`}>2</div>
            <p className="text-[2.5vw] text-white">Upload & price</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className={`flex items-center gap-[2vw] transition-opacity duration-500 ${phase >= 4 ? 'opacity-100' : 'opacity-40'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 4 ? { opacity: phase >= 4 ? 1 : 0.4, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-[4vw] h-[4vw] rounded-full flex items-center justify-center font-bold text-[1.5vw] ${phase >= 4 ? 'bg-[#3ECF8E] text-black' : 'border border-white/20 text-white/50'}`}>3</div>
            <p className="text-[2.5vw] text-white">Share on WhatsApp</p>
          </motion.div>
        </div>
      </div>

      <div className="w-[60%] relative flex items-center justify-center">
        {/* Step 1 Visual */}
        <motion.div 
          className="absolute w-[30vw] h-[30vw] bg-[#C41230]/20 rounded-full border border-[#C41230]/40 flex items-center justify-center backdrop-blur-md"
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={phase >= 2 && phase < 3 ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: 45, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <span className="text-[10vw]">📸</span>
        </motion.div>

        {/* Step 2 Visual */}
        <motion.div 
          className="absolute w-[30vw] h-[40vw] bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl flex flex-col p-[2vw]"
          initial={{ y: 200, opacity: 0 }}
          animate={phase >= 3 && phase < 4 ? { y: 0, opacity: 1 } : { y: -200, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-full h-[40%] bg-white/5 rounded-lg flex items-center justify-center mb-[2vw]">
            <span className="text-[4vw]">⬆️</span>
          </div>
          <div className="h-[2vw] bg-white/10 rounded w-[60%] mb-[1vw]" />
          <div className="h-[2vw] bg-[#F5A800]/50 rounded w-[40%]" />
        </motion.div>

        {/* Step 3 Visual */}
        <motion.div 
          className="absolute w-[25vw] h-[25vw] bg-[#3ECF8E] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(62,207,142,0.5)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        >
          <span className="text-[12vw] text-white">📲</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

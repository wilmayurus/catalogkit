import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Title
      setTimeout(() => setPhase(2), 1200),  // Step 1
      setTimeout(() => setPhase(3), 3500),  // Step 2
      setTimeout(() => setPhase(4), 6000),  // Step 3
      setTimeout(() => setPhase(5), 9000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 overflow-hidden flex"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-[45%] flex flex-col justify-center pl-[8vw] z-10">
        <motion.h2 
          className="text-[4.5vw] font-['Montserrat'] font-bold text-white leading-tight mb-[6vh]"
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          How It Works
        </motion.h2>

        <div className="space-y-[5vh]">
          {/* Step 1 */}
          <motion.div 
            className="flex items-center gap-[2vw] relative"
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-[3.5vw] h-[3.5vw] rounded-full flex items-center justify-center font-bold text-[1.5vw] transition-colors duration-500 ${phase >= 2 && phase < 3 ? 'bg-[#C41230] text-white shadow-[0_0_20px_#C41230]' : 'border-2 border-white/20 text-white/50 bg-[#0D0D0D]'}`}>
              1
            </div>
            <p className={`text-[2.2vw] font-medium transition-colors duration-500 ${phase >= 2 && phase < 3 ? 'text-white' : 'text-white/40'}`}>
              Snap photos
            </p>
            {/* Connecting line */}
            <div className="absolute left-[1.75vw] top-[3.5vw] w-[2px] h-[5vh] -translate-x-[1px] bg-white/10" />
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className="flex items-center gap-[2vw] relative"
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-[3.5vw] h-[3.5vw] rounded-full flex items-center justify-center font-bold text-[1.5vw] transition-colors duration-500 ${phase >= 3 && phase < 4 ? 'bg-[#F5A800] text-[#0D0D0D] shadow-[0_0_20px_#F5A800]' : 'border-2 border-white/20 text-white/50 bg-[#0D0D0D]'}`}>
              2
            </div>
            <p className={`text-[2.2vw] font-medium transition-colors duration-500 ${phase >= 3 && phase < 4 ? 'text-white' : 'text-white/40'}`}>
              Upload & price
            </p>
            {/* Connecting line */}
            <div className="absolute left-[1.75vw] top-[3.5vw] w-[2px] h-[5vh] -translate-x-[1px] bg-white/10" />
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className="flex items-center gap-[2vw]"
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-[3.5vw] h-[3.5vw] rounded-full flex items-center justify-center font-bold text-[1.5vw] transition-colors duration-500 ${phase >= 4 ? 'bg-[#25D366] text-[#0D0D0D] shadow-[0_0_20px_#25D366]' : 'border-2 border-white/20 text-white/50 bg-[#0D0D0D]'}`}>
              3
            </div>
            <p className={`text-[2.2vw] font-medium transition-colors duration-500 ${phase >= 4 ? 'text-white' : 'text-white/40'}`}>
              Share the link
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-[55%] relative flex items-center justify-center">
        {/* Abstract UI visualizations replacing emojis */}
        
        {/* Step 1 Visual: Camera viewfinder frame */}
        <motion.div 
          className="absolute w-[25vw] h-[35vw] border-[3px] border-[#C41230]/80 rounded-[2vw]"
          initial={{ scale: 0.5, opacity: 0, rotateZ: -10 }}
          animate={phase >= 2 && phase < 3 ? { scale: 1, opacity: 1, rotateZ: 0 } : { scale: 1.2, opacity: 0, rotateZ: 10 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        >
          {/* Viewfinder corners */}
          <div className="absolute top-[2vw] left-[2vw] w-[3vw] h-[3vw] border-t-4 border-l-4 border-[#F5F5F5]" />
          <div className="absolute top-[2vw] right-[2vw] w-[3vw] h-[3vw] border-t-4 border-r-4 border-[#F5F5F5]" />
          <div className="absolute bottom-[2vw] left-[2vw] w-[3vw] h-[3vw] border-b-4 border-l-4 border-[#F5F5F5]" />
          <div className="absolute bottom-[2vw] right-[2vw] w-[3vw] h-[3vw] border-b-4 border-r-4 border-[#F5F5F5]" />
          
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8vw] h-[8vw] border-[4px] border-[#F5F5F5]/50 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2vw] h-[2vw] bg-[#C41230] rounded-full"
            initial={{ scale: 0 }}
            animate={phase >= 2 ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
          />
        </motion.div>

        {/* Step 2 Visual: Abstract UI mockup */}
        <motion.div 
          className="absolute w-[30vw] h-[40vw] bg-[#111111] rounded-[2vw] border border-white/10 shadow-2xl flex flex-col p-[2vw] overflow-hidden"
          initial={{ y: 200, opacity: 0, rotateX: -30 }}
          animate={phase >= 3 && phase < 4 ? { y: 0, opacity: 1, rotateX: 0 } : { y: -200, opacity: 0, rotateX: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          style={{ perspective: 1000 }}
        >
          {/* Header */}
          <div className="w-[10vw] h-[1.5vw] bg-white/20 rounded-full mb-[2vw]" />
          
          {/* Image placeholder */}
          <motion.div 
            className="w-full h-[15vw] bg-[#1A1A1A] rounded-xl mb-[2vw] overflow-hidden relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg className="absolute inset-0 w-full h-full text-white/5 p-[4vw]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.div>
          
          {/* Form fields */}
          <motion.div className="w-[18vw] h-[1.5vw] bg-white/10 rounded mb-[1.5vw]" initial={{ x: -20, opacity: 0 }} animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }} transition={{ delay: 0.3 }} />
          <motion.div className="w-[12vw] h-[1.5vw] bg-[#F5A800]/30 rounded mb-[2.5vw]" initial={{ x: -20, opacity: 0 }} animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }} transition={{ delay: 0.4 }} />
          
          {/* Button */}
          <motion.div className="w-full h-[4vw] bg-[#C41230] rounded-xl mt-auto shadow-lg" initial={{ y: 20, opacity: 0 }} animate={phase >= 3 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }} transition={{ delay: 0.5 }} />
        </motion.div>

        {/* Step 3 Visual: WhatsApp Chat Bubble Abstract */}
        <motion.div 
          className="absolute"
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 120 }}
        >
          <div className="w-[28vw] p-[2vw] bg-[#25D366] rounded-[2vw] rounded-br-none shadow-[0_10px_40px_rgba(37,211,102,0.3)] relative">
            <motion.div className="w-[12vw] h-[1.5vw] bg-black/20 rounded-full mb-[1.5vw]" initial={{ width: 0 }} animate={phase >= 4 ? { width: '12vw' } : { width: 0 }} transition={{ delay: 0.3 }} />
            
            <div className="bg-white/90 p-[1.5vw] rounded-xl flex items-center gap-[1.5vw]">
              <div className="w-[4vw] h-[4vw] bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <motion.div className="w-[10vw] h-[1vw] bg-gray-300 rounded mb-[0.8vw]" initial={{ width: 0 }} animate={phase >= 4 ? { width: '10vw' } : { width: 0 }} transition={{ delay: 0.5 }} />
                <motion.div className="w-[6vw] h-[1vw] bg-[#25D366]/40 rounded" initial={{ width: 0 }} animate={phase >= 4 ? { width: '6vw' } : { width: 0 }} transition={{ delay: 0.6 }} />
              </div>
            </div>
            
            <div className="absolute -bottom-[2vw] right-0 w-[4vw] h-[4vw]">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#25D366]" fill="currentColor">
                <path d="M24 0L0 24h24V0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

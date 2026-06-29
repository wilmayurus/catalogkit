import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 7000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
    >
      {/* Background — animated warm market glow */}
      <motion.div className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[#0D0D0D]" />
        <motion.div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 60% 45%, #6B2A04 0%, #3A1002 40%, #0D0D0D 100%)' }}
          animate={{ scale: [1, 1.12, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 70%, #F5A80022 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Animated dots simulating market stall lights */}
        {[...Array(18)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 5) * 3}px`, height: `${4 + (i % 5) * 3}px`,
              left: `${(i * 17 + 5) % 95}%`, top: `${(i * 23 + 10) % 80}%`,
              background: i % 3 === 0 ? '#F5A800' : i % 3 === 1 ? '#C41230' : '#ffffff',
              opacity: 0.15 + (i % 4) * 0.08,
            }}
            animate={{ opacity: [0.1, 0.35, 0.1], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-[80vw] text-center">
        <motion.h1 
          className="text-[6vw] leading-[1.1] font-bold text-[#F5F5F5] font-['Montserrat'] tracking-tight"
        >
          {"PNG's hardworking market vendors".split(' ').map((word, i) => (
            <motion.span 
              key={i} 
              className="inline-block mr-[2vw]"
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 45 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200, delay: phase >= 1 ? i * 0.1 : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          className="text-[4vw] mt-[2vh] text-[#F5A800] font-['Montserrat'] font-semibold"
          initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0, filter: 'blur(20px)', y: 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          have amazing products
        </motion.h2>

        <motion.div
          className="mt-[4vh] py-[2vh] px-[4vw] bg-[#C41230]/20 border border-[#C41230]/50 rounded-xl backdrop-blur-md inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <p className="text-[2.5vw] text-white/90 font-medium">but no way to show them online.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

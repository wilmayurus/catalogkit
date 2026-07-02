import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 5000), // exit
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
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <img src={`${import.meta.env.BASE_URL}images/market-bg.png`} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Market" />
        <div className="absolute inset-0 bg-[#0D0D0D]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
        
        {/* Simulate market atmosphere with moving lights */}
        <motion.div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 60% 45%, #C4123033 0%, #3A1002 40%, transparent 100%)' }}
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Subtle noise/texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Animated bokeh / market stall lights */}
        {[...Array(12)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full blur-[2px]"
            style={{
              width: `${4 + (i % 3) * 4}px`, height: `${4 + (i % 3) * 4}px`,
              left: `${10 + (i * 27) % 80}%`, top: `${15 + (i * 13) % 70}%`,
              background: i % 2 === 0 ? '#F5A800' : '#F5F5F5',
              opacity: 0.1 + (i % 3) * 0.1,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1], y: [0, -10, 0] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 w-full px-[10vw] flex flex-col items-center text-center">
        <motion.h1 
          className="text-[6.5vw] leading-[1.1] font-bold text-[#F5F5F5] font-['Montserrat'] tracking-tight"
        >
          {"PNG vendors".split(' ').map((word, i) => (
            <motion.span 
              key={i} 
              className="inline-block mr-[2vw]"
              initial={{ opacity: 0, y: 40, rotateX: 45 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: 45 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200, delay: phase >= 1 ? i * 0.1 : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2
          className="text-[4.5vw] mt-[2vh] text-[#F5A800] font-['Montserrat'] font-semibold italic"
          initial={{ opacity: 0, filter: 'blur(15px)', x: -20 }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)', x: 0 } : { opacity: 0, filter: 'blur(15px)', x: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          have amazing products
        </motion.h2>

        <motion.div
          className="mt-[6vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="py-[2vh] px-[5vw] bg-black/60 border-l-[4px] border-[#C41230] backdrop-blur-md inline-block"
            initial={{ x: -100, opacity: 0 }}
            animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          >
            <p className="text-[3vw] text-[#F5F5F5] font-medium tracking-wide">
              but no way to show them online.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

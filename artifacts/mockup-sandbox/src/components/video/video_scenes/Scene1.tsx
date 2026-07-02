import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-[#2D0B0E]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{ background: 'radial-gradient(circle at 50% 50%, #C41230 0%, #2D0B0E 80%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
        {/* Images stagger in */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Bilum bag */}
          <motion.div 
            className="absolute -left-[10vw] top-[10vh] w-[25vw] h-[25vw]"
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={phase >= 1 ? { scale: 1, rotate: -10, opacity: 0.8 } : {}}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
             <img src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`} className="w-full h-full object-contain" alt="" />
          </motion.div>
          
          {/* Vegetables */}
          <motion.div 
            className="absolute -right-[22vw] top-[35vh] w-[30vw] h-[30vw]"
            initial={{ scale: 0, rotate: 20, opacity: 0 }}
            animate={phase >= 2 ? { scale: 1, rotate: 15, opacity: 0.8 } : {}}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
             <img src={`${import.meta.env.BASE_URL}/images/tropical-fruit-warm.png`} className="w-full h-full object-contain" alt="" />
          </motion.div>

          {/* Carved mask */}
          <motion.div 
            className="absolute left-[30vw] bottom-[5vh] w-[18vw] h-[18vw]"
            initial={{ scale: 0, rotate: 10, opacity: 0 }}
            animate={phase >= 3 ? { scale: 1, rotate: 5, opacity: 0.75 } : {}}
            transition={{ type: 'spring', bounce: 0.4 }}
          >
             <img src={`${import.meta.env.BASE_URL}/images/product-mask.png`} className="w-full h-full object-contain" alt="" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-[4vh] text-center px-[5vw]">
          <motion.h1 
            className="text-[8vw] font-black text-[#F5A800] leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {'YOU SELL THINGS?'.split(' ').map((word, i) => (
              <motion.span 
                key={i} 
                className="inline-block mr-[2vw]"
                initial={{ y: 50, opacity: 0 }}
                animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                transition={{ type: 'spring', damping: 20, delay: i * 0.15 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            className="text-[6vw] font-bold text-white leading-tight mt-[4vh]"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={phase >= 4 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Show them to the <span className="text-[#F5A800]">WORLD.</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 4000), // exit begin
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
      <motion.div className="absolute inset-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        <img src={`${import.meta.env.BASE_URL}images/market-bg.png`} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Market" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full flex flex-col items-center text-center px-[5vw]">
        <motion.h1 
          className="text-[7vw] leading-[1.1] font-bold text-[#F5F5F5] font-['Montserrat'] tracking-tight"
        >
          {"Your products".split(' ').map((word, i) => (
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
          className="text-[6vw] mt-[2vh] text-[#F5A800] font-['Bebas_Neue'] tracking-wide"
          initial={{ opacity: 0, filter: 'blur(15px)', scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : { opacity: 0, filter: 'blur(15px)', scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          DESERVE TO BE SEEN.
        </motion.h2>

        {phase >= 3 && (
          <motion.div className="mt-[4vh] w-[15vw] h-[2px] bg-[#C41230]"
            initial={{ width: 0 }}
            animate={{ width: '15vw' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </div>
    </motion.div>
  );
}

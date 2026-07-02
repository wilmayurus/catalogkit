import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => setPhase(4), 4500),
      setTimeout(() => setPhase(5), 7000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      {/* Dramatic wipe entrance */}
      <motion.div 
        className="absolute inset-0 bg-[#C41230]"
        initial={{ x: '-100%' }}
        animate={phase >= 1 ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      
      {/* Red silk background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 0.3 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <img src={`${import.meta.env.BASE_URL}images/red-silk.png`} className="w-full h-full object-cover mix-blend-screen" alt="red silk" />
      </motion.div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Logo Reveal */}
        <motion.div
          className="flex items-center gap-[3vw] mb-[6vh]"
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
          {/* Logo Mark */}
          <div className="w-[8vw] h-[8vw] bg-[#F5F5F5] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(196,18,48,0.5)]">
            <svg viewBox="0 0 24 24" fill="none" className="w-[5vw] h-[5vw] text-[#C41230]" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-[9vw] font-['Bebas_Neue'] tracking-wider text-[#F5F5F5]">CatalogKit</h1>
        </motion.div>

        {/* Messaging Sequence */}
        <div className="flex flex-col items-center gap-[2vh]">
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={phase >= 3 ? { height: 'auto' } : { height: 0 }}
          >
            <motion.h2 
              className="text-[4.5vw] font-['Montserrat'] font-bold text-[#F5A800]"
              initial={{ y: 40 }}
              animate={phase >= 3 ? { y: 0 } : { y: 40 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              Your products.
            </motion.h2>
          </motion.div>
          
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={phase >= 4 ? { height: 'auto' } : { height: 0 }}
          >
            <motion.h2 
              className="text-[4.5vw] font-['Montserrat'] font-bold text-[#F5F5F5]"
              initial={{ y: 40 }}
              animate={phase >= 4 ? { y: 0 } : { y: 40 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              One link.
            </motion.h2>
          </motion.div>

          <motion.div
            className="mt-[3vh] px-[4vw] py-[1.5vh] bg-[#25D366]/20 border border-[#25D366]/40 rounded-full flex items-center gap-[2vw]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={phase >= 5 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          >
            <svg className="w-[3vw] h-[3vw] text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span className="text-[3.5vw] font-['Montserrat'] font-bold text-[#F5F5F5]">On WhatsApp.</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

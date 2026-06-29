import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
      setTimeout(() => setPhase(6), 7000), // stats
      setTimeout(() => setPhase(7), 11000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const cards = [
    { emoji: '👩‍🌾', title: 'Market Mamas' },
    { emoji: '👗', title: 'Garment Sellers' },
    { emoji: '🏪', title: 'Trade Stores' },
    { emoji: '🎨', title: 'Artisans & Crafts' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#0D0D0D]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1 }}
    >
      <motion.h2
        className="text-[4vw] font-['Montserrat'] text-white font-bold mb-[8vh]"
        initial={{ y: -50, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
      >
        Who It Helps
      </motion.h2>

      <div className="flex gap-[3vw] mb-[10vh]">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="w-[18vw] h-[22vw] bg-[#1A1A1A] border border-[#F5A800]/30 rounded-2xl flex flex-col items-center justify-center p-[2vw]"
            initial={{ scale: 0, opacity: 0, rotateY: 90 }}
            animate={phase >= i + 2 ? { scale: 1, opacity: 1, rotateY: 0 } : { scale: 0, opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          >
            <span className="text-[6vw] mb-[2vh]">{card.emoji}</span>
            <span className="text-[2vw] text-center text-white/90 font-medium leading-snug">{card.title}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex gap-[4vw]"
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center">
          <span className="block text-[5vw] font-['Bebas_Neue'] text-[#3ECF8E]">70%</span>
          <span className="text-[2vw] text-white/70 uppercase tracking-widest">Women</span>
        </div>
        <div className="w-[1px] bg-white/20" />
        <div className="text-center">
          <span className="block text-[5vw] font-['Bebas_Neue'] text-[#C41230]">100%</span>
          <span className="text-[2vw] text-white/70 uppercase tracking-widest">Free</span>
        </div>
        <div className="w-[1px] bg-white/20" />
        <div className="text-center">
          <span className="block text-[5vw] font-['Bebas_Neue'] text-[#F5A800]">Built</span>
          <span className="text-[2vw] text-white/70 uppercase tracking-widest">For PNG</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BADGES = [
  // ── Top row ──────────────────────────────────────
  { emoji: '🍌', label: 'Banana',       top: '3vh',    left: '2vw',    delay: 0.10, rotate: -6 },
  { emoji: '🧺', label: 'Basket',       top: '3vh',    left: '24vw',   delay: 0.20, rotate:  3 },
  { emoji: '🐟', label: 'Fish',         top: '3vh',    right: '24vw',  delay: 0.15, rotate: -4 },
  { emoji: '🍍', label: 'Pineapple',    top: '3vh',    right: '2vw',   delay: 0.25, rotate:  7 },
  // ── Left column ──────────────────────────────────
  { emoji: '🥬', label: 'Kumu',         top: '32vh',   left: '2vw',    delay: 0.35, rotate: -5 },
  { emoji: '🌺', label: 'Flowers',      top: '55vh',   left: '2vw',    delay: 0.45, rotate:  4 },
  // ── Right column ─────────────────────────────────
  { emoji: '🌿', label: 'Herbs',        top: '32vh',   right: '2vw',   delay: 0.30, rotate:  5 },
  { emoji: '👗', label: 'Clothing',     top: '55vh',   right: '2vw',   delay: 0.40, rotate: -4 },
  // ── Bottom row ───────────────────────────────────
  { emoji: '🥥', label: 'Coconut',      bottom: '3vh', left: '2vw',    delay: 0.55, rotate: -6 },
  { emoji: '🎨', label: 'Crafts',       bottom: '3vh', left: '24vw',   delay: 0.65, rotate:  3 },
  { emoji: '🍠', label: 'Sweet Potato', bottom: '3vh', right: '24vw',  delay: 0.60, rotate: -3 },
  { emoji: '🐔', label: 'Chicken',      bottom: '3vh', right: '2vw',   delay: 0.70, rotate:  6 },
];

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2800),
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
      {/* Radial glow */}
      <motion.div className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{ background: 'radial-gradient(circle at 50% 50%, #C41230 0%, #2D0B0E 80%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating product badges */}
      {BADGES.map((b, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center gap-[0.4vh] pointer-events-none"
          style={{
            top: b.top, bottom: b.bottom,
            left: b.left, right: b.right,
          }}
          initial={{ scale: 0, opacity: 0, rotate: b.rotate * 2 }}
          animate={phase >= 1 ? { scale: 1, opacity: 0.92, rotate: b.rotate } : {}}
          transition={{ type: 'spring', bounce: 0.45, delay: b.delay }}
        >
          <div className="bg-white/12 backdrop-blur-sm border border-white/20 rounded-2xl px-[1.2vw] py-[0.8vh] flex flex-col items-center gap-[0.3vh] shadow-lg">
            <span className="text-[3.5vw] leading-none">{b.emoji}</span>
            <span className="text-[1vw] font-bold text-white/80 tracking-wide">{b.label}</span>
          </div>
        </motion.div>
      ))}

      {/* Product images — in the side gaps between badge rows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bilum bag — left gap (between left-column badges) */}
        <motion.div 
          className="absolute -left-[4vw] top-[40vh] w-[20vw] h-[20vw]"
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, rotate: -8, opacity: 0.85 } : {}}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <img src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`} className="w-full h-full object-contain" alt="" />
        </motion.div>

        {/* Tropical fruit — right gap (between right-column badges) */}
        <motion.div 
          className="absolute -right-[4vw] top-[40vh] w-[20vw] h-[20vw]"
          initial={{ scale: 0, rotate: 20, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, rotate: 10, opacity: 0.80 } : {}}
          transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
        >
          <img src={`${import.meta.env.BASE_URL}/images/tropical-fruit-warm.png`} className="w-full h-full object-contain" alt="" />
        </motion.div>

        {/* Carved mask — bottom centre gap */}
        <motion.div 
          className="absolute left-[44vw] bottom-[10vh] w-[14vw] h-[14vw]"
          initial={{ scale: 0, rotate: 10, opacity: 0 }}
          animate={phase >= 3 ? { scale: 1, rotate: 4, opacity: 0.75 } : {}}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <img src={`${import.meta.env.BASE_URL}/images/product-mask.png`} className="w-full h-full object-contain" alt="" />
        </motion.div>
      </div>

      {/* Main text — centre */}
      <div className="relative z-10 flex flex-col items-center gap-[2vh] text-center px-[5vw]">
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
          className="text-[5.5vw] font-bold text-white leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 4 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Show them to the <span className="text-[#F5A800]">WORLD.</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

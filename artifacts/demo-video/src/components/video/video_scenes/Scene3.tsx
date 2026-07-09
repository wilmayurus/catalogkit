import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGES = [
  { name: 'BILUM BAG',      price: 'K 25.00', img: 'bilum-bag-clean.png' },
  { name: 'TROPICAL FRUIT', price: 'K 10.00', img: 'tropical-fruit-warm.png' },
  { name: 'CARVED MASK',    price: 'K 45.00', img: 'product-mask.png' },
];

const pageVariants = {
  enter:  { x: '100%',  opacity: 0 },
  center: { x: 0,       opacity: 1 },
  exit:   { x: '-100%', opacity: 0 },
};

export function Scene3() {
  const [phase, setPhase] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1),  400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 5500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    const interval = setInterval(() => {
      setCurrentPage(p => (p + 1) % PAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [phase]);

  const page = PAGES[currentPage];

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full text-center pt-[5cqh] pb-[3cqh] px-[5cqw] flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-[5cqw] font-black text-[#f97316] font-display leading-tight">
          One link. Every product. With prices.
        </h2>
        <p className="text-[2.5cqw] text-[#0D0D0D]/70 font-medium mt-[1cqh]">
          Customers swipe through — like a real catalog.
        </p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center gap-[4cqw] px-[5cqw] pb-[2cqh]">

        {/* Share card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-[2.5cqw] w-[34cqw] flex-shrink-0"
          initial={{ scale: 0.85, opacity: 0, x: -30 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1, x: 0 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-full h-[9cqw] bg-[#0D0D0D] rounded-xl mb-[2cqh] flex items-center justify-between px-[2cqw] overflow-hidden flex-shrink-0">
            <div className="text-white">
              <div className="text-[2.2cqw] font-black font-display leading-none">Mary's</div>
              <div className="text-[1.6cqw] font-black font-display text-[#F5A800]">Catalog</div>
            </div>
            <img src={`${import.meta.env.BASE_URL}images/bilum-bag-clean.png`} className="h-[7.5cqw] w-[7.5cqw] object-contain" alt="" />
          </div>

          <div className="flex items-center gap-[1.5cqw]">
            <div className="flex-1 bg-[#F0F4FF] rounded-xl px-[1.5cqw] py-[1.2cqh] border border-blue-100 min-w-0">
              <span className="text-[1.6cqw] text-blue-600 font-bold truncate block">catalogkit.org/c/mary</span>
            </div>
            <motion.div
              className="w-[4cqw] h-[4cqw] bg-[#f97316] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              animate={phase >= 2 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-[2.2cqw] h-[2.2cqw]">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </motion.div>
          </div>

          {/* Share row */}
          <motion.div
            className="flex items-center justify-center gap-[2cqw] mt-[2cqh]"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            {/* WhatsApp */}
            <div className="flex flex-col items-center gap-[0.5cqh]">
              <div className="w-[3.5cqw] h-[3.5cqw] rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" fill="white" className="w-[2.2cqw] h-[2.2cqw]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <span className="text-[1cqw] text-[#0D0D0D]/50 font-semibold">WhatsApp</span>
            </div>
            {/* Facebook */}
            <div className="flex flex-col items-center gap-[0.5cqh]">
              <div className="w-[3.5cqw] h-[3.5cqw] rounded-full bg-[#1877F2] flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" fill="white" className="w-[2.2cqw] h-[2.2cqw]">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-[1cqw] text-[#0D0D0D]/50 font-semibold">Facebook</span>
            </div>
            {/* SMS */}
            <div className="flex flex-col items-center gap-[0.5cqh]">
              <div className="w-[3.5cqw] h-[3.5cqw] rounded-full bg-[#6C63FF] flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" fill="white" className="w-[2.2cqw] h-[2.2cqw]">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <span className="text-[1cqw] text-[#0D0D0D]/50 font-semibold">SMS</span>
            </div>
          </motion.div>

          <div className="text-[1.4cqw] text-gray-400 mt-[1.5cqh] text-center">
            One link — share anywhere
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: -10 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <svg viewBox="0 0 60 24" fill="none" className="w-[7cqw] text-[#f97316]">
            <path d="M0 12 H50 M38 2 L52 12 L38 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Customer phone — flipbook */}
        <motion.div
          className="relative w-[18cqw] h-[34cqw] bg-white rounded-[3cqw] shadow-2xl border-[0.8cqw] border-[#222] overflow-hidden flex-shrink-0 flex flex-col"
          initial={{ y: '20cqh', opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 20, delay: 0.2 }}
        >
          <div className="h-[11%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0 z-10">
            <span className="text-white text-[1.5cqw] font-black font-display">Mary's Catalog</span>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentPage}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="h-[14%] flex items-center justify-center border-b border-gray-100 flex-shrink-0">
                  <span className="text-[1.5cqw] font-black text-[#0D0D0D] font-display">{page.name}</span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden px-[1cqw] py-[0.5cqh]">
                  <img src={`${import.meta.env.BASE_URL}images/${page.img}`} className="w-[78%] h-full object-contain" alt="" />
                </div>
                <div className="h-[14%] flex items-center justify-center border-t border-gray-100 flex-shrink-0">
                  <span className="text-[1.6cqw] font-bold text-[#f97316]">{page.price}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-[10%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
            <span className="text-[1cqw] font-bold text-white">catalogkit.org/c/mary</span>
          </div>

          <div className="absolute bottom-[11%] left-0 right-0 flex justify-center gap-[0.5cqw] z-20">
            {PAGES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentPage ? '1.6cqw' : '0.6cqw',
                  height: '0.6cqw',
                  background: i === currentPage ? '#f97316' : 'rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>

          {phase >= 3 && (
            <motion.div
              className="absolute bottom-[22%] right-[28%] w-[3.5cqw] h-[3.5cqw] bg-[#25D366] rounded-full flex items-center justify-center shadow-xl z-20"
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                x: [0, -22, -44, -44],
                scale: [0.8, 1, 1, 0.9],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-[2cqw] h-[2cqw]">
                <path d="M18 11V8a2 2 0 1 0-4 0v3M14 11V6a2 2 0 1 0-4 0v5M10 11V8a2 2 0 1 0-4 0v8a6 6 0 0 0 12 0v-5a2 2 0 1 0-4 0v0"/>
              </svg>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="w-full text-center px-[4cqw] pb-[2.5cqh] flex-shrink-0"
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[3cqw] font-bold text-[#0D0D0D] font-display leading-tight">
          No more scrolling through 20 images. <span className="text-[#f97316]">Just tap and browse.</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),   // heading
      setTimeout(() => setPhase(2), 1200),  // card + arrow + phone
      setTimeout(() => setPhase(3), 3000),  // swipe hint
      setTimeout(() => setPhase(4), 5500),  // caption
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Heading — fixed at top, full width */}
      <motion.div
        className="w-full text-center pt-[5vh] pb-[3vh] px-[5vw] flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-[5vw] font-black text-[#C41230] font-display leading-tight">
          Your catalog has a link.
        </h2>
        <p className="text-[2.5vw] text-[#0D0D0D]/70 font-medium mt-[1vh]">
          Share it anywhere — Facebook, SMS, WhatsApp, print it.
        </p>
      </motion.div>

      {/* Main content row — below heading */}
      <div className="flex-1 flex items-center justify-center gap-[4vw] px-[5vw] pb-[12vh]">

        {/* Catalog share card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-[2.5vw] w-[34vw] flex-shrink-0"
          initial={{ scale: 0.85, opacity: 0, x: -30 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1, x: 0 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* Mini catalog preview — fully contained */}
          <div className="w-full h-[9vw] bg-[#0D0D0D] rounded-xl mb-[2vh] flex items-center justify-between px-[2vw] overflow-hidden flex-shrink-0">
            <div className="text-white">
              <div className="text-[2.2vw] font-black font-display leading-none">Mary's</div>
              <div className="text-[1.6vw] font-black font-display text-[#F5A800]">Catalog</div>
            </div>
            <img
              src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`}
              className="h-[7.5vw] w-[7.5vw] object-contain"
              alt=""
            />
          </div>

          {/* Link row */}
          <div className="flex items-center gap-[1.5vw]">
            <div className="flex-1 bg-[#F0F4FF] rounded-xl px-[1.5vw] py-[1.2vh] border border-blue-100 min-w-0">
              <span className="text-[1.6vw] text-blue-600 font-bold truncate block">catalogkit.org/c/mary</span>
            </div>
            <motion.div
              className="w-[4vw] h-[4vw] bg-[#C41230] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              animate={phase >= 2 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-[2.2vw] h-[2.2vw]">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </motion.div>
          </div>
          <div className="text-[1.4vw] text-gray-400 mt-[1vh] text-center">
            Copy your link — share it anywhere
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: -10 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <svg viewBox="0 0 60 24" fill="none" className="w-[7vw] text-[#C41230]">
            <path d="M0 12 H50 M38 2 L52 12 L38 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Customer phone */}
        <motion.div
          className="w-[18vw] h-[34vw] bg-white rounded-[3vw] shadow-2xl border-[0.8vw] border-[#222] overflow-hidden flex-shrink-0"
          initial={{ y: '20vh', opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 20, delay: 0.2 }}
        >
          <div className="w-full h-full flex flex-col bg-white">
            {/* Header */}
            <div className="h-[11%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[1.5vw] font-black font-display">Mary's Catalog</span>
            </div>
            {/* Product name — top */}
            <div className="h-[10%] flex items-center justify-center flex-shrink-0 border-b border-gray-100">
              <span className="text-[1.7vw] font-black text-[#0D0D0D] font-display">BILUM BAG</span>
            </div>
            {/* Image — centre */}
            <div className="flex-1 flex items-center justify-center overflow-hidden px-[1vw]">
              <img
                src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`}
                className="w-[75%] h-full object-contain"
                alt=""
              />
            </div>
            {/* Price — bottom */}
            <div className="h-[10%] flex items-center justify-center flex-shrink-0 border-t border-gray-100">
              <span className="text-[1.6vw] font-bold text-[#C41230]">K 25.00</span>
            </div>
            {/* Footer */}
            <div className="h-[10%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
              <span className="text-[1vw] font-bold text-white">catalogkit.org/c/mary</span>
            </div>
          </div>

          {/* Swipe finger */}
          <motion.div
            className="absolute bottom-[20%] right-[25%] w-[4vw] h-[4vw] bg-[#25D366] rounded-full flex items-center justify-center shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 3 ? { opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8], x: [0, -25, -50] } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-[2.2vw] h-[2.2vw]">
              <path d="M18 11V8a2 2 0 1 0-4 0v3M14 11V6a2 2 0 1 0-4 0v5M10 11V8a2 2 0 1 0-4 0v8a6 6 0 0 0 12 0v-5a2 2 0 1 0-4 0v0"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom caption */}
      <motion.div
        className="absolute bottom-[2vh] w-full text-center px-[4vw]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[3vw] font-bold text-[#0D0D0D] font-display leading-tight whitespace-nowrap">
          Customer opens and <span className="text-[#C41230]">swipes through</span> your catalog.
        </h2>
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),   // heading
      setTimeout(() => setPhase(2), 1200),  // catalog link appears
      setTimeout(() => setPhase(3), 2800),  // customer phone appears
      setTimeout(() => setPhase(4), 4200),  // customer swiping
      setTimeout(() => setPhase(5), 6000),  // caption
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Heading */}
      <motion.div
        className="absolute top-[8vh] text-center px-[5vw]"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-[5.5vw] font-black text-[#C41230] font-display leading-tight">
          Your catalog has a link.
        </h2>
        <p className="text-[2.8vw] text-[#0D0D0D]/70 font-medium mt-[1.5vh]">
          Share it anywhere — Facebook, SMS, WhatsApp, print it.
        </p>
      </motion.div>

      <div className="relative flex-1 w-full flex items-center justify-center mt-[8vh]">

        {/* Catalog share card */}
        <motion.div
          className="absolute left-[8vw] top-[8vh] bg-white rounded-2xl shadow-2xl border border-gray-100 p-[2.5vw] w-[35vw]"
          initial={{ scale: 0.85, opacity: 0, x: -30 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1, x: 0 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* Mini catalog preview */}
          <div className="w-full h-[10vw] bg-[#0D0D0D] rounded-xl mb-[2vh] flex items-center justify-between px-[2vw] overflow-hidden">
            <div className="text-white flex-shrink-0">
              <div className="text-[2.2vw] font-black font-display leading-none">Mary's</div>
              <div className="text-[1.6vw] font-black font-display text-[#F5A800]">Catalog</div>
            </div>
            <img
              src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`}
              className="h-[8vw] w-[8vw] object-contain flex-shrink-0"
              alt=""
            />
          </div>

          {/* Link row */}
          <div className="flex items-center gap-[1.5vw]">
            <div className="flex-1 bg-[#F0F4FF] rounded-xl px-[1.5vw] py-[1.2vh] border border-blue-100">
              <span className="text-[1.6vw] text-blue-600 font-bold">catalogkit.org/c/mary</span>
            </div>
            {/* Copy button */}
            <motion.div
              className="w-[4.5vw] h-[4.5vw] bg-[#C41230] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              animate={phase >= 2 ? { scale: [1, 1.15, 1] } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-[2.5vw] h-[2.5vw]">
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
          className="absolute left-[46vw] top-[16vh]"
          initial={{ opacity: 0, x: -10 }}
          animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 60 24" fill="none" className="w-[8vw] text-[#C41230]">
            <path d="M0 12 H50 M38 2 L52 12 L38 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Customer phone */}
        <motion.div
          className="absolute right-[8vw] w-[20vw] h-[38vw] bg-white rounded-[3vw] shadow-2xl border-[0.8vw] border-[#222] overflow-hidden"
          initial={{ y: '30vh', opacity: 0 }}
          animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* Catalog page inside phone */}
          <div className="w-full h-full flex flex-col bg-white">
            {/* Catalog header */}
            <div className="h-[12%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[1.8vw] font-black font-display tracking-wide">Mary's Catalog</span>
            </div>
            {/* Product page */}
            <div className="flex-1 flex flex-col items-center justify-between py-[2vh] px-[1vw]">
              <img
                src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`}
                className="w-[75%] flex-1 object-contain"
                alt=""
              />
              <div className="text-center w-full mt-[1vh]">
                <div className="text-[2vw] font-black text-[#0D0D0D] font-display">BILUM BAG</div>
                <div className="text-[1.8vw] font-bold text-[#C41230]">K 25.00</div>
              </div>
            </div>
            {/* Catalog footer */}
            <div className="h-[10%] bg-[#F5A800]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[1.2vw] font-bold text-[#0D0D0D]">catalogkit.org/c/mary</span>
            </div>
          </div>

          {/* Swipe hint finger */}
          <motion.div
            className="absolute bottom-[15%] right-[20%] w-[5vw] h-[5vw] bg-[#25D366] rounded-full flex items-center justify-center shadow-xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 4 ? { opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8], x: [0, -30, -60] } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-[2.5vw] h-[2.5vw]">
              <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 3-1.14 3 1.26v3a5 5 0 0 1-5 5H9.5A4.5 4.5 0 0 1 5 16v-3c0-2.4 1.79-2.07 3-1.26z"/>
              <path d="M4 11h1M19 11h1M12 4V3"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom caption */}
      <motion.div
        className="absolute bottom-[8vh] text-center px-[10vw]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[4.5vw] font-bold text-[#0D0D0D] font-display leading-tight">
          Customer opens → <span className="text-[#C41230]">swipes through</span> your catalog.
        </h2>
      </motion.div>
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // heading in
      setTimeout(() => setPhase(2), 1000),  // phone appears
      setTimeout(() => setPhase(3), 2000),  // photo drops in
      setTimeout(() => setPhase(4), 3200),  // name types in
      setTimeout(() => setPhase(5), 4400),  // price types in
      setTimeout(() => setPhase(6), 5600),  // catalog result appears
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Warm glow background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#F5A800]/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADING — absolutely pinned at top, always visible */}
      <motion.div
        className="absolute top-0 left-0 right-0 text-center pt-[4vh] pb-[2vh] px-[5vw] z-10"
        initial={{ opacity: 0, y: -15 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-[5vw] font-black text-[#C41230] font-display leading-tight">
          Add photo, name and price.
        </h2>
        <p className="text-[2.6vw] text-[#0D0D0D]/65 font-semibold mt-[1vh]">
          CatalogKit builds your catalog — <span className="text-[#C41230]">automatically.</span>
        </p>
      </motion.div>

      {/* Content — sits below the heading */}
      <div className="absolute inset-0 flex items-center justify-center gap-[4vw] px-[5vw]"
           style={{ paddingTop: '22vh', paddingBottom: '5vh' }}>

        {/* Phone with upload form */}
        <motion.div
          className="w-[19vw] h-[33vw] bg-[#333] rounded-[2.5vw] border-[0.6vw] border-[#111] shadow-2xl overflow-hidden flex flex-col flex-shrink-0"
          initial={{ y: '15vh', opacity: 0, scale: 0.85 }}
          animate={phase >= 2 ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* App bar */}
          <div className="w-full h-[13%] bg-white flex items-center justify-center border-b border-gray-100 flex-shrink-0">
            <span className="text-[1.8vw] font-bold text-[#C41230]">Add Product</span>
          </div>

          {/* Form body */}
          <div className="flex-1 bg-[#F8F8F8] flex flex-col items-center px-[1.5vw] py-[1.5vh] gap-[1.2vh] overflow-hidden">

            {/* Photo box */}
            <div className="w-full h-[13vw] border-[0.3vw] border-dashed border-[#C41230]/40 rounded-xl flex items-center justify-center overflow-hidden bg-white flex-shrink-0">
              <motion.img
                src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`}
                className="w-[75%] h-[75%] object-contain"
                initial={{ scale: 0, opacity: 0 }}
                animate={phase >= 3 ? { scale: 1, opacity: 1 } : {}}
                transition={{ type: 'spring', bounce: 0.4 }}
              />
            </div>

            {/* Product name */}
            <div className="w-full flex-shrink-0">
              <div className="text-[1.2vw] text-gray-500 mb-[0.4vh] font-medium px-[0.3vw]">Product Name</div>
              <div className="w-full bg-white rounded-lg border-[0.2vw] border-gray-200 px-[1vw] py-[0.8vh] text-[1.5vw] font-bold text-[#0D0D0D] flex items-center min-h-[3vh]">
                <motion.span
                  animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {phase >= 4 ? 'Bilum Bag' : ''}
                </motion.span>
                {phase === 4 && (
                  <motion.span className="inline-block w-[0.12vw] h-[1.6vw] bg-[#C41230] ml-[0.2vw]"
                    animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                )}
              </div>
            </div>

            {/* Price */}
            <div className="w-full flex-shrink-0">
              <div className="text-[1.2vw] text-gray-500 mb-[0.4vh] font-medium px-[0.3vw]">Price (Kina)</div>
              <div className="w-full bg-white rounded-lg border-[0.2vw] border-gray-200 px-[1vw] py-[0.8vh] text-[1.5vw] font-bold text-[#C41230] flex items-center min-h-[3vh]">
                <motion.span
                  animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {phase >= 5 ? 'K 25.00' : ''}
                </motion.span>
                {phase === 5 && (
                  <motion.span className="inline-block w-[0.12vw] h-[1.6vw] bg-[#C41230] ml-[0.2vw]"
                    animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={phase >= 6 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 60 24" fill="none" className="w-[7vw] text-[#C41230]">
            <path d="M0 12 H50 M38 2 L52 12 L38 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Finished catalog page */}
        <motion.div
          className="w-[21vw] h-[30vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col flex-shrink-0"
          initial={{ opacity: 0, scale: 0.85, x: 30 }}
          animate={phase >= 6 ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ type: 'spring', damping: 18 }}
        >
          <div className="h-[13%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[1.8vw] font-black font-display">Mary's Catalog</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between py-[2vh] px-[1.5vw] overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`}
              className="flex-1 w-[65%] object-contain"
              alt=""
            />
            <div className="text-center mt-[1vh]">
              <div className="text-[2.2vw] font-black text-[#0D0D0D] font-display">BILUM BAG</div>
              <div className="text-[2vw] font-bold text-[#C41230]">K 25.00</div>
            </div>
          </div>
          <div className="h-[11%] bg-[#F5A800]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[1.1vw] font-bold text-[#0D0D0D]">+675 7000 0000</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom label — "Your catalog built automatically" visual reinforcement */}
      <motion.div
        className="absolute bottom-[2vh] w-full text-center"
        initial={{ opacity: 0 }}
        animate={phase >= 6 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-[2.8vw] font-bold text-[#0D0D0D] font-display">
          Your catalog — <span className="text-[#C41230]">done!</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

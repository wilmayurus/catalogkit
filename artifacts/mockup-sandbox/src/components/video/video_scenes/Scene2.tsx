import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Text 1
      setTimeout(() => setPhase(2), 1500),  // Phone appears
      setTimeout(() => setPhase(3), 2500),  // Photos drop in
      setTimeout(() => setPhase(4), 4500),  // Text 2
      setTimeout(() => setPhase(5), 5500),  // Book opens
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
      {/* Background warm circles */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#F5A800]/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute top-[8vh] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[5vw] font-black text-[#C41230] font-display">
          Upload your photos.
        </h2>
      </motion.div>

      <div className="relative flex-1 w-full flex items-center justify-center mt-[10vh]">
        {/* Phone */}
        <motion.div
          className="absolute w-[18vw] h-[36vw] bg-[#333] rounded-[2vw] border-[0.5vw] border-[#222] shadow-2xl overflow-hidden flex flex-col items-center"
          initial={{ y: '20vh', opacity: 0, scale: 0.8 }}
          animate={phase >= 2 ? (phase >= 5 ? { x: '-20vw', opacity: 0, scale: 0.8 } : { y: 0, opacity: 1, scale: 1 }) : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-full h-[15%] bg-white flex items-end justify-center pb-[1vh]">
             <div className="text-[1.5vw] font-bold text-[#C41230]">New Item</div>
          </div>
          <div className="w-full flex-1 bg-[#F5F5F5] flex flex-col items-center p-[2vw]">
             <div className="w-[12vw] h-[12vw] border-[0.3vw] border-dashed border-[#C41230]/40 rounded-xl flex items-center justify-center overflow-hidden bg-white mb-[2vh]">
                {/* Photo dropping in */}
                <motion.img 
                  src={`${import.meta.env.BASE_URL}images/bilum-bag-clean.png`}
                  className="w-[80%] h-[80%] object-contain"
                  initial={{ y: '-30vh', opacity: 0 }}
                  animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}
                  transition={{ type: 'spring', bounce: 0.5 }}
                />
             </div>
             <div className="w-[10vw] h-[2vh] bg-gray-300 rounded mb-[1vh]" />
             <div className="w-[6vw] h-[2vh] bg-gray-300 rounded" />
          </div>
        </motion.div>

        {/* Book */}
        <motion.div
          className="absolute w-[50vw] h-[35vw] flex perspective-[2000px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 5 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-1/2 h-full bg-[#C41230] rounded-l-xl shadow-2xl flex flex-col items-center justify-center p-[2vw]">
            <h3 className="text-[3vw] text-white font-bold font-display text-center">My Shop</h3>
            <div className="w-[10vw] h-[0.5vh] bg-[#F5A800] mt-[2vh]" />
          </div>
          <div className="w-1/2 h-full bg-white rounded-r-xl shadow-2xl flex flex-col items-center justify-between p-[2vw] border-l border-gray-200">
             <div className="w-full h-[60%] flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}images/bilum-bag-clean.png`} className="w-[80%] h-[80%] object-contain" />
             </div>
             <div className="text-center w-full">
                <h4 className="text-[2.5vw] font-bold text-black font-display leading-none">BILUM BAG</h4>
                <div className="text-[2vw] text-[#C41230] font-bold mt-[1vh]">K 25.00</div>
             </div>
             <div className="w-full bg-[#F5A800]/20 text-[#0D0D0D] text-[1.2vw] font-bold text-center py-[1vh] rounded mt-[2vh]">
                WhatsApp: +675 123 4567
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-[10vh] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[4vw] font-bold text-[#0D0D0D] font-display">
          Your catalog builds — <span className="text-[#C41230]">automatically.</span>
        </h2>
      </motion.div>

    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300), // surface appears
      setTimeout(() => setPhase(2), 1200), // flipbook enters
      setTimeout(() => setPhase(3), 3000), // page 1 flip
      setTimeout(() => setPhase(4), 5000), // page 2 flip
      setTimeout(() => setPhase(5), 7000), // text reveal
      setTimeout(() => setPhase(6), 9000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      <img src={`${import.meta.env.BASE_URL}images/dark-surface.png`} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Dark surface" />
      <div className="absolute inset-0 bg-[#0D0D0D]/60" />

      {/* Gold Glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[100px] pointer-events-none mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(245,168,0,0.15) 0%, transparent 60%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Flipbook Container */}
        <motion.div
          className="relative w-[50vw] h-[35vw] flex"
          initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1, rotateX: 0 } : { scale: 0.8, opacity: 0, rotateX: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ perspective: 2000 }}
        >
          {/* Left Page (Cover) */}
          <div className="w-1/2 h-full bg-[#C41230] rounded-l-xl shadow-[-20px_20px_40px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
             <h3 className="text-[4vw] font-['Bebas_Neue'] text-white z-10">My Catalog</h3>
             <div className="w-[10vw] h-[2px] bg-[#F5A800] mt-[2vh] z-10" />
          </div>

          {/* Right Pages Container */}
          <div className="w-1/2 h-full relative perspective-[2000px]">
            {/* Base Right Page (Page 3) */}
            <div className="absolute inset-0 bg-white rounded-r-xl shadow-[20px_20px_40px_rgba(0,0,0,0.8)] border border-black/10 flex flex-col">
              <div className="h-[15%] bg-[#C41230] rounded-tr-xl flex items-center px-[2vw]"><span className="text-white font-bold text-[1.2vw]">PNG Crafts</span></div>
              <div className="flex-1 flex flex-col items-center justify-center p-[2vw]">
                <img src={`${import.meta.env.BASE_URL}images/product-fruit.png`} className="h-[60%] object-contain" alt="Fruit" />
                <h4 className="text-[1.8vw] font-bold text-black mt-[1vh]">Tropical Fruits</h4>
                <div className="bg-[#F5A800] text-black px-[1.5vw] py-[0.5vh] rounded-full text-[1.2vw] font-bold mt-[1vh]">K15</div>
              </div>
              <div className="h-[10%] bg-[#0D0D0D] rounded-br-xl flex items-center justify-center"><span className="text-white/80 text-[1vw]">Contact: +675 123 4567</span></div>
            </div>

            {/* Flipped Page 2 */}
            <motion.div 
              className="absolute inset-0 bg-white rounded-r-xl shadow-[20px_20px_40px_rgba(0,0,0,0.5)] border border-black/10 flex flex-col origin-left"
              initial={{ rotateY: 0, zIndex: 20 }}
              animate={phase >= 4 ? { rotateY: -180, zIndex: 10 } : { rotateY: 0, zIndex: 20 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <div className="h-[15%] bg-[#C41230] rounded-tr-xl flex items-center px-[2vw]"><span className="text-white font-bold text-[1.2vw]">PNG Crafts</span></div>
              <div className="flex-1 flex flex-col items-center justify-center p-[2vw]">
                <img src={`${import.meta.env.BASE_URL}images/product-mask.png`} className="h-[60%] object-contain" alt="Mask" />
                <h4 className="text-[1.8vw] font-bold text-black mt-[1vh]">Carved Mask</h4>
                <div className="bg-[#F5A800] text-black px-[1.5vw] py-[0.5vh] rounded-full text-[1.2vw] font-bold mt-[1vh]">K150</div>
              </div>
              <div className="h-[10%] bg-[#0D0D0D] rounded-br-xl flex items-center justify-center"><span className="text-white/80 text-[1vw]">Contact: +675 123 4567</span></div>
            </motion.div>

            {/* Flipped Page 1 */}
            <motion.div 
              className="absolute inset-0 bg-white rounded-r-xl shadow-[20px_20px_40px_rgba(0,0,0,0.5)] border border-black/10 flex flex-col origin-left"
              initial={{ rotateY: 0, zIndex: 30 }}
              animate={phase >= 3 ? { rotateY: -180, zIndex: 0 } : { rotateY: 0, zIndex: 30 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <div className="h-[15%] bg-[#C41230] rounded-tr-xl flex items-center px-[2vw]"><span className="text-white font-bold text-[1.2vw]">PNG Crafts</span></div>
              <div className="flex-1 flex flex-col items-center justify-center p-[2vw]">
                <img src={`${import.meta.env.BASE_URL}images/product-bilum.png`} className="h-[60%] object-contain" alt="Bilum" />
                <h4 className="text-[1.8vw] font-bold text-black mt-[1vh]">Woven Bilum</h4>
                <div className="bg-[#F5A800] text-black px-[1.5vw] py-[0.5vh] rounded-full text-[1.2vw] font-bold mt-[1vh]">K80</div>
              </div>
              <div className="h-[10%] bg-[#0D0D0D] rounded-br-xl flex items-center justify-center"><span className="text-white/80 text-[1vw]">Contact: +675 123 4567</span></div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[10vh] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[4vw] font-['Montserrat'] font-bold text-white mb-[1vh]">
            A beautiful flipbook
          </h2>
          <p className="text-[2vw] text-[#F5A800]">Created instantly.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

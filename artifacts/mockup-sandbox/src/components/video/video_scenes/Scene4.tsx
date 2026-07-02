import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300), // link appears
      setTimeout(() => setPhase(2), 1500), // split reveal left (flipbook)
      setTimeout(() => setPhase(3), 3000), // split reveal right (PDF)
      setTimeout(() => setPhase(4), 5000), // text reveal
      setTimeout(() => setPhase(5), 9000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0D0D0D]" />

      <motion.div 
        className="absolute top-[8vh] flex items-center justify-center gap-[1vw] bg-[#25D366]/10 px-[3vw] py-[1.5vh] rounded-full border border-[#25D366]/30"
        initial={{ y: -50, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[2.5vw] h-[2.5vw] text-[#25D366]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="text-[2vw] text-[#25D366] font-medium tracking-wide">catalogkit.org/v/my-shop</span>
      </motion.div>

      <div className="relative w-full flex-1 mt-[20vh] mb-[20vh] flex px-[5vw]">
        {/* Left Side: Flipbook */}
        <div className="w-1/2 h-full flex flex-col items-center justify-center relative">
          <motion.div
            className="w-[18vw] h-[36vw] bg-[#111] rounded-[2.5vw] border-4 border-[#333] shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={phase >= 2 ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: -50, rotate: -5 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[6vw] h-[1.5vw] bg-[#333] rounded-b-xl z-20" />
            
            {/* Flipbook content in phone */}
            <div className="w-full h-full bg-white flex flex-col pt-[3vw]">
               <div className="h-[10%] bg-[#C41230] w-full flex items-center justify-center text-white font-bold text-[1.5vw]">My Shop</div>
               <div className="flex-1 flex flex-col items-center justify-center relative">
                 <img src={`${import.meta.env.BASE_URL}images/product-mask.png`} className="w-[80%] h-auto object-contain" alt="Mask" />
                 <div className="absolute right-[-1vw] top-1/2 w-[2vw] h-[2vw] bg-black/10 rounded-full flex items-center justify-center text-black font-bold">›</div>
               </div>
               <div className="h-[8%] bg-[#0D0D0D] w-full flex items-center justify-center text-white/80 text-[1vw]">Contact Us</div>
            </div>
            
            {/* Swipe animation indicator */}
            <motion.div 
              className="absolute top-1/2 right-[2vw] w-[3vw] h-[3vw] rounded-full bg-white/50 backdrop-blur-sm pointer-events-none flex items-center justify-center"
              initial={{ x: 0, opacity: 0 }}
              animate={phase >= 2 ? { x: [-30, 0], opacity: [0, 1, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-[1vw] h-[1vw] bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: PDF */}
        <div className="w-1/2 h-full flex flex-col items-center justify-center relative">
          <motion.div
            className="w-[20vw] h-[28vw] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 relative"
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={phase >= 3 ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 50, rotate: 5 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {/* PDF Header */}
            <div className="h-[15%] w-full bg-[#e53935] rounded-t-xl flex items-center px-[1.5vw] gap-[1vw]">
               <svg viewBox="0 0 24 24" fill="none" className="w-[2vw] h-[2vw] text-white" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
               </svg>
               <span className="text-white font-bold text-[1.2vw]">Catalog.pdf</span>
            </div>
            {/* PDF Content grid */}
            <div className="flex-1 p-[1.5vw] grid grid-cols-2 gap-[1vw]">
               <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-[0.5vw]">
                 <img src={`${import.meta.env.BASE_URL}images/product-bilum.png`} className="w-[80%] object-contain" alt="item" />
                 <div className="w-[60%] h-[0.5vw] bg-gray-300 mt-[1vh] rounded" />
               </div>
               <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-[0.5vw]">
                 <img src={`${import.meta.env.BASE_URL}images/product-mask.png`} className="w-[80%] object-contain" alt="item" />
                 <div className="w-[60%] h-[0.5vw] bg-gray-300 mt-[1vh] rounded" />
               </div>
               <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-[0.5vw]">
                 <img src={`${import.meta.env.BASE_URL}images/product-fruit.png`} className="w-[80%] object-contain" alt="item" />
                 <div className="w-[60%] h-[0.5vw] bg-gray-300 mt-[1vh] rounded" />
               </div>
               <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-[0.5vw]">
                 <div className="w-[80%] h-[60%] bg-gray-200" />
                 <div className="w-[60%] h-[0.5vw] bg-gray-300 mt-[1vh] rounded" />
               </div>
            </div>
            
            {/* Download Arrow Animation */}
            <motion.div 
              className="absolute -right-[3vw] top-1/2 -translate-y-1/2 w-[4vw] h-[4vw] bg-[#C41230] rounded-full flex items-center justify-center text-white shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={phase >= 3 ? { y: [0, 10, 0], opacity: 1 } : { y: -20, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-[2vw] h-[2vw]" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-[10vh] text-center w-full px-[10vw]"
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[3.5vw] font-['Montserrat'] font-bold text-white leading-tight">
          One link. Two ways to share.
        </h2>
        <p className="text-[2.5vw] text-[#F5A800] mt-[1vh]">
          Browse online or download the PDF.
        </p>
      </motion.div>

    </motion.div>
  );
}

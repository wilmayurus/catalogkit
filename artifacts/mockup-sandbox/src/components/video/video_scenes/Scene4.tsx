import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Left PDF side
      setTimeout(() => setPhase(2), 2500),  // Right WhatsApp side
      setTimeout(() => setPhase(3), 4000),  // WhatsApp Bubble pop
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-1/2 h-full relative flex flex-col items-center justify-center border-r border-[#C41230]/10">
         <motion.div 
           className="flex flex-col items-center"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
           transition={{ type: 'spring', damping: 20 }}
         >
            <div className="relative w-[15vw] h-[20vw] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-100 mb-[4vh]">
              <div className="h-[20%] bg-[#E53935] rounded-t-xl flex items-center justify-center">
                 <span className="text-white font-bold text-[2vw]">PDF</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-[1vw] p-[1.5vw]">
                 <div className="bg-gray-100 rounded-lg flex items-center justify-center p-1">
                   <img src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`} className="w-[80%] object-contain" />
                 </div>
                 <div className="bg-gray-100 rounded-lg flex items-center justify-center p-1">
                   <img src={`${import.meta.env.BASE_URL}/images/tropical-fruit-warm.png`} className="w-[80%] object-contain" />
                 </div>
                 <div className="bg-gray-100 rounded-lg flex items-center justify-center p-1">
                   <img src={`${import.meta.env.BASE_URL}/images/product-mask.png`} className="w-[80%] object-contain" />
                 </div>
                 <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                   <span className="text-gray-400 text-[1.2vw]">+more</span>
                 </div>
              </div>
              
              <motion.div 
                className="absolute -right-[3vw] -bottom-[3vw] w-[8vw] h-[8vw] bg-[#C41230] rounded-full text-white flex items-center justify-center shadow-xl"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[4vw] h-[4vw]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.div>
            </div>
            
            <div className="text-center">
               <h3 className="text-[3.5vw] font-bold text-[#0D0D0D] font-display">Download as PDF.</h3>
               <p className="text-[2.5vw] text-[#C41230] font-medium mt-[1vh]">Share with anyone.</p>
            </div>
         </motion.div>
      </div>

      <div className="w-1/2 h-full relative flex flex-col items-center justify-center bg-white/50">
         <motion.div 
           className="flex flex-col items-center"
           initial={{ scale: 0.8, opacity: 0 }}
           animate={phase >= 2 ? { scale: 1, opacity: 1 } : {}}
           transition={{ type: 'spring', damping: 20 }}
         >
            {/* Last page of catalog showing WhatsApp button at the bottom */}
            <div className="relative w-[20vw] h-[28vw] bg-white rounded-2xl shadow-2xl border border-gray-100 mb-[3vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="h-[10%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[1.2vw] font-bold tracking-wide">Mary's Catalog</span>
              </div>
              {/* Product name — top */}
              <div className="h-[10%] flex items-center justify-center flex-shrink-0 border-b border-gray-100">
                <span className="text-[1.4vw] font-black text-[#0D0D0D] font-display">LAST PAGE</span>
              </div>
              {/* Page body */}
              <div className="flex-1 flex flex-col items-center justify-center px-[1.5vw] gap-[0.8vh]">
                <div className="text-[1.8vw] font-bold text-[#0D0D0D] text-center">Thank you for viewing!</div>
                <div className="text-[1.3vw] text-gray-500 text-center">Tap below to order</div>
              </div>
              {/* WhatsApp button at the BOTTOM of the last page */}
              <motion.div
                className="mx-[1.5vw] mb-[1.5vw] bg-[#25D366] rounded-xl py-[1.2vw] flex items-center justify-center gap-[1vw] shadow-lg"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-[2.5vw] h-[2.5vw]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span className="text-white font-bold text-[1.6vw]">+675 7000 0000</span>
              </motion.div>
            </div>

            {/* Pop-up customer reply */}
            <motion.div 
              className="absolute right-[2vw] top-[30%] bg-white rounded-2xl rounded-br-none shadow-xl border border-gray-100 px-[2vw] py-[1.2vw] whitespace-nowrap"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 3 ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              <span className="text-[1.8vw] text-black font-bold">I want to buy the bilum!</span>
            </motion.div>
            
            <div className="text-center">
               <h3 className="text-[3.5vw] font-bold text-[#0D0D0D] font-display">WhatsApp button</h3>
               <p className="text-[2.5vw] text-[#25D366] font-medium mt-[1vh]">at the end of every catalog.</p>
            </div>
         </motion.div>
      </div>

    </motion.div>
  );
}

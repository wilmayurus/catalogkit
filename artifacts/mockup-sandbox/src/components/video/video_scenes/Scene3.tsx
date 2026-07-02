import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // text 1
      setTimeout(() => setPhase(2), 1500),  // chat bubble
      setTimeout(() => setPhase(3), 3500),  // customer phone
      setTimeout(() => setPhase(4), 5000),  // text 2
      setTimeout(() => setPhase(5), 6500),  // swipe page
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
      <motion.div
        className="absolute top-[8vh] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[6vw] font-black text-[#C41230] font-display">
          Send ONE link.
        </h2>
      </motion.div>

      <div className="relative flex-1 w-full flex items-center justify-center mt-[10vh]">
        
        {/* WhatsApp bubble */}
        <motion.div 
          className="absolute top-[15vh] left-[20vw] bg-white rounded-2xl rounded-tl-none shadow-xl p-[2vw] border border-gray-100 flex items-center gap-[2vw]"
          initial={{ scale: 0, opacity: 0, originX: 0, originY: 0 }}
          animate={phase >= 2 ? (phase >= 3 ? { x: '-20vw', opacity: 0.5, scale: 0.7 } : { scale: 1, opacity: 1 }) : {}}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <div className="w-[5vw] h-[5vw] bg-[#25D366] rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[3vw] h-[3vw]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          <div>
            <div className="text-[2vw] text-blue-500 underline font-bold">catalogkit.org/c/abc123</div>
            <div className="text-[1.5vw] text-gray-500 mt-[0.5vh]">Look at my catalog!</div>
          </div>
        </motion.div>

        {/* Customer Phone */}
        <motion.div
          className="absolute right-[20vw] w-[22vw] h-[45vw] bg-white rounded-[3vw] shadow-2xl border-[0.8vw] border-[#222] overflow-hidden"
          initial={{ y: '30vh', opacity: 0 }}
          animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 20 }}
          style={{ perspective: 1000 }}
        >
          {/* Flipbook inside phone */}
          <div className="w-full h-full bg-[#FFF8F0] relative flex">
             <div className="w-[50%] h-full bg-[#C41230] relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.2)]" />
             
             {/* Base page right */}
             <div className="absolute top-0 right-0 w-[50%] h-full bg-white flex flex-col items-center justify-between py-[4vh]">
                <img src={`${import.meta.env.BASE_URL}/images/tropical-fruit-warm.png`} className="w-[80%] object-contain" />
                <div className="text-center font-bold text-black text-[2vw]">FRUIT</div>
             </div>

             {/* Swiping page */}
             <motion.div 
                className="absolute top-0 right-0 w-[50%] h-full bg-white flex flex-col items-center justify-between py-[4vh] origin-left shadow-2xl"
                initial={{ rotateY: 0 }}
                animate={phase >= 5 ? { rotateY: -180 } : {}}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
             >
                <img src={`${import.meta.env.BASE_URL}/images/bilum-bag-clean.png`} className="w-[80%] object-contain" />
                <div className="text-center font-bold text-black text-[2vw]">BILUM</div>
             </motion.div>
          </div>
        </motion.div>

      </div>

      <motion.div
        className="absolute bottom-[10vh] text-center px-[10vw]"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[5vw] font-bold text-[#0D0D0D] font-display leading-tight">
          Customers <span className="text-[#F5A800]">swipe through</span><br/> your catalog.
        </h2>
      </motion.div>
    </motion.div>
  );
}

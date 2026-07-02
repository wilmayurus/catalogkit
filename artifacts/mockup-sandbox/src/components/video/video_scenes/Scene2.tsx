import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200), // first image
      setTimeout(() => setPhase(3), 1600), // second image
      setTimeout(() => setPhase(4), 2000), // third image
      setTimeout(() => setPhase(5), 3500), // text
      setTimeout(() => setPhase(6), 5000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const images = [
    { src: 'product-bilum.png', rotate: -10, x: '-20vw', y: '10vh' },
    { src: 'product-mask.png', rotate: 5, x: '0vw', y: '-5vh' },
    { src: 'product-fruit.png', rotate: 15, x: '20vw', y: '15vh' }
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[#0D0D0D]" />

      <motion.div 
        className="absolute top-[15vh] text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-[4vw] font-['Montserrat'] font-bold text-white mb-[1vh]">
          Snap your products
        </h2>
        <p className="text-[2vw] text-white/60">Upload directly to CatalogKit</p>
      </motion.div>

      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="absolute w-[22vw] h-[22vw] bg-white rounded-xl shadow-2xl p-[1vw]"
            initial={{ y: '50vh', opacity: 0, rotate: 0, scale: 0.8 }}
            animate={phase >= 2 + i ? { y: img.y, x: img.x, opacity: 1, rotate: img.rotate, scale: 1 } : { y: '50vh', opacity: 0, rotate: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          >
            <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
               <img src={`${import.meta.env.BASE_URL}images/${img.src}`} className="w-[80%] h-[80%] object-contain drop-shadow-xl" alt="Product" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute bottom-[15vh] bg-[#C41230] text-white px-[4vw] py-[2vh] rounded-full flex items-center gap-[1vw] shadow-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={phase >= 5 ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[2vw] h-[2vw]" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span className="text-[2vw] font-bold">Uploading...</span>
      </motion.div>
    </motion.div>
  );
}

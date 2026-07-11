import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Scene4({ portrait }: { portrait?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1),  400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 6500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const WA_SVG = (
    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Heading */}
      <motion.div
        className={`w-full text-center ${portrait ? 'pt-[3cqh] pb-[1.5cqh]' : 'pt-[4cqh] pb-[2cqh]'} px-[5cqw] flex-shrink-0`}
        initial={{ opacity: 0, y: -15 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className={`${portrait ? 'text-[5.5cqw]' : 'text-[5cqw]'} font-black text-[#f97316] font-display leading-tight`}>
          Share a link. Or send the PDF.
        </h2>
        <p className={`${portrait ? 'text-[3cqw]' : 'text-[2.4cqw]'} text-[#0D0D0D]/65 font-semibold mt-[0.8cqh]`}>
          Plus — a <span className="text-[#25D366] font-bold">WhatsApp button</span> at the end of every catalog.
        </p>
      </motion.div>

      {portrait ? (
        /* ── Portrait: full-height stacked layout ── */
        <div className="flex-1 flex flex-col px-[5cqw] overflow-hidden justify-center gap-[0]">

          {/* PDF row */}
          <motion.div
            className="flex items-center gap-[3cqw] bg-white rounded-2xl shadow-lg border border-gray-100 px-[3cqw] py-[2cqh] flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* PDF thumbnail */}
            <div className="relative w-[24cqw] h-[18cqw] bg-white rounded-xl shadow-md flex flex-col border border-gray-100 flex-shrink-0">
              <div className="h-[28%] bg-[#ea580c] rounded-t-xl flex items-center justify-center">
                <span className="text-white font-bold text-[3cqw]">PDF</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-[0.6cqw] p-[1cqw]">
                {['bilum-bag-clean.png','tropical-fruit-warm.png','product-mask.png'].map((img, i) => (
                  <div key={i} className="bg-gray-100 rounded flex items-center justify-center p-[0.3cqw]">
                    <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-full object-contain" alt="" />
                  </div>
                ))}
                <div className="bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-[1.3cqw]">+more</span>
                </div>
              </div>
              <motion.div
                className="absolute -right-[2.5cqw] -top-[2cqw] w-[6cqw] h-[6cqw] bg-[#f97316] rounded-full flex items-center justify-center shadow-xl"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-[3cqw] h-[3cqw]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.div>
            </div>
            {/* PDF label */}
            <div>
              <h3 className="text-[4cqw] font-bold text-[#0D0D0D] font-display leading-tight">PDF Download</h3>
              <p className="text-[3cqw] text-[#f97316] font-medium mt-[0.6cqh] leading-snug">Print it.<br/>Email it.<br/>Share it.</p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-[2cqw] py-[1.5cqh] px-[4cqw] flex-shrink-0">
            <div className="flex-1 h-[0.15cqh] bg-[#f97316]/20" />
            <span className="text-[3.5cqw] text-[#f97316]/50 font-bold">+</span>
            <div className="flex-1 h-[0.15cqh] bg-[#f97316]/20" />
          </div>

          {/* WhatsApp card — full width */}
          <motion.div
            className="flex flex-col flex-shrink-0"
            style={{ height: '38cqh' }}
            initial={{ opacity: 0, x: 20 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden" style={{ height: '30cqh' }}>
              <div className="h-[12%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[2cqw] font-bold tracking-wide">Mary's Catalog</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-[3cqw] gap-[1.5cqh]">
                <div className="text-[3cqw] font-bold text-[#0D0D0D]">Thank you for viewing!</div>
                <div className="text-[2.2cqw] text-gray-400">3 products · Tap below to order</div>
                <div className="flex gap-[2cqw]">
                  {['bilum-bag-clean.png','tropical-fruit-warm.png','product-mask.png'].map((img, i) => (
                    <div key={i} className="w-[10cqw] h-[10cqw] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                      <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-[80%] h-[80%] object-contain" alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                className="mx-[3cqw] mb-[2cqh] bg-[#25D366] rounded-2xl py-[2cqw] flex items-center justify-center gap-[1.5cqw] shadow-lg"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-[4cqw] h-[4cqw]">{WA_SVG}</div>
                <span className="text-white font-bold text-[2.8cqw]">+675 7000 0000</span>
              </motion.div>
            </div>

            {/* Customer bubble */}
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  className="mt-[1.5cqh] self-start bg-[#25D366] rounded-2xl rounded-tl-none shadow-xl px-[3cqw] py-[1.5cqh]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.6 }}
                >
                  <span className="text-white text-[3cqw] font-bold block leading-snug">I want the bilum! 🛍️</span>
                  <span className="text-white/70 text-[2cqw]">via WhatsApp</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : (
        /* ── Landscape: side by side ── */
        <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center gap-[4cqw] px-[5cqw] pb-[2cqh]">

          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0, x: -20 }}
            animate={phase >= 2 ? { scale: 1, opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="relative w-[17cqw] h-[22cqw] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-100 mb-[3cqh]">
              <div className="h-[20%] bg-[#ea580c] rounded-t-xl flex items-center justify-center">
                <span className="text-white font-bold text-[2.5cqw]">PDF</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-[1cqw] p-[1.5cqw]">
                {['bilum-bag-clean.png','tropical-fruit-warm.png','product-mask.png'].map((img, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg flex items-center justify-center p-1">
                    <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-[80%] object-contain" alt="" />
                  </div>
                ))}
                <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-[1.2cqw]">+more</span>
                </div>
              </div>
              <motion.div
                className="absolute -right-[3cqw] -bottom-[3cqw] w-[8cqw] h-[8cqw] bg-[#f97316] rounded-full text-white flex items-center justify-center shadow-xl"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[4cqw] h-[4cqw]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.div>
            </div>
            <div className="text-center">
              <h3 className="text-[3cqw] font-bold text-[#0D0D0D] font-display">PDF Download</h3>
              <p className="text-[2cqw] text-[#f97316] font-medium mt-[0.5cqh]">Print it. Email it. Share it.</p>
            </div>
          </motion.div>

          <div className="flex flex-col items-center gap-[2cqh] flex-shrink-0">
            <div className="w-[0.15cqw] h-[20cqh] bg-[#f97316]/15" />
            <span className="text-[2cqw] text-[#f97316]/40 font-bold">+</span>
            <div className="w-[0.15cqw] h-[20cqh] bg-[#f97316]/15" />
          </div>

          <motion.div
            className="flex flex-col items-center relative"
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            animate={phase >= 3 ? { scale: 1, opacity: 1, x: 0 } : {}}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="relative w-[20cqw] h-[22cqw] bg-white rounded-2xl shadow-2xl border border-gray-100 mb-[1.5cqh] flex flex-col overflow-hidden">
              <div className="h-[10%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[1.2cqw] font-bold tracking-wide">Mary's Catalog</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-[1.5cqw] gap-[1cqh]">
                <div className="text-[1.8cqw] font-bold text-[#0D0D0D] text-center">Thank you for viewing!</div>
                <div className="text-[1.2cqw] text-gray-400 text-center">3 products · Tap below to order</div>
                <div className="flex gap-[0.8cqw] mt-[1cqh]">
                  {['bilum-bag-clean.png','tropical-fruit-warm.png','product-mask.png'].map((img, i) => (
                    <div key={i} className="w-[4.5cqw] h-[4.5cqw] bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                      <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-[80%] h-[80%] object-contain" alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                className="mx-[1.5cqw] mb-[1.5cqw] bg-[#25D366] rounded-xl py-[1.2cqw] flex items-center justify-center gap-[0.8cqw] shadow-lg"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-[2.5cqw] h-[2.5cqw]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span className="text-white font-bold text-[1.6cqw]">+675 7000 0000</span>
              </motion.div>
            </div>
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  className="mt-[1.5cqh] bg-[#25D366] rounded-2xl rounded-tl-none shadow-xl px-[1.8cqw] py-[1cqw]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.6 }}
                >
                  <span className="text-white text-[1.6cqw] font-bold block leading-snug">I want the bilum! 🛍️</span>
                  <span className="text-white/70 text-[1cqw]">via WhatsApp</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Bottom caption */}
      <motion.div
        className={`flex-shrink-0 w-full text-center ${portrait ? 'pb-[2cqh]' : 'pb-[4cqh]'}`}
        initial={{ opacity: 0 }}
        animate={phase >= 5 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className={`${portrait ? 'text-[3cqw]' : 'text-[2.5cqw]'} font-bold text-[#0D0D0D] font-display`}>
          No more ignored photos. <span className="text-[#f97316]">Real orders. Real sales.</span>
        </span>
      </motion.div>

    </motion.div>
  );
}

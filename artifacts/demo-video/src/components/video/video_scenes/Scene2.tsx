import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
  { img: 'bilum-bag-clean.png',      name: 'Bilum',        price: 'K 25' },
  { img: 'tropical-fruit-warm.png',  name: 'Fruit Mix',    price: 'K 5'  },
  { img: 'product-mask.png',         name: 'Beaded Mask',  price: 'K 40' },
];

export function Scene2({ portrait }: { portrait?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1),  300),
      setTimeout(() => setPhase(2),  900),
      setTimeout(() => setPhase(3), 1700),
      setTimeout(() => setPhase(4), 2300),
      setTimeout(() => setPhase(5), 2900),
      setTimeout(() => setPhase(6), 3800),
      setTimeout(() => setPhase(7), 4600),
      setTimeout(() => setPhase(8), 5400),
      setTimeout(() => setPhase(9), 6200),
      setTimeout(() => setPhase(10), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const phoneW = portrait ? 'w-[38cqw]' : 'w-[18cqw]';
  const phoneH = portrait ? 'h-[62cqw]' : 'h-[26cqw]';
  const catalogW = portrait ? 'w-[38cqw]' : 'w-[18cqw]';
  const catalogH = portrait ? 'h-[28cqw]' : 'h-[22cqw]';

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#FFF8F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-[-20%] left-[-10%] w-[60cqw] h-[60cqw] bg-[#F5A800]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="flex-shrink-0 text-center pt-[3cqh] pb-[1cqh] px-[5cqw] z-10"
        initial={{ opacity: 0, y: -15 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2 className={`${portrait ? 'text-[5.5cqw]' : 'text-[4.8cqw]'} font-black text-[#f97316] font-display leading-tight`}>
          Upload your photos.<br />Add price & name.
        </h2>
        <p className={`${portrait ? 'text-[3cqw]' : 'text-[2.4cqw]'} text-[#0D0D0D]/65 font-semibold mt-[0.8cqh]`}>
          When you're ready — click <span className="text-[#f97316]">Build Catalog</span> and it's done.
        </p>
      </motion.div>

      <div className={`flex-1 min-h-0 overflow-hidden flex items-center justify-center px-[5cqw] pb-[2cqh] ${portrait ? 'flex-col gap-[2cqh]' : 'flex-row gap-[4cqw]'}`}>
        {/* Phone */}
        <motion.div
          className={`${phoneW} ${phoneH} bg-[#222] rounded-[2.5cqw] border-[0.6cqw] border-[#111] shadow-2xl overflow-hidden flex flex-col flex-shrink-0`}
          initial={{ y: '15cqh', opacity: 0, scale: 0.88 }}
          animate={phase >= 2 ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="w-full h-[11%] bg-white flex items-center justify-center border-b border-gray-100 flex-shrink-0">
            <span className={`${portrait ? 'text-[2.2cqw]' : 'text-[1.8cqw]'} font-bold text-[#f97316]`}>
              {phase < 6 ? 'Upload Photos' : 'Add Details'}
            </span>
          </div>

          <div className="flex-1 bg-[#F8F8F8] overflow-hidden relative">
            <AnimatePresence>
              {phase < 6 && (
                <motion.div
                  key="upload"
                  className="absolute inset-0 flex flex-col items-center px-[1.5cqw] pt-[1.5cqh] pb-[1cqh] gap-[1cqh]"
                  exit={{ x: '-100%', opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-full flex-shrink-0 border-[0.3cqw] border-dashed border-[#f97316]/50 rounded-xl bg-white flex flex-col items-center justify-center py-[1.5cqh] gap-[0.6cqh]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" className={`${portrait ? 'w-[4cqw] h-[4cqw]' : 'w-[3.5cqw] h-[3.5cqw]'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                    <span className={`${portrait ? 'text-[1.6cqw]' : 'text-[1.3cqw]'} font-bold text-[#f97316]`}>Select All Photos</span>
                    <span className={`${portrait ? 'text-[1.3cqw]' : 'text-[1cqw]'} text-gray-400`}>tap to choose multiple</span>
                  </div>

                  <div className="w-full flex gap-[1cqw] justify-center flex-shrink-0">
                    {PRODUCTS.map((p, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm"
                        initial={{ scale: 0, opacity: 0, y: -20 }}
                        animate={phase >= 3 + i ? { scale: 1, opacity: 1, y: 0 } : {}}
                        transition={{ type: 'spring', bounce: 0.45, duration: 0.5 }}
                      >
                        <img src={`${import.meta.env.BASE_URL}images/${p.img}`} className="w-[85%] h-[85%] object-contain" alt="" />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className={`bg-[#f97316] text-white ${portrait ? 'text-[1.5cqw]' : 'text-[1.2cqw]'} font-bold px-[2cqw] py-[0.6cqh] rounded-full`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    3 photos selected ✓
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase >= 6 && (
                <motion.div
                  key="details"
                  className="absolute inset-0 flex flex-col px-[1cqw] pt-[1cqh] pb-[1cqh] gap-[0.8cqh] overflow-hidden"
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {PRODUCTS.map((p, i) => {
                    const filled = phase >= 7 + i;
                    return (
                      <motion.div
                        key={i}
                        className="flex items-center gap-[1cqw] bg-white rounded-xl border border-gray-200 px-[1cqw] py-[0.8cqh] flex-shrink-0 shadow-sm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={phase >= 6 ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                      >
                        <div className={`${portrait ? 'w-[5cqw] h-[5cqw]' : 'w-[4cqw] h-[4cqw]'} rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center bg-gray-50`}>
                          <img src={`${import.meta.env.BASE_URL}images/${p.img}`} className="w-[90%] h-[90%] object-contain" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col gap-[0.5cqh] min-w-0">
                          <div className={`w-full rounded border px-[0.6cqw] py-[0.3cqh] ${portrait ? 'text-[1.5cqw]' : 'text-[1.2cqw]'} font-bold text-[#0D0D0D] flex items-center min-h-[2.2cqh] transition-colors ${filled ? 'border-[#f97316]/40 bg-[#FFF8F0]' : 'border-gray-200 bg-gray-50'}`}>
                            <motion.span animate={filled ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.2 }}>
                              {filled ? p.name : ''}
                            </motion.span>
                            {phase === 7 + i && (
                              <motion.span className={`inline-block w-[0.1cqw] ${portrait ? 'h-[1.8cqw]' : 'h-[1.4cqw]'} bg-[#f97316] ml-[0.1cqw]`}
                                animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
                            )}
                          </div>
                          <div className={`w-full rounded border px-[0.6cqw] py-[0.3cqh] ${portrait ? 'text-[1.5cqw]' : 'text-[1.2cqw]'} font-bold text-[#f97316] flex items-center min-h-[2.2cqh] transition-colors ${filled ? 'border-[#f97316]/40 bg-[#FFF8F0]' : 'border-gray-200 bg-gray-50'}`}>
                            <motion.span animate={filled ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
                              {filled ? p.price : ''}
                            </motion.span>
                          </div>
                        </div>
                        <motion.div
                          className={`${portrait ? 'w-[2.5cqw] h-[2.5cqw]' : 'w-[2cqw] h-[2cqw]'} rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0`}
                          initial={{ scale: 0 }}
                          animate={filled ? { scale: 1 } : {}}
                          transition={{ type: 'spring', bounce: 0.5 }}
                        >
                          <svg viewBox="0 0 12 10" fill="none" className={portrait ? 'w-[1.5cqw]' : 'w-[1.2cqw]'}>
                            <path d="M1 5l3 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={phase >= 10 ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {portrait ? (
            <svg viewBox="0 0 24 40" fill="none" className="h-[5cqw] text-[#f97316]">
              <path d="M12 0 V32 M2 22 L12 34 L22 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 60 24" fill="none" className="w-[6cqw] text-[#f97316]">
              <path d="M0 12 H50 M38 2 L52 12 L38 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </motion.div>

        {/* Finished catalog page */}
        <motion.div
          className={`${catalogW} ${catalogH} bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col flex-shrink-0`}
          initial={{ opacity: 0, scale: 0.85, x: portrait ? 0 : 30, y: portrait ? 30 : 0 }}
          animate={phase >= 10 ? { opacity: 1, scale: 1, x: 0, y: 0 } : {}}
          transition={{ type: 'spring', damping: 18 }}
        >
          <div className="h-[12%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
            <span className={`text-white ${portrait ? 'text-[2.2cqw]' : 'text-[1.7cqw]'} font-black font-display`}>Mary's Catalog</span>
          </div>
          <div className="h-[10%] flex items-center justify-center flex-shrink-0 border-b border-gray-100">
            <span className={`${portrait ? 'text-[2.2cqw]' : 'text-[1.8cqw]'} font-black text-[#0D0D0D] font-display`}>BILUM</span>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden px-[1cqw]">
            <img src={`${import.meta.env.BASE_URL}images/bilum-bag-clean.png`} className="w-[70%] h-full object-contain" alt="" />
          </div>
          <div className="h-[10%] flex items-center justify-center flex-shrink-0 border-t border-gray-100">
            <span className={`${portrait ? 'text-[2.2cqw]' : 'text-[1.8cqw]'} font-bold text-[#f97316]`}>K 25.00</span>
          </div>
          <div className="h-[11%] bg-[#0D0D0D] flex items-center justify-center flex-shrink-0">
            <span className={`${portrait ? 'text-[1.3cqw]' : 'text-[1cqw]'} font-bold text-white`}>+675 7000 0000</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="flex-shrink-0 w-full text-center pb-[4cqh]"
        initial={{ opacity: 0 }}
        animate={phase >= 10 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={`${portrait ? 'text-[3.2cqw]' : 'text-[2.6cqw]'} font-bold text-[#0D0D0D] font-display`}>
          Your catalog — <span className="text-[#f97316]">done in minutes.</span>
        </span>
      </motion.div>

      {/* Copyright */}
      <div className="absolute bottom-[1.2cqh] left-0 right-0 flex justify-center pointer-events-none z-50">
        <span className="text-[1.5cqw] text-[#0D0D0D]/30 font-medium tracking-wide">© CatalogKit</span>
      </div>
    </motion.div>
  );
}

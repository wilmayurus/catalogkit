import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '📸', text: 'Upload photos in seconds' },
  { icon: '💰', text: 'Add name & price per item' },
  { icon: '🔗', text: 'Share your catalog link' },
  { icon: '📄', text: 'Send as a PDF — your choice' },
];

export function Scene5({ portrait }: { portrait?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1),  400),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4500),
      setTimeout(() => setPhase(5), 6200),
      setTimeout(() => setPhase(6), 8000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center overflow-hidden bg-[#0D0D0D]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, #f97316 0%, transparent 65%)' }}
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 0.18 } : {}}
        transition={{ duration: 2 }}
      />
      <motion.img
        src={`${import.meta.env.BASE_URL}images/market-scene-warm.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 0.22 } : {}}
        transition={{ duration: 2 }}
      />

      {portrait ? (
        /* ── Portrait: tightly packed, no mt-auto credit ── */
        <div className="relative z-10 w-full h-full flex flex-col items-center px-[6cqw] py-[5cqh] justify-between">
          {/* Logo */}
          <motion.img
            src={`${import.meta.env.BASE_URL}images/catalogkit-logo.png`}
            alt="CatalogKit logo"
            className="h-[14cqw] object-contain drop-shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
            transition={{ type: 'spring', damping: 18 }}
          />

          {/* Tagline */}
          <motion.p
            className="text-[3.8cqw] text-[#FFF8F0]/75 font-semibold text-center leading-snug"
            initial={{ opacity: 0, y: 8 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Stop flooding WhatsApp groups.<br />
            <span className="text-[#F5A800] font-bold">Share a catalog that sells for you.</span>
          </motion.p>

          {/* Feature pills */}
          <motion.div
            className="grid grid-cols-2 gap-[1.5cqw] w-full"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-[1.5cqw] bg-white/10 border border-white/15 rounded-2xl px-[2.5cqw] py-[1.8cqh]"
                initial={{ opacity: 0, y: 8 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-[4cqw] leading-none">{f.icon}</span>
                <span className="text-[2.8cqw] font-semibold text-white/90 leading-tight">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* FREE badge */}
          <motion.div
            className="bg-[#f97316] text-white px-[5cqw] py-[1.6cqh] rounded-full shadow-2xl"
            initial={{ y: 15, opacity: 0, scale: 0.9 }}
            animate={phase >= 4 ? { y: 0, opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', damping: 16 }}
          >
            <span className="text-[4.5cqw] font-black font-display tracking-wide">FREE TO START</span>
          </motion.div>

          {/* URL */}
          <motion.div
            className="flex items-center gap-[2cqw] bg-white/12 border border-white/20 px-[4cqw] py-[1.8cqh] rounded-2xl w-full justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="w-[4.5cqw] h-[4.5cqw] bg-[#f97316] rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[2.8cqw] h-[2.8cqw]">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <span className="text-[4.5cqw] font-black text-[#FFF8F0] font-display tracking-wide">
              www.catalogkit.org
            </span>
          </motion.div>

          {/* Credit */}
          <motion.p
            className="text-[2.2cqw] text-white/40 font-sans text-center"
            initial={{ opacity: 0 }}
            animate={phase >= 5 ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
          >
            CatalogKit · Built in PNG for PNG<br />
            <span className="text-[0.85em] opacity-60">© 2026 · All Rights Reserved</span>
          </motion.p>
        </div>
      ) : (
        /* ── Landscape: centred vertical stack ── */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-[6cqw] py-[1cqh]">
          <motion.div
            className="flex items-center gap-[2cqw] mb-[1cqh]"
            initial={{ y: 40, opacity: 0 }}
            animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
            transition={{ type: 'spring', damping: 18 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/catalogkit-logo.png`}
              alt="CatalogKit logo"
              className="h-[8cqw] object-contain drop-shadow-2xl"
            />
          </motion.div>

          <motion.p
            className="text-[2.8cqw] text-[#FFF8F0]/70 font-semibold mb-[1cqh] text-center leading-snug"
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Stop flooding WhatsApp groups.<br />
            <span className="text-[#F5A800]">Share a catalog that sells for you.</span>
          </motion.p>

          <motion.div
            className="grid grid-cols-2 gap-[1cqw] mb-[1cqh] w-auto"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-[1cqw] bg-white/8 border border-white/10 rounded-2xl px-[2cqw] py-[1.2cqh]"
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-[2cqw]">{f.icon}</span>
                <span className="text-[1.6cqw] font-semibold text-white/85">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="bg-[#f97316] text-white px-[4cqw] py-[1.6cqh] rounded-full shadow-2xl mb-[1cqh]"
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={phase >= 4 ? { y: 0, opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', damping: 16 }}
          >
            <span className="text-[3.8cqw] font-black font-display tracking-wide">FREE TO START</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-[1.5cqw] bg-white/10 border border-white/20 px-[4cqw] py-[1.5cqh] rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="w-[3cqw] h-[3cqw] bg-[#f97316] rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[1.8cqw] h-[1.8cqw]">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <span className="text-[3.5cqw] font-black text-[#FFF8F0] font-display tracking-wide">
              www.catalogkit.org
            </span>
          </motion.div>
        </div>
      )}

      {/* Scene 5 footer — second line sits above the persistent App footer */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none z-[90]" style={{ paddingBottom: '2cqh' }}>
        <span style={{ fontSize: '0.9cqw', fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.03em' }}>🇵🇬 Built in Papua New Guinea for Papua New Guinea 🇵🇬</span>
      </div>
    </motion.div>
  );
}

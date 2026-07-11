import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_MESSAGES = [
  { id: 1, img: 'bilum-bag-clean.png',     delay: 0.3 },
  { id: 2, img: 'tropical-fruit-warm.png', delay: 0.8 },
  { id: 3, img: 'product-mask.png',        delay: 1.3 },
  { id: 4, img: 'bilum-bag-clean.png',     delay: 1.8 },
  { id: 5, img: 'tropical-fruit-warm.png', delay: 2.3 },
  { id: 6, img: 'product-mask.png',        delay: 2.8 },
  { id: 7, img: 'bilum-bag-clean.png',     delay: 3.3 },
  { id: 8, img: 'tropical-fruit-warm.png', delay: 3.8 },
];

const PORTRAIT_MESSAGES = [
  { id: 1, img: 'bilum-bag-clean.png',     delay: 0.3 },
  { id: 2, img: 'tropical-fruit-warm.png', delay: 0.8 },
  { id: 3, img: 'product-mask.png',        delay: 1.3 },
];

function sender(id: number) {
  return id % 3 === 0 ? { label: 'M', name: 'Mary K' } : id % 2 === 0 ? { label: 'S', name: 'Sarah T' } : { label: 'R', name: 'Rose M' };
}

export function Scene1({ portrait }: { portrait?: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => setPhase(4), 4200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const chatHeader = (
    <div className="flex-shrink-0 bg-[#1a1a2e] px-[2cqw] py-[1.5cqh] flex items-center gap-[1.5cqw] border-b border-white/10">
      <div className="w-[4cqw] h-[4cqw] rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="white" className="w-[2.5cqw] h-[2.5cqw]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-[1.6cqw] font-bold flex items-center gap-[0.6cqw]">
          SME Vendors POM&nbsp;
          <img src={`${import.meta.env.BASE_URL}images/png-flag.png`} alt="PNG" className="h-[1.4cqw] w-auto inline-block" />
        </div>
        <div className="text-white/50 text-[1.1cqw]">247 members</div>
      </div>
      <motion.div
        className="flex-shrink-0"
        animate={phase >= 3 ? { scale: [1, 1.4, 1.2], filter: ['brightness(1)', 'brightness(2)', 'brightness(1.5)'] } : {}}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[2.8cqw] h-[2.8cqw]"
          stroke={phase >= 3 ? '#F5A800' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/>
          <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </motion.div>
    </div>
  );

  const chatBody = (msgSize: string) => (
    <>
      <div className="text-center py-[0.8cqh] flex-shrink-0">
        <span className="text-white/30 text-[1.1cqw] bg-white/5 px-[1.5cqw] py-[0.3cqh] rounded-full">Today</span>
      </div>
      <div className="flex-1 overflow-hidden relative px-[1.5cqw] pb-[1cqh]">
        <div className="flex flex-col gap-[1cqh]">
          {CHAT_MESSAGES.map((msg) => {
            const s = sender(msg.id);
            return (
              <motion.div
                key={msg.id}
                className="flex gap-[1cqw] items-end"
                initial={{ x: -30, opacity: 0 }}
                animate={phase >= 1 ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: msg.delay, duration: 0.3 }}
              >
                <div className="w-[2.5cqw] h-[2.5cqw] rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-[1cqw] font-bold">{s.label}</span>
                </div>
                <div className={`bg-white/10 rounded-2xl rounded-bl-none overflow-hidden flex-shrink-0 ${msgSize}`}>
                  <img src={`${import.meta.env.BASE_URL}images/${msg.img}`} className="w-full aspect-square object-cover opacity-80" alt="" />
                  <div className="px-[0.8cqw] py-[0.5cqh] text-white/40 text-[0.9cqw]">{s.name}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[8cqh] bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />
      </div>
    </>
  );

  return (
    <motion.div
      className="absolute inset-0 z-20 flex overflow-hidden bg-[#111111]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {portrait ? (
        /* ── Portrait: fixed top chat + fixed bottom panel ── */
        <div className="absolute inset-0 flex flex-col">

          {/* TOP: label + chat frame, fixed 46% height */}
          <div className="flex-shrink-0 flex flex-col px-[4cqw] pt-[2cqh] gap-[1.2cqh]" style={{ height: '46%' }}>
            <motion.div
              className="flex-shrink-0 text-center"
              initial={{ opacity: 0, y: -8 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[2.6cqw] font-black text-[#f97316] font-display bg-[#f97316]/10 px-[3cqw] py-[0.7cqh] rounded-full border border-[#f97316]/30">
                📱 PNG vendors flooding WhatsApp groups with photos...
              </span>
            </motion.div>

            {/* Chat frame — fills remaining top space */}
            <motion.div
              className="flex-1 min-h-0 flex flex-col overflow-hidden"
              style={{
                borderRadius: '2.5cqw',
                border: '0.35cqw solid rgba(37,211,102,0.6)',
                boxShadow: '0 0 0 0.15cqw rgba(37,211,102,0.15), 0 4px 24px rgba(0,0,0,0.7)',
                background: '#1a1a2e',
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex-shrink-0 bg-[#1a1a2e] px-[3cqw] py-[1.2cqh] flex items-center gap-[2cqw] border-b border-white/10">
                <div className="w-[5cqw] h-[5cqw] rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="white" className="w-[3cqw] h-[3cqw]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-[2.2cqw] font-bold flex items-center gap-[0.8cqw]">
                    SME Vendors POM&nbsp;
                    <img src={`${import.meta.env.BASE_URL}images/png-flag.png`} alt="PNG" className="h-[1.8cqw] w-auto inline-block" />
                  </div>
                  <div className="text-white/50 text-[1.5cqw]">247 members</div>
                </div>
                <AnimatePresence>
                  {phase >= 2 && (
                    <motion.div
                      className="bg-[#f97316] text-white text-[2cqw] font-black px-[2cqw] py-[0.5cqh] rounded-full shadow-xl flex-shrink-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                      transition={{ type: 'spring', bounce: 0.6 }}
                    >
                      20+ 📸
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Messages — 3 unique images, laid out in a row to save vertical space */}
              <div className="flex-1 min-h-0 flex items-center gap-[2cqw] px-[3cqw] py-[1.5cqh] overflow-hidden">
                {PORTRAIT_MESSAGES.map((msg) => {
                  const s = sender(msg.id);
                  return (
                    <motion.div
                      key={msg.id}
                      className="flex flex-col items-center gap-[0.8cqh] flex-1"
                      initial={{ y: 20, opacity: 0 }}
                      animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                      transition={{ delay: msg.delay, duration: 0.3 }}
                    >
                      <div className="w-full aspect-square bg-white/10 rounded-xl overflow-hidden">
                        <img src={`${import.meta.env.BASE_URL}images/${msg.img}`} className="w-full h-full object-cover opacity-85" alt="" />
                      </div>
                      <span className="text-white/40 text-[1.5cqw]">{s.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* DIVIDER */}
          <div className="flex-shrink-0 flex items-center gap-[2cqw] px-[6cqw] py-[0.8cqh]">
            <div className="flex-1 h-[0.2cqh] bg-white/15" />
            <span className="text-[2.2cqw] text-white/25 font-bold">↓</span>
            <div className="flex-1 h-[0.2cqh] bg-white/15" />
          </div>

          {/* BOTTOM: pain point — takes all remaining height */}
          <motion.div
            className="flex-1 min-h-0 flex flex-col items-center justify-center px-[5cqw] pb-[2cqh] gap-[1.8cqh]"
            style={{ background: '#0D0D0D' }}
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-[6cqw] mb-[1cqh]">😩</div>
              <h2 className="text-[5cqw] font-black text-white font-display leading-tight text-center">
                20 images dropped<br />in the group.
              </h2>
              <p className="text-[3cqw] text-white/55 font-medium mt-[1cqh] leading-snug text-center">
                No prices. No contact.<br />Just… photos.
              </p>
            </div>

            <motion.p
              className="text-[2.8cqw] text-white/40 italic text-center leading-snug"
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              You mute the group.<br />Good products — never seen.
            </motion.p>

            <motion.div
              className="bg-[#f97316] text-white px-[7cqw] py-[2cqh] rounded-2xl shadow-2xl text-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: 'spring', damping: 18 }}
            >
              <p className="text-[4cqw] font-black font-display leading-tight">
                There's a better way.
              </p>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        /* ── Landscape: original side-by-side ── */
        <>
          {/* Left: WhatsApp chat — slightly lighter tint */}
          <div className="w-[48%] h-full flex flex-col overflow-hidden relative" style={{ background: '#141420' }}>
            {chatHeader}
            {chatBody('w-[13cqw]')}

            {/* Left side label */}
            <motion.div
              className="absolute bottom-[2.5cqh] left-0 right-0 flex justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="text-[1.15cqw] font-bold tracking-widest uppercase text-white/25 bg-white/5 px-[1.5cqw] py-[0.4cqh] rounded-full">
                📱 WhatsApp Group
              </span>
            </motion.div>

            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  className="absolute top-[7cqh] right-[3%] bg-[#f97316] text-white text-[1.4cqw] font-black px-[1.2cqw] py-[0.5cqh] rounded-full shadow-xl z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ type: 'spring', bounce: 0.6, duration: 0.8 }}
                >
                  20+ 📸
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vertical divider */}
          <div className="relative flex-shrink-0" style={{ width: '1px' }}>
            <div className="absolute inset-y-0 w-full" style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(249,115,22,0.15) 20%, rgba(249,115,22,0.5) 50%, rgba(249,115,22,0.15) 80%, transparent 100%)',
            }} />
          </div>

          {/* Right: Pain point — darker background */}
          <div className="flex-1 h-full flex flex-col items-center justify-center px-[4cqw] gap-[3cqh] relative" style={{ background: '#0D0D0D' }}>

            {/* Right side label */}
            <motion.div
              className="absolute bottom-[2.5cqh] left-0 right-0 flex justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-[1.15cqw] font-bold tracking-widest uppercase text-[#f97316]/40 bg-[#f97316]/5 px-[1.5cqw] py-[0.4cqh] rounded-full">
                😩 The Problem
              </span>
            </motion.div>
            {[
              { delay: 0.6, right: '12cqw', top: '14cqh' },
              { delay: 1.2, right: '8cqw',  top: '22cqh' },
              { delay: 1.8, right: '15cqw', top: '30cqh' },
              { delay: 2.4, right: '9cqw',  top: '18cqh' },
            ].map((n, i) => (
              <motion.div
                key={i}
                className="absolute w-[2cqw] h-[2cqw] rounded-full bg-[#f97316]"
                style={{ right: n.right, top: n.top }}
                initial={{ scale: 0, opacity: 0 }}
                animate={phase >= 2 ? { scale: [0, 1.2, 1, 0], opacity: [0, 1, 0.8, 0] } : {}}
                transition={{ delay: i * 0.3 + 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
            ))}

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="text-[5cqw] mb-[2cqh]">😩</div>
              <h2 className="text-[3.8cqw] font-black text-white font-display leading-tight">
                20 images dropped<br />in the group.
              </h2>
              <p className="text-[2.2cqw] text-white/50 font-medium mt-[1.5cqh]">
                No prices. No contact.<br />Just… photos.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-[1.5cqh]"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="w-[80%] h-[0.15cqh] bg-white/10" />
              <p className="text-[2.2cqw] text-white/50 font-medium text-center italic">
                You mute the group.<br />Good products — never seen.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#f97316] text-white px-[4cqw] py-[1.8cqh] rounded-2xl shadow-2xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: 'spring', damping: 18 }}
            >
              <p className="text-[2.8cqw] font-black font-display leading-tight">
                There's a better way.
              </p>
            </motion.div>
          </div>
        </>
      )}

      {/* Copyright */}
      <div className="absolute bottom-[1.2cqh] left-0 right-0 flex justify-center pointer-events-none z-50">
        <span className="text-[1.5cqw] text-white/30 font-medium tracking-wide">© CatalogKit</span>
      </div>
    </motion.div>
  );
}

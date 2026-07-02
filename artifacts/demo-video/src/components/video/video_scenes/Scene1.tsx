import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_MESSAGES = [
  { id: 1, text: null, img: 'bilum-bag-clean.png',     delay: 0.3 },
  { id: 2, text: null, img: 'tropical-fruit-warm.png', delay: 0.7 },
  { id: 3, text: null, img: 'product-mask.png',        delay: 1.1 },
  { id: 4, text: null, img: 'bilum-bag-clean.png',     delay: 1.5 },
  { id: 5, text: null, img: 'tropical-fruit-warm.png', delay: 1.9 },
  { id: 6, text: null, img: 'product-mask.png',        delay: 2.3 },
  { id: 7, text: null, img: 'bilum-bag-clean.png',     delay: 2.7 },
  { id: 8, text: null, img: 'tropical-fruit-warm.png', delay: 3.1 },
];

const NOTIFICATION_DOTS = [
  { delay: 0.6,  right: '12vw', top: '14vh' },
  { delay: 1.2,  right: '8vw',  top: '22vh' },
  { delay: 1.8,  right: '15vw', top: '30vh' },
  { delay: 2.4,  right: '9vw',  top: '18vh' },
];

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),    // chat starts flooding
      setTimeout(() => setPhase(2), 1800),   // notification overlay
      setTimeout(() => setPhase(3), 3200),   // mute button highlight
      setTimeout(() => setPhase(4), 4200),   // problem statement text
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex overflow-hidden bg-[#111111]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left side — WhatsApp group chat simulation */}
      <div className="w-[48%] h-full flex flex-col relative overflow-hidden border-r border-white/10">
        {/* Chat header */}
        <div className="flex-shrink-0 bg-[#1a1a2e] px-[2vw] py-[1.5vh] flex items-center gap-[1.5vw] border-b border-white/10">
          <div className="w-[4vw] h-[4vw] rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-[2.5vw] h-[2.5vw]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.639-1.653-1.935-.173-.299-.018-.461.13-.611.134-.135.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[1.6vw] font-bold">SME Vendors POM 🇵🇬</div>
            <div className="text-white/50 text-[1.1vw]">247 members</div>
          </div>
          {/* Mute icon — lights up in phase 3 */}
          <motion.div
            className="flex-shrink-0 flex flex-col items-center"
            animate={phase >= 3 ? { scale: [1, 1.4, 1.2], filter: ['brightness(1)', 'brightness(2)', 'brightness(1.5)'] } : {}}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-[2.8vw] h-[2.8vw]" stroke={phase >= 3 ? '#F5A800' : 'rgba(255,255,255,0.4)'} strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12C10.343 6 8.842 6.842 7.757 8.172M12 6c1.657 0 3.158.842 4.243 2.172M7.757 8.172A7.02 7.02 0 006 12c0 1.38.398 2.665 1.085 3.757M16.243 8.172A7.02 7.02 0 0118 12c0 1.38-.398 2.665-1.085 3.757M3 3l18 18"/>
            </svg>
            {phase >= 3 && (
              <motion.div
                className="text-[#F5A800] text-[1vw] font-bold mt-[0.2vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                MUTED
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Date divider */}
        <div className="text-center py-[0.8vh] flex-shrink-0">
          <span className="text-white/30 text-[1.1vw] bg-white/5 px-[1.5vw] py-[0.3vh] rounded-full">Today</span>
        </div>

        {/* Scrolling image flood */}
        <div className="flex-1 overflow-hidden relative px-[1.5vw] pb-[1vh]">
          <div className="flex flex-col gap-[1vh]">
            {CHAT_MESSAGES.map((msg) => (
              <motion.div
                key={msg.id}
                className="flex gap-[1vw] items-end"
                initial={{ x: -30, opacity: 0 }}
                animate={phase >= 1 ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: msg.delay, duration: 0.3 }}
              >
                <div className="w-[2.5vw] h-[2.5vw] rounded-full bg-gradient-to-br from-[#C41230] to-[#8B0D22] flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-[1vw] font-bold">{msg.id % 3 === 0 ? 'M' : msg.id % 2 === 0 ? 'S' : 'R'}</span>
                </div>
                <div className="bg-white/10 rounded-2xl rounded-bl-none overflow-hidden w-[13vw] flex-shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${msg.img}`}
                    className="w-full aspect-square object-cover opacity-80"
                    alt=""
                  />
                  <div className="px-[0.8vw] py-[0.5vh] text-white/40 text-[0.9vw]">
                    {msg.id % 3 === 0 ? 'Mary K' : msg.id % 2 === 0 ? 'Sarah T' : 'Rose M'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll blur at bottom — suggests infinite feed */}
          <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />
        </div>

        {/* Notification count badge */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="absolute top-[7vh] right-[2vw] bg-[#C41230] text-white text-[1.4vw] font-black px-[1.2vw] py-[0.5vh] rounded-full shadow-xl z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              20+ 📸
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side — the pain point message */}
      <div className="w-[52%] h-full flex flex-col items-center justify-center px-[4vw] gap-[3vh]">

        {/* Notification dots floating */}
        {NOTIFICATION_DOTS.map((n, i) => (
          <motion.div
            key={i}
            className="absolute w-[2vw] h-[2vw] rounded-full bg-[#C41230]"
            style={{ right: n.right, top: n.top }}
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 2 ? {
              scale: [0, 1.2, 1, 0],
              opacity: [0, 1, 0.8, 0],
            } : {}}
            transition={{ delay: i * 0.3 + 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="text-[5vw] mb-[2vh]">😩</div>
          <h2 className="text-[3.8vw] font-black text-white leading-tight font-display">
            20 images dropped<br/>in the group.
          </h2>
          <p className="text-[2.2vw] text-white/50 font-medium mt-[1.5vh]">
            No prices. No contact.<br/>Just… photos.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-[1.5vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="w-[80%] h-[0.15vh] bg-white/10" />
          <p className="text-[2.2vw] text-white/50 font-medium text-center italic">
            You mute the group.<br/>Good products — never seen.
          </p>
        </motion.div>

        <motion.div
          className="bg-[#C41230] text-white px-[4vw] py-[1.8vh] rounded-2xl shadow-2xl text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', damping: 18 }}
        >
          <p className="text-[2.8vw] font-black font-display leading-tight">
            There's a better way.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

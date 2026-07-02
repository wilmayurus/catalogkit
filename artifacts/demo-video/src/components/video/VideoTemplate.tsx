import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = {
  hook: 5000,
  build: 8000,
  share: 9000,
  download: 10000,
  closing: 13000,
};

const PRELOAD_IMAGES = [
  'images/bilum-bag-clean.png',
  'images/tropical-fruit-warm.png',
  'images/product-mask.png',
  'images/market-scene-warm.png',
];

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });
  const base = import.meta.env.BASE_URL;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    PRELOAD_IMAGES.forEach(src => {
      const img = new Image();
      img.src = `${base}${src}`;
    });
  }, [base]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.loop = true;
    const tryPlay = () => {
      audio.play().catch(() => {});
    };
    if (audio.readyState >= 2) {
      tryPlay();
    } else {
      audio.addEventListener('canplaythrough', tryPlay, { once: true });
    }
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      audio.muted = !audio.muted;
      setMuted(audio.muted);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FFF8F0] font-sans">
      <audio
        ref={audioRef}
        src={`${base}audio/background.mp3`}
        preload="auto"
        loop
      />

      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1 key="hook" />}
        {currentScene === 1 && <Scene2 key="build" />}
        {currentScene === 2 && <Scene3 key="share" />}
        {currentScene === 3 && <Scene4 key="download" />}
        {currentScene === 4 && <Scene5 key="closing" />}
      </AnimatePresence>

      <motion.button
        className="absolute top-[2vh] right-[2vw] z-50 w-[4vw] h-[4vw] rounded-full bg-black/40 backdrop-blur flex items-center justify-center border border-white/20 text-white shadow-lg"
        onClick={toggleMute}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[2vw] h-[2vw]">
            <path d="M13 3.586L7.707 8.879A1 1 0 017 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 01.707.293L13 20.414V3.586z" opacity="0.3"/>
            <line x1="3" y1="3" x2="21" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[2vw] h-[2vw]">
            <path d="M13 3.586L7.707 8.879A1 1 0 017 9H4a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 01.707.293L13 20.414V3.586z"/>
            <path d="M16.243 7.757a1 1 0 011.414 0A8.966 8.966 0 0120 14a8.966 8.966 0 01-2.343 6.243 1 1 0 01-1.414-1.414A6.966 6.966 0 0018 14a6.966 6.966 0 00-1.757-4.829 1 1 0 010-1.414zM18.657 5.343a1 1 0 011.414 0A11.954 11.954 0 0122 14a11.954 11.954 0 01-1.929 6.657 1 1 0 01-1.414-1.414A9.954 9.954 0 0020 14a9.954 9.954 0 00-1.343-5.243 1 1 0 010-1.414z"/>
          </svg>
        )}
      </motion.button>
    </div>
  );
}

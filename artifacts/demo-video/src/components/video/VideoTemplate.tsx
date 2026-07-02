import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

// Total: 7000 + 9000 + 10000 + 11000 + 12000 = 49s
const SCENE_DURATIONS = {
  problem:  7000,   // WhatsApp flood, mute, pain point
  build:    9000,   // Upload, add details, catalog built
  catalog: 10000,   // Link, share icons, customer flipbook
  share:   11000,   // PDF + WhatsApp button, order comes in
  closing: 12000,   // Logo, tagline, FREE, URL, credit
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
    audio.volume = 0.45;
    audio.loop = true;
    const tryPlay = () => audio.play().catch(() => {});
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
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D] font-sans">
      <audio ref={audioRef} src={`${base}audio/background.mp3`} preload="auto" loop />

      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1 key="problem" />}
        {currentScene === 1 && <Scene2 key="build" />}
        {currentScene === 2 && <Scene3 key="catalog" />}
        {currentScene === 3 && <Scene4 key="share" />}
        {currentScene === 4 && <Scene5 key="closing" />}
      </AnimatePresence>

      {/* Mute button */}
      <button
        className="absolute top-[2cqh] right-[2cqw] z-50 w-[3.5cqw] h-[3.5cqw] rounded-full bg-black/40 backdrop-blur flex items-center justify-center border border-white/20 text-white shadow-lg transition-opacity hover:opacity-100 opacity-60"
        onClick={toggleMute}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.8cqw] h-[1.8cqw]">
            <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18a6.997 6.997 0 01-2.65 1.52.998.998 0 00.35 1.93c1.34-.37 2.57-1.07 3.57-2.02l1.49 1.49a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76V4c0-.89-1.08-1.34-1.71-.71L6.18 7.39 7.59 8.8 12 4.41V4zm4.04 8.79c0-2.08-1.22-3.87-3-4.75v1.83l2.97 2.97c.02-.02.03-.03.03-.05z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.8cqw] h-[1.8cqw]">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </button>
    </div>
  );
}

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
  closing: 13000 
};

const PRELOAD_IMAGES = [
  '/images/bilum-bag-clean.png',
  '/images/tropical-fruit-warm.png',
  '/images/product-mask.png',
  '/images/market-scene-warm.png',
];

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    PRELOAD_IMAGES.forEach(src => {
      const img = new Image();
      img.src = `${base}${src}`;
    });
  }, [base]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FFF8F0] font-sans">
      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1 key="hook" />}
        {currentScene === 1 && <Scene2 key="build" />}
        {currentScene === 2 && <Scene3 key="share" />}
        {currentScene === 3 && <Scene4 key="download" />}
        {currentScene === 4 && <Scene5 key="closing" />}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = { 
  hook: 5000, 
  upload: 6000, 
  flipbook: 10000, 
  share: 10000, 
  closing: 9000 
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D] font-['Montserrat']">
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #6B1A0A 0%, #0D0D0D 50%, transparent 100%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C41230, transparent)' }}
          animate={{ x: ['5%', '-15%', '5%'], y: ['-5%', '20%', '-5%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F5A800, transparent)' }}
          animate={{ x: ['-15%', '10%', '-15%'], y: ['15%', '-5%', '15%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="hook" />}
        {currentScene === 1 && <Scene2 key="upload" />}
        {currentScene === 2 && <Scene3 key="flipbook" />}
        {currentScene === 3 && <Scene4 key="share" />}
        {currentScene === 4 && <Scene5 key="closing" />}
      </AnimatePresence>
    </div>
  );
}

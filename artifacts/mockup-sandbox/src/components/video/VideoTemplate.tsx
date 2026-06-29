import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = { 
  problem: 8000, 
  solution: 12000, 
  howItWorks: 16000, 
  whoItHelps: 12000, 
  theCall: 12000 
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D] font-['Inter']">
      {/* Persistent Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #6B1A0A 0%, #2A0D02 50%, transparent 100%)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C41230, transparent)' }}
          animate={{ x: ['10%', '-20%', '10%'], y: ['-10%', '30%', '-10%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F5A800, transparent)' }}
          animate={{ x: ['-20%', '10%', '-20%'], y: ['20%', '-10%', '20%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Persistent Brand / Abstract midground */}
      <motion.div 
        className="absolute z-10 w-[2px] bg-[#F5A800]/50"
        animate={{
          left: ['10vw', '90vw', '50vw', '10vw', '5vw'][currentScene] || '10vw',
          height: ['100vh', '50vh', '80vh', '100vh', '40vh'][currentScene] || '100vh',
          top: ['0vh', '25vh', '10vh', '0vh', '30vh'][currentScene] || '0vh',
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      
      <motion.div 
        className="absolute z-10 rounded-full border border-[#C41230]/30"
        animate={{
          width: ['10vw', '20vw', '5vw', '30vw', '15vw'][currentScene] || '10vw',
          height: ['10vw', '20vw', '5vw', '30vw', '15vw'][currentScene] || '10vw',
          x: ['70vw', '10vw', '80vw', '80vw', '20vw'][currentScene] || '70vw',
          y: ['60vh', '10vh', '80vh', '20vh', '70vh'][currentScene] || '60vh',
          opacity: [0.4, 0.8, 0.2, 0.5, 0.7][currentScene] || 0.4
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="problem" />}
        {currentScene === 1 && <Scene2 key="solution" />}
        {currentScene === 2 && <Scene3 key="howItWorks" />}
        {currentScene === 3 && <Scene4 key="whoItHelps" />}
        {currentScene === 4 && <Scene5 key="theCall" />}
      </AnimatePresence>
    </div>
  );
}

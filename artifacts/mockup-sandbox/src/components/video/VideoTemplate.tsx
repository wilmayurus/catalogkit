import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = { 
  problem: 6000, 
  solution: 8000, 
  howItWorks: 10000, 
  whoItHelps: 8000, 
  theCall: 8000 
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D0D0D] font-['Montserrat']">
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/tech-bg.png`} className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-screen" alt="background" />
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

      {/* Persistent Midground / Abstract Shapes */}
      <motion.div 
        className="absolute z-10 w-[2px] bg-[#F5A800]/60"
        animate={{
          left: ['15vw', '85vw', '50vw', '20vw', '10vw'][currentScene] || '15vw',
          height: ['100vh', '60vh', '80vh', '100vh', '50vh'][currentScene] || '100vh',
          top: ['0vh', '20vh', '10vh', '0vh', '25vh'][currentScene] || '0vh',
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      
      <motion.div 
        className="absolute z-10 rounded-full border border-[#C41230]/40 mix-blend-screen"
        animate={{
          width: ['15vw', '30vw', '10vw', '25vw', '20vw'][currentScene] || '15vw',
          height: ['15vw', '30vw', '10vw', '25vw', '20vw'][currentScene] || '15vw',
          x: ['65vw', '15vw', '75vw', '70vw', '25vw'][currentScene] || '65vw',
          y: ['55vh', '15vh', '70vh', '25vh', '60vh'][currentScene] || '55vh',
          opacity: [0.3, 0.6, 0.2, 0.5, 0.8][currentScene] || 0.3,
          rotate: [0, 45, 90, 135, 180][currentScene] || 0
        }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
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

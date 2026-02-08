
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroAnimation: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2500),
      setTimeout(() => setStage(3), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const welcomeText = "WELCOME TO INFINITE SOUNDS";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        filter: 'brightness(1.5) blur(20px)',
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden perspective-[1500px] select-none"
    >
      {/* Deep Space Background */}
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a0a_0%,#000_90%)]"
      />

      {/* 3D Ring System - Refined to 5 Rings with enhanced visibility */}
      <motion.div 
        initial={{ scale: 0.1, opacity: 0, rotateX: 80 }}
        animate={{ 
          scale: stage >= 1 ? 1 : 0.1, 
          opacity: stage >= 1 ? 1 : 0,
          rotateX: [72, 78, 72],
          rotateZ: [0, 360]
        }}
        transition={{ 
          scale: { duration: 3.5, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 2 },
          rotateX: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 80, repeat: Infinity, ease: "linear" }
        }}
        className="relative w-[80vw] h-[80vw] max-w-[850px] max-h-[850px] flex items-center justify-center transform-style-3d pointer-events-none"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: stage >= 1 ? [0.2, 0.5, 0.2] : 0,
              rotateZ: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              opacity: { duration: 4, repeat: Infinity, delay: i * 0.5 },
              rotateZ: { duration: 30 + i * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              position: 'absolute',
              width: `${100 - i * 10}%`,
              height: `${100 - i * 10}%`,
              border: `${0.7 + i * 0.1}px solid rgba(255, 255, 255, 0.6)`,
              borderRadius: '50%',
              boxShadow: '0 0 40px rgba(255,255,255,0.08), inset 0 0 20px rgba(255,255,255,0.03)',
              transform: `translateZ(${i * 35}px)`,
              filter: `blur(${i * 0.3}px)`
            }}
          />
        ))}

        {/* Core Radiance - Slightly brighter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: stage >= 2 ? 0.18 : 0, scale: stage >= 2 ? 1.4 : 0.5 }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute w-[30%] h-[30%] rounded-full bg-white blur-[120px]"
        />
      </motion.div>

      {/* Pure Text Reveal */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex gap-[0.4em] overflow-hidden">
          {welcomeText.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: stage >= 2 ? 1 : 0, 
                y: stage >= 2 ? 0 : 15 
              }}
              transition={{ 
                duration: 1, 
                delay: stage >= 2 ? i * 0.04 : 0, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={`text-[12px] font-black uppercase tracking-[0.3em] text-white/80 select-none ${char === " " ? 'w-3' : ''}`}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;

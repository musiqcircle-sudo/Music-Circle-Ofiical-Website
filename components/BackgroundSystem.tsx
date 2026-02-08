
import React, { useMemo } from 'react';
import { motion, AnimatePresence, MotionValue, useTransform } from 'framer-motion';
import MusicMatrixRain from './MusicMatrixRain';
import CosmicDrift from './CosmicDrift';
import { SonicIdentity } from '../types';

interface BackgroundSystemProps {
  isPlaying: boolean;
  sonicIdentity: SonicIdentity | null;
  orbY1: MotionValue<number>;
  orbY2: MotionValue<number>;
}

const BackgroundSystem: React.FC<BackgroundSystemProps> = ({ 
  isPlaying, 
  sonicIdentity, 
  orbY1, 
  orbY2 
}) => {
  // Map scroll progress to cinematic vertical positions
  const pos1 = useTransform(orbY1, [0, 1], ['-10%', '60%']);
  const pos2 = useTransform(orbY2, [0, 1], ['20%', '110%']);
  const blurValue = useTransform(orbY1, [0, 1], ['250px', '450px']);

  const baseColors = useMemo(() => {
    return sonicIdentity?.colors || ['#000', '#000'];
  }, [sonicIdentity]);

  return (
    <>
      {/* Noise layer */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-screen" />

      {/* Base Dynamic Gradients */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[-2]"
        animate={{
          background: `radial-gradient(at 0% 0%, ${baseColors[0]}15 0px, transparent 50%), 
                       radial-gradient(at 100% 100%, ${baseColors[1]}10 0px, transparent 50%)`
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Floating Cinematic Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <AnimatePresence>
          {sonicIdentity && (
            <motion.div 
              style={{ top: pos1, backgroundColor: baseColors[0], filter: `blur(${blurValue.get()})` }}
              animate={{ 
                scale: isPlaying ? [1, 1.2, 1] : 1, 
                opacity: isPlaying ? 0.08 : 0.04 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-[20vw] w-[120vw] h-[120vw] rounded-full will-change-transform" 
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {sonicIdentity && (
            <motion.div 
              style={{ top: pos2, backgroundColor: baseColors[1], filter: `blur(${blurValue.get()})` }}
              animate={{ 
                scale: isPlaying ? [1.1, 1, 1.1] : 1, 
                opacity: isPlaying ? 0.06 : 0.03 
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-[20vw] w-[100vw] h-[100vw] rounded-full will-change-transform" 
            />
          )}
        </AnimatePresence>
      </div>

      <CosmicDrift isPlaying={isPlaying} />
      <MusicMatrixRain isPlaying={isPlaying} color={baseColors[0]} opacity={0.3} />

      {/* Atmospheric Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
      <div className="fixed inset-0 pointer-events-none z-[5] bg-gradient-to-b from-black via-transparent to-black opacity-80" />
    </>
  );
};

export default BackgroundSystem;

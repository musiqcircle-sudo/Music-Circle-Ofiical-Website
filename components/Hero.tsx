
import React, { useRef, useEffect, useState, memo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Shuffle } from 'lucide-react';

const MUSICAL_SYMBOLS = "♩♪♫♬♭♮♯";

const ScrambledChar = memo(({ char }: { char: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayChar, setDisplayChar] = useState(char);
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    const randomSymbol = MUSICAL_SYMBOLS[Math.floor(Math.random() * MUSICAL_SYMBOLS.length)];
    setDisplayChar(randomSymbol);
    setTimeout(() => {
      setDisplayChar(char);
      setIsGlitching(false);
    }, 600);
  };

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { e.stopPropagation(); triggerGlitch(); }}
      className="inline-block relative cursor-pointer select-none"
      animate={{ 
        color: isGlitching ? '#fff' : (isHovered ? '#fff' : 'inherit'),
        scale: isHovered || isGlitching ? 1.15 : 1,
        y: isHovered ? -5 : (isGlitching ? [0, -5, 5, 0] : 0),
        filter: isGlitching ? 'blur(2px) brightness(1.5)' : (isHovered ? 'blur(0px) brightness(1.2)' : 'blur(0px) brightness(1)'),
        textShadow: isHovered || isGlitching ? '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)' : '0 0 0px rgba(255,255,255,0)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
    >
      {displayChar}
    </motion.span>
  );
});

const ScrambleText = memo(({ text }: { text: string }) => {
  return (
    <span className="flex whitespace-nowrap overflow-visible">
      {text.split("").map((c, i) => <ScrambledChar key={i} char={c} />)}
    </span>
  );
});

const Hero: React.FC<{ onDiscoverHits?: () => void }> = ({ onDiscoverHits }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  
  // Unified parallax calculation to keep MUSIC and CIRCLE locked together
  const yUnified = useTransform(scrollY, [0, 800], [0, -100]);
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const blurProgress = useTransform(scrollY, [0, 400], [0, 15]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-visible bg-transparent pt-60 pb-40">
      <motion.div 
        style={{ opacity: textOpacity, filter: `blur(${blurProgress}px)` }}
        className="relative z-10 text-center flex flex-col items-center select-none w-full px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 flex items-center gap-6 sm:gap-10 group/slogan cursor-pointer"
        >
          <motion.div 
            animate={{ width: [32, 64, 32] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 sm:w-16 h-[1px] bg-white/20 group-hover/slogan:bg-white/60 transition-colors" 
          />
          <motion.span 
            whileHover={{ 
              scale: 1.05, 
              color: '#ffffff', 
              letterSpacing: '2em',
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))'
            }}
            whileTap={{ scale: 0.95, filter: 'blur(2px)' }}
            className="text-[9px] sm:text-[11px] uppercase font-outfit font-black text-white/50 tracking-[1.8em] block whitespace-nowrap drop-shadow-2xl transition-all duration-700"
          >
            ONE CIRCLE INFINITE SOUND
          </motion.span>
          <motion.div 
            animate={{ width: [32, 64, 32] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="w-8 sm:w-16 h-[1px] bg-white/20 group-hover/slogan:bg-white/60 transition-colors" 
          />
        </motion.div>

        <motion.h1 
          style={{ y: yUnified }}
          className="text-[18vw] sm:text-[15vw] md:text-[13vw] font-outfit font-extrabold leading-[0.75] tracking-tighter uppercase relative z-10 flex flex-col items-center mix-blend-difference cursor-default overflow-visible select-none"
        >
          <div className="inline-block whitespace-nowrap">
            <ScrambleText text="MUSIC" />
          </div>
          <div className="inline-block text-white/10 whitespace-nowrap">
            <ScrambleText text="CIRCLE" />
          </div>
        </motion.h1>

        <motion.div 
          initial={{ height: 0 }} 
          animate={{ height: 100 }} 
          transition={{ delay: 1, duration: 2, ease: "circOut" }}
          className="relative mt-20 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
        >
          <motion.div 
            animate={{ y: [0, 100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 -left-[2px] w-[5px] h-12 bg-white blur-[8px] rounded-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20"
        >
          <button 
            onClick={onDiscoverHits}
            className="flex items-center gap-6 px-12 py-5 bg-white/5 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-700 group backdrop-blur-3xl rounded-full relative overflow-hidden shadow-2xl"
          >
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[1em] transition-colors duration-500 whitespace-nowrap">
              DISCOVER LIBRARY
            </span>
            <Shuffle size={14} className="relative z-10 text-white/50 group-hover:text-black transition-all duration-700" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;


import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Activity, Disc } from 'lucide-react';
import { Track, SonicIdentity } from '../types';

interface InteractiveVinylProps {
  isPlaying: boolean;
  currentTrack: Track;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onSeek?: (time: number) => void;
  onArtistClick?: (artist: string) => void;
  sonicIdentity?: SonicIdentity | null;
  isIdentitySyncing?: boolean;
}

const MUSICAL_SYMBOLS = "♩♪♫♬♭♮♯";

const ScanChar = memo(({ char, triggerDelay }: { char: string; triggerDelay: number | null }) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (triggerDelay !== null) {
      const timer = setTimeout(() => {
        const shouldSwap = char !== " " && Math.random() < 0.15;
        if (shouldSwap) {
          setIsGlitching(true);
          setDisplayChar(MUSICAL_SYMBOLS[Math.floor(Math.random() * MUSICAL_SYMBOLS.length)]);
          const revertTimer = setTimeout(() => {
            setDisplayChar(char);
            setIsGlitching(false);
          }, 200);
          return () => clearTimeout(revertTimer);
        }
      }, triggerDelay);
      return () => clearTimeout(timer);
    }
  }, [triggerDelay, char]);

  return (
    <span className="relative inline-flex items-center justify-center">
      <span className="invisible select-none pointer-events-none" aria-hidden="true">{char === " " ? "\u00A0" : char}</span>
      <motion.span className="absolute inset-0 flex items-center justify-center" animate={isGlitching ? { opacity: [1, 0.4, 1], scale: [1, 1.3, 1], filter: ['blur(0px)', 'blur(1.5px)', 'blur(0px)'], color: ['#fff', '#ffffff50', '#fff'] } : { opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.2 }}>{displayChar === " " ? "\u00A0" : displayChar}</motion.span>
    </span>
  );
});

const PhaseShiftTitle = memo(({ text, className, fontSize }: { text: string; className?: string; fontSize?: string }) => {
  const [rippleData, setRippleData] = useState<{ originIndex: number; timestamp: number } | null>(null);
  const words = text.split(" ");
  const handleCharClick = (globalIdx: number) => {
    setRippleData({ originIndex: globalIdx, timestamp: Date.now() });
    setTimeout(() => setRippleData(null), 1500);
  };
  return (
    <motion.div className={`flex flex-wrap justify-end gap-x-[0.2em] gap-y-2 select-none text-balance no-orphans ${className}`} style={{ fontSize, textWrap: 'balance' }} initial="rest" whileHover="hover">
      {words.map((word, wordIdx) => (
        <span key={`${text}-${wordIdx}`} className="inline-flex">
          {word.split("").map((char, charIdx) => {
            const charGlobalIdx = text.split(" ").slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0) + charIdx;
            let triggerDelay = null;
            if (rippleData) {
              const distance = Math.abs(charGlobalIdx - rippleData.originIndex);
              triggerDelay = distance * 50;
            }
            return (
              <motion.span key={`${text}-${wordIdx}-${charIdx}`} variants={{ hover: { y: -2, transition: { duration: 0.4, delay: charGlobalIdx * 0.02, ease: "easeOut" } } }} className="inline-block cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCharClick(charGlobalIdx); }}>
                <ScanChar char={char} triggerDelay={triggerDelay} />
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.div>
  );
});

const ArtistName = memo(({ text, onClick, className, fontSize, isQuoteAuthor = false }: { text: string; onClick?: () => void; className?: string; fontSize?: string; isQuoteAuthor?: boolean }) => {
  const [rippleKey, setRippleKey] = useState<number | null>(null);
  const words = text.split(" ");
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rippleKey) return;
    setRippleKey(Date.now());
    setTimeout(() => setRippleKey(null), 1000);
    if (onClick) onClick();
  };
  return (
    <motion.div className={`flex flex-wrap gap-x-[0.2em] gap-y-1 cursor-pointer select-none group/artist text-balance ${className}`} onClick={handleClick} whileHover={{ x: isQuoteAuthor ? 4 : -4 }} style={{ fontSize, textWrap: 'balance' }}>
      {words.map((word, wordIdx) => (
        <span key={`${text}-${wordIdx}`} className="inline-flex">
          {word.split("").map((c, charIdx) => {
            const charGlobalIdx = text.split(" ").slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0) + charIdx;
            return <ScanChar key={`${c}-${charIdx}`} char={c} triggerDelay={rippleKey ? charGlobalIdx * 30 : null} />;
          })}
        </span>
      ))}
    </motion.div>
  );
});

const formatTime = (time: number) => {
  if (isNaN(time) || !isFinite(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const WordReveal = ({ text }: { text: string }) => {
  const segments = useMemo(() => {
    try {
      // @ts-ignore
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
      return Array.from(segmenter.segment(text));
    } catch (e) {
      return text.split(' ').map(w => ({ segment: w, isWordLike: true }));
    }
  }, [text]);
  return (
    <span className="inline-flex flex-wrap justify-start text-left items-baseline leading-[1.1] text-balance no-orphans">
      {segments.map((s: any, i: number) => {
        if (!s.isWordLike) return <span key={i} className="whitespace-pre">{s.segment}</span>;
        return (
          <span key={i} className="overflow-visible inline-block pt-1 pb-1 whitespace-nowrap">
            <motion.span initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} whileHover={{ y: -4, color: '#fff', textShadow: '0 0 25px rgba(255,255,255,0.6)', scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }} transition={{ duration: 1, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }} className="inline-block cursor-pointer transition-all duration-500 text-white/70">
              {s.segment}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

const ToneArm = memo(({ isPlaying }: { isPlaying: boolean }) => {
  const armRotation = isPlaying ? -28 : 0;
  return (
    <div className="absolute top-[8%] right-[8%] w-[420px] h-[80px] pointer-events-none" style={{ transformStyle: 'preserve-3d', zIndex: 300 }}>
      <motion.div animate={{ rotateZ: armRotation, opacity: isPlaying ? 0.3 : 0.05, x: isPlaying ? -15 : 0 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} className="absolute right-12 top-1/2 w-[380px] h-12 bg-black/95 blur-[80px] origin-right rounded-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#080808] border border-white/5 shadow-2xl" style={{ transform: 'translateZ(100px)' }}>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#222] via-[#000] to-[#111]" />
      </div>
      <motion.div animate={{ rotateZ: armRotation, y: isPlaying ? 12 : -12 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} className="absolute right-12 top-1/2 -translate-y-1/2 w-[380px] origin-right" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-y-0 right-0 w-full h-8 bg-gradient-to-b from-[#888] via-[#eee] to-[#333] rounded-full shadow-2xl" style={{ transform: 'translateZ(110px)' }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-12 bg-[#0c0c0c] rounded-sm shadow-2xl" style={{ transform: 'translateZ(115px) rotateY(-18deg)' }} />
      </motion.div>
    </div>
  );
});

const RealVinylDisc = memo(({ isPlaying, sonicIdentity, onToggle }: any) => {
  const rotationDuration = sonicIdentity?.bpm ? (60 / sonicIdentity.bpm) * 3 : 2.5;
  return (
    <div className="absolute top-1/2 left-1/2 w-[850px] h-[850px] cursor-pointer group rounded-full" style={{ transform: 'translate3d(-50%, -50%, 20px)', transformStyle: 'preserve-3d' }} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      {/* Dynamic Highlight Outline Ring */}
      <div className="absolute inset-[-4px] rounded-full border border-white/0 group-hover:border-white/20 group-hover:shadow-[0_0_80px_rgba(255,255,255,0.15)] transition-all duration-1000 z-[40] pointer-events-none" />
      
      {/* Disc Content with Clipping */}
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-full z-20 pointer-events-none opacity-40 mix-blend-screen" style={{ background: 'conic-gradient(from 180deg, transparent 0%, rgba(255,255,255,0.4) 8%, transparent 15%, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%, transparent 85%, rgba(255,255,255,0.4) 92%, transparent 100%)' }} />
        <motion.div className="absolute inset-0 rounded-full" animate={isPlaying ? { rotateZ: [0, 360] } : { rotateZ: 0 }} transition={isPlaying ? { rotateZ: { duration: rotationDuration, repeat: Infinity, ease: "linear" } } : { duration: 1.2 }}>
          <div className="absolute inset-0 rounded-full bg-[#030303]" style={{ transform: 'translateZ(30px)', boxShadow: 'inset 0 0 150px black, 0 25px 80px rgba(0,0,0,0.95)' }}>
            <div className="absolute inset-0 rounded-full opacity-60" style={{ background: `radial-gradient(circle, transparent 15%, #000 16%, transparent 17%, #000 18%, transparent 40%, #000 42%, transparent 70%, #000 72%, transparent 90%), repeating-radial-gradient(circle, #000 0px, #000 1px, #1a1a1a 2px, #000 3.5px)` }} />
            <div className="absolute inset-[33%] rounded-full bg-neutral-900 border-[2px] border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
               <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/20 to-transparent" />
               <Activity className={`text-white/20 transition-all duration-1000 ${isPlaying ? 'animate-pulse scale-150' : 'scale-100'}`} size={70} />
               <div className="absolute bottom-10 text-[6px] font-black uppercase tracking-[0.4em] text-white/10">MUSIC CIRCLE INC.</div>
            </div>
            <div className="absolute inset-[48.5%] rounded-full bg-black/40 border border-white/5 z-30" />
          </div>
        </motion.div>
      </div>
    </div>
  );
});

const InteractiveVinyl: React.FC<InteractiveVinylProps> = ({ isPlaying, currentTrack, currentTime, duration, onToggle, onSeek, onArtistClick, sonicIdentity, isIdentitySyncing }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Dynamic scale calculation based on screen width
  const turntableScale = useMemo(() => {
    if (windowWidth < 480) return (windowWidth / 1500) * 1.2;
    if (windowWidth < 768) return (windowWidth / 1500) * 1.1;
    if (windowWidth < 1024) return (windowWidth / 1500) * 0.95;
    return 1;
  }, [windowWidth]);

  const rotateX = useSpring(useTransform(mouseY, [-500, 500], [55, 45]), { stiffness: 12, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-20, -10]), { stiffness: 12, damping: 20 });
  const progress = duration > 0 ? (currentTime / duration) : 0;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
    if (scrubRef.current && isScrubbing && onSeek) {
      const scrubRect = scrubRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - scrubRect.left) / scrubRect.width));
      onSeek(pct * duration);
    }
  };

  const handleQuoteClick = () => { setIsGlitching(true); setTimeout(() => setIsGlitching(false), 300); };
  useEffect(() => { const endScrub = () => setIsScrubbing(false); window.addEventListener('mouseup', endScrub); return () => window.removeEventListener('mouseup', endScrub); }, []);

  const displayQuote = sonicIdentity?.quote || { text: "SOUND AS FREQUENCY. FREQUENCY AS SOUL.", author: currentTrack.artist, translation: null };
  const shouldShowTranslation = displayQuote.translation && displayQuote.translation.trim().toLowerCase() !== displayQuote.text.trim().toLowerCase();

  return (
    <section className="relative min-h-[110vh] md:min-h-[160vh] flex flex-col items-center justify-start bg-transparent py-20 md:py-40 overflow-visible">
      {/* Dynamic Quote Positioning for Mobile */}
      <div className="absolute top-12 left-6 md:left-24 max-w-[85vw] md:max-w-[35vw] z-[100] flex flex-col items-start pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isIdentitySyncing && (
            <motion.div key={displayQuote.text} className="flex flex-col items-start gap-4 select-none" initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }} animate={{ opacity: isGlitching ? [0.4, 1, 0.6, 1] : 1, scale: isGlitching ? 0.98 : 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} onClick={handleQuoteClick}>
               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-1">
                 <div className="w-6 h-[1px] bg-white/30" />
                 <ArtistName text={currentTrack.artist} onClick={() => onArtistClick?.(currentTrack.artist)} className="text-[7px] md:text-[8px] uppercase tracking-[1em] font-black text-white/40 hover:text-white transition-colors" isQuoteAuthor />
               </motion.div>
               <div className="flex flex-col gap-5 w-full px-2">
                  <h2 className="font-outfit font-black italic tracking-tight leading-[1.05] text-left text-white drop-shadow-[0_10px_40px_rgba(0,0,0,1)] text-balance no-orphans" style={{ fontSize: 'clamp(1.2rem, 5vw, 2.2rem)', textWrap: 'balance' }}>
                    <WordReveal text={displayQuote.text} />
                  </h2>
                  {shouldShowTranslation && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="pl-6 border-l-2 border-white/20 w-full bg-white/5 backdrop-blur-md py-3 pr-4 rounded-sm shadow-xl">
                      <p className="text-[10px] md:text-[0.9rem] italic uppercase tracking-[0.2em] font-light text-white/40 leading-relaxed text-pretty no-orphans drop-shadow-md">
                        {displayQuote.translation}
                      </p>
                    </motion.div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full h-[400px] sm:h-[600px] md:h-[1000px] flex items-center justify-center perspective-[5000px] perspective-origin-center">
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', scale: turntableScale }} className="relative w-[1500px] h-[1000px] transform-gpu">
          <div className="absolute inset-0 rounded-[120px] bg-gradient-to-br from-[#0a0a0a] via-[#020202] to-[#0f0f0f] border border-white/5 shadow-[0_120px_350px_rgba(0,0,0,1)]" style={{ transform: 'translateZ(0px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-black border border-white/5 shadow-inner" />
          <RealVinylDisc isPlaying={isPlaying} sonicIdentity={sonicIdentity} onToggle={onToggle} />
          <ToneArm isPlaying={isPlaying} />
        </motion.div>
      </div>

      <div className="w-full max-w-7xl px-8 md:px-12 mt-12 md:mt-40 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-16 relative z-50">
        <div className="space-y-4 md:space-y-6 shrink-0 pb-2 bg-black/40 backdrop-blur-sm p-4 rounded-sm border border-white/5 shadow-2xl">
           <div className="flex items-center gap-4 text-[9px] md:text-[10px] uppercase tracking-[1.2em] text-white/30 font-black">
             <Activity size={14} className={isPlaying ? 'animate-pulse text-white' : ''} />
             ACTIVE TRANSMISSION
           </div>
           <div className="text-3xl md:text-6xl font-mono text-white/70 tabular-nums drop-shadow-2xl">
             {formatTime(currentTime)} <span className="text-white/10 mx-2">/</span> {formatTime(duration)}
           </div>
        </div>
        <div className="text-left md:text-right space-y-6 md:space-y-10 min-h-[100px] md:min-h-[120px] flex flex-col justify-end w-full md:max-w-[65%] pb-2">
           <AnimatePresence mode="wait">
             <motion.div key={currentTrack.id} className="flex flex-col items-start md:items-end w-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
               <PhaseShiftTitle key={`${currentTrack.id}-title`} text={currentTrack.title} fontSize="clamp(1.5rem, 8vw, 4rem)" className="font-outfit font-black uppercase tracking-tighter text-white leading-[0.85] drop-shadow-[0_20px_60px_rgba(0,0,0,1)] text-balance text-left md:text-right w-full" />
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start md:justify-end items-center gap-6 md:gap-10 mt-5 md:mt-6 w-full">
                  {windowWidth > 768 && <div className="hidden md:block w-10 md:w-16 h-[1px] bg-white/20 shrink-0 shadow-[0_0_10px_white]" />}
                  <ArtistName key={`${currentTrack.id}-artist`} text={currentTrack.artist} onClick={() => onArtistClick?.(currentTrack.artist)} fontSize="clamp(1.1rem, 4vw, 1.8rem)" className="italic font-light text-white/40 uppercase tracking-[0.4em] hover:text-white transition-all text-left md:text-right whitespace-nowrap drop-shadow-md" />
                  {windowWidth <= 768 && <div className="block md:hidden w-10 h-[1px] bg-white/20 shrink-0 shadow-[0_0_10px_white]" />}
               </motion.div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-7xl px-8 md:px-12 mt-12 md:mt-24 pb-12">
         <div ref={scrubRef} onMouseDown={() => setIsScrubbing(true)} className="w-full h-12 md:h-16 flex items-center cursor-crosshair group">
            <div className="w-full h-[2px] bg-white/10 relative overflow-visible rounded-full">
               <motion.div className="absolute inset-y-0 left-0 bg-white shadow-[0_0_40px_white]" style={{ width: `${progress * 100}%` }} />
               <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_white]" style={{ left: `${progress * 100}%` }} />
            </div>
         </div>
      </div>
    </section>
  );
};

export default InteractiveVinyl;


import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Search } from 'lucide-react';
import { MusicGenre } from './types';

interface HeaderProps {
  isPlaying: boolean;
  currentGenre: MusicGenre;
  onToggle: () => void;
  onNextTrack: () => void;
  onOpenSearch: () => void;
  isExternalPlaying: boolean;
}

const NavItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <motion.span 
      whileHover={{ y: -2, scale: 1.05 }} 
      onClick={onClick}
      className="relative inline-block cursor-pointer group"
    >
      {children}
      <motion.span initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} className="absolute -bottom-1 left-0 w-full h-[1px] bg-white origin-left" />
    </motion.span>
  );
};

const Header: React.FC<HeaderProps> = ({ 
  isPlaying, 
  onToggle, 
  onNextTrack, 
  onOpenSearch,
  isExternalPlaying 
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const handleMouseDown = () => {
    setIsHolding(false);
    timerRef.current = setTimeout(() => {
      onNextTrack();
      setIsHolding(true);
    }, 700);
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (!isHolding) onToggle();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center bg-transparent">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => scrollToSection('top')}
          className="text-xl font-bold tracking-[0.2em] uppercase select-none cursor-pointer flex items-center gap-1 group"
        >
          <span className="group-hover:text-white transition-colors">MUSIC</span> 
          <span className="text-white/30 group-hover:text-white/60 transition-colors">CIRCLE</span>
        </motion.div>
      </div>

      <div className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold">
        <div className="flex gap-10">
          <NavItem onClick={() => scrollToSection('top')}>Archives</NavItem>
          <NavItem onClick={() => scrollToSection('featured-artist')}>Artist</NavItem>
          <NavItem onClick={() => scrollToSection('news-archive')}>News</NavItem>
          <NavItem>Sync</NavItem>
        </div>

        <div className="flex items-center gap-8 pl-8 border-l border-white/10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenSearch}
              className="flex flex-col items-end group transition-all"
            >
              <span className="text-[7px] text-white/30 tracking-[0.4em] uppercase mb-0.5">Frequency Search</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white tracking-[0.3em] font-black group-hover:text-white/70 transition-colors">Explore Library</span>
                <div className="relative">
                  <Search size={14} className="group-hover:scale-110 transition-transform text-white/40" />
                  {isExternalPlaying && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" 
                    />
                  )}
                </div>
              </div>
            </button>
          </div>
          
          <motion.button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md group"
          >
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.8 }}
              className={`absolute inset-1.5 rounded-full border-[1px] border-dashed transition-colors ${isPlaying ? 'border-white/60' : 'border-white/20'}`}
            />
            {isPlaying ? <Pause size={14} className="relative z-10 text-white" /> : <Play size={14} className="relative z-10 ml-1 text-white" />}
            
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-40 transition-opacity text-[6px] tracking-[0.5em] whitespace-nowrap">
              Hold for skip
            </div>
          </motion.button>
        </div>
      </div>

      <button onClick={onOpenSearch} className="md:hidden p-2 text-white z-50">
        <Search size={24} />
      </button>
    </header>
  );
};

export default Header;

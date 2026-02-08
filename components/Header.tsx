
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Search } from 'lucide-react';
import { MusicGenre } from '../types';

interface HeaderProps {
  isPlaying: boolean;
  currentGenre: MusicGenre;
  onToggle: () => void;
  onNextTrack: () => void;
  onOpenSearch: () => void;
  isExternalPlaying: boolean;
  currentView: 'home' | 'artist' | 'news' | 'sync' | 'store';
  onSetView: (view: 'home' | 'artist' | 'news' | 'sync' | 'store') => void;
}

const NavItem: React.FC<{ children: string; onClick?: () => void; isActive?: boolean }> = ({ children, onClick, isActive }) => (
  <motion.span 
    onClick={onClick} 
    whileHover={{ y: -2 }} 
    className={`relative inline-block cursor-pointer px-4 py-2 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
  >
    <span className="relative z-10 text-white font-black text-[10px] tracking-[0.4em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
      {children}
    </span>
    {isActive && (
      <motion.div 
        layoutId="header-nav-indicator"
        className="absolute -bottom-1 left-4 right-4 h-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      />
    )}
  </motion.span>
);

const Header: React.FC<HeaderProps> = ({ isPlaying, onToggle, onOpenSearch, isExternalPlaying, currentView, onSetView }) => {
  const { scrollY } = useScroll();
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <motion.div 
        style={{ scale: headerScale }}
        className="w-full px-8 py-8 md:px-12 flex justify-between items-center pointer-events-auto mix-blend-difference"
      >
        {/* Brand Logo with Shadow and Optical Inversion */}
        <motion.div 
          onClick={() => onSetView('home')} 
          className="relative text-2xl font-black tracking-[0.25em] uppercase select-none cursor-pointer flex items-center gap-1 group drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
        >
          <span className="text-white">MUSIC</span>
          <span className="text-white/40 group-hover:text-white transition-colors">CIRCLE</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-12">
          <nav className="flex items-center">
            <NavItem isActive={currentView === 'artist'} onClick={() => onSetView('artist')}>Artists</NavItem>
            <NavItem isActive={currentView === 'news'} onClick={() => onSetView('news')}>News</NavItem>
            <NavItem isActive={currentView === 'store'} onClick={() => onSetView('store')}>Store</NavItem>
            <NavItem isActive={currentView === 'sync'} onClick={() => onSetView('sync')}>About</NavItem>
          </nav>

          <div className="flex items-center gap-10 pl-10 border-l border-white/20">
            <button 
              onClick={onOpenSearch} 
              className="flex items-center gap-4 group"
            >
              <span className="text-[10px] text-white/60 tracking-[0.4em] font-black group-hover:text-white transition-colors uppercase drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">Search</span>
              <div className="relative">
                <Search size={16} className="group-hover:scale-110 transition-transform text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" />
                {isExternalPlaying && (
                  <motion.div layoutId="active-indicator" className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                )}
              </div>
            </button>
            
            <motion.button 
              onClick={onToggle} 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              className="relative w-12 h-12 rounded-full border border-white/40 flex items-center justify-center group overflow-hidden bg-white/5 shadow-2xl"
            >
              <motion.div 
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }} 
                transition={isPlaying ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 1 }} 
                className={`absolute inset-1.5 rounded-full border-[1px] border-dashed transition-colors ${isPlaying ? 'border-white/80' : 'border-white/30'}`} 
              />
              {isPlaying ? <Pause size={14} className="relative z-10 text-white" /> : <Play size={14} className="relative z-10 ml-0.5 text-white" />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;

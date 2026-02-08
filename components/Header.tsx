
import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
    whileHover="hover"
    initial="rest"
    animate={isActive ? "active" : "rest"}
    className="relative inline-block cursor-pointer px-6 py-4 transition-all duration-300"
  >
    <motion.span 
      variants={{
        rest: { 
          opacity: 0.4, 
          scale: 1, 
          fontWeight: 400,
          letterSpacing: '0.45em',
          textShadow: '0 0 0px rgba(255,255,255,0), 0 2px 5px rgba(0,0,0,0.5)'
        },
        hover: { 
          opacity: 1, 
          scale: 1.12, 
          fontWeight: 900,
          letterSpacing: '0.48em',
          textShadow: '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.4), 0 4px 15px rgba(0,0,0,1)',
          transition: { duration: 0.2, ease: "easeOut" }
        },
        active: { 
          opacity: 1, 
          scale: 1.05, 
          fontWeight: 500,
          letterSpacing: '0.45em',
          textShadow: '0 0 10px rgba(255,255,255,0.5), 0 2px 10px rgba(0,0,0,0.8)',
        }
      }}
      className="relative z-10 text-white text-[13px] uppercase block text-center transition-[font-weight]"
    >
      {children}
    </motion.span>
    
    <AnimatePresence>
      {isActive && (
        <motion.div 
          layoutId="header-nav-indicator"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          className="absolute bottom-2 left-6 right-6 h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.4)]"
        />
      )}
    </AnimatePresence>
  </motion.span>
);

const Header: React.FC<HeaderProps> = ({ isPlaying, onToggle, onOpenSearch, isExternalPlaying, currentView, onSetView }) => {
  const { scrollY } = useScroll();
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <motion.div 
        style={{ scale: headerScale }}
        className="w-full px-8 py-10 md:px-12 flex justify-between items-center pointer-events-auto mix-blend-difference"
      >
        {/* Brand Logo with dynamic glow */}
        <motion.div 
          onClick={() => onSetView('home')} 
          whileHover={{ scale: 1.05 }}
          className="relative text-3xl tracking-[0.35em] uppercase select-none cursor-pointer flex items-center gap-1 group drop-shadow-[0_4px_30px_rgba(0,0,0,1)]"
        >
          <span className="text-white font-black group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_15px_white]">MUSIC</span>
          <span className="text-white/30 font-light group-hover:text-white/80 transition-all duration-300">CIRCLE</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-16">
          <nav className="flex items-center gap-2">
            <NavItem isActive={currentView === 'artist'} onClick={() => onSetView('artist')}>Artists</NavItem>
            <NavItem isActive={currentView === 'news'} onClick={() => onSetView('news')}>News</NavItem>
            <NavItem isActive={currentView === 'store'} onClick={() => onSetView('store')}>Store</NavItem>
            <NavItem isActive={currentView === 'sync'} onClick={() => onSetView('sync')}>About</NavItem>
          </nav>

          <div className="flex items-center gap-14 pl-14 border-l border-white/10">
            <motion.button 
              onClick={onOpenSearch} 
              whileHover="hover"
              initial="rest"
              className="flex flex-col items-end group"
            >
              <span className="text-[9px] text-white/40 tracking-[0.6em] font-black group-hover:text-white transition-colors uppercase mb-1">METADATA</span>
              <div className="flex items-center gap-5">
                <motion.span 
                  variants={{
                    rest: { opacity: 0.6, x: 0, fontWeight: 400 },
                    hover: { opacity: 1, x: -6, fontWeight: 900, textShadow: '0 0 15px white' }
                  }}
                  className="text-[13px] text-white tracking-[0.45em] uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,1)]"
                >
                  Search
                </motion.span>
                <div className="relative">
                  <Search size={20} className="group-hover:scale-110 group-hover:text-white transition-all text-white/80 drop-shadow-[0_4px_15px_rgba(0,0,0,1)]" />
                  {isExternalPlaying && (
                    <motion.div 
                      layoutId="active-indicator" 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" 
                    />
                  )}
                </div>
              </div>
            </motion.button>
            
            <motion.button 
              onClick={onToggle} 
              whileHover={{ scale: 1.12, boxShadow: '0 0 40px rgba(255,255,255,0.2)' }} 
              whileTap={{ scale: 0.95 }} 
              className="relative w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group overflow-hidden bg-white/5 shadow-2xl transition-all duration-500"
            >
              <motion.div 
                animate={isPlaying ? { rotate: 360, opacity: 1 } : { rotate: 0, opacity: 0.3 }} 
                transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 1 }} 
                className={`absolute inset-2 rounded-full border-[2px] border-dashed transition-colors ${isPlaying ? 'border-white' : 'border-white/20'}`} 
              />
              {isPlaying ? (
                <Pause size={20} className="relative z-10 text-white drop-shadow-[0_0_15px_white]" />
              ) : (
                <Play size={20} className="relative z-10 ml-1 text-white opacity-60 group-hover:opacity-100" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;

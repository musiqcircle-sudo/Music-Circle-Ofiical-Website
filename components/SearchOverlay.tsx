
import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Play, 
  Loader2, 
  Lock,
  Unlock,
  History,
  Mic2,
  ChevronDown,
  Disc,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Track, MusicGenre } from '../types';
import * as api from '../services/apiService';

const PRIORITY_GENRES = [
  MusicGenre.ROCK,
  MusicGenre.JAZZ,
  MusicGenre.FUNK,
  MusicGenre.REGGAE,
  MusicGenre.GOSPEL,
  MusicGenre.FUSION,
  MusicGenre.TECHNO,
  MusicGenre.CINEMATIC
];

const ARCHIVE_GENRES = Object.values(MusicGenre).filter(g => !PRIORITY_GENRES.includes(g) && g !== MusicGenre.ALL);

const InfiniteSoundsTitle = memo(() => {
  const text = "INFINITE SOUNDS";
  return (
    <div className="flex gap-[0.1em] overflow-visible py-2">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)', scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)', 
            scale: 1,
            textShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 20px rgba(255,255,255,0.5)",
              "0 0 0px rgba(255,255,255,0)"
            ]
          }}
          transition={{ 
            duration: 1.5, 
            delay: i * 0.05, 
            ease: [0.16, 1, 0.3, 1],
            textShadow: { duration: 3, repeat: Infinity, delay: i * 0.1 }
          }}
          whileHover={{ 
            y: -5, 
            scale: 1.2, 
            color: '#fff',
            filter: 'drop-shadow(0 0 8px #fff)',
            transition: { duration: 0.2 }
          }}
          className={`inline-block font-black tracking-tighter cursor-default ${char === " " ? 'w-4' : ''}`}
          style={{ 
            color: 'rgba(255,255,255,0.4)',
            transition: 'color 0.5s ease'
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
});

const StardustField = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      {[...Array(isMobile ? 20 : 50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%", 
            opacity: Math.random(),
            scale: Math.random() * 0.5
          }}
          animate={{ 
            y: ["-10%", "110%"],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
    </div>
  );
};

interface SearchOverlayProps {
  onClose: () => void;
  onSelectTrack: (track: Track) => void;
  onGenreSelect: (genre: MusicGenre) => void;
  onArtistLock: (artist: string | null) => void;
  currentGenre: MusicGenre;
  lockedArtist: string | null;
  isExternalPlaying: boolean;
  isPlaying: boolean;
}

const GenreButton: React.FC<{ 
  genre: MusicGenre; 
  isActive: boolean; 
  onClick: () => void;
  compact?: boolean;
}> = ({ genre, isActive, onClick, compact }) => (
  <motion.button 
    onClick={onClick}
    whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.08)' }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-2 sm:gap-3 transition-all rounded-sm border ${
      isActive 
        ? 'bg-white border-white text-black shadow-[0_0_35px_rgba(255,255,255,0.5)]' 
        : 'bg-white/[0.02] border-white/10 hover:border-white/40 text-white/50 hover:text-white'
    } ${compact ? 'px-3 py-1.5' : 'px-4 sm:px-6 py-2 sm:py-3'}`}
  >
    <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap`}>{genre}</span>
    {isActive ? (
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <Lock size={10} />
      </motion.div>
    ) : (
      <Unlock size={10} className="opacity-10 group-hover:opacity-30" />
    )}
  </motion.button>
);

const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
  onClose, 
  onSelectTrack, 
  onGenreSelect, 
  onArtistLock,
  currentGenre,
  lockedArtist,
}) => {
  const [query, setQuery] = useState('');
  const [genreSearch, setGenreSearch] = useState('');
  const [showFullArchive, setShowFullArchive] = useState(false);
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredArchive = useMemo(() => {
    return ARCHIVE_GENRES.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase()));
  }, [genreSearch]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const tracks = await api.searchMusic(query);
      setResults(tracks);
    } catch (err) {
      console.warn("Search failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGenre = (g: MusicGenre) => {
    if (currentGenre === g) {
      onGenreSelect(MusicGenre.ALL);
    } else {
      onGenreSelect(g);
    }
  };

  const handleUnlockAll = () => {
    onGenreSelect(MusicGenre.ALL);
    onArtistLock(null);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) handleSearch();
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(30px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-[80px] flex flex-col items-center overflow-hidden"
    >
      <StardustField />

      <div className="w-full flex justify-between items-center px-6 py-6 md:px-12 relative z-[305]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg flex items-center gap-4 sm:gap-6"
        >
          <div className="hidden sm:block"><InfiniteSoundsTitle /></div>
          <AnimatePresence>
            {(lockedArtist || currentGenre !== MusicGenre.ALL) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                className="flex items-center gap-3 sm:gap-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 border border-white/10 text-[7px] sm:text-[9px] font-black rounded-sm"
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-white/60 uppercase tracking-widest truncate max-w-[100px] sm:max-w-none">
                    {currentGenre !== MusicGenre.ALL ? currentGenre : lockedArtist}
                  </span>
                </div>
                <button 
                  onClick={handleUnlockAll}
                  className="ml-2 sm:ml-4 flex items-center gap-1.5 sm:gap-2 text-white/40 hover:text-white transition-colors border-l border-white/10 pl-2 sm:pl-4"
                >
                  <RotateCcw size={10} /> <span className="hidden sm:inline">CLEAR</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <button 
          onClick={onClose} 
          className="p-2 sm:p-3 rounded-full hover:bg-white/5 transition-all group relative overflow-hidden"
        >
          <X size={24} className="text-white/30 group-hover:text-white transition-all relative z-10" />
        </button>
      </div>

      <div className="w-full max-w-7xl flex-1 flex flex-col px-6 md:px-12 overflow-hidden relative z-[305]">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 sm:mb-12 border-b border-white/5 pb-6 sm:pb-10"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 text-[7px] sm:text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold">
              <Sparkles size={10} className="text-white/20" /> Spectrum Calibration
            </div>
            <button 
              onClick={() => setShowFullArchive(!showFullArchive)}
              className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors flex items-center gap-2 sm:gap-3"
            >
              {showFullArchive ? 'Seal' : 'Archives'}
              <motion.div animate={showFullArchive ? { rotate: 180 } : { rotate: 0 }}>
                <ChevronDown size={12} />
              </motion.div>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 sm:mb-8 max-h-[120px] overflow-y-auto no-scrollbar">
            {PRIORITY_GENRES.map((g, i) => (
              <motion.div
                key={g}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.05), ease: "easeOut" }}
              >
                <GenreButton 
                  genre={g} 
                  isActive={currentGenre === g} 
                  onClick={() => toggleGenre(g)} 
                />
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showFullArchive && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white/[0.01] border border-white/5 p-4 sm:p-10 rounded-sm space-y-6 sm:space-y-10 mt-2 backdrop-blur-3xl"
              >
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Scan metadata..." 
                    value={genreSearch}
                    onChange={(e) => setGenreSearch(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pl-10 py-2 sm:py-4 text-[9px] sm:text-[11px] font-black tracking-widest uppercase focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {filteredArchive.slice(0, 16).map((g, i) => (
                    <GenreButton key={g} genre={g} isActive={currentGenre === g} onClick={() => toggleGenre(g)} compact />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSearch} 
          className="relative group mb-8 sm:mb-12"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scan frequencies..."
            className="w-full bg-transparent border-b border-white/10 py-6 sm:py-12 text-2xl sm:text-4xl md:text-6xl font-outfit font-black uppercase tracking-tighter focus:outline-none focus:border-white transition-all placeholder:text-white/[0.03]"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 sm:gap-8">
            {isLoading && <Loader2 className="animate-spin text-white/40" size={24} strokeWidth={1} />}
            <Search size={32} className="text-white/5 group-focus-within:text-white transition-all" />
          </div>
        </motion.form>

        <div className="flex-1 overflow-y-auto pr-2 pb-40 no-scrollbar">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 sm:gap-x-10 gap-y-12 sm:gap-y-20">
              {results.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-neutral-900 border border-white/10 mb-4 group-hover:border-white/50 transition-all">
                    <img src={item.albumArt} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
                    <div onClick={() => onSelectTrack(item)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 backdrop-blur-sm cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <Play size={18} fill="black" className="text-black ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-white truncate">{item.title}</h4>
                    <div className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] truncate">{item.artist}</div>
                    <button onClick={() => onArtistLock(lockedArtist === item.artist ? null : item.artist)} className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${lockedArtist === item.artist ? 'text-white' : 'text-white/10 hover:text-white'}`}>
                      {lockedArtist === item.artist ? <Lock size={10} /> : <Mic2 size={10} />} {lockedArtist === item.artist ? 'ISOLATED' : 'ISOLATE'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query.length > 2 && !isLoading ? (
            <div className="w-full py-40 flex flex-col items-center justify-center text-white/20 gap-6">
               <Disc size={60} className="animate-spin-slow opacity-10" />
               <span className="text-[10px] font-black uppercase tracking-[1em]">Scanning...</span>
            </div>
          ) : (
            <div className="w-full py-10 flex flex-col items-start gap-8">
               <div className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20">ARCHIVED SIGNALS</div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                  {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-white/[0.01] border border-white/5 rounded-sm animate-pulse" />)}
               </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchOverlay;

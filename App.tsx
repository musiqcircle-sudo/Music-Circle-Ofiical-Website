
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import InteractiveVinyl from './components/InteractiveVinyl';
import NewsSection from './components/NewsSection';
import NewsDetailOverlay from './components/NewsDetailOverlay';
import StoreSection from './components/StoreSection';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SearchOverlay from './components/SearchOverlay';
import BackgroundSystem from './components/BackgroundSystem';
import FeaturedArtist from './components/FeaturedArtist';
import SyncSection from './components/SyncSection';
import IntroAnimation from './components/IntroAnimation';
import ScrollReveal from './components/ScrollReveal';
import { Track, MusicGenre, SonicIdentity, NewsItem, ArtistBio } from './types';
import * as api from './services/apiService';

const INITIAL_TRACK: Track = {
  id: 'startup-seq',
  title: 'STRANGER THINGS THEME',
  artist: 'SURVIVE',
  album: 'Stranger Things OST',
  genre: MusicGenre.CINEMATIC,
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  quotes: []
};

type View = 'home' | 'artist' | 'news' | 'sync' | 'store';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGenre, setCurrentGenre] = useState<MusicGenre>(MusicGenre.ALL);
  const [lockedArtist, setLockedArtist] = useState<string | null>(null);
  const [externalTrack, setExternalTrack] = useState<Track | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sonicIdentity, setSonicIdentity] = useState<SonicIdentity | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [featuredArtist, setFeaturedArtist] = useState<ArtistBio | null>(null);
  const [isArtistLoading, setIsArtistLoading] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const currentTrack = externalTrack || INITIAL_TRACK;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 5500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasEntered) {
      if (newsItems.length === 0) syncNews();
      if (!featuredArtist) syncArtist();
      if (!sonicIdentity) syncSonicIdentity();
    }
  }, [hasEntered]);

  const syncSonicIdentity = async () => {
    const quote = await api.fetchQuote();
    setSonicIdentity({
      quote,
      colors: ['#3b82f6', '#8b5cf6'],
      insight: "Frequencies synchronized."
    });
  };

  const syncNews = async () => {
    setIsNewsLoading(true);
    const news = await api.fetchMusicNews();
    setNewsItems(news);
    setIsNewsLoading(false);
  };

  const syncArtist = async (name?: string) => {
    setIsArtistLoading(true);
    const artist = await api.fetchArtistBio(name);
    setFeaturedArtist(artist);
    setIsArtistLoading(false);
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen selection:bg-white/20 overflow-x-hidden">
      <CustomCursor />
      
      <AnimatePresence>
        {!hasEntered && <IntroAnimation key="intro" />}
      </AnimatePresence>

      <BackgroundSystem 
        isPlaying={isPlaying} 
        sonicIdentity={sonicIdentity} 
        orbY1={smoothScrollY} 
        orbY2={smoothScrollY} 
      />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
        crossOrigin="anonymous" 
      />
      
      <motion.div 
        animate={{ opacity: hasEntered ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="flex flex-col relative z-10"
      >
        <Header 
          isPlaying={isPlaying} 
          currentGenre={currentGenre} 
          onToggle={handleTogglePlay} 
          onNextTrack={() => {}} 
          onOpenSearch={() => setIsSearchOpen(true)} 
          isExternalPlaying={!!externalTrack} 
          currentView={currentView} 
          onSetView={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
        
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.main key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onDiscoverHits={() => setIsSearchOpen(true)} />
              
              <ScrollReveal direction="up" distance={100}>
                <InteractiveVinyl 
                  isPlaying={isPlaying} 
                  currentTrack={currentTrack} 
                  currentTime={currentTime} 
                  duration={duration} 
                  onToggle={handleTogglePlay} 
                  sonicIdentity={sonicIdentity} 
                  onSeek={(t) => { if(audioRef.current) audioRef.current.currentTime = t; }} 
                />
              </ScrollReveal>

              <ScrollReveal direction="up" distance={80} delay={0.2}>
                <NewsSection newsItems={newsItems} isLoading={isNewsLoading} onSelectNews={setSelectedNewsItem} limit={3} />
              </ScrollReveal>
              
              <Footer />
            </motion.main>
          )}
          
          {currentView === 'artist' && (
            <motion.div key="artist" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <FeaturedArtist artist={featuredArtist} isLoading={isArtistLoading} />
              <Footer />
            </motion.div>
          )}

          {currentView === 'news' && (
            <motion.div key="news" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <NewsSection newsItems={newsItems} isLoading={isNewsLoading} onSelectNews={setSelectedNewsItem} />
              <Footer />
            </motion.div>
          )}

          {currentView === 'store' && (
            <motion.div key="store" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <StoreSection />
              <Footer />
            </motion.div>
          )}

          {currentView === 'sync' && (
            <motion.div key="sync" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <SyncSection />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedNewsItem && (
          <NewsDetailOverlay 
            item={selectedNewsItem} 
            onClose={() => setSelectedNewsItem(null)} 
            isPlaying={isPlaying} 
            sonicIdentity={sonicIdentity} 
          />
        )}
      </AnimatePresence>
      
      {isSearchOpen && (
        <SearchOverlay 
          onClose={() => setIsSearchOpen(false)} 
          onSelectTrack={(t) => { setExternalTrack(t); setIsSearchOpen(false); }} 
          onGenreSelect={setCurrentGenre} 
          onArtistLock={setLockedArtist} 
          currentGenre={currentGenre} 
          lockedArtist={lockedArtist} 
          isExternalPlaying={!!externalTrack} 
          isPlaying={isPlaying} 
        />
      )}
    </div>
  );
};

export default App;


import React, { useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { X, ArrowLeft, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import { NewsItem, SonicIdentity } from '../types';
import Footer from './Footer';
import BackgroundSystem from './BackgroundSystem';
import ReliableImage from './ReliableImage';

interface NewsDetailOverlayProps {
  item: NewsItem | null;
  onClose: () => void;
  isPlaying: boolean;
  sonicIdentity: SonicIdentity | null;
}

const NewsDetailOverlay: React.FC<NewsDetailOverlayProps> = ({ item, onClose, isPlaying, sonicIdentity }) => {
  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 2000], ['0%', '30%']);
  const orbY2 = useTransform(scrollY, [0, 2000], ['10%', '40%']);

  useEffect(() => {
    if (item) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [item]);

  // DERIVED IDENTITY: While we can't extract precise hex codes easily client-side for all CORS images,
  // we can use the image itself as a blurred atmospheric layer behind the BackgroundSystem
  // to achieve the 'changing colors from image' effect requested.

  if (!item) return null;

  const isBreaking = item.isBreaking;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col overflow-y-auto overflow-x-hidden"
    >
      {/* ATMOSPHERIC COLOR SYNC LAYER */}
      <div className="fixed inset-0 z-[-3] pointer-events-none overflow-hidden">
        <motion.img 
          src={item.image} 
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.15, scale: 1 }}
          className="w-full h-full object-cover blur-[150px] desaturate-[0.5]"
          alt=""
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <BackgroundSystem isPlaying={isPlaying} sonicIdentity={sonicIdentity} orbY1={orbY1} orbY2={orbY2} />

      <header className="fixed top-0 left-0 w-full z-[210] px-6 md:px-12 py-6 md:py-8 flex justify-between items-center mix-blend-difference pointer-events-none">
        <button 
          onClick={onClose} 
          className="flex items-center gap-4 group pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all duration-500">
            <ArrowLeft size={16} className="group-hover:text-black transition-colors" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Return</span>
        </button>
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all pointer-events-auto"
        >
          <X size={18} />
        </button>
      </header>

      <main className="relative z-[205] w-full pt-32 md:pt-44 pb-32 md:pb-40">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col gap-5 md:gap-8 mb-12 md:mb-16 items-start">
            <div className="flex items-center gap-4">
              {isBreaking && (
                <div className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-sm flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                   <AlertTriangle size={10} /> BREAKING
                </div>
              )}
              <div className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-[0.3em] ${
                isBreaking ? 'bg-white/10 text-white' : 'bg-white text-black'
              }`}>
                {item.category}
              </div>
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">
                {item.sourceName}
              </span>
            </div>
            
            <h1 className="text-[clamp(1.75rem,5vw,3.25rem)] font-black uppercase tracking-tight leading-[1.1] italic text-white text-balance break-words drop-shadow-lg max-w-4xl">
              {item.title}
            </h1>
          </div>

          <div 
            className={`relative w-full overflow-hidden mb-12 md:mb-20 border rounded-sm shadow-2xl bg-neutral-900/50 group max-h-[75vh] min-h-[300px] flex items-center justify-center ${
              isBreaking ? 'border-red-500/20' : 'border-white/5'
            }`}
          >
            <ReliableImage 
              src={item.image} 
              alt={item.title} 
              fallbackKeywords={item.title} 
              hoverEffect={false} 
              objectPosition="center" 
              objectFit="contain" 
              className="w-full h-auto max-h-[75vh]"
            />
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none`} />
            
            {item.imageAttribution && (
              <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                <Info size={10} className="text-white/40" />
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{item.imageAttribution}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-12 space-y-12">
              <div className="space-y-12">
                <div className={`flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] ${
                  isBreaking ? 'text-red-500/50' : 'text-white/20'
                }`}>
                   <div className={`w-8 h-[1px] ${isBreaking ? 'bg-red-500/20' : 'bg-white/10'}`} /> 
                   EDITORIAL CONTENT
                </div>
                
                <div className="news-content text-xl md:text-2xl font-light text-white/80 leading-relaxed text-pretty border-l border-white/10 pl-8 md:pl-12 select-text whitespace-pre-line">
                  {item.description}
                </div>

                <div className="flex flex-col md:flex-row gap-12 pt-8 items-start">
                  <div className="w-full md:w-56 shrink-0 flex flex-col gap-6 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Metadata Trace</span>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20 uppercase tracking-widest">Broadcast</span>
                        <span className="text-[9px] text-white/60 uppercase tracking-widest">{item.date}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20 uppercase tracking-widest">Origin</span>
                        <span className="text-[9px] text-white/60 uppercase tracking-widest">{item.sourceName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center gap-8">
                <a 
                  href={item.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-6 px-12 py-5 text-black text-[10px] font-black uppercase tracking-[0.5em] transition-all rounded-sm group shadow-2xl ${
                    isBreaking ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  FULL ARTICLE SOURCE <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: item.title, url: item.sourceUrl });
                    }
                  }}
                  className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors"
                >
                  SHARE SIGNAL
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default NewsDetailOverlay;

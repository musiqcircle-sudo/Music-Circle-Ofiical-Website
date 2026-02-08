
import React, { useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, ArrowRight, Share2, Calendar, Clock, ArrowLeft, Disc } from 'lucide-react';
import { NewsItem, SonicIdentity } from '../types';
import Footer from './Footer';
import BackgroundSystem from './BackgroundSystem';

interface NewsDetailOverlayProps {
  item: NewsItem | null;
  onClose: () => void;
  isPlaying: boolean;
  sonicIdentity: SonicIdentity | null;
}

const NewsDetailOverlay: React.FC<NewsDetailOverlayProps> = ({ item, onClose, isPlaying, sonicIdentity }) => {
  // Use independent scroll for background parallax if needed, or static values
  // To keep it simple and consistent, we'll use slightly static transforms or map them to the overlay's scroll
  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 2000], ['0%', '30%']);
  const orbY2 = useTransform(scrollY, [0, 2000], ['10%', '40%']);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [item]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col overflow-y-auto overflow-x-hidden"
    >
      {/* Cinematic Background System - Shared from Home */}
      <BackgroundSystem 
        isPlaying={isPlaying} 
        sonicIdentity={sonicIdentity} 
        orbY1={orbY1} 
        orbY2={orbY2} 
      />

      <header className="fixed top-0 left-0 w-full z-[210] px-8 md:px-12 py-10 flex justify-between items-center mix-blend-difference">
        <button 
          onClick={onClose}
          className="flex items-center gap-6 group"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all duration-500">
            <ArrowLeft size={18} className="group-hover:text-black transition-colors" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">Back to Archive</span>
        </button>

        <div className="flex items-center gap-12">
           <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all group">
             <Share2 size={12} className="group-hover:scale-125 transition-transform" />
             <span className="hidden sm:inline">Transmit</span>
           </button>
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
           >
             <X size={20} />
           </button>
        </div>
      </header>

      <main className="relative z-[205] w-full pt-40 pb-60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32 items-end">
            <div className="lg:col-span-8 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-6"
              >
                <div className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-sm">
                  {item.category}
                </div>
                <div className="h-[1px] w-20 bg-white/20" />
                <span className="text-[10px] font-bold tracking-[0.6em] text-white/30 uppercase">{item.sourceName || 'CIRCLE MEDIA'}</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl lg:text-[110px] font-bold uppercase tracking-tighter leading-[0.85] italic text-white"
              >
                {item.title}
              </motion.h1>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-4 flex flex-col gap-8 pb-4"
            >
              <div className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-black text-white/20 uppercase">
                <Calendar size={14} />
                <span>{item.date || 'DATELINE: CURRENT'}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-black text-white/20 uppercase">
                <Clock size={14} />
                <span>ESTIMATED READ: 4 MIN</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[21/9] w-full bg-neutral-900 overflow-hidden mb-32 border border-white/5 rounded-sm shadow-2xl"
          >
            <img 
              src={item.image} 
              className="w-full h-full object-cover" 
              alt={item.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </motion.div>

          {/* Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-3 hidden lg:block space-y-20 pt-10">
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Contributor</h4>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                       <Disc size={16} className="text-white/40 animate-spin" />
                    </div>
                    <div className="text-[9px] font-bold tracking-[0.2em] text-white/60 uppercase">SYSTEM ARCHIVIST</div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Sonic Tags</h4>
                 <div className="flex flex-wrap gap-2">
                    {['WAVES', 'FREQUENCY', 'ANALOG', 'FUTURE'].map(t => (
                      <span key={t} className="text-[8px] font-black border border-white/10 px-3 py-1 rounded-full text-white/30 uppercase tracking-[0.3em]">#{t}</span>
                    ))}
                 </div>
              </div>
            </div>

            <div className="lg:col-span-8 lg:col-start-5 space-y-16">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-light italic text-white/90 leading-relaxed border-l-4 border-white/10 pl-10"
              >
                {item.description}
              </motion.p>

              <div className="space-y-12 text-lg text-white/50 font-light leading-relaxed tracking-wide">
                 <p>
                   As the boundaries between synthesis and organic sound continue to blur, this recent development marks a pivotal shift in how we perceive the future of the medium. The internal team at Music Circle has been monitoring these frequencies closely, analyzing the impact on both professional studio environments and underground performance spaces.
                 </p>
                 
                 <div className="py-12 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 h-[1px] bg-white/10" />
                    <Disc className="text-white/20 animate-spin-slow" size={32} />
                    <div className="flex-1 h-[1px] bg-white/10" />
                 </div>

                 <p>
                   What we find most compelling about this specific event is the way it challenges the traditional archival process. By treating every sound as a living data point, we are able to reconstruct these narratives within the Circle, ensuring that the legacy of these sonic pioneers remains intact for the next generation of engineers.
                 </p>

                 <p>
                   Moving forward, our studio will continue to prioritize these deep-dive reports. We believe that true audio mastery comes not just from technical proficiency, but from a profound understanding of the cultural waves moving through the industry.
                 </p>
              </div>

              <div className="pt-20 border-t border-white/5">
                <a 
                  href={item.sourceUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-6 px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.6em] hover:bg-white/90 transition-all rounded-sm group"
                >
                  Visit Official Source <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </a>
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

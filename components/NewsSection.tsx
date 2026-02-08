
import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem } from '../types';
import { Loader2, BookOpen, AlertCircle, Zap } from 'lucide-react';
import ReliableImage from './ReliableImage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const NewsCard = memo(({ item, onSelect, isLarge = false }: { item: NewsItem; onSelect: (item: NewsItem) => void; isLarge?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item)}
      className={`group relative cursor-pointer ${isLarge ? 'md:col-span-2 lg:col-span-3' : ''}`}
    >
      <div className={`relative ${isLarge ? 'aspect-[21/9]' : 'aspect-[16/9] md:aspect-[4/5]'} w-full bg-neutral-900 overflow-hidden border border-white/10 rounded-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.95)] group-hover:border-white/30 transition-all duration-700`}>
        <motion.div 
          animate={{ scale: isHovered ? 1.05 : 1, filter: isHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%) brightness(0.6)' }} 
          className="w-full h-full"
        >
          <ReliableImage src={item.image} alt={item.title} fallbackKeywords={item.title} />
        </motion.div>
        
        {item.isBreaking && (
          <div className="absolute inset-0 bg-red-900/10 pointer-events-none mix-blend-overlay" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-700" />
        
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
           <div className={`px-4 py-1.5 ${item.isBreaking ? 'bg-red-600 text-white' : 'bg-white text-black'} text-[9px] font-black uppercase tracking-[0.3em]`}>
             {item.isBreaking ? 'BREAKING' : item.category}
           </div>
           {item.isBreaking && (
             <motion.div 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_#ff0000]"
             />
           )}
        </div>

        {isLarge && (
          <div className="absolute bottom-10 left-10 max-w-2xl hidden md:block">
            <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
              {item.title}
            </h3>
          </div>
        )}
      </div>
      {!isLarge && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <span className={`text-[9px] font-black uppercase tracking-[0.5em] ${item.isBreaking ? 'text-red-500' : 'text-white/40'}`}>
              {item.isBreaking ? 'PRIORITY TRANSMISSION' : (item.sourceName || 'ARCHIVE')}
            </span>
            <div className={`w-10 h-[1px] ${item.isBreaking ? 'bg-red-900' : 'bg-white/10'}`} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter leading-[1.1] text-white group-hover:text-white/80 transition-colors">
            {item.title}
          </h3>
        </div>
      )}
    </motion.div>
  );
});

const NewsSection: React.FC<{ 
  newsItems: NewsItem[]; 
  isLoading: boolean; 
  onSelectNews: (item: NewsItem) => void; 
  limit?: number; 
}> = ({ newsItems, isLoading, onSelectNews, limit }) => {
  const breakingItems = useMemo(() => newsItems.filter(it => it.isBreaking), [newsItems]);
  const standardItems = useMemo(() => newsItems.filter(it => !it.isBreaking), [newsItems]);
  
  let filtered = standardItems.slice(0, limit || standardItems.length);

  return (
    <motion.section initial="hidden" animate="visible" variants={containerVariants} className="w-full py-40 px-6 md:px-12 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={cardVariants} className="flex flex-col mb-32 border-b border-white/10 pb-16">
          <span className="text-[11px] uppercase tracking-[1em] text-white/40 font-black block mb-4">LATEST TRANSMISSIONS</span>
          <h2 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter italic text-white leading-none">NEWS</h2>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex flex-col items-center py-40 gap-10">
              <Loader2 className="animate-spin text-white/20" size={60} strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-[1.5em] text-white/40">Synchronizing...</span>
            </div>
          ) : (
            <div className="space-y-40">
              {/* Breaking News Section - Appears only if breaking news exists */}
              {breakingItems.length > 0 && (
                <div className="space-y-12">
                   <div className="flex items-center gap-6">
                      <Zap className="text-red-600 fill-red-600" size={20} />
                      <span className="text-[11px] font-black uppercase tracking-[1em] text-red-500">BREAKING TRANSMISSION</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                      {breakingItems.map(item => (
                        <NewsCard key={item.id} item={item} onSelect={onSelectNews} isLarge={breakingItems.length === 1} />
                      ))}
                   </div>
                   <div className="h-[1px] w-full bg-red-600/20" />
                </div>
              )}

              {/* Standard News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                {filtered.map((item) => <NewsCard key={item.id} item={item} onSelect={onSelectNews} />)}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
export default NewsSection;

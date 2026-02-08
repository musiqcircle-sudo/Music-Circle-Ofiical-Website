
import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsItem, GenreFilter } from '../types';
import { Loader2, ArrowUpRight, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import ReliableImage from './ReliableImage';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const NewsCard = memo(({ item, onSelect }: { item: NewsItem; onSelect: (item: NewsItem) => void }) => {
  const isBreaking = item.isBreaking;
  
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      className={`group relative flex flex-col bg-white/[0.02] border transition-all duration-500 overflow-hidden backdrop-blur-md h-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] hover:shadow-[0_35px_65px_-12px_rgba(255,255,255,0.05)] ${
        isBreaking ? 'border-red-600/40 ring-1 ring-red-600/10' : 'border-white/5 hover:border-white/20'
      }`}
    >
      <div 
        onClick={() => onSelect(item)}
        className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden cursor-pointer shrink-0 border-b border-white/5"
      >
        <ReliableImage 
          src={item.image} 
          alt={item.title} 
          fallbackKeywords={`${item.category} ${item.title}`} 
          objectPosition="center top"
          hoverEffect={true} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
        
        <div className="absolute top-3 left-3 z-10 flex gap-2">
           {isBreaking && (
             <motion.div 
               animate={{ opacity: [1, 0.5, 1] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="px-2.5 py-1 bg-red-600 text-white text-[7px] font-black uppercase tracking-[0.2em] rounded-xs flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
             >
               <AlertTriangle size={8} /> BREAKING
             </motion.div>
           )}
           <div className={`px-3 py-1 backdrop-blur-md text-[7px] font-black uppercase tracking-[0.3em] rounded-xs border transition-all ${
             isBreaking ? 'bg-black/90 text-red-500 border-red-500/30' : 'bg-black/60 text-white/70 border-white/10 group-hover:bg-white group-hover:text-black'
           }`}>
             {item.category}
           </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-3">
         <div className="space-y-1">
           <div className="flex items-center justify-between">
             <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">
               {item.sourceName}
             </span>
             <span className="text-[7px] font-medium uppercase tracking-[0.2em] text-white/10">
               {item.date}
             </span>
           </div>
           <h3 
             onClick={() => onSelect(item)}
             className="font-bold uppercase tracking-tight leading-[1.1] transition-all cursor-pointer line-clamp-2 text-base group-hover:text-white"
           >
             {item.title}
           </h3>
         </div>
         
         <p className="text-[10px] text-white/30 leading-relaxed line-clamp-2 uppercase tracking-[0.05em] font-medium group-hover:text-white/50 transition-colors duration-500">
           {item.description}
         </p>

         <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <button 
              onClick={() => onSelect(item)}
              className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all flex items-center gap-2"
            >
              READ <ArrowUpRight size={10} />
            </button>

            <a 
              href={item.sourceUrl}
              target="_blank"
              rel="nofollow noopener"
              className={`text-[7px] font-black uppercase tracking-[0.4em] px-3 py-1.5 transition-all rounded-xs border ${
                isBreaking ? 'bg-red-600/10 border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white hover:text-black hover:border-white'
              }`}
            >
              SOURCE
            </a>
         </div>
      </div>
    </motion.div>
  );
});

const NewsSection: React.FC<{ 
  newsItems: NewsItem[]; 
  isLoading: boolean; 
  onSelectNews: (item: NewsItem) => void; 
  limit?: number; 
}> = ({ newsItems, isLoading, onSelectNews, limit }) => {
  const [activeFilter, setActiveFilter] = useState<string>(GenreFilter.ALL);

  const availableFilters = useMemo(() => {
    const existingCats = new Set(newsItems.map(item => item.category));
    const filters = [GenreFilter.ALL, ...Object.values(GenreFilter).filter(f => f !== GenreFilter.ALL && existingCats.has(f))];
    return filters;
  }, [newsItems]);

  const filteredItems = useMemo(() => {
    // 1. First, filter by the active category if one is selected
    const baseItems = newsItems.filter(item => activeFilter === GenreFilter.ALL || item.category === activeFilter);
    
    // 2. Strict sorting: Breaking News ALWAYS at the top, then sorted by timestamp
    return baseItems
      .sort((a, b) => {
        // Breaking news takes absolute precedence
        if (a.isBreaking && !b.isBreaking) return -1;
        if (!a.isBreaking && b.isBreaking) return 1;
        
        // Otherwise sort by time (newest first)
        return b.timestamp - a.timestamp;
      })
      .slice(0, limit || 40);
  }, [newsItems, activeFilter, limit]);

  return (
    <motion.section initial="hidden" animate="visible" className="w-full py-24 px-6 md:px-12 relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 border-b border-white/10 pb-16">
          <div className="space-y-3">
            <span className="text-[9px] uppercase tracking-[1em] text-white/30 font-black block">EDITORIAL HQ</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white leading-none">THE FEED</h2>
          </div>
          
          <div className="flex items-center bg-white/[0.01] border border-white/5 rounded-sm px-2 overflow-x-auto no-scrollbar max-w-full backdrop-blur-3xl">
             {availableFilters.map((f) => (
               <button 
                 key={f}
                 onClick={() => setActiveFilter(f)}
                 className={`px-6 py-3 text-[8px] font-black uppercase tracking-[0.4em] transition-all relative whitespace-nowrap ${activeFilter === f ? 'text-white' : 'text-white/20 hover:text-white/50'}`}
               >
                 {f}
                 {activeFilter === f && (
                   <motion.div layoutId="news-tab-indicator" className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-white shadow-[0_0_10px_white]" />
                 )}
               </button>
             ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex flex-col items-center py-40 gap-8">
              <Loader2 className="animate-spin text-white/10" size={48} strokeWidth={1} />
              <span className="text-[8px] uppercase tracking-[0.8em] text-white/20 font-black animate-pulse">Syncing Editorial Signals...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center py-40 gap-6 text-center">
               <RefreshCw size={24} className="text-white/10" />
               <p className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black">No high-res signals detected.</p>
               <button onClick={() => setActiveFilter(GenreFilter.ALL)} className="text-[7px] uppercase tracking-[0.3em] font-black text-white underline">Reset Spectrum</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {filteredItems.map((item) => <NewsCard key={item.id} item={item} onSelect={onSelectNews} />)}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
export default NewsSection;

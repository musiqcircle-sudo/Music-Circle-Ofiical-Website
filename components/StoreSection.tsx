
import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, Info, Zap, Guitar, Drum, Music, Loader2 } from 'lucide-react';
import { StoreProduct } from '../types';
import * as api from '../services/apiService';
import ReliableImage from './ReliableImage';

const StoreSection: React.FC = () => {
  const [registry, setRegistry] = useState<Record<string, StoreProduct[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  useEffect(() => {
    const loadVault = async () => {
      setIsLoading(true);
      const data = await api.fetchVaultInstruments();
      setRegistry(data);
      setIsLoading(false);
    };
    loadVault();
  }, []);

  const getIcon = (cat: string) => {
    if (cat.toLowerCase().includes('guitar')) return Guitar;
    if (cat.toLowerCase().includes('drum')) return Drum;
    if (cat.toLowerCase().includes('synth') || cat.toLowerCase().includes('key')) return Zap;
    return Music;
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-black z-10 relative">
        <Loader2 className="animate-spin text-white/20" size={60} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[1.5em] text-white/40">Opening the Store...</span>
      </div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full min-h-screen pt-32 pb-40 px-6 md:px-12 bg-black z-10 relative">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <div className="space-y-24">
              <div className="border-b border-white/10 pb-16">
                <span className="text-[11px] font-black uppercase tracking-[1em] text-white/40 block mb-6">AFFILIATE REGISTRY</span>
                <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic text-white leading-none">THE STORE</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.keys(registry).map((catName) => {
                  const Icon = getIcon(catName);
                  return (
                    <motion.div key={catName} whileHover={{ y: -10 }} onClick={() => setActiveCategory(catName)} className="group relative aspect-[3/4] overflow-hidden cursor-pointer border border-white/5 bg-neutral-900 shadow-2xl">
                      <ReliableImage src="" alt={catName} fallbackKeywords={catName} className="grayscale opacity-20 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80" />
                      <div className="absolute inset-0 p-10 flex flex-col justify-end">
                        <Icon className="text-white/20 mb-4" size={32} />
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{catName}</h3>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              <button onClick={() => setActiveCategory(null)} className="flex items-center gap-4 text-[10px] font-black tracking-[0.6em] text-white/40 hover:text-white transition-colors uppercase"><ChevronLeft size={18} /> Back to Store</button>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white">{activeCategory}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {registry[activeCategory]?.map((product) => (
                  <motion.div key={product.id} whileHover={{ y: -5 }} onClick={() => setSelectedProduct(product)} className="group bg-white/[0.03] backdrop-blur-xl border border-white/5 overflow-hidden rounded-none cursor-pointer shadow-2xl hover:border-white/20 transition-all">
                    <div className="aspect-square bg-white flex items-center justify-center p-8">
                      <ReliableImage src={product.image} alt={product.name} fallbackKeywords={`${product.brand} ${product.name} instrument`} className="group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-8 space-y-4">
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">{product.brand}</span>
                      <h4 className="text-xl font-black uppercase text-white leading-tight">{product.name}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 z-[300] bg-black/98 backdrop-blur-3xl p-6 md:p-12 overflow-y-auto flex flex-col items-center justify-center cursor-pointer">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 100 }} onClick={(e) => e.stopPropagation()} className="max-w-6xl w-full relative flex flex-col md:flex-row bg-neutral-950 border border-white/10 rounded-none overflow-hidden shadow-2xl cursor-default">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 z-[310] w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"><X size={24} /></button>
              <div className="w-full md:w-1/2 bg-white p-12 md:p-24 flex items-center justify-center">
                 <ReliableImage src={selectedProduct.image} alt={selectedProduct.name} fallbackKeywords={`${selectedProduct.brand} ${selectedProduct.name} official gear`} className="drop-shadow-2xl" />
              </div>
              <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center space-y-12">
                 <div className="space-y-6">
                    <span className="text-[11px] font-black uppercase tracking-[1em] text-white/40">{selectedProduct.brand}</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">{selectedProduct.name}</h2>
                    <p className="text-lg text-white/60 font-light leading-relaxed">{selectedProduct.description}</p>
                 </div>
                 <div className="pt-10 border-t border-white/5">
                    <a href={selectedProduct.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-6 px-12 py-5 bg-white text-black text-[12px] font-black uppercase tracking-[0.6em] hover:scale-105 transition-all shadow-2xl">Buy on Amazon <ExternalLink size={18} /></a>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default memo(StoreSection);

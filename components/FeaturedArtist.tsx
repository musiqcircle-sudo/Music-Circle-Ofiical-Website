
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, MapPin, Award, Music, Loader2, ExternalLink, Globe, AlertCircle, FileText } from 'lucide-react';
import { ArtistBio } from '../types';

interface FeaturedArtistProps {
  artist: ArtistBio | null;
  isLoading: boolean;
}

const FeaturedArtist: React.FC<FeaturedArtistProps> = ({ artist, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-8 bg-black">
        <div className="relative">
          <Loader2 className="text-white/20 animate-spin" size={80} strokeWidth={1} />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.8em] text-white/40 font-black animate-pulse">Syncing Editorial Signals...</span>
      </div>
    );
  }

  if (!artist || !artist.name) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-black text-center px-12">
        <AlertCircle className="text-white/10" size={60} strokeWidth={1} />
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Signal Interrupted</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 max-w-md mx-auto">The artistic frequency for this profile is currently unavailable.</p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] hover:scale-105 transition-transform">Re-establish Link</button>
      </div>
    );
  }

  const hasVideoCoverage = !!artist.youtubeId;

  return (
    <motion.section 
      initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full py-32 px-6 md:px-12 relative z-10 min-h-screen bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 md:mb-24 border-b border-white/10 pb-16">
          <div className="space-y-4">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
              <span className="w-8 sm:w-12 h-[1px] bg-white/40" />
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[1em] sm:tracking-[1.4em] text-white font-black italic">VERIFIED EDITORIAL PROFILE</span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5 space-y-12 sm:space-y-16">
            <motion.div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              initial={{ y: 40, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="relative aspect-[4/5] rounded-sm overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] bg-neutral-900 group"
            >
              <motion.div 
                animate={{ scale: isHovered ? 1.05 : 1, filter: isHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%) brightness(0.8)' }}
                className="w-full h-full relative"
              >
                <img src={artist.portraitUrl} className="w-full h-full object-cover transition-opacity duration-1000" alt={artist.name} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
            </motion.div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-white/40"><Award size={14} /> Source Tags</div>
              <div className="grid gap-3 sm:gap-4">
                {artist.achievements.map((item, i) => (
                  <motion.div key={i} className="p-4 sm:p-6 border border-white/5 bg-white/[0.03] backdrop-blur-md rounded-sm shadow-2xl">
                    <span className="text-[9px] sm:text-[11px] font-bold tracking-widest text-white/80 uppercase italic">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12 sm:space-y-16">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-6 sm:gap-8 text-[9px] sm:text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                <div className="flex items-center gap-2 sm:gap-3"><MapPin size={12} /> {artist.location}</div>
                <div className="flex items-center gap-2 sm:gap-3"><Music size={12} /> {artist.genre}</div>
              </div>
              <h2 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">{artist.name}</h2>
            </div>

            <div className="space-y-8 sm:space-y-10 text-xl sm:text-2xl text-white/70 font-light leading-relaxed tracking-wide select-text whitespace-pre-line border-l border-white/5 pl-8">
              {artist.biography.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            {artist.sources && artist.sources.length > 0 && (
              <div className="pt-8 space-y-4">
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                   <Globe size={12} /> VERIFICATION TRACE
                 </div>
                 <div className="flex flex-wrap gap-4">
                    {artist.sources.map((src, i) => (
                      <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/40 hover:text-white flex items-center gap-2 border border-white/5 px-4 py-2 rounded-sm bg-white/[0.02] transition-colors">
                        <FileText size={10} /> {src.title} <ExternalLink size={10} />
                      </a>
                    ))}
                 </div>
              </div>
            )}
            
            {/* CONDITIONAL YOUTUBE SECTION: Hidden if no coverage found */}
            {hasVideoCoverage && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-12 sm:pt-20 border-t border-white/10 space-y-8 sm:space-y-12 overflow-hidden"
              >
                 <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-white">
                   <Youtube className="text-red-600" /> MUSIC CIRCLE TRANSMISSION
                 </div>
                 <div className="relative aspect-video w-full rounded-sm overflow-hidden border border-white/20 shadow-2xl bg-black">
                   <iframe src={`https://www.youtube.com/embed/${artist.youtubeId}?modestbranding=1&rel=0`} className="absolute inset-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity" frameBorder="0" allowFullScreen />
                 </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedArtist;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, MapPin, Award, Music, Loader2, ExternalLink, Globe } from 'lucide-react';
import { ArtistBio } from '../types';

interface FeaturedArtistProps {
  artist: ArtistBio | null;
  isLoading: boolean;
}

const FeaturedArtist: React.FC<FeaturedArtistProps> = ({ artist, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-black">
        <Loader2 className="text-white animate-spin" size={48} strokeWidth={1} />
        <span className="text-[10px] uppercase tracking-[0.8em] text-white/40 font-black animate-pulse">Scanning Metadata...</span>
      </div>
    );
  }

  if (!artist) return null;

  // STRICT RULE: Only show YouTube if verified ID exists and isn't a placeholder
  const hasTransmission = Boolean(
    artist.youtubeId && 
    artist.youtubeId.trim() !== "" && 
    artist.youtubeId.length > 5 &&
    artist.youtubeId.toLowerCase() !== "null"
  );

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
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[1em] sm:tracking-[1.4em] text-white font-black italic">VERIFIED ARTIST PROFILE</span>
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
              transition={{ delay: 0.6, duration: 1 }} 
              className="relative aspect-[4/5] rounded-sm overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] bg-neutral-900 group"
            >
              <motion.div 
                animate={{ 
                  scale: isHovered ? 1.05 : 1,
                  filter: isHovered ? 'grayscale(0%) brightness(1.1) contrast(1.1)' : 'grayscale(100%) brightness(0.8) contrast(1.2)'
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative"
              >
                <img 
                  src={artist.portraitUrl} 
                  className="w-full h-full object-cover transition-opacity duration-1000" 
                  alt={artist.name} 
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1514525253361-bee8a187449a?auto=format&fit=crop&q=90&w=2000";
                  }}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </motion.div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                 <div className="text-[10px] font-black tracking-[0.4em] text-white/50 uppercase">AUTHENTICATED PORTRAIT</div>
              </div>
            </motion.div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-white/40"><Award size={14} /> Milestones</div>
              <div className="grid gap-3 sm:gap-4">
                {artist.achievements.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + (i * 0.1) }} className="p-4 sm:p-6 border border-white/5 bg-white/[0.03] backdrop-blur-md rounded-sm shadow-2xl">
                    <span className="text-[9px] sm:text-[11px] font-bold tracking-widest text-white/80 uppercase italic">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12 sm:space-y-16">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap gap-6 sm:gap-8 text-[9px] sm:text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                <div className="flex items-center gap-2 sm:gap-3"><MapPin size={12} /> {artist.location}</div>
                <div className="flex items-center gap-2 sm:gap-3"><Music size={12} /> {artist.genre}</div>
              </motion.div>
              <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">{artist.name}</motion.h2>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1.5 }} className="space-y-8 sm:space-y-10 text-lg sm:text-xl md:text-2xl text-white/70 font-light leading-relaxed tracking-wide">
              {artist.biography.map((para, i) => <p key={i}>{para}</p>)}
            </motion.div>

            {/* Citations / Grounding Sources */}
            {artist.sources && artist.sources.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 space-y-4">
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                   <Globe size={12} /> Verification Sources
                 </div>
                 <div className="flex flex-wrap gap-4">
                    {artist.sources.slice(0, 3).map((src, i) => (
                      <a 
                        key={i} 
                        href={src.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-white/40 hover:text-white flex items-center gap-2 border border-white/5 px-3 py-1.5 rounded-sm bg-white/[0.02] transition-colors"
                      >
                        {src.title} <ExternalLink size={10} />
                      </a>
                    ))}
                 </div>
              </motion.div>
            )}

            <AnimatePresence>
              {hasTransmission && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 1.4, duration: 1 }} 
                  className="pt-12 sm:pt-20 border-t border-white/10 space-y-8 sm:space-y-12 overflow-hidden"
                >
                  <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.6em] text-white">
                    <Youtube className="text-red-600" /> MUSIC CIRCLE EXCLUSIVE
                  </div>
                  <div className="relative aspect-video w-full rounded-sm overflow-hidden border border-white/20 shadow-2xl bg-black group/video">
                    <iframe 
                      src={`https://www.youtube.com/embed/${artist.youtubeId}?modestbranding=1&rel=0`} 
                      className="absolute inset-0 w-full h-full sm:opacity-90 sm:hover:opacity-100 transition-all duration-700" 
                      frameBorder="0" 
                      allowFullScreen 
                    />
                    <div className="absolute inset-0 pointer-events-none group-hover/video:opacity-0 transition-opacity bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedArtist;


import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Instagram, Facebook, Twitter, Coffee, ExternalLink, Globe, Heart, Zap, Waves, Music, Fingerprint, Sparkles, Activity } from 'lucide-react';

const VerseLine = ({ children, delay = 0 }: { children?: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    className="overflow-hidden"
  >
    <span className="block text-lg sm:text-2xl md:text-3xl font-light italic text-white/80 leading-relaxed tracking-wide">
      {children}
    </span>
  </motion.div>
);

const QuoteCard = ({ text, delay = 0, icon: Icon, type }: { text: string; delay?: number; icon: any, type: 'music' | 'identity' | 'passion' }) => {
  const [isActivating, setIsActivating] = useState(false);

  const triggerActivation = () => {
    if (isActivating) return;
    setIsActivating(true);
    setTimeout(() => setIsActivating(false), 800);
  };

  const getIconAnimation = () => {
    if (!isActivating) return {};
    switch (type) {
      case 'music':
        return { rotate: [0, 360], scale: [1, 1.8, 1], transition: { duration: 0.6 } };
      case 'identity':
        return { opacity: [1, 0.3, 1], scale: [1, 1.1, 1], color: ['#fff', '#55ff55', '#fff'], transition: { duration: 0.5 } };
      case 'passion':
        return { scale: [1, 1.4, 1.1, 1.5, 1], transition: { duration: 0.6 } };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      onClick={triggerActivation}
      className="p-8 sm:p-14 border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden rounded-sm min-h-[200px] sm:min-h-[280px] shadow-2xl transition-all"
    >
      <AnimatePresence>
        {isActivating && (
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.1, scale: 2 }} exit={{ opacity: 0 }} className={`absolute inset-0 rounded-full blur-3xl pointer-events-none ${type === 'identity' ? 'bg-green-500' : type === 'passion' ? 'bg-red-500' : 'bg-white'}`} />
        )}
      </AnimatePresence>

      <motion.div animate={getIconAnimation()} className="relative z-10 mb-6 sm:mb-8">
        <Icon size={18} className="text-white/20 group-hover:text-white transition-all duration-500" />
      </motion.div>

      <span className="font-outfit text-lg sm:text-2xl font-light italic text-white/80 leading-snug tracking-tight relative z-10 px-2 group-hover:text-white transition-colors duration-500">
        &ldquo;{text}&rdquo;
      </span>
    </motion.div>
  );
};

const SocialTransmission = ({ icon: Icon, label, link, delay = 0 }: any) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 hover:bg-white/[0.03] transition-all group"
  >
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all">
        <Icon size={12} className="text-white group-hover:text-black transition-colors" />
      </div>
      <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">{label}</span>
    </div>
    <ExternalLink size={12} className="text-white/10 group-hover:text-white transition-all" />
  </motion.a>
);

const AnimatedIdentityTitle = memo(({ text, className }: { text: string; className: string }) => {
  return (
    <div className="relative inline-block py-4 sm:py-6">
      <motion.div whileHover="hover" className={`flex flex-wrap justify-center gap-x-2 sm:gap-x-4 cursor-pointer relative z-10 ${className}`}>
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: 'blur(20px)', y: 15 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.04 }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
});

const SyncSection: React.FC = () => {
  return (
    <motion.section 
      key="sync-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full py-20 sm:py-32 px-6 md:px-12 relative z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-40">
           <div className="mb-8 sm:mb-12">
             <div className="text-xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white cursor-default inline-block">
               MUSIC <span className="text-white/30">CIRCLE</span>
             </div>
           </div>

           <AnimatedIdentityTitle text="ABOUT US" className="text-5xl sm:text-7xl md:text-9xl font-outfit font-black uppercase tracking-tighter leading-none text-white select-none drop-shadow-2xl" />

           <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} className="text-[8px] sm:text-[9px] uppercase tracking-[0.6em] sm:tracking-[0.8em] font-black text-white max-w-xl leading-relaxed cursor-default mt-6 sm:mt-8 px-4">
            CELEBRATING THE HUMAN BEINGS BEHIND THE INFINITE SOUND.
           </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-24 items-start mb-20 sm:mb-40">
          <div className="lg:col-span-7 space-y-10 sm:space-y-16">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-white/40"><Zap size={14} /> Foundation</div>
              <p className="text-xl sm:text-3xl md:text-4xl font-light text-white/90 leading-tight tracking-tight font-outfit text-pretty">
                We spotlight the architects of sound—individuals who translate human experience into auditory reality.
              </p>
            </div>
            <div className="space-y-2 pt-6 sm:pt-10 border-l border-white/10 pl-6 sm:pl-10">
              <VerseLine delay={0.2}>Music speaks in many voices—</VerseLine>
              <VerseLine delay={0.4}>some whisper with grace,</VerseLine>
              <VerseLine delay={0.6}>others rise from a shackled place.</VerseLine>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-12 sm:space-y-20">
            <div className="space-y-8 sm:space-y-12">
               <div className="flex items-center gap-4 text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-white/40"><Globe size={14} /> Transmissions</div>
              <div className="flex flex-col border-t border-white/5">
                <SocialTransmission icon={Youtube} label="YouTube" link="https://www.youtube.com/@officialmusiccircle" delay={0.2} />
                <SocialTransmission icon={Instagram} label="Instagram" link="https://instagram.com/officialmusiccircle" delay={0.3} />
                <SocialTransmission icon={Twitter} label="X (Twitter)" link="https://x.com/OffMusiccircle" delay={0.4} />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-10">
              <motion.a 
                href="https://buymeacoffee.com/musiccircle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 sm:p-10 bg-white/[0.03] border border-white/10 text-white rounded-sm group relative overflow-hidden shadow-2xl"
              >
                 <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em]">Fuel the Circle</h3>
                       <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">Studio Maintenance.</p>
                    </div>
                    <Coffee size={20} className="text-white/40" />
                 </div>
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-16 sm:pt-32 mb-20 sm:mb-40">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
              <QuoteCard text="Play from the heart." delay={0.3} icon={Music} type="music" />
              <QuoteCard text="Be real. Be yourself." delay={0.4} icon={Fingerprint} type="identity" />
              <QuoteCard text="Do what you love." delay={0.5} icon={Heart} type="passion" />
           </div>
        </div>

        <div className="text-center space-y-8 sm:space-y-12">
           <div className="h-px bg-white/10 mx-auto w-full opacity-30" />
           <h2 className="text-3xl sm:text-6xl lg:text-8xl font-outfit font-black uppercase tracking-tighter text-white leading-none mt-8 sm:mt-12">
            ONE CIRCLE. <span className="text-white/5">INFINITE SOUND.</span>
           </h2>
        </div>
      </div>
    </motion.section>
  );
};

export default SyncSection;

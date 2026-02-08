
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  Music2, 
  Waves, 
  Coffee, 
  Link as LinkIcon, 
  ArrowRight,
  ArrowUpRight 
} from 'lucide-react';

const SocialLink = ({ href, label }: { href: string; label: string }) => (
  <li className="list-none">
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      whileTap={{ scale: 0.98, opacity: 0.6 }}
      className="flex items-center gap-3 hover:text-white transition-all group py-1"
    >
      <span className="text-[11px] font-medium text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 tracking-wide">
        {label}
      </span>
      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
    </motion.a>
  </li>
);

const FooterLink = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <li className="list-none">
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.98, opacity: 0.6 }}
      className="flex items-center gap-3 hover:text-white transition-all group py-1 text-left"
    >
      <span className="text-[11px] font-medium text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 tracking-wide">
        {label}
      </span>
    </motion.button>
  </li>
);

const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-transparent py-24 md:py-32 px-6 md:px-12 relative overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-24">
          
          {/* Newsletter Section */}
          <div className="lg:max-w-md space-y-10">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
                Subscribe to the <br />Music Circle Newsletter
              </h3>
              <p className="text-sm text-white/40 tracking-tight leading-relaxed max-w-sm">
                Latest news, musings, announcements and updates direct to your audio frequency.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs group">
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-white/10 py-4 px-0 text-sm tracking-tight focus:outline-none focus:border-white transition-all text-white placeholder:text-white/20"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-8 md:w-16 md:h-10 bg-white rounded-full flex items-center justify-center group transition-colors shadow-2xl"
              >
                <ArrowRight size={18} className="text-black group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-20">
            <div className="space-y-6">
              <h4 className="text-[12px] uppercase tracking-widest font-semibold text-white/30">Transmissions</h4>
              <ul className="space-y-2 p-0 m-0">
                <SocialLink href="https://www.youtube.com/@officialmusiccircle" label="YouTube" />
                <SocialLink href="https://instagram.com/officialmusiccircle" label="Instagram" />
                <SocialLink href="https://tiktok.com/@officialmusiccircle" label="TikTok" />
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[12px] uppercase tracking-widest font-semibold text-white/30">Social</h4>
              <ul className="space-y-2 p-0 m-0">
                <SocialLink href="https://x.com/OffMusiccircle" label="Twitter" />
                <SocialLink href="https://facebook.com/officialmusiccircle" label="Facebook" />
                <SocialLink href="https://bsky.app/profile/musiccircle.bsky.social" label="Bluesky" />
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[12px] uppercase tracking-widest font-semibold text-white/30">Resources</h4>
              <ul className="space-y-2 p-0 m-0">
                <SocialLink href="https://buymeacoffee.com/musiccircle" label="Support" />
                <SocialLink href="https://linktr.ee/musiccircle" label="Media Kit" />
                <FooterLink label="Downloads" />
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[12px] uppercase tracking-widest font-semibold text-white/30">Company</h4>
              <ul className="space-y-2 p-0 m-0">
                <FooterLink label="About" />
                <FooterLink label="Terms" />
                <FooterLink label="Privacy" />
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-8">
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold cursor-default">
            © 2025 MUSIC CIRCLE. ONE CIRCLE. INFINITE SOUND.
          </div>
          
          <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] font-black">
            <motion.a whileHover={{ color: '#fff' }} href="#" className="text-white/10 transition-colors">
              Play from the heart
            </motion.a>
            <motion.a whileHover={{ color: '#fff' }} href="#" className="text-white/10 transition-colors">
              Be real. Be yourself.
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReliableImageProps {
  src: string;
  alt: string;
  fallbackKeywords: string;
  className?: string;
  hoverEffect?: boolean;
  objectPosition?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const ReliableImage: React.FC<ReliableImageProps> = ({ 
  src, 
  alt, 
  className, 
  hoverEffect = true,
  objectPosition = "center",
  objectFit = "cover"
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    if (!src || src.length < 15 || src.includes('placeholder')) {
      setError(true);
      setIsLoading(false);
      return;
    }
    
    setImgSrc(src);
  }, [src]);

  if (error) return null;

  return (
    <div className={`relative w-full h-full bg-neutral-950 overflow-hidden flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900 z-10 flex items-center justify-center"
          >
             <div className="w-full h-full animate-pulse bg-white/[0.02]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={imgSrc}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        className={`w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hoverEffect ? 'grayscale group-hover:grayscale-0 group-hover:scale-105' : 'grayscale-0'}`}
        style={{ 
          imageRendering: 'high-quality', 
          objectPosition,
          objectFit,
          filter: hoverEffect && isLoading ? 'grayscale(100%) blur(10px)' : (hoverEffect ? undefined : 'grayscale(0%)')
        }}
      />
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default ReliableImage;

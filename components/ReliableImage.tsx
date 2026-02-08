
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ReliableImageProps {
  src: string;
  alt: string;
  fallbackKeywords: string;
  className?: string;
}

const ReliableImage: React.FC<ReliableImageProps> = ({ src, alt, fallbackKeywords, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // Fallback to high-resolution verified media archive with specific keywords
      const archiveUrl = `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=90&w=1600&music,${encodeURIComponent(fallbackKeywords)}`;
      setImgSrc(archiveUrl);
      setHasError(true);
    }
  };

  return (
    <motion.img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`${className} w-full h-full object-cover`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
  );
};

export default ReliableImage;

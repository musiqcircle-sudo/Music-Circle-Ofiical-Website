
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', animated = true }) => {
  const sizes = {
    sm: { width: 40, height: 40, musicSize: 6, circleSize: 12 },
    md: { width: 80, height: 80, musicSize: 12, circleSize: 24 },
    lg: { width: 160, height: 160, musicSize: 24, circleSize: 48 },
    xl: { width: 240, height: 240, musicSize: 36, circleSize: 72 },
  };

  const current = sizes[size];

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: current.width, height: current.height }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Eighth Notes Group */}
        <motion.g
          animate={animated ? { 
            y: [0, -2, 0],
            rotate: [0, 1, 0]
          } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Note 1 - Subtle shadow note */}
          <motion.path
            d="M25 45 L25 75 C25 80 20 83 15 83 C10 83 5 80 5 75 C5 70 10 67 15 67 L15 45 L35 40 L35 70 C35 75 30 78 25 78 C20 78 15 75 15 70"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.2"
          />
          {/* Note 2 - The primary one from brand image */}
          <motion.path
            d="M35 25 L35 60 A10 10 0 1 0 45 60 L45 35 L65 30 L65 55 A10 10 0 1 0 75 55 L75 20 Z"
            fill="white"
            initial={animated ? { pathLength: 0, opacity: 0 } : {}}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Text "Music" */}
        <motion.text
          x="65"
          y="45"
          fontFamily="Outfit, sans-serif"
          fontWeight="800"
          fontSize="14"
          fill="white"
          textAnchor="middle"
          opacity="0.8"
          initial={animated ? { opacity: 0, x: 55 } : {}}
          animate={{ opacity: 0.8, x: 65 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          usic
        </motion.text>
        <motion.text
           x="40"
           y="45"
           fontFamily="Outfit, sans-serif"
           fontWeight="800"
           fontSize="14"
           fill="white"
           textAnchor="end"
           initial={animated ? { opacity: 0 } : {}}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3 }}
        >
          M
        </motion.text>

        {/* Text "CIRCLE" */}
        <motion.text
          x="50"
          y="75"
          fontFamily="Outfit, sans-serif"
          fontWeight="800"
          fontSize="24"
          fill="white"
          textAnchor="middle"
          initial={animated ? { opacity: 0, y: 85 } : {}}
          animate={{ opacity: 1, y: 75 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          style={{ letterSpacing: '0.05em' }}
        >
          CIRCLE
        </motion.text>
      </svg>
    </div>
  );
};

export default Logo;

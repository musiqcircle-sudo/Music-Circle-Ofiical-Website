
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  width?: 'full' | 'auto';
  className?: string;
  stagger?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  distance = 60, 
  duration = 1.2,
  width = 'auto',
  className = '',
  stagger = false
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        filter: 'blur(15px)',
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        filter: 'blur(0px)',
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: stagger ? 0.1 : 0
      }}
      className={`${width === 'full' ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

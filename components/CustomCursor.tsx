
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High stiffness and moderate damping for snappy, lag-free tracking
  const cursorX = useSpring(mouseX, { stiffness: 1200, damping: 60 });
  const cursorY = useSpring(mouseY, { stiffness: 1200, damping: 60 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isClickable = window.getComputedStyle(target).cursor === 'pointer';
      setIsPointer(isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[1000] mix-blend-exclusion"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        scale: isPointer ? 1.4 : 1,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: isPointer ? [1, 1.5, 1] : 1 }}
          transition={{ repeat: isPointer ? Infinity : 0, duration: 1 }}
          className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" 
        />
      </div>
    </motion.div>
  );
};

export default CustomCursor;


import React, { useRef, useEffect, memo } from 'react';

// Purely musical symbols for the core matrix effect
const MUSICAL_SYMBOLS = "♩♪♫♬♭♮♯";

interface MusicMatrixRainProps {
  isPlaying: boolean;
  color?: string;
  opacity?: number;
}

const MusicMatrixRain = memo(({ isPlaying, color = '#ffffff', opacity = 0.45 }: MusicMatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 16;
    const spacing = fontSize * 3.5; 
    const columns = Math.floor(width / spacing);
    
    const drops = new Array(columns).fill(0).map(() => ({
      y: Math.random() * -100,
      speed: 0.1 + Math.random() * 0.2
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = `${fontSize}px "Noto Music", sans-serif`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        const text = MUSICAL_SYMBOLS.charAt(Math.floor(Math.random() * MUSICAL_SYMBOLS.length));
        const dropSpeed = isPlaying ? drop.speed * 2.5 : drop.speed;
        
        const pulse = Math.sin(Date.now() / (isPlaying ? 500 : 1500) + i) * 0.1 + 0.25;
        // Restored original alpha logic for better visibility without "flashing"
        const alpha = isPlaying ? Math.max(0.2, pulse * 2) : Math.max(0.05, pulse * 0.6);
        
        // Restored shadow blur for depth, but strictly tied to isPlaying (no random pulses)
        ctx.shadowBlur = isPlaying ? 12 : 0;
        ctx.shadowColor = color;
        
        const fillAlpha = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = color === '#ffffff' 
          ? `rgba(255, 255, 255, ${alpha})` 
          : `${color}${fillAlpha}`;
        
        ctx.fillText(text, i * spacing, drop.y * fontSize);

        if (drop.y * fontSize > height && Math.random() > 0.98) {
          drop.y = -20;
          drop.speed = 0.1 + Math.random() * 0.2;
        }
        drop.y += dropSpeed;
      }
    };

    let animationFrameId: number;
    const render = () => {
      draw();
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-1000"
      style={{ opacity, filter: isPlaying ? 'contrast(1.2) brightness(1.1) blur(0.5px)' : 'none' }}
    />
  );
});

export default MusicMatrixRain;

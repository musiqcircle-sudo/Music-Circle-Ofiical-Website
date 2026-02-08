
import React, { useRef, useEffect, memo } from 'react';

// Expanded pool of unique high-fidelity cosmic and abstract symbols
const COSMIC_SYMBOLS = [
  "✧", "✦", "✶", "☾", "☼", "⋆", "⚝", "☄", "✹", "✸", 
  "✻", "✼", "✵", "❉", "❊", "❋", "۞", "☊", "☋", "☌", 
  "☍", "❂", "❃", "❄", "✺", "✾", "❀", "✿", "❁", "❦"
];

interface CosmicDriftProps {
  isPlaying: boolean;
}

const CosmicDrift = memo(({ isPlaying }: CosmicDriftProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      char: string;
      size: number;
      opacity: number;
      targetOpacity: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      parallaxFactor: number;
      driftScale: number;
    }

    let particles: Particle[] = [];
    const maxParticles = 22; // Slightly more particles but much more subtle

    const createParticle = (currentParticles: Particle[]): Particle => {
      // UNIQUENESS LOGIC
      const activeChars = currentParticles.map(p => p.char);
      const availableSymbols = COSMIC_SYMBOLS.filter(s => !activeChars.includes(s));
      const finalPool = availableSymbols.length > 0 ? availableSymbols : COSMIC_SYMBOLS;
      const char = finalPool[Math.floor(Math.random() * finalPool.length)];

      // DEPTH LOGIC: Parallax factor defines how "far away" the symbol is
      const parallaxFactor = 0.05 + Math.random() * 0.45;
      
      return {
        x: Math.random() * width,
        y: Math.random() * (height * 2), // Spawn in a larger virtual space
        char: char,
        // Farther symbols (low parallax) are smaller
        size: 8 + (parallaxFactor * 24),
        opacity: 0,
        // Deeper symbols are much fainter
        targetOpacity: 0.05 + (parallaxFactor * 0.15), 
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        life: 0,
        maxLife: 800 + Math.random() * 1200,
        parallaxFactor: parallaxFactor,
        // Individual drift multiplier to make them move slightly differently
        driftScale: 0.5 + Math.random() * 1.5 
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const currentScroll = scrollYRef.current;

      if (particles.length < maxParticles && Math.random() > 0.98) {
        particles.push(createParticle(particles));
      }

      particles = particles.filter(p => {
        // DRIFT: Movement scaled by individual driftScale and global state
        const multiplier = isPlaying ? 2.0 : 1.0;
        p.x += p.speedX * multiplier * p.driftScale;
        p.y += p.speedY * multiplier * p.driftScale;
        p.life++;

        // FADE: Very gradual entry and exit
        if (p.life < p.maxLife * 0.15) {
          p.opacity = Math.min(p.targetOpacity, p.opacity + 0.002);
        } else if (p.life > p.maxLife * 0.85) {
          p.opacity = Math.max(0, p.opacity - 0.002);
        }

        // SPATIAL PARALLAX: Anchored in 3D-like space
        // Using % height * 3 to ensure a very large looping field
        const loopRange = height * 3;
        const renderY = (p.y - (currentScroll * p.parallaxFactor)) % loopRange;
        
        let finalY = renderY;
        if (finalY < -200) finalY += loopRange;
        if (finalY > height + 200) finalY -= loopRange;

        // ATMOSPHERICS: Distance-based blur and scaling
        const blurAmount = (0.5 - p.parallaxFactor) * 6; // Farther = blurrier
        ctx.filter = `blur(${Math.max(0, blurAmount)}px)`;
        ctx.font = `${p.size}px "Inter", sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        
        // SYNCED GLITCH: Very subtle jitter when playing
        const glitchX = isPlaying && Math.random() > 0.992 ? (Math.random() - 0.5) * 8 : 0;
        ctx.fillText(p.char, p.x + glitchX, finalY);
        ctx.filter = 'none';

        return p.life < p.maxLife && (p.opacity > 0 || p.life < p.maxLife * 0.5);
      });
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
  }, [isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[2] mix-blend-screen"
    />
  );
});

export default CosmicDrift;

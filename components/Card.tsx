import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { getIcon } from '../constants';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  title: string;
  description: string;
  visitText: string;
  loading?: boolean;
  isLarge?: boolean;
}

const Card: React.FC<CardProps> = ({ data, title, description, visitText, loading, isLarge }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spotlight effect
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // 3D Tilt effect
  const rotateX = useSpring(useTransform(mouseY, [0, 400], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 800], [-5, 5]), { stiffness: 100, damping: 30 });

  // Spotlight background - refined for a more subtle glow
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(var(--primary), 0.1), transparent 80%)`
  );

  // Border glow background
  const borderGlowBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, rgba(var(--primary), 0.4), transparent 80%)`
  );

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="h-full glass border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px] gap-6">
        <div className="relative w-16 h-16">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
          </motion.div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/50">Initializing</p>
          <p className="text-xs font-bold text-muted-foreground animate-pulse">Secure Connection...</p>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    window.open(data.url, '_blank', 'noopener,noreferrer');
  };

  const fallbackImage = "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=800";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ 
        scale: 1.05,
        y: -16,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`group relative flex flex-col h-full glass rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 border border-white/10 hover:border-primary/50 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7),0_0_40px_rgba(var(--primary),0.2)]`}
    >
      {/* Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: spotlightBg,
        }}
      />

      {/* Border Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 z-20"
        style={{
          background: borderGlowBg,
          maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
          maskClip: 'content-box, border-box',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Thumbnail Image Container */}
      <div className={`relative w-full overflow-hidden bg-muted ${isLarge ? 'h-64 md:h-full' : 'h-48'}`}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}
        <img 
          src={imageError ? fallbackImage : data.imageUrl} 
          alt={title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
        {/* Icon Overlay */}
        <div className="absolute bottom-6 left-6 p-4 rounded-2xl glass border border-white/20 text-white shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {getIcon(data.icon, "w-8 h-8")}
        </div>

        {/* External link indicator */}
        <div className="absolute top-6 right-6 p-3 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <ExternalLink className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Content Area */}
      <div className={`p-8 flex-grow flex flex-col gap-6 relative z-10 ${isLarge ? 'md:absolute md:bottom-0 md:left-0 md:right-0 md:bg-gradient-to-t md:from-background md:to-transparent' : ''}`}>
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-300 tracking-tighter">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-base font-medium line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex items-center justify-between">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-black uppercase tracking-widest text-primary group-hover:text-primary/80 transition-colors cursor-pointer"
          >
            {visitText}
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300 rtl:rotate-180 rtl:group-hover:-translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;

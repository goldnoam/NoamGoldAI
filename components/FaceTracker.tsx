import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const FaceTracker: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getSpritePosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Grid is 4 cols, 2 rows
    const col = Math.min(3, Math.floor((position.x / windowWidth) * 4));
    const row = Math.min(1, Math.floor((position.y / windowHeight) * 2));
    
    // Background size should be 400% width, 200% height (4 columns, 2 rows)
    // Position: -col * 100%, -row * 100%
    return {
        backgroundPosition: `-${col * 100}% -${row * 100}%`,
        backgroundSize: '400% 200%'
    };
  };

  return (
    <div className="fixed bottom-[25px] left-6 z-[60] p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
      <motion.div 
        className="w-10 h-20 rounded-xl overflow-hidden"
        style={{
            backgroundImage: "url('/image.png')",
            ...getSpritePosition()
        }}
        animate={getSpritePosition()}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      />
    </div>
  );
};

export default FaceTracker;

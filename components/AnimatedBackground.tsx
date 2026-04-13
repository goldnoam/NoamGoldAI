import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const AnimatedBackground: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for parallax
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax movement: move slightly in opposite direction
  const moveX = useTransform(springX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [20, -20]);
  const moveY = useTransform(springY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#020617]">
      {/* Animated Blobs */}
      <motion.div 
        style={{ x: moveX, y: moveY }}
        className="absolute inset-0"
      >
        {/* Blob 1: Deep Purple */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 60% 40% 60%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/30 blur-[120px]"
        />

        {/* Blob 2: Electric Blue */}
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 120, -60, 0],
            scale: [1, 1.1, 1.2, 1],
            borderRadius: ["30% 70% 70% 30% / 50% 50% 50% 50%", "70% 30% 30% 70% / 50% 50% 50% 50%", "30% 70% 70% 30% / 50% 50% 50% 50%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-[-5%] w-[50%] h-[50%] bg-blue-600/20 blur-[100px]"
        />

        {/* Blob 3: Slate/Teal */}
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.3, 0.8, 1],
            borderRadius: ["50% 50% 20% 80% / 20% 80% 50% 50%", "80% 20% 50% 50% / 50% 50% 20% 80%", "50% 50% 20% 80% / 20% 80% 50% 50%"],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] left-[20%] w-[55%] h-[55%] bg-slate-800/40 blur-[110px]"
        />

        {/* Blob 4: Soft Indigo */}
        <motion.div
          animate={{
            x: [0, -120, 60, 0],
            y: [0, -60, 120, 0],
            scale: [1, 1.2, 1.1, 1],
            borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 30% 60% 40% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%"],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] bg-indigo-900/25 blur-[90px]"
        />
      </motion.div>

      {/* Grainy Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay noise-bg"></div>
      
      {/* Subtle Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
    </div>
  );
};

export default AnimatedBackground;

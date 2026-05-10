import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  pinX: number | null;
  pinY: number | null;
}

interface Constraint {
  p1: Point;
  p2: Point;
  length: number;
  active: boolean;
}

const ClothSim: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, down: false, button: 0, shift: false });
  const [paused, setPaused] = React.useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const settings = {
        width: 60,
        height: 40,
        spacing: 12,
        gravity: 0.25,
        friction: 0.99,
        tearDistance: 60,
        stiffness: 1
    };

    let points: Point[] = [];
    let constraints: Constraint[] = [];

    const init = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        points = [];
        constraints = [];

        const startX = (width - (settings.width - 1) * settings.spacing) / 2;
        const startY = 50;

        for (let y = 0; y < settings.height; y++) {
            for (let x = 0; x < settings.width; x++) {
                const p: Point = {
                    x: startX + x * settings.spacing,
                    y: startY + y * settings.spacing,
                    px: startX + x * settings.spacing,
                    py: startY + y * settings.spacing,
                    vx: 0,
                    vy: 0,
                    pinX: (y === 0) ? startX + x * settings.spacing : null, // Pin entire top row
                    pinY: (y === 0) ? startY + y * settings.spacing : null
                };
                points.push(p);

                if (x > 0) constraints.push({ p1: points[points.length - 2], p2: p, length: settings.spacing, active: true });
                if (y > 0) constraints.push({ p1: points[points.length - settings.width - 1], p2: p, length: settings.spacing, active: true });
            }
        }
    };

    const update = () => {
        if (pausedRef.current) return;
        const mouse = mouseRef.current;
        if (mouse.down) {
            points.forEach(p => {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (mouse.button === 0) {
                    if (dist < 40) {
                        p.px = p.x - (mouse.x - mouse.px) * 1.8;
                        p.py = p.y - (mouse.y - mouse.py) * 1.8;
                        
                        const vdist = Math.sqrt(Math.pow(mouse.x - mouse.px, 2) + Math.pow(mouse.y - mouse.py, 2));
                        if (vdist > 25) {
                            constraints.forEach(c => {
                                if (c.active && (c.p1 === p || c.p2 === p)) c.active = false;
                            });
                        }
                    }
                } else if (mouse.button === 2 || (mouse.down && mouse.shift)) {
                    constraints.forEach(c => {
                        if (c.active) {
                            const cdx = (c.p1.x + c.p2.x) / 2 - mouse.x;
                            const cdy = (c.p1.y + c.p2.y) / 2 - mouse.y;
                            if (Math.sqrt(cdx * cdx + cdy * cdy) < 30) c.active = false;
                        }
                    });
                }
            });
        }

        points.forEach(p => {
            if (p.pinX !== null) return;
            p.vx = (p.x - p.px) * settings.friction;
            p.vy = (p.y - p.py) * settings.friction;
            p.px = p.x;
            p.py = p.y;
            p.x += p.vx;
            p.y += p.vy;
            p.y += settings.gravity;
        });

        for (let i = 0; i < 5; i++) {
            constraints.forEach(c => {
                if (!c.active) return;
                const dx = c.p1.x - c.p2.x;
                const dy = c.p1.y - c.p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > settings.tearDistance) { c.active = false; return; }
                const diff = (c.length - distance) / distance;
                const offset = diff * settings.stiffness * 0.5;
                const ox = dx * offset;
                const oy = dy * offset;
                if (c.p1.pinX === null) { c.p1.x += ox; c.p1.y += oy; }
                if (c.p2.pinX === null) { c.p2.x -= ox; c.p2.y -= oy; }
            });
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        constraints.forEach(c => {
            if (!c.active) return;
            ctx.moveTo(c.p1.x, c.p1.y);
            ctx.lineTo(c.p2.x, c.p2.y);
        });
        ctx.stroke();
    };

    let frameId: number;
    const loop = () => {
        update();
        draw();
        mouseRef.current.px = mouseRef.current.x;
        mouseRef.current.py = mouseRef.current.y;
        frameId = requestAnimationFrame(loop);
    };

    init();
    loop();

    const handleMouseMove = (e: MouseEvent) => {
        const mouse = mouseRef.current;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.shift = e.shiftKey;
    };

    const handleMouseDown = (e: MouseEvent) => {
        const mouse = mouseRef.current;
        mouse.down = true;
        mouse.button = e.button;
        mouse.shift = e.shiftKey;
    };

    const handleMouseUp = () => { mouseRef.current.down = false; };
    const handleContext = (e: MouseEvent) => e.preventDefault();

    const handleTouchMove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const mouse = mouseRef.current;
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
    };

    const handleTouchStart = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const mouse = mouseRef.current;
        mouse.down = true;
        mouse.button = 0;
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        mouse.px = touch.clientX;
        mouse.py = touch.clientY;
    };

    const handleTouchEnd = () => { mouseRef.current.down = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('resize', init);
    
    // Custom reset event
    const handleReset = () => init();
    window.addEventListener('cloth-reset', handleReset);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('contextmenu', handleContext);
        window.removeEventListener('resize', init);
        window.removeEventListener('cloth-reset', handleReset);
    };
  }, []);

  const handleReset = () => {
    window.dispatchEvent(new CustomEvent('cloth-reset'));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center cursor-crosshair"
    >
      <div className="absolute top-6 left-6 flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setPaused(!paused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${
              paused 
                ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(var(--primary),0.4)]' 
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
            }`}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            {paused ? 'Resume' : 'Pause'}
          </button>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-wider"
          >
            <RotateCcw size={14} />
            Reset
          </button>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={24} />
      </button>

      <canvas ref={canvasRef} />
    </motion.div>
  );
};

export default ClothSim;

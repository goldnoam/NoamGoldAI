import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

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
        const startY = 100;

        for (let y = 0; y < settings.height; y++) {
            for (let x = 0; x < settings.width; x++) {
                const p: Point = {
                    x: startX + x * settings.spacing,
                    y: startY + y * settings.spacing,
                    px: startX + x * settings.spacing,
                    py: startY + y * settings.spacing,
                    vx: 0,
                    vy: 0,
                    pinX: (y === 0 && x % 4 === 0) ? startX + x * settings.spacing : null,
                    pinY: (y === 0 && x % 4 === 0) ? startY + y * settings.spacing : null
                };
                points.push(p);

                if (x > 0) constraints.push({ p1: points[points.length - 2], p2: p, length: settings.spacing, active: true });
                if (y > 0) constraints.push({ p1: points[points.length - settings.width - 1], p2: p, length: settings.spacing, active: true });
            }
        }
    };

    const update = () => {
        const mouse = mouseRef.current;
        if (mouse.down) {
            points.forEach(p => {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (mouse.button === 0) {
                    if (dist < 30) {
                        p.px = p.x - (mouse.x - mouse.px);
                        p.py = p.y - (mouse.y - mouse.py);
                        
                        const vdist = Math.sqrt(Math.pow(mouse.x - mouse.px, 2) + Math.pow(mouse.y - mouse.py, 2));
                        if (vdist > 20) {
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
                            if (Math.sqrt(cdx * cdx + cdy * cdy) < 20) c.active = false;
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('resize', init);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('contextmenu', handleContext);
        window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center cursor-crosshair"
    >
      <div className="absolute top-6 left-6 text-white bg-black/60 p-4 rounded-xl border border-white/10 pointer-events-none">
        <h2 className="text-xl font-bold text-primary mb-2">Cloth Lab</h2>
        <p className="text-sm opacity-70">• Drag fast to tear</p>
        <p className="text-sm opacity-70">• Right-click or Shift+Drag to cut</p>
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

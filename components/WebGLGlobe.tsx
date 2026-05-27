import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

interface WebGLGlobeProps {
  className?: string;
  canvasClassName?: string;
}

const WebGLGlobe: React.FC<WebGLGlobeProps> = ({ className = "fixed inset-0", canvasClassName = "w-[800px] h-[800px]" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800 * 2,
      height: 800 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.2, 0.2, 0.2],
      markers: [
        { location: [31.7683, 35.2137], size: 0.05 }, // Jerusalem (Noam's location)
      ],
      onRender: (state: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        state.phi = phi;
        phi += 0.005;
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    return () => globe.destroy();
  }, []);

  return (
    <div className={`flex items-center justify-center pointer-events-none -z-10 opacity-30 ${className}`}>
        <canvas
        ref={canvasRef}
        className={canvasClassName}
        style={{ maxWidth: '100%', aspectRatio: '1' }}
        />
    </div>
  );
};

export default WebGLGlobe;

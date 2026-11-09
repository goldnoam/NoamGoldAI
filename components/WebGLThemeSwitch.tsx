import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface WebGLThemeSwitchProps {
  theme: 'dark' | 'light' | 'colorful';
  onToggle: () => void;
  className?: string;
}

const WebGLThemeSwitch: React.FC<WebGLThemeSwitchProps> = ({ theme, onToggle, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = 110;
    const height = 48;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group holding the celestial system
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);

    // Procedural procedural sun & moon textures
    const createSunTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Solar gradient
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
      grad.addColorStop(0, '#fffbeb');
      grad.addColorStop(0.25, '#fbbf24');
      grad.addColorStop(0.65, '#f59e0b');
      grad.addColorStop(0.9, '#d97706');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Solar flare spots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 10 + Math.random() * 40;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const createMoonTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Lunar surface gradient
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
      grad.addColorStop(0, '#f1f5f9');
      grad.addColorStop(0.4, '#cbd5e1');
      grad.addColorStop(0.8, '#64748b');
      grad.addColorStop(1, '#334155');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Craters
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 4 + Math.random() * 24;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Crater highlight rim
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    // Sun Sphere (Light Theme side)
    const sunGeom = new THREE.SphereGeometry(0.85, 32, 32);
    const sunTex = createSunTexture();
    const sunMat = new THREE.MeshStandardMaterial({
      map: sunTex,
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.1,
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunMesh.position.x = 1.1;
    celestialGroup.add(sunMesh);

    // Sun Corona / Rays Ring
    const sunRingGeom = new THREE.RingGeometry(0.95, 1.25, 32);
    const sunRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const sunRing = new THREE.Mesh(sunRingGeom, sunRingMat);
    sunMesh.add(sunRing);

    // Moon Sphere (Dark Theme side)
    const moonGeom = new THREE.SphereGeometry(0.85, 32, 32);
    const moonTex = createMoonTexture();
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      roughness: 0.7,
      metalness: 0.2,
    });
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonMesh.position.x = -1.1;
    celestialGroup.add(moonMesh);

    // Moon Crescent Shadow Cap (Creates authentic 3D lunar terminator shade)
    const shadeGeom = new THREE.SphereGeometry(0.88, 32, 32, 0, Math.PI, 0, Math.PI);
    const shadeMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.65,
    });
    const shadeMesh = new THREE.Mesh(shadeGeom, shadeMat);
    shadeMesh.rotation.y = 0.4;
    moonMesh.add(shadeMesh);

    // Stars background particles inside the toggle
    const starsCount = 40;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 4;
      starPositions[i + 1] = (Math.random() - 0.5) * 2;
      starPositions[i + 2] = -0.5 + Math.random() * 0.5;
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    scene.add(starPoints);

    // Lighting rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    dirLight.position.set(3, 2, 4);
    scene.add(dirLight);

    // Animation & State
    let targetX = isDark ? -1.1 : 1.1;
    let targetRotY = 0;
    let currentX = targetX;
    let currentRotY = 0;
    let mouseTiltX = 0;
    let mouseTiltY = 0;
    let frameId = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTiltX = x * 0.4;
      mouseTiltY = y * 0.3;
    };

    const onPointerLeave = () => {
      mouseTiltX = 0;
      mouseTiltY = 0;
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseleave', onPointerLeave);

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Smooth damping interpolation
      targetX = isDark ? -1.1 : 1.1;
      currentX = THREE.MathUtils.damp(currentX, targetX, 10, 0.016);
      targetRotY = isDark ? 0 : Math.PI;
      currentRotY = THREE.MathUtils.damp(currentRotY, targetRotY, 8, 0.016);

      // Active rotation & solar flares
      sunMesh.rotation.y += 0.012;
      sunRing.rotation.z += 0.015;
      moonMesh.rotation.y += 0.005;

      // Group orientation according to active theme and mouse tilt
      celestialGroup.rotation.y = THREE.MathUtils.damp(celestialGroup.rotation.y, mouseTiltX, 8, 0.016);
      celestialGroup.rotation.x = THREE.MathUtils.damp(celestialGroup.rotation.x, -mouseTiltY, 8, 0.016);

      // Dynamic shade emphasis: highlight the active celestial body
      if (isDark) {
        moonMesh.scale.setScalar(THREE.MathUtils.damp(moonMesh.scale.x, 1.15, 8, 0.016));
        sunMesh.scale.setScalar(THREE.MathUtils.damp(sunMesh.scale.x, 0.75, 8, 0.016));
        dirLight.position.set(-2, 1, 3);
        dirLight.color.setHex(0x93c5fd);
      } else {
        sunMesh.scale.setScalar(THREE.MathUtils.damp(sunMesh.scale.x, 1.15, 8, 0.016));
        moonMesh.scale.setScalar(THREE.MathUtils.damp(moonMesh.scale.x, 0.75, 8, 0.016));
        dirLight.position.set(2, 1, 3);
        dirLight.color.setHex(0xfff7ed);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseleave', onPointerLeave);
      sunGeom.dispose();
      sunTex.dispose();
      sunMat.dispose();
      sunRingGeom.dispose();
      sunRingMat.dispose();
      moonGeom.dispose();
      moonTex.dispose();
      moonMat.dispose();
      shadeGeom.dispose();
      shadeMat.dispose();
      starGeom.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Switch Theme: currently ${isDark ? 'Dark (Moon Shade)' : 'Bright (Sun Shade)'}. Click to switch.`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative inline-flex items-center gap-1.5 p-1 rounded-full cursor-pointer select-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
        isDark 
          ? 'bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-400/60 shadow-[0_0_15px_-3px_rgba(99,102,241,0.25)]' 
          : 'bg-amber-950/20 border border-amber-500/40 hover:border-amber-400 shadow-[0_0_18px_-3px_rgba(245,158,11,0.35)]'
      } ${className}`}
      title={isDark ? "Switch to Sun Shade (Bright)" : "Switch to Moon Shade (Dark)"}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className="w-[110px] h-[44px] overflow-hidden rounded-full pointer-events-none transition-transform duration-300 group-hover:scale-105" 
      />

      {/* Label Badge */}
      <span className="hidden sm:inline-block pr-3 pl-1 text-[11px] font-black uppercase tracking-wider transition-colors duration-300">
        {isDark ? (
          <span className="text-indigo-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8]" />
            Moon Shade
          </span>
        ) : (
          <span className="text-amber-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
            Sun Shade
          </span>
        )}
      </span>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md glass-dark text-[10px] font-bold tracking-wider uppercase text-white shadow-xl pointer-events-none whitespace-nowrap z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
          WebGL {isDark ? 'Moon Shade → Switch to Sun' : 'Sun Shade → Switch to Moon'}
        </div>
      )}
    </div>
  );
};

export default WebGLThemeSwitch;

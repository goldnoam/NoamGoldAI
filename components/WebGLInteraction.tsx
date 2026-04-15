import React, { useEffect, useRef, useState } from 'react';

const WebGLInteraction: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setIsSupported(false);
      return;
    }

    const glContext = gl as WebGLRenderingContext;

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      // Simple noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse / u_resolution.xy;
        
        // Correct aspect ratio
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;
        mouse.x *= aspect;

        // Create a fluid-like distortion
        vec2 p = st;
        p.x += sin(p.y * 10.0 + u_time * 0.5) * 0.02;
        p.y += cos(p.x * 10.0 + u_time * 0.5) * 0.02;

        float dist = distance(p, mouse);
        
        // Create a soft, liquid glow effect
        float glow = 0.08 / (dist + 0.15);
        glow = pow(glow, 2.0);
        
        // Dynamic color shifting
        vec3 color1 = vec3(0.2, 0.4, 0.8); // Blue
        vec3 color2 = vec3(0.5, 0.2, 0.7); // Purple
        vec3 color = mix(color1, color2, sin(u_time * 0.2) * 0.5 + 0.5);
        
        // Apply glow and subtle base light
        vec3 finalColor = color * glow;
        finalColor += vec3(0.05, 0.08, 0.15) * (1.0 - distance(st, vec2(0.5 * aspect, 0.5)));
        
        gl_FragColor = vec4(finalColor, glow * 0.4);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(glContext, glContext.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(glContext, glContext.FRAGMENT_SHADER, fsSource);

    const program = glContext.createProgram();
    if (!program || !vertexShader || !fragmentShader) return;
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);

    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.error(glContext.getProgramInfoLog(program));
      return;
    }

    const positionAttributeLocation = glContext.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = glContext.getUniformLocation(program, "u_resolution");
    const mouseUniformLocation = glContext.getUniformLocation(program, "u_mouse");
    const timeUniformLocation = glContext.getUniformLocation(program, "u_time");

    const positionBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      glContext.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: canvas.height - e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const render = (time: number) => {
      glContext.clearColor(0, 0, 0, 0);
      glContext.clear(glContext.COLOR_BUFFER_BIT);

      glContext.useProgram(program);
      glContext.enableVertexAttribArray(positionAttributeLocation);
      glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
      glContext.vertexAttribPointer(positionAttributeLocation, 2, glContext.FLOAT, false, 0, 0);

      glContext.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      glContext.uniform2f(mouseUniformLocation, mouseRef.current.x, mouseRef.current.y);
      glContext.uniform1f(timeUniformLocation, time * 0.001);

      glContext.drawArrays(glContext.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isSupported) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default WebGLInteraction;

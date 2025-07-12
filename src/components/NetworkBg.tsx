import React, { useRef, useEffect } from "react";

const DOTS = 80;
const LINE_DIST = 120;
const DOT_COLOR = "rgba(62,198,224,0.7)";
const LINE_COLOR = "rgba(255,255,255,0.13)";
const BG_COLOR = "transparent";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NetworkBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize dots
    if (dotsRef.current.length === 0) {
      for (let i = 0; i < DOTS; i++) {
        dotsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Draw lines
      for (let i = 0; i < DOTS; i++) {
        for (let j = i + 1; j < DOTS; j++) {
          const a = dotsRef.current[i];
          const b = dotsRef.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINE_DIST) {
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 1.1 - dist / LINE_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (let i = 0; i < DOTS; i++) {
        const dot = dotsRef.current[i];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = DOT_COLOR;
        ctx.shadowColor = DOT_COLOR;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const update = () => {
      for (let i = 0; i < DOTS; i++) {
        const dot = dotsRef.current[i];
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      }
    };

    const animate = () => {
      update();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      dotsRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default NetworkBg;

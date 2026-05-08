import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const CHARS = '~`!@#$%^&*()-_=+[]{}|;:,.<>?/0123456789ABCDEFabcdef'.split('');
const FONT = "'JetBrains Mono', monospace";
const FONT_SIZE = 14;
const TRAIL = 0.1;
const SPAWN_RATE = 0.4;

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  active: boolean;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame = 0;
    let tick = 0;
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: Drop[] = [];

    function initDrops() {
      drops = [];
      const rows = Math.floor(h / FONT_SIZE);
      for (let i = 0; i < cols; i++) {
        drops.push({
          x: i,
          y: Math.random() * rows,
          speed: 0.4 + Math.random() * 1.2,
          length: 4 + Math.floor(Math.random() * 10),
          active: Math.random() > SPAWN_RATE,
        });
      }
    }

    function reinit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const newW = Math.round(rect.width || window.innerWidth);
      const newH = Math.round(rect.height || window.innerHeight);

      const firstTime = w === 0 && h === 0;
      const unchanged = Math.abs(w - newW) < 2 && Math.abs(h - newH) < 2;
      if (unchanged && !firstTime) return;

      w = newW;
      h = newH;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.floor(w / FONT_SIZE));
      initDrops();
    }

    reinit();
    const ro = new ResizeObserver(reinit);
    ro.observe(canvas);

    function draw() {
      ctx.fillStyle = `rgba(10,10,10,${TRAIL})`;
      ctx.fillRect(0, 0, w, h);
      tick++;
      ctx.font = `${FONT_SIZE}px ${FONT}`;

      for (const d of drops) {
        if (!d.active) {
          if (tick % 60 === 0 && Math.random() > 0.97) d.active = true;
          continue;
        }
        for (let j = 0; j < d.length; j++) {
          const a = Math.max(0, 1 - j / d.length);
          ctx.fillStyle = j === 0 ? '#fff' : `rgba(74,246,38,${a})`;
          ctx.fillText(randomChar(), d.x * FONT_SIZE, (d.y - j) * FONT_SIZE);
        }
        d.y += d.speed;
        if (d.y * FONT_SIZE > h + d.length * FONT_SIZE) {
          d.y = -d.length;
          d.speed = 0.4 + Math.random() * 1.2;
          d.length = 4 + Math.floor(Math.random() * 10);
          d.active = Math.random() > SPAWN_RATE;
        }
      }

      animFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      ro.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
}

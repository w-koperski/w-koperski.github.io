import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface MousePosition {
  x: number;
  y: number;
}

export interface UseMouseFollowOptions {
  sensitivity?: number;
}

export function useMouseFollow(
  options?: UseMouseFollowOptions
): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const { sensitivity = 1.0 } = options ?? {};

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * sensitivity;
        const y = (e.clientY / window.innerHeight - 0.5) * sensitivity;
        setPosition({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sensitivity, prefersReducedMotion]);

  return prefersReducedMotion ? { x: 0, y: 0 } : position;
}

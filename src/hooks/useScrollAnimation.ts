import { useEffect, useRef, type MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface UseScrollAnimationOptions {
  y?: number;
  duration?: number;
}

export function useScrollAnimation(
  options?: UseScrollAnimationOptions
): MutableRefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return;

    const { y = 30, duration = 0.6 } = options ?? {};
    const tween = gsap.from(ref.current, {
      opacity: 0,
      y,
      duration,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReducedMotion, options?.y, options?.duration]);

  return ref;
}

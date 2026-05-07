import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
}

export interface ParallaxScrollOptions {
  speed?: number;
}

export interface StaggerRevealOptions {
  stagger?: number;
  duration?: number;
  y?: number;
}

/**
 * Fade in element from below as it enters viewport
 */
export function scrollReveal(
  element: HTMLElement,
  options?: ScrollRevealOptions
) {
  const { y = 30, duration = 0.6, delay = 0 } = options ?? {};
  return gsap.from(element, {
    opacity: 0,
    y,
    duration,
    delay,
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
    },
  });
}

/**
 * Parallax scroll effect - element moves at fraction of scroll speed
 */
export function parallaxScroll(
  element: HTMLElement,
  speed: number = 0.3
) {
  return gsap.to(element, {
    y: () => -window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });
}

/**
 * Stagger reveal multiple elements with fade and slide
 */
export function staggerReveal(
  elements: HTMLElement[],
  options?: StaggerRevealOptions
) {
  const { stagger = 0.1, duration = 0.6, y = 20 } = options ?? {};
  return gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    stagger,
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 85%',
    },
  });
}

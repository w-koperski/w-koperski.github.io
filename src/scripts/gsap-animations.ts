import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAnimations() {
  if (REDUCED_MOTION) return;

  // ── Hero section: fade in text elements ──
  const heroTimeline = gsap.timeline({ delay: 0.5 });
  heroTimeline
    .from('.hero__prompt', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero__name', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
    .from('.hero__cursor', { opacity: 0, duration: 0.4 }, '-=0.2');

  // ── Intro section: text + CTA scroll-triggered ──
  heroTimeline
    .from('.intro__text', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.intro',
        start: 'top 80%',
      },
    }, '-=0.2')
    .from('.intro__cta', {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      scrollTrigger: {
        trigger: '.intro',
        start: 'top 70%',
      },
    }, '-=0.2');

  // ── About page: neofetch card slides in ──
  gsap.from('.neofetch__card', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.neofetch__card',
      start: 'top 80%',
    },
  });

  // ── About page: bio text fade ──
  gsap.from('.neofetch__bio', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.neofetch__bio',
      start: 'top 85%',
    },
  });

  // ── Projects page: project cards stagger reveal ──
  gsap.from('.project-card', {
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.5,
    scrollTrigger: {
      trigger: '.projects-page__grid',
      start: 'top 80%',
    },
  });

  // ── Projects page: category headers slide from left ──
  gsap.from('.category-header', {
    opacity: 0,
    x: -30,
    stagger: 0.2,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.projects-page',
      start: 'top 70%',
    },
  });

  // ── Skills page: progress bars animate from 0 to target width ──
  gsap.utils.toArray<HTMLElement>('.skills-tree__bar-fill').forEach((bar) => {
    const targetWidth = bar.style.width || '0%';
    bar.style.width = '0%';
    gsap.to(bar, {
      width: targetWidth,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bar,
        start: 'top 85%',
      },
    });
  });

  // ── Skills page: card fade-in ──
  gsap.from('.skills-tree__card', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.skills-tree__card',
      start: 'top 80%',
    },
  });

  // ── Contact page: terminal card fade-in ──
  gsap.from('.contact__card', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 80%',
    },
  });

  // ── Section titles: generic fade-in ──
  gsap.utils.toArray<HTMLElement>(
    '.projects-page__title, .skills-tree__prompt, .contact__prompt'
  ).forEach((title) => {
    gsap.from(title, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
      },
    });
  });
}

// Auto-init on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initAnimations);

  // Refresh ScrollTrigger positions after preloader completes
  document.addEventListener('preloader:complete', () => {
    ScrollTrigger.refresh();
  });
}

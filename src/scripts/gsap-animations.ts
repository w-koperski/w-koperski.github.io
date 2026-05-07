import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAnimations() {
  if (REDUCED_MOTION) return;

  // Kill all existing ScrollTriggers to prevent duplicates on revisit
  ScrollTrigger.getAll().forEach((st) => st.kill());

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // ── Hero section: fade in text elements ──
  const heroTimeline = gsap.timeline({ delay: 0.5 });
  heroTimeline
    .from('.hero__prompt', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero__name', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
    .from('.hero__cursor', { opacity: 0, duration: 0.4 }, '-=0.2');

  // ── Intro section: text + CTA scroll-triggered (mobile-aware) ──
  heroTimeline
    .from('.intro__text', {
      opacity: 0,
      y: isMobile ? 15 : 30,
      duration: 0.7,
      scrollTrigger: {
        trigger: '.intro',
        start: 'top 85%',
      },
    }, '-=0.2')
    .from('.intro__cta', {
      opacity: 0,
      scale: isMobile ? 1 : 0.95,
      y: isMobile ? 10 : 20,
      duration: 0.5,
      delay: 0.15,
      scrollTrigger: {
        trigger: '.intro',
        start: 'top 80%',
      },
    }, '-=0.2');

  // ── About page: neofetch card slides in ──
  if (document.querySelector('.neofetch__card')) {
    gsap.from('.neofetch__card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.neofetch__card',
        start: 'top 80%',
      },
    });
  }

  // ── About page: bio text fade ──
  if (document.querySelector('.neofetch__bio')) {
    gsap.from('.neofetch__bio', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.neofetch__bio',
        start: 'top 85%',
      },
    });
  }

  // ── Projects page: project cards stagger reveal ──
  if (document.querySelector('.project-card')) {
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
  }

  // ── Projects page: category headers slide from left ──
  if (document.querySelector('.category-header')) {
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
  }

  // ── Skills page: progress bars animate from 0 to target width ──
  const barFills = gsap.utils.toArray<HTMLElement>('.skills-tree__bar-fill');
  if (barFills.length > 0) {
    barFills.forEach((bar) => {
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
  }

  // ── Skills page: card fade-in ──
  if (document.querySelector('.skills-tree__card')) {
    gsap.from('.skills-tree__card', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.skills-tree__card',
        start: 'top 80%',
      },
    });
  }

  // ── Contact page: terminal card fade-in ──
  if (document.querySelector('.contact__card')) {
    gsap.from('.contact__card', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
      },
    });
  }

  // ── Section titles: generic fade-in ──
  const sectionTitles = gsap.utils.toArray<HTMLElement>(
    '.projects-page__title, .skills-tree__prompt, .contact__prompt'
  );
  if (sectionTitles.length > 0) {
    sectionTitles.forEach((title) => {
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

  // ── Home page: parallax on 3D canvas (desktop only) ──
  if (!isMobile) {
    gsap.to('.hero__canvas', {
      y: () => window.scrollY * 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }

  // ── Mouse-following parallax (desktop only, respects reduced-motion) ──
  if (!isMobile && !REDUCED_MOTION) {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const heroCanvas = document.querySelector('.hero__canvas') as HTMLElement | null;
    const introCta = document.querySelector('.intro__cta') as HTMLElement | null;

    if (heroCanvas) {
      const canvas = heroCanvas;
      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5);
        mouseY = (e.clientY / window.innerHeight - 0.5);
      });

      function animateMouseFollow() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        const rotX = targetY * -10;
        const rotY = targetX * 10;

        canvas.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        requestAnimationFrame(animateMouseFollow);
      }
      animateMouseFollow();
    }

    if (introCta) {
      introCta.addEventListener('mousemove', (e) => {
        const rect = introCta.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        introCta.style.transform = `perspective(300px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
      });
      introCta.addEventListener('mouseleave', () => {
        introCta.style.transform = '';
      });
    }
  }
}

// Refresh ScrollTrigger positions after preloader completes
if (typeof document !== 'undefined') {
  document.addEventListener('preloader:complete', () => {
    ScrollTrigger.refresh();
  });
}

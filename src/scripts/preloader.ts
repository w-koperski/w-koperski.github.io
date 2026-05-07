/**
 * Preloader - Terminal Boot Sequence Animation
 *
 * Full-screen overlay with typewriter boot sequence.
 * Always shows on page load (not cached by sessionStorage).
 */

export interface PreloaderConfig {
  /** Maximum duration in ms before auto-skip (default: 4000) */
  maxDuration?: number;
  /** Delay between lines in ms (default: 500) */
  lineDelay?: number;
  /** Delay between characters in ms (default: 30) */
  charDelay?: number;
  /** Fade out duration in ms (default: 300) */
  fadeOutDuration?: number;
}

const DEFAULT_CONFIG: Required<PreloaderConfig> = {
  maxDuration: 4000,
  lineDelay: 500,
  charDelay: 30,
  fadeOutDuration: 300,
};

const BOOT_LINES = [
  'BIOS v2.4.1... OK',
  'Loading kernel... OK',
  'Mounting /portfolio... OK',
  'Starting 3D renderer... OK',
  'Welcome, visitor!',
];

const CUSTOM_EVENT = 'preloader:complete';

class PreloaderController {
  private config: Required<PreloaderConfig>;
  private preloaderEl: HTMLElement | null = null;
  private linesContainer: HTMLElement | null = null;
  private skipButton: HTMLElement | null = null;
  private timeoutId: number | null = null;
  private isComplete = false;
  private reducedMotion = false;

  constructor(config: PreloaderConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Initialize and run the preloader */
  init(): void {
    this.isComplete = false;
    this.preloaderEl = document.getElementById('preloader');
    this.linesContainer = document.getElementById('preloader-lines');
    this.skipButton = document.getElementById('preloader-skip');

    if (!this.preloaderEl || !this.linesContainer) {
      console.warn('Preloader elements not found');
      this.complete();
      return;
    }

    // Reset state
    this.preloaderEl.style.display = '';
    this.preloaderEl.style.opacity = '1';
    this.linesContainer.innerHTML = '';

    // Bind skip button
    if (this.skipButton) {
      this.skipButton.addEventListener('click', () => this.skip());
    }

    // Reduced motion: show instantly, then hide
    if (this.reducedMotion) {
      this.showAllLinesInstant();
      setTimeout(() => this.complete(), this.config.lineDelay);
      return;
    }

    // Set max duration timeout
    this.timeoutId = window.setTimeout(() => {
      if (!this.isComplete) {
        this.skip();
      }
    }, this.config.maxDuration);

    // Start animation
    this.animateLines();
  }

  /** Show all lines instantly (for reduced motion) */
  private showAllLinesInstant(): void {
    if (!this.linesContainer) return;

    BOOT_LINES.forEach((line) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'preloader__line terminal-text';
      lineEl.textContent = line;
      this.linesContainer!.appendChild(lineEl);
    });
  }

  /** Animate lines with typewriter effect */
  private async animateLines(): Promise<void> {
    for (let i = 0; i < BOOT_LINES.length; i++) {
      if (this.isComplete) break;

      await this.typeLine(BOOT_LINES[i], i);

      if (i < BOOT_LINES.length - 1) {
        await this.delay(this.config.lineDelay);
      }
    }

    if (!this.isComplete) {
      this.complete();
    }
  }

  /** Type a single line character by character */
  private async typeLine(text: string, index: number): Promise<void> {
    if (!this.linesContainer) return;

    const lineEl = document.createElement('div');
    lineEl.className = 'preloader__line terminal-text';
    this.linesContainer.appendChild(lineEl);

    // Stagger line appearance
    const staggerDelay = index * 100;
    await this.delay(staggerDelay);

    // Type each character
    for (let i = 0; i < text.length; i++) {
      if (this.isComplete) break;

      lineEl.textContent += text[i];
      await this.delay(this.config.charDelay);
    }
  }

  /** Skip animation and complete */
  private skip(): void {
    if (this.isComplete) return;
    this.complete();
  }

  /** Complete preloader with fade out */
  private complete(): void {
    if (this.isComplete) return;
    this.isComplete = true;

    // Clear timeout
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Fade out
    if (this.preloaderEl) {
      if (this.reducedMotion) {
        this.hideInstant();
      } else {
        this.preloaderEl.style.transition = `opacity ${this.config.fadeOutDuration}ms ease-out`;
        this.preloaderEl.style.opacity = '0';

        setTimeout(() => {
          this.hideInstant();
        }, this.config.fadeOutDuration);
      }
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent(CUSTOM_EVENT));
  }

  /** Hide instantly without animation */
  private hideInstant(): void {
    if (this.preloaderEl) {
      this.preloaderEl.style.display = 'none';
    }
    document.dispatchEvent(new CustomEvent(CUSTOM_EVENT));
  }

  /** Promise-based delay */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Auto-initialize when DOM is ready
export function initPreloader(config?: PreloaderConfig): PreloaderController {
  const controller = new PreloaderController(config);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => controller.init());
  } else {
    controller.init();
  }

  return controller;
}

export { PreloaderController };

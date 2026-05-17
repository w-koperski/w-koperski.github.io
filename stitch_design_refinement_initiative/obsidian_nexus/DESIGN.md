---
name: Obsidian Nexus
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#b7c8e1'
  on-tertiary: '#213145'
  tertiary-container: '#94a4bd'
  on-tertiary-container: '#2a3a4f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
  surface-elevated: '#1E293B'
  glow-emerald: rgba(16, 185, 129, 0.15)
  terminal-header: '#0F172A'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 128px
---

## Brand & Style

The design system evolves the "hacker" roots into a sophisticated, high-end developer aesthetic. It targets a professional audience of engineering leaders and tech-forward recruiters, evoking an emotional response of precision, technical mastery, and reliability.

The chosen style is **Modern Corporate with Glassmorphic Accents**. It balances a rigorous, structured layout with subtle depth effects that suggest high-performance software. By replacing the harsh "Matrix-green" with a refined emerald and utilizing deep charcoal surfaces, the system signals seniority and architectural thinking rather than just hobbyist coding.

## Colors

The palette transition moves from pure black to a layered "Obsidian" depth. The primary accent is a refined Emerald, providing high contrast without the eye-strain of neon.

- **Primary (#10B981):** Used for interactive states, key call-to-actions, and "active code" indicators.
- **Neutral (#020617):** The deep foundation for all pages, providing a true-black backdrop that makes secondary surfaces pop.
- **Secondary (#0F172A):** Used for card backgrounds and container surfaces to create perceived depth.
- **Tertiary (#64748B):** Reserved for meta-data, disabled states, and secondary text to maintain a clear visual hierarchy.

## Typography

The typography strategy uses a trio of typefaces to delineate purpose. **Hanken Grotesk** delivers a sharp, modern feel for high-level headings. **Inter** provides maximum legibility for long-form project descriptions. **JetBrains Mono** is used sparingly for labels, buttons, and technical data, maintaining a semantic link to the developer persona.

For mobile, headlines scale down to prevent excessive line breaks, while body text remains consistent at 16px to ensure accessibility.

## Layout & Spacing

This design system employs a **Fixed Grid** on desktop (12 columns) and a **Fluid Grid** on mobile. The spacing rhythm is based on an 8px base unit.

Generous vertical "Section Gaps" (128px) are used to separate major portfolio pieces, allowing the work to breathe. Content is centered in a 1200px container to maintain focus on ultra-wide displays. Alignment should follow a strict left-ragged edge to mirror the appearance of a clean code editor.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Subtle Glassmorphism**. Instead of traditional drop shadows, depth is communicated by shifting background lightness:

1. **Level 0 (Base):** #020617 (Pure dark).
2. **Level 1 (Cards):** #0F172A with a 1px solid border (#1E293B).
3. **Level 2 (Overlays):** Semi-transparent #1E293B with a 12px backdrop-blur.

Interactive elements should feature a "Glow" effect—a soft, low-opacity emerald outer glow (5-10px blur) triggered on hover to simulate the original terminal's luminescence in a modern way.

## Shapes

The shape language is **Soft**, utilizing a consistent 4px (0.25rem) radius for most UI elements. This provides a professional, architectural feel that is more "engineered" than the playful roundness of consumer apps.

- **Buttons:** 4px radius.
- **Project Cards:** 8px (Large) radius for a slightly softer container feel.
- **Code Snippets:** Sharp corners (0px) to differentiate technical blocks from the surrounding UI.

## Components

### Buttons
Primary buttons use the Emerald background with black text for maximum contrast. Secondary buttons are "Ghost" style—1px border in Emerald with transparent centers. All buttons feature a subtle inner-glow transition on hover.

### Cards
Portfolio cards utilize the "Level 1" surface. They should include a subtle gradient header that mimics a terminal title bar (dark charcoal background with three minimal window controls in the corner).

### Inputs & CLI
Input fields should mimic a command line interface. They have no background—only a bottom border in Slate (#334155) that turns Emerald on focus. A blinking block cursor should be used as the focus indicator.

### Chips/Tags
Used for tech stacks (e.g., "Python", "React"). These are styled as "Outline Chips" using JetBrains Mono at the `label-caps` size.

### Progress Bars (ML Models)
Use thin, 4px tall bars with an Emerald fill and a Slate track. These should animate on scroll to show model accuracy or project completion stages.
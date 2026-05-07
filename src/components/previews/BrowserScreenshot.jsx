import { useState, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const DOT_COLORS = {
  red: '#ff5f56',
  yellow: '#ffbd2e',
  green: '#27c93f',
};

const DOT_INACTIVE = '#333';
const DOT_ACTIVE = '#4AF626';

export default function BrowserScreenshot({ screenshots = [], liveUrl, title = '' }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const hasScreenshots = screenshots.length > 0;
  const hasMultiple = screenshots.length > 1;
  const currentSrc = hasScreenshots ? screenshots[activeIndex] : null;

  const handleDotClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const displayUrl = liveUrl
    ? liveUrl.replace(/^https?:\/\//, '')
    : `${title.toLowerCase().replace(/\s+/g, '-')}.app`;

  const styles = {
    wrapper: {
      width: '100%',
      fontFamily: 'var(--font-mono)',
    },
    frame: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'rgba(20, 20, 20, 0.95)',
      border: '1px solid rgba(74, 246, 38, 0.15)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
    },
    titleBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(30, 30, 30, 0.9)',
    },
    dots: {
      display: 'flex',
      gap: '6px',
      flexShrink: 0,
    },
    dot: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: color,
    }),
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 12px',
      borderRadius: '6px 6px 0 0',
      background: 'rgba(20, 20, 20, 0.95)',
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-muted)',
      maxWidth: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    tabIcon: {
      width: '12px',
      height: '12px',
      opacity: 0.5,
      flexShrink: 0,
    },
    addressBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(0, 0, 0, 0.3)',
    },
    navButton: {
      background: 'none',
      border: 'none',
      padding: '2px',
      cursor: 'default',
      color: 'rgba(255, 255, 255, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    lockIcon: {
      flexShrink: 0,
      color: 'var(--color-terminal-green)',
      opacity: 0.7,
      display: 'flex',
      alignItems: 'center',
    },
    urlDisplay: {
      flex: 1,
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '4px',
      padding: '4px 10px',
      fontSize: 'var(--text-xs)',
      fontFamily: 'var(--font-mono)',
      color: 'var(--color-text-muted)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      border: '1px solid rgba(255, 255, 255, 0.04)',
    },
    refreshButton: {
      background: 'none',
      border: 'none',
      padding: '2px',
      cursor: 'default',
      color: 'rgba(255, 255, 255, 0.25)',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    content: {
      position: 'relative',
      aspectRatio: '16 / 9',
      background: 'var(--color-bg)',
      overflow: 'hidden',
    },
    screenshot: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      color: 'var(--color-accent-dim)',
      background:
        'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(74, 246, 38, 0.03) 10px, rgba(74, 246, 38, 0.03) 11px)',
    },
    cursorIcon: {
      opacity: 0.4,
    },
    placeholderText: {
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-mono)',
      opacity: 0.5,
    },
    gallery: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 0',
    },
    galleryDot: (isActive) => ({
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: isActive ? DOT_ACTIVE : DOT_INACTIVE,
      border: 'none',
      padding: 0,
      cursor: isActive ? 'default' : 'pointer',
      transition: prefersReducedMotion ? 'none' : 'background 0.2s ease',
      outline: 'none',
    }),
    liveButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '12px',
      padding: '8px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-terminal-green)',
      background: 'transparent',
      border: '1px dashed var(--color-terminal-green)',
      borderRadius: 'var(--radius-sm)',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'background 0.2s ease, box-shadow 0.2s ease',
    },
    arrowIcon: {
      width: '14px',
      height: '14px',
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.frame}>
      <div style={styles.titleBar}>
          <div style={styles.dots}>
            <span style={styles.dot(DOT_COLORS.red)} />
            <span style={styles.dot(DOT_COLORS.yellow)} />
            <span style={styles.dot(DOT_COLORS.green)} />
          </div>
          <div style={styles.tab}>
            <svg style={styles.tabIcon} viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="6" opacity="0.4" />
            </svg>
            {title}
          </div>
        </div>

      <div style={styles.addressBar}>
          <span style={styles.navButton}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
          <span style={styles.navButton}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
          <span style={styles.lockIcon}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <div style={styles.urlDisplay}>{displayUrl}</div>
          <span style={styles.refreshButton}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </span>
        </div>

      <div style={styles.content}>
          {hasScreenshots ? (
            <img
              src={currentSrc}
              alt={`${title} screenshot ${activeIndex + 1}`}
              style={styles.screenshot}
              loading="lazy"
            />
          ) : (
            <div style={styles.placeholder}>
              <svg
                style={styles.cursorIcon}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              <span style={styles.placeholderText}>no screenshots available</span>
            </div>
          )}
        </div>
      </div>

      {hasMultiple && (
        <div style={styles.gallery} role="tablist" aria-label="Screenshot gallery">
          {screenshots.map((_, index) => (
            <button
              key={index}
              style={styles.galleryDot(index === activeIndex)}
              onClick={() => handleDotClick(index)}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Screenshot ${index + 1} of ${screenshots.length}`}
            />
          ))}
        </div>
      )}

      {liveUrl && (
        <a
          href={liveUrl}
          style={styles.liveButton}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${title} live site`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(74, 246, 38, 0.08)';
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Visit Live Site
          <svg
            style={styles.arrowIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </div>
  );
}

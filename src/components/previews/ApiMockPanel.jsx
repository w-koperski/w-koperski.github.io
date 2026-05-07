import { useState, useEffect, useCallback, useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const METHOD_COLORS = {
  GET:    { bg: '#0d4429', text: '#4AF626', border: '#4AF626' },
  POST:   { bg: '#3d3000', text: '#ffbd2e', border: '#ffbd2e' },
  PUT:    { bg: '#0a1f40', text: '#60a5fa', border: '#60a5fa' },
  DELETE: { bg: '#400a0a', text: '#ff5f56', border: '#ff5f56' },
};

const JSON_SYNTAX = {
  key: { color: '#60a5fa' },
  str: { color: '#4AF626' },
  num: { color: '#ffbd2e' },
};

function highlightJson(jsonStr) {
  if (!jsonStr) return '';
  try {
    const parsed = JSON.parse(jsonStr);
    const formatted = JSON.stringify(parsed, null, 2);
    return formatted.replace(
      /("(?:\\.|[^"\\])*")\s*:/g,
      '<span class="json-key">$1</span>:'
    ).replace(
      /:\s*("(?:\\.|[^"\\])*")/g,
      ': <span class="json-str">$1</span>'
    ).replace(
      /:\s*(-?\d+\.?\d*)/g,
      ': <span class="json-num">$1</span>'
    );
  } catch {
    return jsonStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

export default function ApiMockPanel({ endpoints, lang = 'pl' }) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sending, setSending] = useState(false);
  const [showResponse, setShowResponse] = useState(true);

  useEffect(() => {
    setSelectedIdx(0);
    setShowResponse(true);
  }, [endpoints]);

  const selected = endpoints?.[selectedIdx];
  const methodColor = selected ? METHOD_COLORS[selected.method] ?? METHOD_COLORS.GET : METHOD_COLORS.GET;

  const highlightedRequest = useMemo(
    () => selected ? highlightJson(selected.requestExample) : '',
    [selected]
  );
  const highlightedResponse = useMemo(
    () => selected ? highlightJson(selected.responseExample) : '',
    [selected]
  );

  const handleSend = useCallback(() => {
    setSending(true);
    setShowResponse(false);
    const delay = prefersReducedMotion ? 0 : 500;
    setTimeout(() => {
      setSending(false);
      setShowResponse(true);
    }, delay);
  }, [prefersReducedMotion]);

  if (!endpoints || endpoints.length === 0) return null;

  return (
    <div style={styles.outer}>
      <style>{css}{mobileCss}</style>

      {/* Title bar */}
      <div style={styles.titlebar}>
        <span style={{ ...styles.dot, background: '#ff5f56' }} />
        <span style={{ ...styles.dot, background: '#ffbd2e' }} />
        <span style={{ ...styles.dot, background: '#27c93f' }} />
        <span style={styles.title}>api-panel — rest</span>
      </div>

      <div style={styles.body} data-api-panel-body>
        {/* Left panel — endpoint list */}
        <div style={styles.leftPanel} data-api-panel-left>
          <div style={styles.panelLabel}>Endpoints</div>
          {endpoints.map((ep, i) => {
            const mc = METHOD_COLORS[ep.method] ?? METHOD_COLORS.GET;
            const isActive = i === selectedIdx;
            return (
              <button
                key={`${ep.method}-${ep.path}-${i}`}
                onClick={() => { setSelectedIdx(i); setShowResponse(true); }}
                style={{
                  ...styles.endpointBtn,
                  borderLeftColor: isActive ? mc.border : 'transparent',
                  background: isActive ? 'rgba(74, 246, 38, 0.05)' : 'transparent',
                }}
              >
                <span style={{
                  ...styles.methodBadge,
                  background: mc.bg,
                  color: mc.text,
                  border: `1px solid ${mc.border}`,
                }}>
                  {ep.method}
                </span>
                <span style={styles.endpointPath}>{ep.path}</span>
                <span style={styles.endpointDesc}>{ep.description[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* Right panel — detail */}
        <div style={styles.rightPanel}>
          {selected && (
            <>
              {/* Header */}
              <div style={styles.detailHeader}>
                <span style={{
                  ...styles.methodBadge,
                  ...styles.methodBadgeLarge,
                  background: methodColor.bg,
                  color: methodColor.text,
                  border: `1px solid ${methodColor.border}`,
                }}>
                  {selected.method}
                </span>
                <span style={styles.detailPath}>{selected.path}</span>
              </div>

              {/* Request */}
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Request</div>
                <pre
                  style={styles.codeBlock}
                  dangerouslySetInnerHTML={{ __html: highlightedRequest }}
                />
              </div>

              {/* Response */}
              <div style={styles.section}>
                <div style={styles.sectionLabelRow}>
                  <span style={styles.sectionLabel}>Response</span>
                  {showResponse && (
                    <span style={styles.statusBadge}>200 OK</span>
                  )}
                </div>

                {showResponse && (
                  <pre
                    style={styles.codeBlock}
                    className="api-response-fadein"
                    dangerouslySetInnerHTML={{ __html: highlightedResponse }}
                  />
                )}

                {sending && (
                  <div style={styles.loadingState}>
                    <span style={styles.spinner} />
                    <span style={styles.loadingText}>Sending...</span>
                  </div>
                )}
              </div>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={sending}
                style={{
                  ...styles.sendBtn,
                  opacity: sending ? 0.5 : 1,
                  cursor: sending ? 'not-allowed' : 'pointer',
                }}
              >
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Inline styles ── */

const styles = {
  outer: {
    fontFamily: "'JetBrains Mono', monospace",
    background: 'rgba(10, 10, 10, 0.95)',
    border: '1px dashed rgba(74, 246, 38, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    color: 'rgba(74, 246, 38, 0.9)',
    fontSize: 12,
  },

  titlebar: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 14px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderBottom: '1px solid rgba(74, 246, 38, 0.2)',
  },
  dot: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  title: {
    marginLeft: 6,
    fontSize: 12,
    color: 'rgba(74, 246, 38, 0.6)',
  },

  body: {
    display: 'flex',
    minHeight: 300,
  },

  leftPanel: {
    width: 240,
    minWidth: 200,
    borderRight: '1px solid rgba(74, 246, 38, 0.15)',
    padding: '8px 0',
    overflowY: 'auto',
  },
  panelLabel: {
    padding: '6px 12px',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(74, 246, 38, 0.4)',
  },

  endpointBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    borderLeft: '3px solid transparent',
    background: 'transparent',
    color: 'rgba(74, 246, 38, 0.9)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: 11,
    transition: 'background 0.15s, border-color 0.15s',
  },
  methodBadge: {
    display: 'inline-block',
    padding: '1px 6px',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 3,
    letterSpacing: 0.5,
    lineHeight: '16px',
  },
  methodBadgeLarge: {
    fontSize: 11,
    padding: '2px 8px',
  },
  endpointPath: {
    marginTop: 3,
    fontSize: 11,
    color: '#E5E7EB',
  },
  endpointDesc: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(74, 246, 38, 0.5)',
    lineHeight: 1.3,
  },

  rightPanel: {
    flex: 1,
    padding: 14,
    overflowY: 'auto',
  },

  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: '1px solid rgba(74, 246, 38, 0.12)',
  },
  detailPath: {
    fontSize: 13,
    color: '#E5E7EB',
    fontWeight: 600,
  },

  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(74, 246, 38, 0.5)',
    marginBottom: 6,
    display: 'block',
  },
  sectionLabelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusBadge: {
    fontSize: 10,
    padding: '1px 6px',
    borderRadius: 3,
    background: '#0d4429',
    color: '#4AF626',
    border: '1px solid #4AF626',
    fontWeight: 700,
  },

  codeBlock: {
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(74, 246, 38, 0.1)',
    borderRadius: 4,
    padding: 10,
    margin: 0,
    fontSize: 12,
    lineHeight: 1.5,
    overflowX: 'auto',
    color: '#9CA3AF',
  },

  sendBtn: {
    display: 'inline-block',
    padding: '6px 16px',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'inherit',
    color: '#0A0A0A',
    background: '#4AF626',
    border: 'none',
    borderRadius: 4,
    transition: 'opacity 0.15s',
  },

  loadingState: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 0',
  },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(74, 246, 38, 0.2)',
    borderTopColor: '#4AF626',
    borderRadius: '50%',
    animation: 'api-spin 0.6s linear infinite',
  },
  loadingText: {
    fontSize: 11,
    color: 'rgba(74, 246, 38, 0.6)',
  },
};

/* ── Scoped CSS for animations + syntax classes + responsive ── */
const css = `
.json-key { color: #60a5fa; }
.json-str { color: #4AF626; }
.json-num { color: #ffbd2e; }

@keyframes api-spin {
  to { transform: rotate(360deg); }
}

.api-response-fadein {
  animation: api-fadein 0.3s ease-out;
}

@keyframes api-fadein {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .api-response-fadein { animation: none; opacity: 1; transform: none; }
  .api-spin { animation: none; }
  [style*="api-spin"] { animation: none; }
}

@media (max-width: 640px) {
  /* Stack vertically on mobile */
}
`;

// Mobile responsive overrides are handled via the <style> tag injected above.
// We add the mobile rule here because inline styles can't use media queries:
const mobileCss = `
@media (max-width: 640px) {
  [data-api-panel-body] {
    flex-direction: column !important;
  }
  [data-api-panel-left] {
    width: 100% !important;
    min-width: unset !important;
    border-right: none !important;
    border-bottom: 1px solid rgba(74, 246, 38, 0.15) !important;
    max-height: 180px;
  }
}
`;

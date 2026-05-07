import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CHART_HEIGHT = 200;
const CHART_PADDING_X = 36;
const CHART_PADDING_Y = 12;
const DRAW_DURATION = '1.5s';
const DRAW_EASING = 'ease-in-out';

function buildPolylinePoints(data, totalEpochs, maxVal) {
  const width = 100; // viewBox width
  const height = CHART_HEIGHT - CHART_PADDING_Y * 2;
  const stepX = totalEpochs > 1 ? (width - CHART_PADDING_X) / (totalEpochs - 1) : 0;
  return data
    .map((val, i) => {
      const x = CHART_PADDING_X + i * stepX;
      const normalized = maxVal > 0 ? val / maxVal : 0;
      const y = CHART_PADDING_Y + height * (1 - normalized);
      return `${x},${y}`;
    })
    .join(' ');
}

function SvgChart({ data, totalEpochs, maxVal, strokeColor, label, yLabels }) {
  const polylineRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (polylineRef.current && !prefersReducedMotion) {
      const len = polylineRef.current.getTotalLength();
      setPathLength(len);
    }
  }, [prefersReducedMotion, data]);

  const points = buildPolylinePoints(data, totalEpochs, maxVal);
  const height = CHART_HEIGHT - CHART_PADDING_Y * 2;

  const gridLines = [0.25, 0.5, 0.75].map((pct) => ({
    y: CHART_PADDING_Y + height * (1 - pct),
    pct,
  }));

  return (
    <div style={{ flex: '1 1 0', minWidth: 0 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: strokeColor,
          marginBottom: '0.375rem',
          textShadow: `0 0 8px ${strokeColor}40`,
        }}
      >
        {label}
      </div>
      <svg
        viewBox={`0 0 100 ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: `${CHART_HEIGHT}px`,
          display: 'block',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '4px',
        }}
      >
        {/* Grid lines */}
        {gridLines.map((gl) => (
          <line
            key={gl.pct}
            x1={CHART_PADDING_X}
            y1={gl.y}
            x2="100"
            y2={gl.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.3"
          />
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => {
          const pct = i / (yLabels.length - 1);
          const y = CHART_PADDING_Y + height * (1 - pct);
          return (
            <text
              key={label}
              x={CHART_PADDING_X - 4}
              y={y + 2}
              textAnchor="end"
              fill="rgba(255,255,255,0.25)"
              fontSize="4"
              fontFamily="var(--font-mono)"
            >
              {label}
            </text>
          );
        })}

        {/* X-axis baseline */}
        <line
          x1={CHART_PADDING_X}
          y1={CHART_PADDING_Y + height}
          x2="100"
          y2={CHART_PADDING_Y + height}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.3"
        />

        {/* Data polyline */}
        <polyline
          ref={polylineRef}
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            prefersReducedMotion
              ? {}
              : pathLength > 0
                ? {
                    strokeDasharray: pathLength,
                    strokeDashoffset: pathLength,
                    transition: `stroke-dashoffset ${DRAW_DURATION} ${DRAW_EASING}`,
                  }
                : { strokeDasharray: 0, strokeDashoffset: 0 }
          }
        />

        {/* Filled area under curve (subtle) */}
        <polygon
          points={`${CHART_PADDING_X},${CHART_PADDING_Y + height} ${points} 100,${CHART_PADDING_Y + height}`}
          fill={`${strokeColor}08`}
        />
      </svg>
    </div>
  );
}

export default function MetricsDashboard({
  epochs,
  accuracyData,
  lossData,
  finalAccuracy,
  samplePredictions,
}) {
  const prefersReducedMotion = useReducedMotion();

  // Normalize accuracy to 0-1 range if values > 1 (i.e., 0-100 scale)
  const normalizedAccuracy =
    accuracyData.length > 0 && Math.max(...accuracyData) > 1
      ? accuracyData.map((v) => v / 100)
      : accuracyData;

  const maxLoss = lossData.length > 0 ? Math.max(...lossData) : 1;
  const maxAccNorm = 1; // always 0-1 for accuracy

  // Trigger animation after mount by forcing a re-render with pathLength set
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion) {
      // Double rAF to ensure the initial strokeDashoffset is painted before transition
      let raf1 = requestAnimationFrame(() => {
        let raf2 = requestAnimationFrame(() => {
          setMounted(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [prefersReducedMotion]);

  // Patch: we need to apply transition only after mount
  // Re-render the charts with transition enabled after mount
  const animationReady = prefersReducedMotion ? true : mounted;

  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        color: 'var(--color-text)',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-lg)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-terminal-green)',
            textShadow: '0 0 10px rgba(74, 246, 38, 0.4)',
          }}
        >
          Training Metrics
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {/* Final accuracy badge */}
          <span
            style={{
              fontSize: 'var(--text-2xl)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#4AF626',
              background: 'rgba(74, 246, 38, 0.15)',
              border: '1px solid #4AF626',
              borderRadius: 'var(--radius-sm)',
              padding: '0.25rem 0.75rem',
              textShadow: '0 0 10px rgba(74, 246, 38, 0.3)',
            }}
          >
            {finalAccuracy}
          </span>

          {/* Epoch count */}
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-muted)',
            }}
          >
            Epochs: {epochs}
          </span>
        </div>
      </div>

      {/* Charts section */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: '1 1 320px',
            minWidth: 0,
          }}
        >
          <MetricsChart
            data={normalizedAccuracy}
            totalEpochs={epochs}
            maxVal={maxAccNorm}
            strokeColor="#4AF626"
            label="Accuracy"
            yLabels={['100%', '75%', '50%', '25%', '0%']}
            animationReady={animationReady}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
        <div
          style={{
            flex: '1 1 320px',
            minWidth: 0,
          }}
        >
          <MetricsChart
            data={lossData}
            totalEpochs={epochs}
            maxVal={maxLoss}
            strokeColor="#ff6b6b"
            label="Loss"
            yLabels={[
              `${maxLoss.toFixed(1)}`,
              `${(maxLoss * 0.75).toFixed(1)}`,
              `${(maxLoss * 0.5).toFixed(1)}`,
              `${(maxLoss * 0.25).toFixed(1)}`,
              '0',
            ]}
            animationReady={animationReady}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      </div>

      {/* Sample predictions table */}
      {samplePredictions && samplePredictions.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-terminal-green)',
              marginBottom: 'var(--space-2)',
              textShadow: '0 0 8px rgba(74, 246, 38, 0.3)',
            }}
          >
            Sample Predictions
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.375rem 0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    fontWeight: 400,
                  }}
                >
                  Input
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '0.375rem 0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    fontWeight: 400,
                  }}
                >
                  Output
                </th>
              </tr>
            </thead>
            <tbody>
              {samplePredictions.map((row, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {row.input}
                  </td>
                  <td
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      color: '#4AF626',
                    }}
                  >
                    {row.output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Internal chart component with animation control via animationReady prop.
 * This separates the SVG polyline + animation logic from the dashboard layout.
 */
function MetricsChart({
  data,
  totalEpochs,
  maxVal,
  strokeColor,
  label,
  yLabels,
  animationReady,
  prefersReducedMotion,
}) {
  const polylineRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (polylineRef.current) {
      const len = polylineRef.current.getTotalLength();
      setPathLength(len);
    }
  }, [data]);

  const points = buildPolylinePoints(data, totalEpochs, maxVal);
  const height = CHART_HEIGHT - CHART_PADDING_Y * 2;

  const gridLines = [0.25, 0.5, 0.75].map((pct) => ({
    y: CHART_PADDING_Y + height * (1 - pct),
    pct,
  }));

  // Determine the stroke-dashoffset: start at pathLength (hidden), animate to 0 (visible)
  const shouldAnimate = !prefersReducedMotion && pathLength > 0;
  const dashOffset = shouldAnimate && animationReady ? 0 : pathLength;

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: strokeColor,
          marginBottom: '0.375rem',
          textShadow: `0 0 8px ${strokeColor}40`,
        }}
      >
        {label}
      </div>
      <svg
        viewBox={`0 0 100 ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: `${CHART_HEIGHT}px`,
          display: 'block',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '4px',
        }}
      >
        {/* Grid lines */}
        {gridLines.map((gl) => (
          <line
            key={gl.pct}
            x1={CHART_PADDING_X}
            y1={gl.y}
            x2="100"
            y2={gl.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.3"
          />
        ))}

        {/* Y-axis labels */}
        {yLabels.map((lbl, i) => {
          const pct = i / (yLabels.length - 1);
          const y = CHART_PADDING_Y + height * (1 - pct);
          return (
            <text
              key={lbl}
              x={CHART_PADDING_X - 4}
              y={y + 2}
              textAnchor="end"
              fill="rgba(255,255,255,0.25)"
              fontSize="4"
              fontFamily="var(--font-mono)"
            >
              {lbl}
            </text>
          );
        })}

        {/* X-axis baseline */}
        <line
          x1={CHART_PADDING_X}
          y1={CHART_PADDING_Y + height}
          x2="100"
          y2={CHART_PADDING_Y + height}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.3"
        />

        {/* Filled area under curve */}
        <polygon
          points={`${CHART_PADDING_X},${CHART_PADDING_Y + height} ${points} 100,${CHART_PADDING_Y + height}`}
          fill={`${strokeColor}08`}
        />

        {/* Data polyline with animation */}
        <polyline
          ref={polylineRef}
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            shouldAnimate
              ? {
                  strokeDasharray: pathLength,
                  strokeDashoffset: dashOffset,
                  transition: `stroke-dashoffset ${DRAW_DURATION} ${DRAW_EASING}`,
                }
              : {}
          }
        />
      </svg>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';

const s = {
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    border: '1px dashed #4AF626',
    boxShadow: '0 0 15px rgba(74, 246, 38, 0.15)',
    fontFamily: 'var(--font-mono)',
    display: 'flex',
    flexDirection: 'column',
  },
  titlebar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottom: '1px solid rgba(74, 246, 38, 0.2)',
    flexShrink: 0,
  },
  dot: {
    display: 'inline-block',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%',
  },
  title: {
    marginLeft: '0.5rem',
    fontSize: '0.875rem',
    color: 'rgba(74, 246, 38, 0.7)',
    fontFamily: 'var(--font-mono)',
  },
  body: {
    padding: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  prompt: {
    margin: 0,
    color: 'rgba(74, 246, 38, 0.7)',
    fontSize: '0.875rem',
    lineHeight: '1.4',
  },
  output: {
    margin: '0.25rem 0 0 0',
    color: '#4AF626',
    fontSize: '0.875rem',
    fontWeight: 500,
    textShadow: '0 0 10px rgba(74, 246, 38, 0.5)',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
  },
  line: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  cursor: {
    display: 'inline-block',
    width: '0.5em',
    backgroundColor: 'var(--color-terminal-green, #4AF626)',
    marginLeft: '2px',
  },
};

export default function TerminalTyping({ commands, lang = 'pl', autoplay = false }) {
  const cmds = commands?.[lang] ?? [];

  const [mode, setMode] = useState('static');
  const [tick, setTick] = useState(0);
  const hasStarted = useRef(false);
  const timerRef = useRef(null);

  // Per command: [typingStart, typingEnd, outputStart, outputEnd]
  // typingEnd = typingStart + textLen
  // outputStart = typingEnd + 5
  // outputEnd = outputStart + 10
  const commandFrames = (() => {
    const offsets = [];
    let global = 0;
    for (const cmd of cmds) {
      const typingStart = global;
      const typingEnd = global + cmd.command.length;
      const outputStart = typingEnd + 5;
      const outputEnd = outputStart + 10;
      offsets.push({ typingStart, typingEnd, outputStart, outputEnd });
      global = outputEnd + 8;
    }
    return { offsets, total: offsets.length > 0 ? global : 0 };
  })();

  const startAnimation = () => {
    if (hasStarted.current || cmds.length === 0 || mode !== 'static') return;
    hasStarted.current = true;
    setMode('typing');
    setTick(0);
  };

  // Auto-start when autoplay is true (project detail page)
  useEffect(() => {
    if (autoplay && !hasStarted.current) {
      startAnimation();
    }
  }, [autoplay]);

  useEffect(() => {
    if (mode !== 'typing') return;
    if (tick >= commandFrames.total) {
      setMode('done');
      return;
    }
    timerRef.current = setTimeout(() => {
      setTick((t) => t + 1);
    }, 50);
    return () => clearTimeout(timerRef.current);
  }, [mode, tick, commandFrames.total]);

  // Compute per-command display state based on global tick (pure function)
  const getCmdState = (idx) => {
    const cmd = cmds[idx];
    if (!cmd) return { visible: false, typed: '', showOutput: false };

    const { typingStart, typingEnd, outputStart } = commandFrames.offsets[idx];

    if (tick < typingStart) {
      return { visible: false, typed: '', showOutput: false };
    }

    if (tick < typingEnd) {
      return {
        visible: true,
        typed: cmd.command.slice(0, tick - typingStart),
        showOutput: false,
      };
    }

    if (tick < outputStart) {
      return {
        visible: true,
        typed: cmd.command,
        showOutput: false,
      };
    }

    return {
      visible: true,
      typed: cmd.command,
      showOutput: true,
    };
  };

  const renderStatic = () =>
    cmds.map((cmd, i) => (
      <div key={`s-${i}`} style={s.line}>
        <p style={s.prompt}>$ {cmd.command}</p>
        <p style={s.output}>{cmd.output}</p>
      </div>
    ));

  const renderTyping = () =>
    cmds.map((cmd, i) => {
      const state = getCmdState(i);
      if (!state.visible) return null;
      return (
        <div key={`a-${i}`} style={s.line}>
          <p style={s.prompt}>
            $ {state.typed}
            {i < cmds.length - 1 && !state.showOutput ? <span style={s.cursor}>&nbsp;</span> : null}
            {i === cmds.length - 1 && mode !== 'done' && !state.showOutput ? <span style={s.cursor}>&nbsp;</span> : null}
          </p>
          {state.showOutput && <p style={s.output}>{cmd.output}</p>}
        </div>
      );
    });

  return (
    <div style={s.wrapper} onMouseEnter={startAnimation}>
      <div style={s.titlebar}>
        <span style={{ ...s.dot, backgroundColor: '#ff5f56' }} />
        <span style={{ ...s.dot, backgroundColor: '#ffbd2e' }} />
        <span style={{ ...s.dot, backgroundColor: '#27c93f' }} />
        <span style={s.title}>portfolio — bash</span>
      </div>
      <div style={s.body}>
        {mode === 'static' && renderStatic()}
        {mode === 'typing' && renderTyping()}
        {mode === 'done' && renderStatic()}
      </div>
    </div>
  );
}

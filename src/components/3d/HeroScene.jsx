import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import CodeParticles from './CodeParticles';

function TerminalMonitor() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Monitor body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[2.7, 1.7]} />
        <meshStandardMaterial
          color="#0A0A0A"
          emissive="#4AF626"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Screen glow */}
      <pointLight
        position={[0, 0, 0.3]}
        color="#4AF626"
        intensity={2}
        distance={5}
      />

      {/* Stand */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.3]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Base */}
      <mesh position={[0, -1.4, 0]}>
        <boxGeometry args={[1, 0.05, 0.6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const camera = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.3;
      const y = (e.clientY / window.innerHeight - 0.5) * -0.2;
      if (camera.current) {
        camera.current.position.x = x;
        camera.current.position.y = y;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}

export default function HeroScene() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById('hero-3d');
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      frameloop={visible ? 'always' : 'demand'}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 'var(--z-3d-canvas, 50)',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} color="#1a1a2e" />
        <TerminalMonitor />
        <CodeParticles />
        <CameraRig />
        <gridHelper
          args={[20, 20, '#4AF626', '#1a1a2e']}
          position={[0, -2, 0]}
        />
      </Suspense>
    </Canvas>
  );
}

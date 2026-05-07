import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect, useState } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function VoxelDeveloper() {
  const groupRef = useRef();
  const headRef = useRef();
  const chestRef = useRef();
  const screenRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Breathing: chest gently moves up/down
    if (chestRef.current) chestRef.current.position.y = Math.sin(t * 0.8) * 0.02;
    // Head turn: subtle left-right rotation
    if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.4) * 0.1;
    // Screen glow pulse
    if (screenRef.current) screenRef.current.emissiveIntensity = 0.15 + Math.sin(t * 1.5) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0.5, -0.5, 0]}>
      {/* Desk — flat dark rectangle */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.0]} />
        <meshStandardMaterial color="#1a1a1a" flatShading />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0.2, -0.5, -0.2]}>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color="#2a2a2a" flatShading />
      </mesh>

      {/* Monitor body */}
      <mesh position={[0.2, -0.1, -0.3]}>
        <boxGeometry args={[1.0, 0.7, 0.06]} />
        <meshStandardMaterial color="#111111" flatShading />
      </mesh>

      {/* Monitor screen (emissive #4AF626) */}
      <mesh position={[0.2, -0.1, -0.27]}>
        <boxGeometry args={[0.88, 0.58, 0.01]} />
        <meshStandardMaterial
          ref={screenRef}
          color="#0A0A0A"
          emissive="#4AF626"
          emissiveIntensity={0.15}
          flatShading
        />
      </mesh>

      {/* Keyboard */}
      <mesh position={[-0.1, -0.74, 0.1]}>
        <boxGeometry args={[0.6, 0.04, 0.22]} />
        <meshStandardMaterial color="#2a2a2a" flatShading />
      </mesh>

      {/* Body/Torso */}
      <mesh ref={chestRef} position={[-0.6, -0.3, 0]}>
        <boxGeometry args={[0.5, 0.65, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" flatShading />
      </mesh>

      {/* Left arm (typing) */}
      <mesh position={[-0.4, -0.52, 0.12]} rotation={[0.3, 0, 0.2]}>
        <boxGeometry args={[0.2, 0.5, 0.18]} />
        <meshStandardMaterial color="#3a3a3a" flatShading />
      </mesh>

      {/* Right arm */}
      <mesh position={[-0.82, -0.52, 0.12]} rotation={[0.3, 0, -0.2]}>
        <boxGeometry args={[0.2, 0.5, 0.18]} />
        <meshStandardMaterial color="#3a3a3a" flatShading />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[-0.6, 0.15, 0]}>
        <boxGeometry args={[0.45, 0.45, 0.38]} />
        <meshStandardMaterial color="#4a4a4a" flatShading />
      </mesh>

      {/* Screen point light (green-tinted from monitor) */}
      <pointLight
        position={[0.2, -0.1, -0.1]}
        color="#4AF626"
        intensity={1.5}
        distance={3}
      />
    </group>
  );
}

export default function PixelAvatarScene() {
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
      camera={{ position: [-0.5, 1.5, 5], fov: 45 }}
      frameloop={visible ? 'always' : 'demand'}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 'var(--z-3d-canvas, 50)',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} color="#1a1a2e" />
        <directionalLight position={[2, 4, 2]} intensity={0.4} color="#ffffff" />
        <VoxelDeveloper />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            intensity={0.8}
          />
        </EffectComposer>
        <gridHelper
          args={[20, 20, '#4AF626', '#1a1a2e']}
          position={[0, -1.2, 0]}
        />
      </Suspense>
    </Canvas>
  );
}

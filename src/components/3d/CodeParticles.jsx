import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function CodeParticles({ count = 60 }) {
  const meshRef = useRef();

  const particles = useMemo(() => {
    const chars = '01{}[]<>/:;=+-*&^%$#@!~';
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 1,
      ],
      char: chars[Math.floor(Math.random() * chars.length)],
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <sprite key={i} position={p.position} scale={[0.15, 0.15, 0.15]}>
          <spriteMaterial color="#4AF626" transparent opacity={0.4} />
        </sprite>
      ))}
    </group>
  );
}

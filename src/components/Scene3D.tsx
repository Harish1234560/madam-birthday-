import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Balloon({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + randomOffset) * 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + randomOffset) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} position={position}>
        {/* Balloon body */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color={color}
            metalness={0.3} 
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </mesh>
        {/* Balloon knot */}
        <mesh position={[0, -0.55, 0]}>
          <coneGeometry args={[0.08, 0.15, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* String */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#d4af37" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const balloonColors = ['#e57373', '#f06292', '#ba68c8', '#64b5f6', '#81c784', '#ffb74d', '#ff8a65'];
  
  const balloonPositions: [number, number, number][] = useMemo(() => [
    [-4, 2, -3],
    [-3, 3, -2],
    [-2, 1.5, -4],
    [3, 2.5, -3],
    [4, 1.8, -2],
    [2, 3, -4],
    [-1, 2.8, -5],
    [1, 2.2, -5],
    [-5, 1.5, -4],
    [5, 2, -4],
  ], []);

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Key light - warm rose gold tone */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        color="#f4a8a8"
      />
      
      {/* Fill light - champagne gold */}
      <directionalLight 
        position={[-5, 3, 5]} 
        intensity={0.4} 
        color="#d4af37"
      />
      
      {/* Rim light - coral accent */}
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#ff7f50" />
      
      {/* Stars background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={1}
      />
      
      {/* Sparkles effect */}
      <Sparkles 
        count={100}
        scale={15}
        size={3}
        speed={0.4}
        color="#d4af37"
      />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Balloons */}
      {balloonPositions.map((pos, i) => (
        <Balloon 
          key={i} 
          position={pos} 
          color={balloonColors[i % balloonColors.length]} 
        />
      ))}
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
    </div>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function OrbitDot({
  radius,
  speed,
  size,
  color,
  offset,
}: {
  radius: number;
  speed: number;
  size: number;
  color: string;
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t * 0.6) * 0.6,
        Math.sin(t) * radius
      );
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

function CentralOrb() {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh>
        <icosahedronGeometry args={[1.3, 1]} />
        <MeshDistortMaterial
          color="#2EC4F1"
          distort={0.25}
          speed={1.8}
          roughness={0.15}
          metalness={0.25}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={1.4} color="#FF8A5B" />
          <pointLight position={[-5, -3, -5]} intensity={1} color="#2EC4F1" />

          <CentralOrb />
          <OrbitDot radius={2.6} speed={0.5} size={0.13} color="#FF8A5B" offset={0} />
          <OrbitDot radius={3.1} speed={0.35} size={0.1} color="#5FE3C0" offset={2} />
          <OrbitDot radius={2.2} speed={0.65} size={0.08} color="#123A5E" offset={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
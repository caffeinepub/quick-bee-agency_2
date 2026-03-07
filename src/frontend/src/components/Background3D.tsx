import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ============================================================
// PARTICLE FIELD — drifting teal/orange particles
// ============================================================
function ParticleField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    const teal = new THREE.Color("#00ffc6");
    const orange = new THREE.Color("#ff6a00");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const r = Math.random();
      const col = r < 0.55 ? teal : r < 0.8 ? orange : white;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      speeds[i] = 0.002 + Math.random() * 0.004;
    }

    return { positions, colors, speeds };
  }, [count]);

  useEffect(() => {
    if (!geoRef.current) return;
    geoRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    geoRef.current.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, [positions, colors]);

  useFrame(() => {
    if (!geoRef.current) return;
    const posAttr = geoRef.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    if (!posAttr) return;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      pos[i * 3] += Math.sin(Date.now() * 0.0001 + i * 0.1) * 0.001;

      if (pos[i * 3 + 1] > 20) {
        pos[i * 3 + 1] = -20;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================
// WIREFRAME SPHERE — slow rotating node network
// ============================================================
function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[12, -2, -8]}>
      <icosahedronGeometry args={[5, 1]} />
      <meshBasicMaterial color="#00ffc6" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

// ============================================================
// FLOATING RING — accent geometry
// ============================================================
function FloatingRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.07;
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.04;
  });

  return (
    <mesh ref={meshRef} position={[-14, 3, -10]}>
      <torusGeometry args={[4, 0.04, 4, 60]} />
      <meshBasicMaterial color="#ff6a00" transparent opacity={0.08} />
    </mesh>
  );
}

// ============================================================
// SCENE
// ============================================================
function Scene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 250 : 500;

  return (
    <>
      <ParticleField count={particleCount} />
      <WireframeSphere />
      <FloatingRing />
    </>
  );
}

// ============================================================
// EXPORTED COMPONENT — fixed full-screen background
// ============================================================
export default function Background3D() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        frameloop="always"
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

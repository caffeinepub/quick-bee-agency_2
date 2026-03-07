import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ============================================================
// DENSE HERO PARTICLE CLOUD
// ============================================================
function HeroParticleCloud({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const teal = new THREE.Color("#00ffc6");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 3 + Math.random() * 10;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const mix = Math.random();
      const col = mix < 0.7 ? teal : white;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return { positions, colors };
  }, [count]);

  useEffect(() => {
    if (!geoRef.current) return;
    geoRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    geoRef.current.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, [positions, colors]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================
// ROTATING WIREFRAME TORUS — hero depth element
// ============================================================
function WireframeTorus() {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!torusRef.current) return;
    const t = clock.getElapsedTime();
    torusRef.current.rotation.x = t * 0.12;
    torusRef.current.rotation.y = t * 0.08;
    torusRef.current.rotation.z = t * 0.05;
  });

  return (
    <mesh ref={torusRef} position={[3, 0, -2]}>
      <torusGeometry args={[4, 0.06, 6, 80]} />
      <meshBasicMaterial color="#00ffc6" transparent opacity={0.18} />
    </mesh>
  );
}

// ============================================================
// ORBITING ICOSAHEDRON — data node feel
// ============================================================
function OrbitingNode() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.x = Math.cos(t * 0.3) * 6;
    groupRef.current.position.y = Math.sin(t * 0.2) * 3;
    groupRef.current.rotation.y = t * 0.5;
    groupRef.current.rotation.x = t * 0.3;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color="#ff6a00"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// SECOND WIREFRAME RING — decorative outer ring
// ============================================================
function OuterRing() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.z = t * 0.06;
    meshRef.current.rotation.x = t * 0.03;
  });

  return (
    <mesh ref={meshRef} position={[-2, 1, -4]}>
      <torusGeometry args={[6.5, 0.04, 4, 100]} />
      <meshBasicMaterial color="#00ffc6" transparent opacity={0.1} />
    </mesh>
  );
}

// ============================================================
// HERO SCENE
// ============================================================
function HeroScene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 200 : 380;

  return (
    <>
      <HeroParticleCloud count={particleCount} />
      <WireframeTorus />
      <OuterRing />
      <OrbitingNode />
    </>
  );
}

// ============================================================
// EXPORTED COMPONENT — absolute within hero section
// ============================================================
export default function HeroCanvas3D() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 16], fov: 65 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        frameloop="always"
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <HeroScene />
      </Canvas>
    </div>
  );
}

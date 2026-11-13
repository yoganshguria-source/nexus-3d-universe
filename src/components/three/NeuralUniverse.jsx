import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';

/* ── Particles ── */
function Particles({ count = 350 }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.5 + Math.random() * 4.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = new THREE.Color();
      c.setHSL(0.52 + Math.random() * 0.22, 0.85, 0.55 + Math.random() * 0.2);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.025;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.01) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colors}    count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Orbital Ring ── */
function OrbitalRing({ radius, speed, color, tilt = 0, opacity = 0.3 }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius * 0.38));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame((s) => { if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * speed; });

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <line geometry={geo}>
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </line>
    </group>
  );
}

/* ── Neural connections between agents ── */
function NeuralConnections({ nodes }) {
  const lineRefs = useRef([]);
  const { lines, geos } = useMemo(() => {
    const lines = [];
    const geos  = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const s = new THREE.Vector3(...nodes[i].position);
        const e = new THREE.Vector3(...nodes[j].position);
        const m = s.clone().lerp(e, 0.5);
        m.y += (Math.random() - 0.5) * 0.6;
        const curve = new THREE.QuadraticBezierCurve3(s, m, e);
        geos.push(new THREE.BufferGeometry().setFromPoints(curve.getPoints(24)));
        lines.push({ color: nodes[i].color });
      }
    }
    return { lines, geos };
  }, [nodes]);

  useFrame((s) => {
    lineRefs.current.forEach((l, i) => {
      if (l) l.material.opacity = 0.08 + Math.sin(s.clock.elapsedTime * 0.5 + i * 0.7) * 0.07;
    });
  });

  return (
    <>
      {geos.map((geo, i) => (
        <line key={i} geometry={geo} ref={el => lineRefs.current[i] = el}>
          <lineBasicMaterial color={lines[i].color} transparent opacity={0.12} />
        </line>
      ))}
    </>
  );
}

/* ── Energy traveller ── */
function EnergyBead({ from, to, color, speed = 0.4, offset = 0 }) {
  const ref = useRef();
  const curve = useMemo(() => {
    const s = new THREE.Vector3(...from);
    const e = new THREE.Vector3(...to);
    const m = s.clone().lerp(e, 0.5);
    m.add(new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, 0));
    return new THREE.QuadraticBezierCurve3(s, m, e);
  }, [from, to]);

  useFrame((s) => {
    if (!ref.current) return;
    const t = ((s.clock.elapsedTime * speed + offset) % 1 + 1) % 1;
    const pt = curve.getPoint(t);
    ref.current.position.copy(pt);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} toneMapped={false} />
    </mesh>
  );
}

/* ── Intelligence core ── */
function IntelligenceCore() {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (outerRef.current) outerRef.current.rotation.y = t * 0.15;
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.4;
      const sc = 1 + Math.sin(t * 2) * 0.04;
      innerRef.current.scale.setScalar(sc);
    }
  });

  return (
    <group>
      {/* outer atmosphere */}
      <Sphere ref={outerRef} args={[0.95, 48, 48]}>
        <MeshDistortMaterial color="#0369a1" emissive="#0ea5e9" emissiveIntensity={0.3}
          transparent opacity={0.12} distort={0.35} speed={1.5} />
      </Sphere>
      {/* inner core */}
      <Sphere ref={innerRef} args={[0.5, 48, 48]}>
        <MeshDistortMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2.5}
          distort={0.45} speed={3} roughness={0} metalness={0.2} />
      </Sphere>
      <pointLight color="#0ea5e9" intensity={4} distance={8} />
      <pointLight color="#7c3aed" intensity={1.5} distance={5} position={[0, 0, 1]} />
    </group>
  );
}

/* ── Agent node ── */
function AgentNode({ agent, onClick }) {
  const ref    = useRef();
  const [hov, setHov] = useState(false);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.x = agent.position[0] + Math.sin(t * 0.4 + agent.position[0]) * 0.18;
    ref.current.position.y = agent.position[1] + Math.cos(t * 0.35 + agent.position[1]) * 0.18;
    ref.current.position.z = agent.position[2] + Math.sin(t * 0.5) * 0.12;
    ref.current.scale.setScalar(hov ? 1.35 : 1);
  });

  return (
    <group ref={ref} position={agent.position}>
      <Sphere
        args={[0.2, 32, 32]}
        onClick={(e) => { e.stopPropagation(); onClick(agent); }}
        onPointerOver={() => { setHov(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHov(false); document.body.style.cursor = 'none'; }}
      >
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={hov ? 3.5 : 1.8}
          roughness={0}
          metalness={0.6}
          toneMapped={false}
        />
      </Sphere>
      <pointLight color={agent.color} intensity={hov ? 2.5 : 1} distance={2} />
      {hov && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(6,15,30,0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${agent.color}50`,
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.6rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: agent.glowColor,
            letterSpacing: '0.2em',
            whiteSpace: 'nowrap',
            boxShadow: `0 0 20px ${agent.color}30`,
          }}>
            {agent.name} · {agent.role}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Camera controller ── */
function CameraController({ mouseNormalized, scrollY }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const lp = 0.035;
    target.current.x += (mouseNormalized.x * 0.6 - target.current.x) * lp;
    target.current.y += (mouseNormalized.y * 0.35 - target.current.y) * lp;
    camera.position.x = target.current.x;
    camera.position.y = 0.8 + target.current.y;
    const sf = Math.min(scrollY / 900, 1);
    camera.position.z = 7.5 - sf * 3.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Main exported component ── */
export default function NeuralUniverse({ agents, onAgentClick, scrollY }) {
  const { normalized } = useMousePosition();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      camera={{ position: [0, 0.8, 7.5], fov: 58 }}
      gl={{ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' }}
      dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
    >
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 12, 28]} />
      <ambientLight intensity={0.08} />
      <pointLight position={[8, 6, 4]} intensity={0.6} color="#0ea5e9" />
      <pointLight position={[-6, -6, -4]} intensity={0.4} color="#7c3aed" />

      <CameraController mouseNormalized={normalized} scrollY={scrollY} />

      <IntelligenceCore />
      <Particles count={isMobile ? 160 : 420} />

      <OrbitalRing radius={2.2}  speed={0.09}  color="#0ea5e9" tilt={Math.PI / 5}  opacity={0.25} />
      <OrbitalRing radius={3.2}  speed={-0.06} color="#7c3aed" tilt={Math.PI / 2.8} opacity={0.2} />
      <OrbitalRing radius={4.2}  speed={0.045} color="#06b6d4" tilt={Math.PI / 2}  opacity={0.15} />

      {agents.map(agent => (
        <AgentNode key={agent.id} agent={agent} onClick={onAgentClick} />
      ))}

      <NeuralConnections nodes={agents} />

      {agents.map((agent, i) => (
        <EnergyBead
          key={agent.id}
          from={[0, 0, 0]}
          to={agent.position}
          color={agent.color}
          speed={0.38 + i * 0.07}
          offset={i * 0.2}
        />
      ))}
    </Canvas>
  );
}

import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIntersection } from '../../hooks/useIntersection';

/* ── Interactive particle field ── */
function InteractiveField({ mode, mousePos }) {
  const ref  = useRef();
  const COUNT = 200;

  const { positions, velocities, origins } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const ori = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;
      pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
      ori[i*3]=x; ori[i*3+1]=y; ori[i*3+2]=z;
      vel[i*3]=0; vel[i*3+1]=0; vel[i*3+2]=0;
    }
    return { positions: pos, velocities: vel, origins: ori };
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    const t   = s.clock.elapsedTime;
    const mx  = mousePos.current.x * 3;
    const my  = mousePos.current.y * 2;

    for (let i = 0; i < COUNT; i++) {
      const ix = i*3, iy = i*3+1, iz = i*3+2;
      let tx = origins[ix], ty = origins[iy], tz = origins[iz];

      if (mode === 'chaos') {
        tx = origins[ix] + Math.sin(t * 0.5 + i * 0.3) * 2;
        ty = origins[iy] + Math.cos(t * 0.4 + i * 0.2) * 2;
      } else if (mode === 'orbit') {
        const angle = t * 0.3 + (i / COUNT) * Math.PI * 2;
        const r = 1.5 + (i % 3) * 1.2;
        tx = Math.cos(angle) * r;
        ty = Math.sin(angle) * r;
        tz = origins[iz] * 0.3;
      } else if (mode === 'attract') {
        // attract to mouse
        tx = mx + (origins[ix] - mx) * 0.3;
        ty = my + (origins[iy] - my) * 0.3;
      }

      pos[ix] += (tx - pos[ix]) * 0.04;
      pos[iy] += (ty - pos[iy]) * 0.04;
      pos[iz] += (tz - pos[iz]) * 0.04;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = t * 0.02;
  });

  const colors = useMemo(() => {
    const c = new Float32Array(COUNT * 3);
    const palette = [
      new THREE.Color('#0ea5e9'),
      new THREE.Color('#7c3aed'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#f59e0b'),
    ];
    for (let i = 0; i < COUNT; i++) {
      const col = palette[i % palette.length];
      c[i*3]=col.r; c[i*3+1]=col.g; c[i*3+2]=col.b;
    }
    return c;
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colors}    count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Connecting lines between nearby particles ── */
function ConnectionWeb({ active }) {
  const ref = useRef();
  const GEO = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const r = 2 + Math.random() * 1.5;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    // Connect consecutive
    const linePts = [];
    for (let i = 0; i < pts.length; i++) {
      linePts.push(pts[i]);
      linePts.push(pts[(i + 1) % pts.length]);
    }
    return new THREE.BufferGeometry().setFromPoints(linePts);
  }, []);

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.z = s.clock.elapsedTime * (active ? 0.15 : 0.03);
      ref.current.material.opacity = active ? 0.3 : 0.08;
    }
  });

  return (
    <lineSegments ref={ref} geometry={GEO}>
      <lineBasicMaterial color="#0ea5e9" transparent opacity={0.08} />
    </lineSegments>
  );
}

const MODES = [
  { id: 'scatter',  label: 'Scatter Field',    icon: '✦', desc: 'Particles in natural formation' },
  { id: 'orbit',    label: 'Orbital Rings',    icon: '◎', desc: 'Circular intelligence orbits' },
  { id: 'chaos',    label: 'Chaos Mode',       icon: '⚡', desc: 'Entropy and emergent patterns' },
  { id: 'attract',  label: 'Gravity Well',     icon: '◉', desc: 'Drawn to your cursor' },
];

export default function IntelligenceLab() {
  const { ref, isVisible } = useIntersection({ threshold: 0.05 });
  const [mode, setMode] = useState('scatter');
  const [webActive, setWebActive] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }, []);

  return (
    <section id="lab" className="relative py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(14,165,233,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          className="text-center mb-16 transition-all duration-1000"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }}
        >
          <div className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-8">
            <div className="w-1 h-1 rounded-full bg-green-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-mono tracking-[0.35em] text-green-400/70">INTELLIGENCE LAB</span>
          </div>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-[0.08em] mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #bbf7d0 40%, #10b981 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Experiment<br />with Mind
          </h2>
          <p className="max-w-xl mx-auto text-sm text-blue-200/40 leading-relaxed">
            Interact with live particle intelligence systems. Change modes, hover over the field,
            and watch emergent behavior unfold.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls panel */}
          <div className="lg:col-span-1 space-y-5">
            {/* Mode selector */}
            <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(14,165,233,0.12)' }}>
              <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-4">FIELD MODE</p>
              <div className="space-y-2.5">
                {MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className="w-full flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 text-left"
                    style={{
                      background: mode === m.id ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${mode === m.id ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.08)'}`,
                    }}
                  >
                    <span className="text-lg flex-shrink-0">{m.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-blue-200 tracking-wider">{m.label}</p>
                      <p className="text-[0.6rem] text-blue-300/40">{m.desc}</p>
                    </div>
                    {mode === m.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"
                        style={{ boxShadow: '0 0 6px #22d3ee' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(14,165,233,0.12)' }}>
              <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-4">OVERLAYS</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-200/60">Connection Web</span>
                  <button
                    onClick={() => setWebActive(v => !v)}
                    className="w-10 h-5 rounded-full transition-all duration-300 relative"
                    style={{ background: webActive ? '#0ea5e9' : 'rgba(14,165,233,0.15)' }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                      style={{ left: webActive ? '1.25rem' : '0.125rem' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(14,165,233,0.12)' }}>
              <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-4">FIELD STATS</p>
              <div className="space-y-3">
                {[
                  { label: 'Particles', value: '200' },
                  { label: 'Mode', value: mode.charAt(0).toUpperCase() + mode.slice(1) },
                  { label: 'Connections', value: webActive ? '40' : '0' },
                  { label: 'Render', value: 'Real-time' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-[0.65rem] text-blue-300/40 font-mono">{s.label}</span>
                    <span className="text-[0.65rem] text-cyan-400 font-mono font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div
            className="lg:col-span-2 glass rounded-3xl overflow-hidden relative"
            style={{ height: 500, border: '1px solid rgba(14,165,233,0.15)', cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
          >
            <Canvas
              camera={{ position: [0, 0, 7], fov: 60 }}
              gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
              dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
            >
              <color attach="background" args={['#030c18']} />
              <ambientLight intensity={0.1} />
              <pointLight position={[0, 0, 5]} intensity={0.6} color="#0ea5e9" />
              <InteractiveField mode={mode} mousePos={mousePos} />
              {webActive && <ConnectionWeb active={webActive} />}
            </Canvas>

            {/* Mode label */}
            <div className="absolute bottom-5 left-5">
              <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40">
                {MODES.find(m => m.id === mode)?.label.toUpperCase()} · {mode === 'attract' ? 'MOVE CURSOR OVER FIELD' : 'LIVE'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

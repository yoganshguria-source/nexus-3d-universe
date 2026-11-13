import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useIntersection } from '../../hooks/useIntersection';

/* ── Node data ── */
const NODE_COUNT = 28;
const LAYER_SIZES = [4, 7, 8, 6, 3]; // input → hidden×2 → output

function buildNetwork() {
  const nodes = [];
  const edges = [];
  let id = 0;
  const layerColors = ['#0ea5e9', '#38bdf8', '#7c3aed', '#a78bfa', '#ec4899'];
  const layerLabels = ['Input', 'Hidden 1', 'Hidden 2', 'Hidden 3', 'Output'];

  LAYER_SIZES.forEach((count, li) => {
    const x = (li / (LAYER_SIZES.length - 1)) * 8 - 4;
    for (let ni = 0; ni < count; ni++) {
      const y = (ni / (count - 1 || 1)) * 5 - 2.5;
      nodes.push({ id: id++, x, y, z: 0, layer: li, color: layerColors[li], label: layerLabels[li] });
    }
  });

  // Connect adjacent layers
  let start = 0;
  for (let li = 0; li < LAYER_SIZES.length - 1; li++) {
    for (let a = 0; a < LAYER_SIZES[li]; a++) {
      for (let b = 0; b < LAYER_SIZES[li + 1]; b++) {
        edges.push({ from: start + a, to: start + LAYER_SIZES[li] + b });
      }
    }
    start += LAYER_SIZES[li];
  }
  return { nodes, edges };
}

const { nodes: NET_NODES, edges: NET_EDGES } = buildNetwork();

/* ── 3D Neural canvas ── */
function NeuralNode3D({ node, onClick, active, highlighted }) {
  const ref = useRef();
  const [hov, setHov] = useState(false);

  useFrame((s) => {
    if (!ref.current) return;
    const pulse = active ? 1 + Math.sin(s.clock.elapsedTime * 3) * 0.15 : 1;
    ref.current.scale.setScalar(hov ? 1.5 : pulse);
  });

  const isLit = active || highlighted;
  return (
    <mesh
      ref={ref}
      position={[node.x, node.y, node.z]}
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
      onPointerOver={() => { setHov(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHov(false); document.body.style.cursor = 'none'; }}
    >
      <sphereGeometry args={[0.16, 20, 20]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={isLit ? 3 : 0.5}
        roughness={0}
        metalness={0.4}
        toneMapped={false}
      />
      {hov && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(3,7,18,0.9)', backdropFilter: 'blur(12px)',
            border: `1px solid ${node.color}40`, borderRadius: 12, padding: '4px 10px',
            fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace',
            color: node.color, letterSpacing: '0.15em', whiteSpace: 'nowrap',
          }}>
            {node.label} · Node {node.id}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function NeuralEdge3D({ from, to, active, color }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const pts = [new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(to.x, to.y, to.z)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [from, to]);

  useFrame((s) => {
    if (ref.current) {
      ref.current.material.opacity = active
        ? 0.4 + Math.sin(s.clock.elapsedTime * 4) * 0.2
        : 0.07;
    }
  });

  return (
    <line ref={ref} geometry={geo}>
      <lineBasicMaterial color={active ? color : '#1e3a5f'} transparent opacity={0.07} />
    </line>
  );
}

function TravellingSignal({ from, to, color, speed }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = (s.clock.elapsedTime * speed) % 1;
    ref.current.position.lerpVectors(
      new THREE.Vector3(from.x, from.y, from.z),
      new THREE.Vector3(to.x, to.y, to.z),
      t,
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6} toneMapped={false} />
    </mesh>
  );
}

function NetworkScene({ activeNode, onNodeClick }) {
  const activeEdges = useMemo(() => {
    if (!activeNode) return new Set();
    return new Set(
      NET_EDGES
        .filter(e => e.from === activeNode.id || e.to === activeNode.id)
        .flatMap(e => [e.from, e.to])
    );
  }, [activeNode]);

  return (
    <>
      <color attach="background" args={['#030c18']} />
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#0ea5e9" />

      {NET_EDGES.map((e, i) => {
        const isActive = activeNode && (e.from === activeNode.id || e.to === activeNode.id);
        const fromNode = NET_NODES[e.from];
        const toNode   = NET_NODES[e.to];
        return (
          <NeuralEdge3D key={i} from={fromNode} to={toNode}
            active={isActive} color={fromNode.color} />
        );
      })}

      {activeNode && NET_EDGES
        .filter(e => e.from === activeNode.id || e.to === activeNode.id)
        .slice(0, 4)
        .map((e, i) => (
          <TravellingSignal key={i}
            from={NET_NODES[e.from]} to={NET_NODES[e.to]}
            color={NET_NODES[e.from].color}
            speed={0.4 + i * 0.1} />
        ))
      }

      {NET_NODES.map(node => (
        <NeuralNode3D key={node.id} node={node}
          onClick={onNodeClick}
          active={activeNode?.id === node.id}
          highlighted={activeEdges.has(node.id)} />
      ))}
    </>
  );
}

export default function NeuralNetworkSection() {
  const { ref, isVisible } = useIntersection({ threshold: 0.05 });
  const [activeNode, setActiveNode] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleNodeClick = useCallback((node) => {
    setActiveNode(prev => prev?.id === node.id ? null : node);
  }, []);

  return (
    <section id="neural" className="relative py-20 overflow-hidden" style={{ minHeight: '100vh' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={ref}
          className="text-center mb-12 transition-all duration-1000"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }}
        >
          <div className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-8">
            <div className="w-1 h-1 rounded-full bg-violet-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-mono tracking-[0.35em] text-violet-400/70">THE NEURAL NETWORK</span>
          </div>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-[0.08em] mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Thought as<br />Architecture
          </h2>
          <p className="max-w-xl mx-auto text-sm text-blue-200/40 leading-relaxed">
            Click any node to watch intelligence flow. Each connection is a thought pathway —
            information travelling at the speed of meaning.
          </p>
        </div>

        {/* 3D canvas */}
        <div
          className="relative rounded-3xl overflow-hidden glass"
          style={{ height: isMobile ? 380 : 560, border: '1px solid rgba(14,165,233,0.12)' }}
        >
          <Canvas
            camera={{ position: [0, 0, 7], fov: 60 }}
            gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
            dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
          >
            <NetworkScene activeNode={activeNode} onNodeClick={handleNodeClick} />
          </Canvas>

          {/* Info overlay */}
          {activeNode ? (
            <div className="absolute bottom-6 left-6 glass rounded-2xl px-5 py-4 max-w-xs">
              <p className="text-[0.6rem] font-mono tracking-[0.3em] mb-1" style={{ color: activeNode.color }}>
                ● NODE SELECTED
              </p>
              <p className="text-sm font-bold text-blue-200 mb-1">{activeNode.label} · Node {activeNode.id}</p>
              <p className="text-xs text-blue-300/50">
                {NET_EDGES.filter(e => e.from === activeNode.id || e.to === activeNode.id).length} active connections
              </p>
            </div>
          ) : (
            <div className="absolute bottom-6 left-6">
              <p className="text-[0.6rem] font-mono tracking-[0.25em] text-blue-400/30">CLICK A NODE TO TRACE PATHWAYS</p>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-6 right-6 glass rounded-2xl p-4">
            <p className="text-[0.55rem] font-mono tracking-widest text-blue-400/40 mb-3">LAYERS</p>
            {['#0ea5e9','#38bdf8','#7c3aed','#a78bfa','#ec4899'].map((c,i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="text-[0.55rem] font-mono text-blue-300/50">
                  {['Input','Hidden 1','Hidden 2','Hidden 3','Output'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Nodes', value: NET_NODES.length },
            { label: 'Connections', value: NET_EDGES.length },
            { label: 'Layers', value: LAYER_SIZES.length },
            { label: 'Signal Speed', value: 'Real-time' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-5 text-center"
              style={{ border: '1px solid rgba(14,165,233,0.1)' }}>
              <p className="text-2xl font-black text-blue-300 mb-1">{stat.value}</p>
              <p className="text-[0.6rem] font-mono tracking-[0.2em] text-blue-400/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

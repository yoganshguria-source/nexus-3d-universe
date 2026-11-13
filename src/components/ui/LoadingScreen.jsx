import { useEffect, useState } from 'react';

const PHASES = [
  'Initializing Neural Core...',
  'Calibrating Quantum Mesh...',
  'Deploying Intelligence Agents...',
  'Mapping the Universe...',
  'NEXUS Online.',
];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      const inc = Math.random() * 12 + 4;
      p = Math.min(p + inc, 100);
      setProgress(p);
      setPhaseIdx(Math.min(Math.floor((p / 100) * PHASES.length), PHASES.length - 1));

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setExiting(true), 400);
        setTimeout(() => onComplete(), 900);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-500"
      style={{ opacity: exiting ? 0 : 1, pointerEvents: exiting ? 'none' : 'all' }}
    >
      {/* Ambient rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[200, 350, 500].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-500/10"
            style={{
              width: size,
              height: size,
              animation: `pulse ${3 + i}s ease-in-out infinite ${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Core orb */}
      <div className="relative mb-10">
        <div
          className="w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0ea5e9 40%, #7c3aed 80%, transparent 100%)',
            boxShadow: '0 0 60px rgba(14, 165, 233, 0.6), 0 0 120px rgba(14, 165, 233, 0.2)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-[-8px] rounded-full border border-cyan-400/30"
          style={{ animation: 'pulse-ring 2s ease-out infinite' }}
        />
        <div
          className="absolute inset-[-20px] rounded-full border border-blue-500/15"
          style={{ animation: 'pulse-ring 2s ease-out infinite 0.6s' }}
        />
      </div>

      {/* Title */}
      <h1
        className="text-6xl font-black tracking-[0.35em] mb-1"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 40%, #0ea5e9 70%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 30px rgba(14, 165, 233, 0.4))',
        }}
      >
        NEXUS
      </h1>
      <p className="text-[0.6rem] tracking-[0.5em] text-blue-400/50 mb-14 font-mono uppercase">
        The Next Form of Intelligence
      </p>

      {/* Progress */}
      <div className="w-56 relative mb-4">
        <div className="h-px bg-blue-900/50 w-full" />
        <div
          className="absolute top-0 left-0 h-px transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0ea5e9, #7c3aed)',
            boxShadow: '0 0 8px rgba(14, 165, 233, 0.8)',
          }}
        />
      </div>

      <p className="text-[0.65rem] font-mono text-blue-400/50 tracking-widest h-4">{PHASES[phaseIdx]}</p>
      <p className="text-[0.6rem] font-mono text-blue-900/70 mt-1">{Math.round(progress)}%</p>
    </div>
  );
}

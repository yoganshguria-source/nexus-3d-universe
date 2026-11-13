import { useState } from 'react';
import { AGENTS } from '../../data/agents';
import NeuralUniverse from '../three/NeuralUniverse';
import { useScrollProgress } from '../../hooks/useScrollProgress';

function AgentPanel({ agent, onClose }) {
  if (!agent) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="glass relative max-w-md w-full rounded-3xl p-8 z-10 transition-all duration-300"
        style={{
          border: `1px solid ${agent.color}35`,
          boxShadow: `0 0 60px ${agent.color}18, 0 0 120px ${agent.color}08`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full text-blue-400/50 hover:text-blue-200 hover:bg-blue-500/10 transition-all text-lg"
        >×</button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `${agent.color}15`,
              border: `1px solid ${agent.color}35`,
              width: 52, height: 52,
            }}
          >
            {agent.icon}
          </div>
          <div>
            <h3 className="font-black text-xl tracking-[0.2em]" style={{ color: agent.glowColor }}>
              {agent.name}
            </h3>
            <p className="text-xs text-blue-300/50 font-mono tracking-[0.15em] mt-0.5">{agent.role}</p>
          </div>
        </div>

        <p className="text-sm text-blue-200/70 leading-relaxed mb-6">{agent.description}</p>

        {/* Abilities */}
        <div className="mb-6">
          <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-3">CAPABILITIES</p>
          <ul className="space-y-2.5">
            {agent.abilities.map((ab, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-blue-200/65">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: agent.color, boxShadow: `0 0 6px ${agent.color}` }} />
                {ab}
              </li>
            ))}
          </ul>
        </div>

        {/* Live task feed */}
        <div className="rounded-2xl p-4" style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}20` }}>
          <p className="text-[0.6rem] font-mono tracking-[0.3em] mb-3" style={{ color: agent.color }}>
            ● AGENT ACTIVE
          </p>
          <div className="space-y-1.5">
            {agent.tasks.map((task, i) => (
              <p key={i} className="text-xs font-mono text-blue-300/50"
                style={{ opacity: 1 - i * 0.18 }}>
                {i === 0 ? '▶ ' : '  '}{task}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { scrollY } = useScrollProgress();

  return (
    <section id="universe" className="relative h-screen w-full overflow-hidden">
      {/* 3D canvas fills the whole section */}
      <div className="absolute inset-0">
        <NeuralUniverse
          agents={AGENTS}
          onAgentClick={setSelectedAgent}
          scrollY={scrollY}
        />
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.6) 100%)',
        }}
      />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #030712 0%, transparent 100%)' }} />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #030712 0%, transparent 100%)' }} />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none">
        <div className="text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 glass px-5 py-2.5 rounded-full mb-10 pointer-events-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{ boxShadow: '0 0 8px #22d3ee', animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-mono tracking-[0.35em] text-cyan-400/80 uppercase">
              Next Generation AI Platform
            </span>
          </div>

          {/* Main title */}
          <h1
            className="font-black leading-none mb-5 tracking-[0.08em]"
            style={{
              fontSize: 'clamp(5rem, 15vw, 12rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 35%, #0ea5e9 65%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 60px rgba(14, 165, 233, 0.25))',
            }}
          >
            NEXUS
          </h1>

          {/* Taglines */}
          <div className="mb-10 space-y-1">
            <p className="text-xs sm:text-sm font-mono tracking-[0.4em] text-blue-300/60 uppercase">
              The Future Is Not Artificial.
            </p>
            <p className="text-xs sm:text-sm font-mono tracking-[0.4em] text-blue-300/60 uppercase">
              It Is Autonomous.
            </p>
          </div>

          <p className="max-w-md mx-auto text-sm sm:text-base text-blue-200/40 mb-14 leading-relaxed font-light tracking-wide">
            Discover a universe where intelligence connects, collaborates, and evolves.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <button
              onClick={() => document.querySelector('#agents')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-9 py-4 rounded-full text-xs font-bold tracking-[0.25em] transition-all duration-300 hover:scale-105 active:scale-95 uppercase"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
                boxShadow: '0 0 40px rgba(14, 165, 233, 0.35), 0 0 80px rgba(14, 165, 233, 0.1)',
              }}
            >
              Explore the Universe
            </button>
            <button
              onClick={() => document.querySelector('#agents')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-9 py-4 rounded-full text-xs font-bold tracking-[0.25em] glass border border-blue-500/25 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 active:scale-95 text-blue-300/80 uppercase"
            >
              Discover the Agents
            </button>
          </div>

          {/* Hint */}
          <p className="mt-8 text-[0.6rem] font-mono tracking-[0.3em] text-blue-500/30 pointer-events-auto">
            Click any node to meet an agent
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
        <span className="text-[0.55rem] font-mono tracking-[0.4em] text-blue-400/30 uppercase">Scroll</span>
        <div className="relative w-px h-14">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/40 to-transparent" />
          <div
            className="absolute top-0 left-0 right-0 bg-blue-400/80 h-6"
            style={{ animation: 'scan 2s ease-in-out infinite' }}
          />
        </div>
      </div>

      <AgentPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </section>
  );
}

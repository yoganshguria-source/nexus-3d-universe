import { useState } from 'react';
import { AGENTS } from '../../data/agents';
import { useIntersection } from '../../hooks/useIntersection';

function AgentCard({ agent, index }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="transition-all duration-700 cursor-pointer"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transitionDelay: `${index * 120}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
    >
      <div
        className="glass rounded-3xl p-7 h-full transition-all duration-500"
        style={{
          border: `1px solid ${hovered ? agent.color + '45' : agent.color + '18'}`,
          boxShadow: hovered ? `0 0 50px ${agent.color}15, 0 0 100px ${agent.color}08` : 'none',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* Icon + status */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: `${agent.color}15`,
              border: `1px solid ${agent.color}30`,
              boxShadow: hovered ? `0 0 25px ${agent.color}25` : 'none',
              transition: 'box-shadow 0.3s',
            }}
          >
            {agent.icon}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: agent.color, boxShadow: `0 0 6px ${agent.color}`, animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.55rem] font-mono tracking-[0.3em]" style={{ color: agent.color }}>ACTIVE</span>
          </div>
        </div>

        {/* Name */}
        <h3
          className="text-2xl font-black tracking-[0.2em] mb-1"
          style={{ color: agent.glowColor, filter: hovered ? `drop-shadow(0 0 12px ${agent.color}80)` : 'none', transition: 'filter 0.3s' }}
        >
          {agent.name}
        </h3>
        <p className="text-xs text-blue-300/50 font-mono tracking-[0.15em] mb-4">{agent.role}</p>

        <p className="text-sm text-blue-200/60 leading-relaxed mb-5 line-clamp-3">{agent.description}</p>

        {/* Abilities */}
        <div className="space-y-2 mb-5">
          {agent.abilities.map((ab, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-blue-200/50">
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: agent.color }} />
              {ab}
            </div>
          ))}
        </div>

        {/* Task stream */}
        <div
          className="rounded-xl p-3 mt-auto"
          style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}18` }}
        >
          <p className="text-[0.55rem] font-mono tracking-[0.3em] mb-2" style={{ color: agent.color }}>
            ● LIVE TASK
          </p>
          <p className="text-[0.65rem] font-mono text-blue-300/50">{agent.tasks[0]}</p>
        </div>

        {/* Expand hint */}
        <p className="text-[0.55rem] font-mono tracking-[0.2em] text-blue-500/30 mt-4 text-center">
          {expanded ? 'CLICK TO COLLAPSE' : 'CLICK FOR DETAILS'}
        </p>

        {/* Expanded task feed */}
        {expanded && (
          <div className="mt-4 space-y-1.5 border-t border-blue-900/30 pt-4">
            <p className="text-[0.55rem] font-mono tracking-[0.3em] text-blue-400/40 mb-2">TASK PIPELINE</p>
            {agent.tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[0.6rem] font-mono mt-0.5" style={{ color: i === 0 ? agent.color : '#4b5563' }}>
                  {i === 0 ? '▶' : '○'}
                </span>
                <p className="text-xs font-mono" style={{ color: i === 0 ? '#93c5fd' : '#374151' }}>{task}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentUniverse() {
  const { ref, isVisible } = useIntersection({ threshold: 0.05 });

  return (
    <section id="agents" className="relative py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div
          ref={ref}
          className="text-center mb-20 transition-all duration-1000"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }}
        >
          <div className="inline-flex items-center gap-2.5 glass px-5 py-2 rounded-full mb-8">
            <div className="w-1 h-1 rounded-full bg-cyan-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-mono tracking-[0.35em] text-cyan-400/70">THE AGENT UNIVERSE</span>
          </div>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-[0.1em] mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 40%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Five Minds.<br />One Mission.
          </h2>
          <p className="max-w-2xl mx-auto text-base text-blue-200/45 leading-relaxed">
            Each agent is a specialized intelligence, purpose-built for its domain.
            Together, they form a collective mind greater than the sum of its parts.
          </p>
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
          {/* Sixth card — the network card */}
          <div className="sm:col-span-2 lg:col-span-0">
            <div className="glass rounded-3xl p-7 h-full" style={{ border: '1px solid rgba(14,165,233,0.12)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                  🌐
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-[0.2em] text-blue-300">NEXUS CORE</h3>
                  <p className="text-xs text-blue-300/40 font-mono tracking-wider">Unified Intelligence Layer</p>
                </div>
              </div>
              <p className="text-sm text-blue-200/55 leading-relaxed mb-5">
                The NEXUS Core orchestrates all five agents, managing task routing, priority balancing, and cross-agent communication in real time.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Agents Online', value: '5 / 5' },
                  { label: 'Tasks Running', value: '12' },
                  { label: 'Connections', value: '840+' },
                  { label: 'Uptime', value: '99.99%' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-3"
                    style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)' }}>
                    <p className="text-[0.55rem] font-mono tracking-widest text-blue-400/50 mb-1">{stat.label}</p>
                    <p className="text-lg font-black text-blue-300">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useRef } from 'react';
import { TIMELINE } from '../../data/agents';
import { useIntersection } from '../../hooks/useIntersection';

function TimelineCard({ item, index, isActive, onClick }) {
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="relative flex gap-6 cursor-pointer group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms`,
      }}
      onClick={() => onClick(index)}
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Node */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-base z-10 transition-all duration-500 flex-shrink-0"
          style={{
            background: isActive
              ? `radial-gradient(circle, ${item.color} 0%, ${item.color}60 100%)`
              : 'rgba(6,15,30,0.8)',
            border: `2px solid ${isActive ? item.color : item.color + '40'}`,
            boxShadow: isActive ? `0 0 25px ${item.color}60, 0 0 50px ${item.color}20` : 'none',
          }}
        >
          {item.icon}
        </div>
        {/* Spine line */}
        {index < TIMELINE.length - 1 && (
          <div className="w-px flex-1 mt-2" style={{ background: `linear-gradient(to bottom, ${item.color}50, ${TIMELINE[index+1].color}30)`, minHeight: 60 }} />
        )}
      </div>

      {/* Card */}
      <div
        className="glass rounded-3xl p-6 mb-6 flex-1 transition-all duration-500 group-hover:scale-[1.01]"
        style={{
          border: `1px solid ${isActive ? item.color + '40' : item.color + '15'}`,
          boxShadow: isActive ? `0 0 40px ${item.color}12` : 'none',
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <span
              className="text-[0.6rem] font-mono tracking-[0.3em]"
              style={{ color: item.color }}
            >
              {item.year}
            </span>
            <h3 className="text-xl font-black tracking-[0.1em] text-blue-100 mt-0.5">
              {item.era}
            </h3>
          </div>
          <span
            className="text-[0.55rem] font-mono px-3 py-1 rounded-full tracking-widest flex-shrink-0"
            style={{ background: `${item.color}18`, border: `1px solid ${item.color}30`, color: item.color }}
          >
            {item.highlight}
          </span>
        </div>
        <p className="text-sm text-blue-200/55 leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const { ref, isVisible } = useIntersection({ threshold: 0.05 });
  const [activeIdx, setActiveIdx] = useState(4);

  return (
    <section id="timeline" className="relative py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          className="text-center mb-20 transition-all duration-1000"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }}
        >
          <div className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-8">
            <div className="w-1 h-1 rounded-full bg-pink-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-mono tracking-[0.35em] text-pink-400/70">THE FUTURE OF INTELLIGENCE</span>
          </div>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-[0.08em] mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fbcfe8 40%, #ec4899 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            From Silicon<br />to Consciousness
          </h2>
          <p className="max-w-xl mx-auto text-sm text-blue-200/40 leading-relaxed">
            Six eras. Each one transforming what it means to think. Click any era to explore it.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto">
          {TIMELINE.map((item, i) => (
            <TimelineCard
              key={item.era}
              item={item}
              index={i}
              isActive={activeIdx === i}
              onClick={setActiveIdx}
            />
          ))}
        </div>

        {/* Bottom quote */}
        <div className="text-center mt-12">
          <p className="text-sm text-blue-300/40 font-light italic max-w-lg mx-auto leading-relaxed">
            "We are not building smarter tools. We are building new kinds of minds."
          </p>
        </div>
      </div>
    </section>
  );
}

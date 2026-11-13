import { useIntersection } from '../../hooks/useIntersection';

const STATS = [
  { value: '5', label: 'Autonomous Agents', suffix: '' },
  { value: '99.9', label: 'Network Uptime', suffix: '%' },
  { value: '1M+', label: 'Tasks Processed', suffix: '' },
  { value: '<10', label: 'Response Time', suffix: 'ms' },
];

const LINKS = [
  { label: 'Universe', href: '#universe' },
  { label: 'Agents', href: '#agents' },
  { label: 'Neural Network', href: '#neural' },
  { label: 'Mission Simulator', href: '#mission' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Intelligence Lab', href: '#lab' },
];

export default function Footer() {
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
          style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.04) 0%, transparent 70%)' }} />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto transition-all duration-1000"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)' }}
      >
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-20">
          {STATS.map(s => (
            <div key={s.label} className="glass rounded-3xl p-6 text-center"
              style={{ border: '1px solid rgba(14,165,233,0.1)' }}>
              <p className="text-3xl sm:text-4xl font-black mb-1"
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #7c3aed)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                {s.value}{s.suffix}
              </p>
              <p className="text-[0.6rem] font-mono tracking-[0.2em] text-blue-400/40 uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Logo + links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2
              className="text-4xl font-black tracking-[0.3em] mb-4"
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.3))',
              }}
            >
              NEXUS
            </h2>
            <p className="text-xs text-blue-200/35 leading-relaxed max-w-xs">
              The next form of intelligence. An interconnected universe of autonomous agents, neural networks, and emergent minds.
            </p>
          </div>

          <div className="md:col-span-1">
            <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-5">NAVIGATE</p>
            <ul className="space-y-3">
              {LINKS.map(l => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-xs text-blue-300/50 hover:text-blue-200 transition-colors font-mono tracking-[0.15em]"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-5">STATUS</p>
            <div className="space-y-3">
              {[
                { label: 'All Systems Operational', color: '#10b981' },
                { label: 'Neural Core Active', color: '#0ea5e9' },
                { label: 'Agent Network Live', color: '#7c3aed' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: s.color, boxShadow: `0 0 6px ${s.color}`, animation: 'pulse 2s ease-in-out infinite' }} />
                  <span className="text-xs text-blue-300/50 font-mono">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[0.6rem] font-mono tracking-[0.3em] text-blue-400/40 mb-4">ENTER THE UNIVERSE</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)', boxShadow: '0 0 25px rgba(14,165,233,0.25)' }}
              >
                BACK TO TOP
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-900/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.6rem] font-mono text-blue-400/25 tracking-widest">
            © 2026 NEXUS INTELLIGENCE SYSTEMS · ALL SYSTEMS AUTONOMOUS
          </p>
          <p className="text-[0.6rem] font-mono text-blue-400/20 tracking-wider">
            BUILT WITH ♦ THREE.JS · REACT · VITE
          </p>
        </div>
      </div>
    </footer>
  );
}

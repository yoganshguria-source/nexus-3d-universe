import { useState, useEffect } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const NAV_LINKS = [
  { label: 'Universe', href: '#universe' },
  { label: 'Agents', href: '#agents' },
  { label: 'Neural', href: '#neural' },
  { label: 'Mission', href: '#mission' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Lab', href: '#lab' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { progress } = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-px z-[100]" style={{ background: 'rgba(14,165,233,0.1)' }}>
        <div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #0ea5e9, #7c3aed, #ec4899)',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 8px rgba(14, 165, 233, 0.6)',
          }}
        />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'pt-2 pb-2' : 'pt-6 pb-4'}`}>
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${scrolled ? 'glass rounded-2xl mx-3 sm:mx-6' : ''} transition-all duration-500`}>
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-lg font-black tracking-[0.3em] transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.4))',
              }}
            >
              NEXUS
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-[0.65rem] tracking-[0.2em] text-blue-300/50 hover:text-blue-200 transition-all duration-300 font-mono uppercase hover:tracking-[0.3em]"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + mobile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo('#agents')}
                className="hidden md:block text-[0.65rem] font-semibold tracking-[0.2em] px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
                  boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
                }}
              >
                ENTER NEXUS
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                aria-label="Toggle menu"
              >
                <span className={`w-5 h-px bg-blue-400 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[0.375rem]' : ''}`} />
                <span className={`w-5 h-px bg-blue-400 transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`w-5 h-px bg-blue-400 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[0.375rem]' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-400 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass mx-3 mt-2 rounded-2xl p-6">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-sm font-mono tracking-[0.2em] text-blue-300/70 hover:text-blue-200 transition-all duration-200 py-3 border-b border-blue-900/30 last:border-0 uppercase"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('#agents')}
                className="mt-4 w-full text-[0.7rem] font-semibold tracking-[0.2em] px-5 py-3 rounded-full"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)' }}
              >
                ENTER NEXUS
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

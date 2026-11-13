import { useState, useCallback } from 'react';
import LoadingScreen from './components/ui/LoadingScreen';
import Navigation from './components/ui/Navigation';
import CustomCursor from './components/ui/CustomCursor';
import HeroSection from './components/sections/HeroSection';
import AgentUniverse from './components/sections/AgentUniverse';
import NeuralNetworkSection from './components/sections/NeuralNetwork';
import MissionSimulator from './components/sections/MissionSimulator';
import TimelineSection from './components/sections/TimelineSection';
import IntelligenceLab from './components/sections/IntelligenceLab';
import Footer from './components/sections/Footer';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <div
        className="relative min-h-screen bg-[#030712] transition-opacity duration-700"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        {!isMobile && <CustomCursor />}
        <Navigation />

        <main>
          <HeroSection />

          {/* Divider gradient between sections */}
          <div className="h-px mx-auto max-w-4xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), transparent)' }} />

          <AgentUniverse />

          <div className="h-px mx-auto max-w-4xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)' }} />

          <NeuralNetworkSection />

          <div className="h-px mx-auto max-w-4xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)' }} />

          <MissionSimulator />

          <div className="h-px mx-auto max-w-4xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2), transparent)' }} />

          <TimelineSection />

          <div className="h-px mx-auto max-w-4xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)' }} />

          <IntelligenceLab />
        </main>

        <Footer />
      </div>
    </>
  );
}

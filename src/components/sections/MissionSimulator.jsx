import { useState, useEffect, useRef } from 'react';
import { MISSIONS, AGENTS } from '../../data/agents';
import { useIntersection } from '../../hooks/useIntersection';

function StepBar({ steps, currentStep }) {
  return (
    <div className="relative flex items-center justify-between mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center flex-1 relative">
          {/* connector line */}
          {i < steps.length - 1 && (
            <div className="absolute top-3.5 left-1/2 w-full h-px z-0"
              style={{ background: i < currentStep ? 'rgba(14,165,233,0.4)' : 'rgba(30,58,95,0.5)' }} />
          )}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono z-10 transition-all duration-500"
            style={{
              background: i <= currentStep ? 'linear-gradient(135deg, #0ea5e9, #7c3aed)' : 'rgba(30,58,95,0.5)',
              border: i === currentStep ? '2px solid #38bdf8' : '1px solid transparent',
              boxShadow: i === currentStep ? '0 0 15px rgba(14,165,233,0.5)' : 'none',
            }}
          >
            {i < currentStep ? '✓' : i + 1}
          </div>
          <p className="text-[0.5rem] font-mono tracking-widest text-blue-400/40 mt-2 text-center hidden sm:block">
            {step.phase}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function MissionSimulator() {
  const { ref, isVisible } = useIntersection({ threshold: 0.05 });
  const [selectedMission, setSelectedMission] = useState(null);
  const [running, setRunning]       = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted]   = useState(false);
  const intervalRef = useRef(null);

  const startMission = (mission) => {
    if (running) return;
    setSelectedMission(mission);
    setCompleted(false);
    setCurrentStep(0);
    setRunning(true);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= mission.steps.length) {
        clearInterval(intervalRef.current);
        setCurrentStep(mission.steps.length - 1);
        setRunning(false);
        setCompleted(true);
      } else {
        setCurrentStep(step);
      }
    }, 1200);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setSelectedMission(null);
    setRunning(false);
    setCurrentStep(-1);
    setCompleted(false);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <section id="mission" className="relative py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(124,58,237,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          className="text-center mb-20 transition-all duration-1000"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }}
        >
          <div className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full mb-8">
            <div className="w-1 h-1 rounded-full bg-amber-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-[0.6rem] font-mono tracking-[0.35em] text-amber-400/70">MISSION SIMULATOR</span>
          </div>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-[0.08em] mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 40%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Deploy the<br />Intelligence
          </h2>
          <p className="max-w-xl mx-auto text-sm text-blue-200/40 leading-relaxed">
            Select a mission. Watch multiple AI agents plan, collaborate, and deliver results
            in real time. This is a front-end simulation of multi-agent coordination.
          </p>
        </div>

        {/* Mission selector */}
        {!selectedMission && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {MISSIONS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => startMission(m)}
                className="glass rounded-3xl p-7 text-left group transition-all duration-500 hover:scale-[1.02]"
                style={{
                  border: '1px solid rgba(14,165,233,0.14)',
                  transitionDelay: `${i * 80}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                }}
              >
                <div className="text-3xl mb-4">{m.icon}</div>
                <h3 className="text-base font-bold tracking-widest text-blue-200 mb-2 group-hover:text-blue-100 transition-colors">
                  {m.label}
                </h3>
                <p className="text-xs text-blue-300/45 leading-relaxed mb-5">{m.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.agents.map(a => {
                    const agent = AGENTS.find(ag => ag.name === a);
                    return (
                      <span key={a} className="text-[0.55rem] font-mono px-2.5 py-1 rounded-full tracking-widest"
                        style={{ background: `${agent?.color}18`, border: `1px solid ${agent?.color}30`, color: agent?.glowColor }}>
                        {a}
                      </span>
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Mission running */}
        {selectedMission && (
          <div className="max-w-3xl mx-auto">
            {/* Mission header */}
            <div className="glass rounded-3xl p-8 mb-5" style={{ border: '1px solid rgba(14,165,233,0.15)' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedMission.icon}</span>
                  <div>
                    <h3 className="font-black text-lg tracking-widest text-blue-200">{selectedMission.label}</h3>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {selectedMission.agents.map(a => {
                        const agent = AGENTS.find(ag => ag.name === a);
                        return (
                          <span key={a} className="text-[0.55rem] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: `${agent?.color}18`, border: `1px solid ${agent?.color}30`, color: agent?.glowColor }}>
                            {a}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <button onClick={reset}
                  className="text-xs font-mono text-blue-400/40 hover:text-blue-300 transition-colors tracking-widest">
                  RESET
                </button>
              </div>

              <StepBar steps={selectedMission.steps} currentStep={currentStep} />

              {/* Current step */}
              {currentStep >= 0 && (
                <div className="rounded-2xl p-5" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      style={{ animation: running ? 'pulse 1s ease-in-out infinite' : 'none', boxShadow: '0 0 6px #22d3ee' }} />
                    <p className="text-[0.65rem] font-mono tracking-[0.3em] text-cyan-400">
                      {selectedMission.steps[currentStep].phase.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-sm text-blue-200/70 font-mono">
                    {selectedMission.steps[currentStep].desc}
                  </p>
                </div>
              )}
            </div>

            {/* Step log */}
            <div className="glass rounded-3xl p-6 mb-5" style={{ border: '1px solid rgba(14,165,233,0.1)', fontFamily: 'JetBrains Mono, monospace' }}>
              <p className="text-[0.55rem] tracking-[0.35em] text-blue-400/40 mb-4">MISSION LOG</p>
              <div className="space-y-2.5 max-h-52 overflow-y-auto">
                {selectedMission.steps.slice(0, currentStep + 1).map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[0.6rem] text-blue-400/40 mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-[0.6rem] text-cyan-400/70">[{step.phase}] </span>
                      <span className="text-[0.65rem] text-blue-300/60">{step.desc}</span>
                    </div>
                  </div>
                ))}
                {running && (
                  <div className="flex items-center gap-2 text-[0.6rem] text-blue-400/50">
                    <span className="animate-blink">▮</span> Processing...
                  </div>
                )}
              </div>
            </div>

            {/* Result */}
            {completed && (
              <div
                className="rounded-3xl p-7 transition-all duration-700"
                style={{
                  background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(124,58,237,0.08) 100%)',
                  border: '1px solid rgba(14,165,233,0.25)',
                  boxShadow: '0 0 50px rgba(14,165,233,0.08)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px #4ade80' }} />
                  <p className="text-[0.65rem] font-mono tracking-[0.3em] text-green-400">MISSION COMPLETE</p>
                </div>
                <p className="text-sm text-blue-200/80 leading-relaxed font-mono">{selectedMission.result}</p>
                <button
                  onClick={reset}
                  className="mt-5 px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)' }}
                >
                  RUN NEW MISSION
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

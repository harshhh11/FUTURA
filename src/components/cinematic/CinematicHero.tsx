import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FloatingPhone } from './FloatingPhone';
import { PhoneOneScreen, PhoneTwoScreen } from './CinematicPhoneScreens';
import { RockyTerrain } from './RockyTerrain';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Layers, 
  ShieldAlert,
  Play
} from 'lucide-react';

// Storyboard progression states matching the original MP4 sequence:
// 1. Initial 3D Metallic Card & Balance reveal (0s - 3s)
// 2. Encrypted Passcode Security prompt on Phone B (3.5s - 6s)
// 3. Habit consistency overview drawer on Phone A & Personal typography (6.5s - 9s)
// 4. Drawer settles back to 3D Card & Balance equilibrium (9.5s - 12s)
const ANIMATION_PHASES = ['0s', '4s', '7s', '9s'] as const;
type AnimationPhase = typeof ANIMATION_PHASES[number];

export const CinematicHero: React.FC = () => {
  const { navigateTo, setIsOnboardingOpen, reducedMotion } = useApp();
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('0s');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Automated cinematic sequence progression (smooth looping without timestamps or manual scrubber)
  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setCurrentPhase((prev) => {
        const idx = ANIMATION_PHASES.indexOf(prev);
        const nextIdx = (idx + 1) % ANIMATION_PHASES.length;
        return ANIMATION_PHASES[nextIdx];
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Subtle 3D mouse parallax tracking for cinematic realism
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseTilt({
      x: -Number((y / 60).toFixed(2)),
      y: Number((x / 70).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full pt-8 pb-20 overflow-hidden bg-[#090A0C] border-b border-[#30343B]/60 select-none"
    >
      {/* Background Directional Studio Spotlights */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[550px] bg-gradient-to-b from-[#A9B8C8]/10 via-[#D5B477]/6 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/10 w-[500px] h-[500px] bg-gradient-to-tr from-white/[0.03] to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Main Full-Width Desktop Grid: Left Headline/Copy, Right Dual Floating Smartphones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[660px] lg:min-h-[720px]">
          
          {/* LEFT COLUMN: STRONG HEADLINE, SUPPORTING TEXT & ACTION BUTTONS */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6 pt-4 lg:pt-0 z-20">
            {/* Concept 2 Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#171A20] border border-[#30343B] text-xs font-mono text-[#A9B8C8] self-start shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D5B477] animate-pulse" />
              <span>CINEMATIC SHOWCASE · CONCEPT 2 REFERENCE</span>
            </div>

            {/* Headline mandated by Section 2 */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F1EA] tracking-tight leading-[1.06]">
              Your future deserves <span className="bg-gradient-to-r from-[#F4F1EA] via-[#D5B477] to-[#F4F1EA] bg-clip-text text-transparent">a plan.</span>
            </h1>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-[#A2A5AC] leading-relaxed max-w-xl font-normal">
              Understand your money. Build a realistic goal. Prepare for the unexpected.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-1">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build My Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateTo('dashboard')}
                className="px-7 py-3.5 rounded-2xl font-semibold text-sm bg-[#171A20] hover:bg-[#20242B] text-[#F4F1EA] border border-[#30343B] hover:border-[#A9B8C8]/40 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4 text-[#D5B477]" />
              </button>
            </div>

            {/* Persona Quick Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-[11px] font-mono">
              <div className="p-3 rounded-2xl bg-[#101216] border border-[#30343B]">
                <span className="text-[#A2A5AC] text-[9px] block">STUDENT PERSONA</span>
                <span className="text-[#F4F1EA] font-semibold text-xs">Aarav, 19</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#101216] border border-[#30343B]">
                <span className="text-[#A2A5AC] text-[9px] block">MONTHLY CASH</span>
                <span className="text-[#8BC6A1] font-semibold text-xs">₹8,000/mo</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#101216] border border-[#30343B]">
                <span className="text-[#A2A5AC] text-[9px] block">PLANNED SIP</span>
                <span className="text-[#D5B477] font-semibold text-xs">₹1,000/mo</span>
              </div>
            </div>

            {/* Real Web Product Assurance Indicator */}
            <div className="flex items-center space-x-2 text-xs text-[#A2A5AC] pt-1">
              <div className="w-2 h-2 rounded-full bg-[#8BC6A1]" />
              <span>Full functional web application with deterministic compounding engine</span>
            </div>
          </div>

          {/* RIGHT COLUMN: TWO SLIM PHONES SIDE BY SIDE ON ROCKY MONOLITH */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] overflow-visible">
            
            {/* The Rocky Terrain Foreground beneath the devices */}
            <RockyTerrain />

            {/* DUAL PHONES CONTAINER WITH REALISTIC DEVICE ROTATION & ELEVATION */}
            <div className="relative w-full h-[620px] sm:h-[680px] flex items-center justify-center">
              
              {/* PHONE A (Left Phone: Balance, 3D Metallic Card, Pedestal, Avatars Row) */}
              <div 
                className="absolute left-1/2 -translate-x-[92%] sm:-translate-x-[96%] top-4 sm:top-2 z-20 scale-[0.84] sm:scale-[0.92] md:scale-[0.96] lg:scale-100 origin-center transition-all duration-700 ease-out"
              >
                <FloatingPhone 
                  tiltAngle={{ x: mouseTilt.x + 2, y: mouseTilt.y - 3 }}
                  baseRotation={-2.8}
                  translateY={-6}
                  isFloating={!reducedMotion}
                  scale={1}
                  glowColor="rgba(213, 180, 119, 0.18)"
                >
                  <PhoneOneScreen 
                    timestamp={currentPhase} 
                    onActionClick={(r) => navigateTo(r as any)} 
                  />
                </FloatingPhone>
              </div>

              {/* PHONE B (Right Phone: Minimal Dark Luxury Interface, "Personal" Card / Passcode) */}
              <div 
                className="absolute left-1/2 -translate-x-[6%] sm:-translate-x-[2%] top-12 sm:top-10 z-10 scale-[0.82] sm:scale-[0.88] md:scale-[0.92] lg:scale-[0.96] origin-center transition-all duration-700 ease-out"
              >
                <FloatingPhone 
                  tiltAngle={{ x: mouseTilt.x - 2, y: mouseTilt.y + 3 }}
                  baseRotation={3.2}
                  translateY={8}
                  isFloating={!reducedMotion}
                  reverseFloat={true}
                  scale={1}
                  glowColor="rgba(226, 125, 120, 0.16)"
                >
                  <PhoneTwoScreen 
                    timestamp={currentPhase} 
                    onActionClick={(r) => navigateTo(r as any)} 
                  />
                </FloatingPhone>
              </div>

            </div>

          </div>

        </div>

        {/* THREE COMPACT VALUE SECTIONS BELOW HERO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 text-left">
          {/* Understand */}
          <div 
            onClick={() => navigateTo('explorer')}
            className="p-6 rounded-3xl bg-gradient-to-b from-[#171A20] to-[#101216] border border-[#30343B] hover:border-[#D5B477]/40 transition-all cursor-pointer group shadow-card-depth"
          >
            <div className="w-10 h-10 rounded-xl bg-[#20242B] border border-[#A9B8C8]/20 flex items-center justify-center text-[#D5B477] mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
                Understand
              </h3>
              <ArrowRight className="w-4 h-4 text-[#A2A5AC] group-hover:translate-x-1 group-hover:text-[#D5B477] transition-all" />
            </div>
            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              Compare financial options in plain language. Unpack FDs, bonds, gold, and index funds without jargon or trading hype.
            </p>
          </div>

          {/* Plan */}
          <div 
            onClick={() => navigateTo('moneyflow')}
            className="p-6 rounded-3xl bg-gradient-to-b from-[#171A20] to-[#101216] border border-[#30343B] hover:border-[#8BC6A1]/40 transition-all cursor-pointer group shadow-card-depth"
          >
            <div className="w-10 h-10 rounded-xl bg-[#20242B] border border-[#A9B8C8]/20 flex items-center justify-center text-[#8BC6A1] mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg text-[#F4F1EA] group-hover:text-[#8BC6A1] transition-colors">
                Plan
              </h3>
              <ArrowRight className="w-4 h-4 text-[#A2A5AC] group-hover:translate-x-1 group-hover:text-[#8BC6A1] transition-all" />
            </div>
            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              Build a goal around money you can actually afford to set aside. Tailored for student incomes like Aarav’s ₹8,000/month.
            </p>
          </div>

          {/* Prepare */}
          <div 
            onClick={() => navigateTo('bad_year')}
            className="p-6 rounded-3xl bg-gradient-to-b from-[#171A20] to-[#101216] border border-[#30343B] hover:border-[#E27D78]/40 transition-all cursor-pointer group shadow-card-depth"
          >
            <div className="w-10 h-10 rounded-xl bg-[#20242B] border border-[#A9B8C8]/20 flex items-center justify-center text-[#E27D78] mb-4 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg text-[#F4F1EA] group-hover:text-[#E27D78] transition-colors">
                Prepare
              </h3>
              <ArrowRight className="w-4 h-4 text-[#A2A5AC] group-hover:translate-x-1 group-hover:text-[#E27D78] transition-all" />
            </div>
            <p className="text-xs text-[#A2A5AC] leading-relaxed">
              Explore hypothetical market declines before they happen. Rehearse normal bad years so you never panic-sell when it counts.
            </p>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-14 max-w-xl mx-auto text-center space-y-2">
          <p className="text-xs text-[#A2A5AC]">
            Financial planning prototype for first-time investors. No real money required.
          </p>
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-[#D5B477]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Interactive dummy data · 100% Client-side · Deterministic compounding math</span>
          </div>
        </div>
      </div>
    </section>
  );
};

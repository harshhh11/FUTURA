import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  LogIn, 
  CheckCircle2,
  Compass,
  RotateCcw
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { 
    navigateTo, 
    setIsOnboardingOpen, 
    setIsSignInOpen, 
    hasCompletedOnboarding, 
    userProfile, 
    reducedMotion 
  } = useApp();

  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D parallax tracking on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 36;
    const y = (e.clientY - rect.top - rect.height / 2) / 36;
    setMouseTilt({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const handleGetStarted = () => {
    sound.playChime();
    setIsOnboardingOpen(true);
  };

  const handleSignIn = () => {
    sound.playClick();
    setIsSignInOpen(true);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-[100dvh] w-full bg-[#050607] text-[#F5F3EF] flex flex-col justify-between relative overflow-x-hidden select-none font-sans"
    >
      {/* Background Directional Studio Lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[550px] bg-gradient-to-b from-white/[0.04] via-[#DDBA78]/[0.025] to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#DDBA78]/[0.02] blur-3xl pointer-events-none rounded-full" />

      {/* 1. TOP BRAND HEADER */}
      <header 
        className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-5 pb-3 flex items-center justify-between z-20"
        style={{ paddingTop: 'max(1.2rem, env(safe-area-inset-top, 0px))' }}
      >
        {/* Brand Emblem & Wordmark */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => sound.playClick()}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20242B] to-[#111317] border border-[#292D35] flex items-center justify-center shadow-md group-hover:border-[#DDBA78]/50 transition-colors">
            <span className="font-display font-extrabold text-sm text-[#DDBA78] tracking-wider">F</span>
          </div>
          <span className="font-display font-black tracking-widest text-base sm:text-lg text-[#F5F3EF]">
            FUTURA
          </span>
        </div>

        {/* Status Tag */}
        <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111317]/90 border border-[#292D35] text-[10px] font-mono text-[#A2A5AD]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#80C9A0] animate-pulse" />
          <span>Disciplined Student Wealth Building</span>
        </div>

        {/* Quick Sign In button on header */}
        <button
          onClick={handleSignIn}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#191C22]/80 hover:bg-[#20242B] border border-[#292D35] hover:border-[#DDBA78]/40 text-[#F5F3EF] flex items-center space-x-1.5 transition-all cursor-pointer backdrop-blur-md"
        >
          <LogIn className="w-3.5 h-3.5 text-[#DDBA78]" />
          <span>Sign In</span>
        </button>
      </header>

      {/* 2. MAIN CENTER HERO STAGE (Mobile edge-to-edge, Desktop wide grid) */}
      <main className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-4 sm:py-8 flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Responsive Grid: Mobile centered column, Desktop 2-column balanced composition */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT / CENTER: THE 3D METALLIC SILVER-AND-BLACK FUTURA CARD OVER PEDESTAL */}
          <div className="lg:col-span-6 w-full flex flex-col items-center justify-center relative py-4 sm:py-6">
            
            {/* Floating Supporting Financial Labels (Concept 2 Instruments) */}
            {/* Upper Right Metric: [+12.4%] [Nifty 50 SIP ₹1,000.00] */}
            <div className="absolute right-2 sm:right-6 top-6 sm:top-8 z-30 flex items-center space-x-1.5 pointer-events-none animate-fadeIn">
              <span className="px-2 py-0.5 rounded-full bg-[#111317]/90 border border-[#80C9A0]/40 text-[#80C9A0] text-[10px] font-mono font-medium shadow-md backdrop-blur-md">
                +12.4%
              </span>
              <div className="text-right leading-none">
                <span className="block text-[9px] text-[#A2A5AD] -mb-0.5">Nifty 50 SIP</span>
                <span className="text-xs sm:text-sm font-semibold text-[#F5F3EF] font-mono tracking-tight">₹1,000.00</span>
              </div>
            </div>

            {/* Lower Left Metric: [Gold ETF ₹200.00] [+8.2%] */}
            <div className="absolute left-2 sm:left-6 bottom-16 sm:bottom-20 z-30 flex items-center space-x-1.5 pointer-events-none animate-fadeIn">
              <div className="text-left leading-none">
                <span className="block text-[9px] text-[#A2A5AD] -mb-0.5">Gold ETF</span>
                <span className="text-xs sm:text-sm font-semibold text-[#F5F3EF] font-mono tracking-tight">₹200.00</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#111317]/90 border border-[#DDBA78]/40 text-[#DDBA78] text-[10px] font-mono font-medium shadow-md backdrop-blur-md">
                +8.2%
              </span>
            </div>

            {/* 3D Perspective Scene Container */}
            <div 
              className="relative w-[280px] sm:w-[320px] h-[360px] sm:h-[400px] flex items-center justify-center"
              style={{
                perspective: '1200px',
                transform: `rotateX(${-mouseTilt.y * 0.5}deg) rotateY(${mouseTilt.x * 0.5}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s ease-out'
              }}
            >
              {/* THE ASYMMETRIC 3D METALLIC SILVER-AND-BLACK CARD */}
              <div
                className={`relative select-none cursor-pointer z-20 ${
                  reducedMotion ? '' : 'animate-card-floating'
                }`}
                style={{
                  transform: reducedMotion 
                    ? 'translateY(-2px) rotateX(15deg) rotateY(-24deg) rotateZ(32deg)' 
                    : undefined,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => sound.playClick()}
              >
                {/* Card Chassis: Vertical Card with Sharp Diagonal Reflection Seam */}
                <div 
                  className="w-[210px] sm:w-[228px] h-[330px] sm:h-[355px] rounded-[20px] p-5 relative overflow-hidden transition-all duration-500 shadow-2xl"
                  style={{
                    background: 'linear-gradient(134deg, #F0F4F8 0%, #D4DDE8 32%, #A8B4C2 41%, #14171E 42%, #0A0C10 70%, #050608 100%)',
                    boxShadow: `
                      0 40px 90px -20px rgba(0, 0, 0, 0.95),
                      0 15px 35px -10px rgba(0, 0, 0, 0.8),
                      inset 0 1.5px 2px rgba(255, 255, 255, 0.85),
                      inset -1.5px -1.5px 2px rgba(0, 0, 0, 0.85),
                      0 0 0 1px rgba(255, 255, 255, 0.28)
                    `
                  }}
                >
                  {/* Razor-sharp 1px diagonal specular reflection seam */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `
                        linear-gradient(134deg, 
                          rgba(255,255,255,0.4) 0%, 
                          rgba(255,255,255,0.15) 35%, 
                          rgba(255,255,255,0.95) 41%, 
                          rgba(0,0,0,0.6) 42%, 
                          rgba(0,0,0,0.8) 75%, 
                          rgba(255,255,255,0.15) 100%
                        )
                      `
                    }}
                  />

                  {/* Soft Moving Specular Highlight across the brushed metal */}
                  <div 
                    className={`absolute inset-0 pointer-events-none ${
                      reducedMotion ? 'hidden' : 'animate-card-shimmer'
                    }`}
                    style={{
                      background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.7) 52%, transparent 80%)',
                      backgroundSize: '200% 200%'
                    }}
                  />

                  {/* Razor-Sharp Specular Rim Edge on the right boundary */}
                  <div 
                    className="absolute inset-y-0 right-0 w-[3px] pointer-events-none opacity-85"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.2) 100%)',
                      boxShadow: '0 0 10px rgba(255,255,255,0.85)'
                    }}
                  />

                  {/* Fine Metallic Chamfered Edge */}
                  <div className="absolute inset-0 rounded-[20px] pointer-events-none border border-white/30" />

                  {/* Card Content */}
                  <div className="relative z-10 w-full h-full flex flex-col justify-between">
                    {/* Top Wordmark: "futura" in clean lowercase */}
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-base tracking-widest lowercase text-white/95 drop-shadow-sm">
                        futura
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                        Vault
                      </span>
                    </div>

                    {/* EMV Microchip Contacts */}
                    <div className="w-11 h-8 rounded-md bg-gradient-to-br from-[#E2E6EC] via-[#A8B2C0] to-[#757E8C] p-[1px] shadow-sm relative overflow-hidden border border-white/50 -mt-10">
                      <div className="w-full h-full rounded-[4px] bg-[#C2CAD4] relative flex items-center justify-center">
                        <div className="absolute inset-x-0 h-[1px] bg-black/35 top-2.5" />
                        <div className="absolute inset-x-0 h-[1px] bg-black/35 bottom-2.5" />
                        <div className="absolute inset-y-0 w-[1px] bg-black/35 left-3" />
                        <div className="absolute inset-y-0 w-[1px] bg-black/35 right-3" />
                        <div className="w-3 h-3 rounded-full border border-black/35" />
                      </div>
                    </div>

                    {/* Bottom Right: Contactless Radio Wave Symbol */}
                    <div className="flex items-end justify-end pb-1 pr-1">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white/80 drop-shadow-sm">
                        <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M12 7.5C14.7614 7.5 17 9.73858 17 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M12 11C13.1046 11 14 11.8954 14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <circle cx="12" cy="13.5" r="1.2" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* THE ANGULAR METALLIC PEDESTAL */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-[42%] w-[250px] pointer-events-none z-10 flex flex-col items-center">
                <div 
                  className={`w-full h-8 relative ${
                    reducedMotion ? '' : 'animate-pedestal-glow'
                  }`}
                  style={{
                    clipPath: 'polygon(16% 0%, 84% 0%, 100% 100%, 0% 100%)',
                    background: 'linear-gradient(90deg, #8E97A4 0%, #E6EDF5 30%, #FFFFFF 50%, #CAD2DC 70%, #76808E 100%)',
                    boxShadow: '0 0 30px rgba(255,255,255,0.3)'
                  }}
                >
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-white/80 blur-[2px] rounded-full" />
                </div>
                <div 
                  className="w-full h-9 -mt-[1px]"
                  style={{
                    background: 'linear-gradient(180deg, #20242C 0%, #0F1116 65%, #050608 100%)',
                    boxShadow: '0 25px 35px rgba(0,0,0,0.95)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT / HEADLINE & ACTIONS */}
          <div className="lg:col-span-6 w-full space-y-5 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#111317] border border-[#DDBA78]/35 text-xs font-mono text-[#DDBA78]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Disciplined Financial Journey</span>
            </div>

            {/* Primary Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F3EF] tracking-tight leading-[1.15]">
              Your future <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EF] via-[#DDBA78] to-[#F5F3EF]">
                deserves a plan.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-xs sm:text-sm text-[#A2A5AD] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Understand your money. Build a realistic goal. Prepare for the unexpected. Designed specifically for students and first-time investors.
            </p>

            {/* Subtle Goal-Progress Indicator Pill */}
            <div className="p-3 rounded-2xl bg-[#111317]/90 border border-[#292D35] max-w-md mx-auto lg:mx-0 flex items-center justify-between text-xs backdrop-blur-md">
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] text-[#A2A5AD] font-mono block">Baseline Student Milestone</span>
                <span className="font-semibold text-[#F5F3EF]">First Milestone: ₹10 Lakhs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-1.5 bg-[#292D35] rounded-full overflow-hidden">
                  <div className="w-[42%] h-full bg-gradient-to-r from-[#DDBA78] to-white rounded-full" />
                </div>
                <span className="font-mono text-xs font-bold text-[#DDBA78]">42%</span>
              </div>
            </div>

            {/* ACTION BUTTON ROW */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 max-w-md mx-auto lg:mx-0">
              {/* Primary Gold Button: "Get Started" or "Go to Dashboard" */}
              {hasCompletedOnboarding ? (
                <>
                  <button
                    onClick={() => {
                      sound.playChime();
                      navigateTo('dashboard');
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#DDBA78] to-[#E8CD96] text-[#050607] hover:shadow-[0_0_25px_rgba(221,186,120,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <span>Open My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-2xl text-xs font-semibold bg-[#111317] hover:bg-[#191C22] border border-[#292D35] hover:border-[#DDBA78]/40 text-[#A2A5AD] hover:text-[#F5F3EF] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Create New Plan</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#DDBA78] to-[#E8CD96] text-[#050607] hover:shadow-[0_0_25px_rgba(221,186,120,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Transparent Glass-Style Button: "Sign In" */}
                  <button
                    onClick={handleSignIn}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-[#191C22]/80 hover:bg-[#20242B] border border-[#292D35] hover:border-[#DDBA78]/50 text-[#F5F3EF] backdrop-blur-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                  >
                    <LogIn className="w-4 h-4 text-[#DDBA78]" />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick value props list */}
            <div className="pt-3 grid grid-cols-2 gap-2 text-[11px] text-[#A2A5AD] max-w-md mx-auto lg:mx-0">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
                <span>Zero complex jargon</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
                <span>Discipline over hype</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
                <span>Simulated stress-testing</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
                <span>100% private in browser</span>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* 3. UNOBTRUSIVE EDUCATIONAL DISCLAIMER FOOTER */}
      <footer 
        className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-4 text-center border-t border-[#292D35]/50 text-[10px] text-[#A2A5AD]/80 z-20"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <p className="max-w-2xl mx-auto leading-relaxed">
          Educational Disclaimer: FUTURA is an educational financial simulation tool designed for first-time investors. All projections, returns, and scenarios are hypothetical calculations, not financial advice or guaranteed investment outcomes.
        </p>
      </footer>
    </div>
  );
};

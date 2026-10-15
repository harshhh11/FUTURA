import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';
import { 
  ArrowRight, 
  Sparkles, 
  LogIn, 
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { 
    navigateTo, 
    setIsOnboardingOpen, 
    setIsSignInOpen, 
    hasCompletedOnboarding, 
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

  // Reusable 3D Metallic Card Illustration matching the desktop reference
  const renderCardScene = (scale: 'mobile' | 'desktop') => {
    const isMobile = scale === 'mobile';

    return (
      <div className="relative w-full flex flex-col items-center justify-center py-2 sm:py-4 select-none">
        {/* Floating Supporting Financial Labels (Exact match to reference) */}
        {/* Upper Right Metric: [+12.4%] [Nifty 50 SIP ₹1,000.00] */}
        <div className={`absolute z-30 flex items-center space-x-1.5 pointer-events-none animate-fadeIn ${
          isMobile 
            ? 'right-2 sm:right-6 top-1 sm:top-2 scale-90' 
            : 'right-1 sm:right-6 top-4 sm:top-6'
        }`}>
          <span className="px-2 py-0.5 rounded-full bg-[#15171C]/90 border border-[#80C9A0]/40 text-[#80C9A0] text-[10px] font-mono font-medium shadow-md backdrop-blur-md">
            +12.4%
          </span>
          <div className="text-right leading-none">
            <span className="block text-[9px] text-[#A6AFBD] -mb-0.5">Nifty 50 SIP</span>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F3EF] font-mono tracking-tight">₹1,000.00</span>
          </div>
        </div>

        {/* Lower Left Metric: [Gold ETF ₹200.00] [+8.2%] */}
        <div className={`absolute z-30 flex items-center space-x-1.5 pointer-events-none animate-fadeIn ${
          isMobile 
            ? 'left-2 sm:left-6 bottom-10 sm:bottom-12 scale-90' 
            : 'left-1 sm:left-6 bottom-16 sm:bottom-20'
        }`}>
          <div className="text-left leading-none">
            <span className="block text-[9px] text-[#A6AFBD] -mb-0.5">Gold ETF</span>
            <span className="text-xs sm:text-sm font-semibold text-[#F5F3EF] font-mono tracking-tight">₹200.00</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#15171C]/90 border border-[#E6C17D]/40 text-[#E6C17D] text-[10px] font-mono font-medium shadow-md backdrop-blur-md">
            +8.2%
          </span>
        </div>

        {/* 3D Perspective Scene Container */}
        <div 
          className={`relative flex items-center justify-center ${
            isMobile 
              ? 'w-[240px] sm:w-[280px] h-[270px] sm:h-[310px]' 
              : 'w-[290px] sm:w-[320px] h-[370px] sm:h-[400px]'
          }`}
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
              className={`rounded-[18px] sm:rounded-[20px] p-4 sm:p-5 relative overflow-hidden transition-all duration-500 shadow-2xl ${
                isMobile 
                  ? 'w-[170px] sm:w-[195px] h-[260px] sm:h-[295px]' 
                  : 'w-[215px] sm:w-[228px] h-[335px] sm:h-[355px]'
              }`}
              style={{
                background: 'linear-gradient(134deg, #F0F4F8 0%, #D4DDE8 32%, #A8B4C2 41%, #15171C 42%, #0A0C10 70%, #08090B 100%)',
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
              <div className="absolute inset-0 rounded-[18px] sm:rounded-[20px] pointer-events-none border border-white/30" />

              {/* Card Content */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between">
                {/* Top Wordmark: "futura" in clean lowercase, "Vault" on right */}
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm sm:text-base tracking-widest lowercase text-white/95 drop-shadow-sm">
                    futura
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-white/50 uppercase">
                    Vault
                  </span>
                </div>

                {/* EMV Microchip Contacts */}
                <div className="w-9 sm:w-11 h-7 sm:h-8 rounded-md bg-gradient-to-br from-[#E2E6EC] via-[#A8B2C0] to-[#757E8C] p-[1px] shadow-sm relative overflow-hidden border border-white/50 -mt-8 sm:-mt-10">
                  <div className="w-full h-full rounded-[4px] bg-[#C2CAD4] relative flex items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-black/35 top-2.5" />
                    <div className="absolute inset-x-0 h-[1px] bg-black/35 bottom-2.5" />
                    <div className="absolute inset-y-0 w-[1px] bg-black/35 left-3" />
                    <div className="absolute inset-y-0 w-[1px] bg-black/35 right-3" />
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border border-black/35" />
                  </div>
                </div>

                {/* Bottom Right: Contactless Radio Wave Symbol */}
                <div className="flex items-end justify-end pb-1 pr-1">
                  <svg viewBox="0 0 24 24" className="w-6 sm:w-7 h-6 sm:h-7 text-white/80 drop-shadow-sm">
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
          <div className={`absolute -bottom-2 left-1/2 -translate-x-[42%] pointer-events-none z-10 flex flex-col items-center ${
            isMobile ? 'w-[200px] sm:w-[220px]' : 'w-[250px]'
          }`}>
            <div 
              className={`w-full h-7 sm:h-8 relative ${
                reducedMotion ? '' : 'animate-pedestal-glow'
              }`}
              style={{
                clipPath: 'polygon(16% 0%, 84% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(90deg, #8E97A4 0%, #E6EDF5 30%, #FFFFFF 50%, #CAD2DC 70%, #76808E 100%)',
                boxShadow: '0 0 30px rgba(255,255,255,0.3)'
              }}
            >
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-2.5 sm:h-3 bg-white/80 blur-[2px] rounded-full" />
            </div>
            <div 
              className="w-full h-8 sm:h-9 -mt-[1px]"
              style={{
                background: 'linear-gradient(180deg, #20242C 0%, #0F1116 65%, #08090B 100%)',
                boxShadow: '0 25px 35px rgba(0,0,0,0.95)'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-[100dvh] w-full bg-[#08090B] text-[#F5F3EF] flex flex-col justify-between relative overflow-x-hidden select-none font-sans"
    >
      {/* Background Directional Studio Lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[550px] bg-gradient-to-b from-white/[0.04] via-[#E6C17D]/[0.025] to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#E6C17D]/[0.02] blur-3xl pointer-events-none rounded-full" />

      {/* 1. TOP BRAND HEADER (Exact match to reference) */}
      <header 
        className="w-full max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-2 flex items-center justify-between z-20 shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}
      >
        {/* Brand Emblem & Wordmark */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => sound.playClick()}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20232A] to-[#15171C] border border-[#30343C] flex items-center justify-center shadow-md group-hover:border-[#E6C17D]/50 transition-colors">
            <span className="font-display font-extrabold text-sm text-[#E6C17D] tracking-wider">F</span>
          </div>
          <span className="font-display font-black tracking-widest text-base sm:text-lg text-[#F5F3EF]">
            FUTURA
          </span>
        </div>

        {/* Status Tag (Center pill in reference) */}
        <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#15171C]/90 border border-[#30343C] text-[11px] font-mono text-[#A6AFBD]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#80C9A0] animate-pulse" />
          <span>Disciplined Student Wealth Building</span>
        </div>

        {/* Quick Sign In button on header */}
        <button
          onClick={handleSignIn}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#20232A]/80 hover:bg-[#20232A] border border-[#30343C] hover:border-[#E6C17D]/40 text-[#F5F3EF] flex items-center space-x-1.5 transition-all cursor-pointer backdrop-blur-md"
        >
          <LogIn className="w-3.5 h-3.5 text-[#E6C17D]" />
          <span>Sign In</span>
        </button>
      </header>

      {/* 2. MAIN CONTENT STAGE */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-3 sm:py-6 flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* =========================================================================
            MOBILE LAYOUT (< lg): STRICT SEQUENTIAL ORDER 1 to 8 FROM SECTION 3
            1. Brand Header (already rendered above)
            2. Headline & Description
            3. Prominent metallic card animation
            4. Goal milestone preview
            5. Full-width Get Started button
            6. Sign In button below it
            7. Compact trust indicators
            8. Readable disclaimer (rendered in footer)
            ========================================================================= */}
        <div className="lg:hidden w-full flex flex-col items-center space-y-4 text-center my-auto">
          
          {/* 2. Headline & Description */}
          <div className="space-y-2 max-w-md mx-auto pt-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#15171C] border border-[#E6C17D]/35 text-[10px] font-mono text-[#E6C17D]">
              <Sparkles className="w-3 h-3" />
              <span>Disciplined Financial Journey</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#F5F3EF] tracking-tight leading-tight">
              Your future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EF] via-[#E6C17D] to-[#F5F3EF]">
                deserves a plan.
              </span>
            </h1>
            <p className="text-xs text-[#A6AFBD] leading-relaxed max-w-xs mx-auto">
              Understand your money. Build a realistic goal. Prepare for the unexpected. Designed specifically for students and first-time investors.
            </p>
          </div>

          {/* 3. Prominent Metallic Card Animation */}
          <div className="w-full max-w-sm flex justify-center py-1 overflow-visible">
            {renderCardScene('mobile')}
          </div>

          {/* 4. Goal Milestone Preview */}
          <div className="w-full max-w-sm p-3 rounded-2xl bg-[#15171C]/90 border border-[#30343C] flex items-center justify-between text-xs backdrop-blur-md">
            <div className="space-y-0.5 text-left">
              <span className="text-[10px] text-[#A6AFBD] font-mono block">Baseline Student Milestone</span>
              <span className="font-semibold text-[#F5F3EF]">First Milestone: ₹10 Lakhs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1.5 bg-[#30343C] rounded-full overflow-hidden">
                <div className="w-[42%] h-full bg-gradient-to-r from-[#E6C17D] to-white rounded-full" />
              </div>
              <span className="font-mono text-xs font-bold text-[#E6C17D]">42%</span>
            </div>
          </div>

          {/* 5 & 6. Full-width Get Started + Sign In below it */}
          <div className="w-full max-w-sm space-y-2 pt-1">
            {hasCompletedOnboarding ? (
              <button
                onClick={() => {
                  sound.playChime();
                  navigateTo('dashboard');
                }}
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#E6C17D] to-[#F0D399] text-[#08090B] hover:shadow-[0_0_25px_rgba(230,193,125,0.3)] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <span>Open My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGetStarted}
                className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#E6C17D] to-[#F0D399] text-[#08090B] hover:shadow-[0_0_25px_rgba(230,193,125,0.3)] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleSignIn}
              className="w-full py-3 px-6 rounded-2xl text-xs font-semibold bg-[#20232A]/80 hover:bg-[#20232A] border border-[#30343C] hover:border-[#E6C17D]/40 text-[#F5F3EF] backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4 text-[#E6C17D]" />
              <span>Sign In</span>
            </button>
          </div>

          {/* 7. Compact Trust Indicators (2x2 Grid) */}
          <div className="w-full max-w-sm pt-2 grid grid-cols-2 gap-2 text-[11px] text-[#A6AFBD]">
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
              <span>Zero complex jargon</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
              <span>Discipline over hype</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
              <span>Simulated stress-testing</span>
            </div>
            <div className="flex items-center space-x-1.5 justify-center sm:justify-start">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#80C9A0] shrink-0" />
              <span>100% private in browser</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP LAYOUT (hidden lg:grid): IDENTICAL 2-COLUMN MATCH TO USER SCREENSHOT
            Left (col-span-6): 3D Metallic Card Scene over Pedestal
            Right (col-span-6): Title, Description, Milestone Pill, Buttons, Trust Grid
            ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center w-full">
          
          {/* LEFT: 3D Metallic Card over Pedestal */}
          <div className="col-span-6 w-full flex items-center justify-center">
            {renderCardScene('desktop')}
          </div>

          {/* RIGHT: Content, Milestone, Action Row, Trust Badges */}
          <div className="col-span-6 w-full space-y-5 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#15171C] border border-[#E6C17D]/35 text-xs font-mono text-[#E6C17D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Disciplined Financial Journey</span>
            </div>

            {/* Primary Headline */}
            <h1 className="font-display text-4xl lg:text-5xl font-black text-[#F5F3EF] tracking-tight leading-[1.15]">
              Your future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EF] via-[#E6C17D] to-[#F5F3EF]">
                deserves a plan.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm text-[#A6AFBD] leading-relaxed max-w-lg">
              Understand your money. Build a realistic goal. Prepare for the unexpected. Designed specifically for students and first-time investors.
            </p>

            {/* Goal Milestone Progress Panel */}
            <div className="p-3.5 rounded-2xl bg-[#15171C]/90 border border-[#30343C] max-w-md flex items-center justify-between text-xs backdrop-blur-md">
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] text-[#A6AFBD] font-mono block">Baseline Student Milestone</span>
                <span className="font-semibold text-[#F5F3EF]">First Milestone: ₹10 Lakhs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-1.5 bg-[#30343C] rounded-full overflow-hidden">
                  <div className="w-[42%] h-full bg-gradient-to-r from-[#E6C17D] to-white rounded-full" />
                </div>
                <span className="font-mono text-xs font-bold text-[#E6C17D]">42%</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-3 pt-2 max-w-md">
              {hasCompletedOnboarding ? (
                <>
                  <button
                    onClick={() => {
                      sound.playChime();
                      navigateTo('dashboard');
                    }}
                    className="px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#E6C17D] to-[#F0D399] text-[#08090B] hover:shadow-[0_0_25px_rgba(230,193,125,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <span>Open My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-3.5 rounded-2xl text-xs font-semibold bg-[#15171C] hover:bg-[#20232A] border border-[#30343C] hover:border-[#E6C17D]/40 text-[#A6AFBD] hover:text-[#F5F3EF] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Create New Plan</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGetStarted}
                    className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#E6C17D] to-[#F0D399] text-[#08090B] hover:shadow-[0_0_25px_rgba(230,193,125,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Transparent Glass-Style Button: "Sign In" */}
                  <button
                    onClick={handleSignIn}
                    className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-[#20232A]/80 hover:bg-[#20232A] border border-[#30343C] hover:border-[#E6C17D]/50 text-[#F5F3EF] backdrop-blur-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                  >
                    <LogIn className="w-4 h-4 text-[#E6C17D]" />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick value props list (2x2 grid) */}
            <div className="pt-3 grid grid-cols-2 gap-2 text-[11px] text-[#A6AFBD] max-w-md">
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
        className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-3 text-center border-t border-[#30343C]/40 text-[10px] text-[#A6AFBD]/80 z-20 shrink-0"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <p className="max-w-2xl mx-auto leading-relaxed">
          Educational Disclaimer: FUTURA is an educational financial simulation tool designed for first-time investors. All projections, returns, and scenarios are hypothetical calculations, not financial advice or guaranteed investment outcomes.
        </p>
      </footer>
    </div>
  );
};

export default LandingView;

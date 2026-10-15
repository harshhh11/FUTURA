import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';
import { formatINR } from '../../utils/calculations';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight as ChevronRightSmall,
  Layers,
  Sparkles
} from 'lucide-react';

interface CardHeroProps {
  onExplore?: () => void;
}

type CardFinish = 'silver' | 'gold' | 'obsidian';

export const FuturaCardHero: React.FC<CardHeroProps> = ({ onExplore }) => {
  const { navigateTo, userProfile, reducedMotion, setIsAppLauncherOpen } = useApp();
  const currentBalance = userProfile?.currentSavings || 12450;
  const goalTarget = userProfile?.goalTargetAmount || 1000000;
  const goalProgressPct = Math.min(100, Math.max(1, Math.round((currentBalance / goalTarget) * 100)));
  const monthlySip = userProfile?.comfortableMonthlyContribution || 1000;

  const [activeFinish, setActiveFinish] = useState<CardFinish>('silver');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1); // 1 = Karina (has indicator in reference)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking for realistic 3D depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current || isDrawerOpen) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 32;
    const y = (e.clientY - rect.top - rect.height / 2) / 32;
    setMouseTilt({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const cycleCard = (direction: 'next' | 'prev') => {
    sound.playClick();
    const finishes: CardFinish[] = ['silver', 'gold', 'obsidian'];
    const idx = finishes.indexOf(activeFinish);
    const nextIdx = direction === 'next'
      ? (idx + 1) % finishes.length
      : (idx - 1 + finishes.length) % finishes.length;
    setActiveFinish(finishes[nextIdx]);
  };

  // 5 FUTURA study circle & co-investors matching the 5 reference circular portraits
  const quickContacts = [
    {
      id: 0,
      name: 'Aarav',
      role: 'Tier-1 Student',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      fallbackBg: 'bg-emerald-600'
    },
    {
      id: 1,
      name: 'Karina',
      role: 'SIP Partner',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      fallbackBg: 'bg-pink-500',
      hasIndicator: true // White triangle indicator under Karina
    },
    {
      id: 2,
      name: 'Yash',
      role: 'Co-Saver',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      fallbackBg: 'bg-amber-500'
    },
    {
      id: 3,
      name: 'Priya',
      role: 'Peer Investor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      fallbackBg: 'bg-blue-600'
    },
    {
      id: 4,
      name: 'Rohan',
      role: 'SIP Leader',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      fallbackBg: 'bg-purple-600'
    }
  ];

  // Habit bars for expanded overview (Image 3)
  const habitBars = [
    { month: 'Apr', pct: '22%', height: '35%', active: false },
    { month: 'May', pct: '56%', height: '65%', active: false },
    { month: 'Jun', pct: '31%', height: '45%', active: false },
    { month: 'Aug', pct: '67%', height: '88%', active: true } // Highlighted active bar as in reference
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-transparent text-white flex flex-col justify-between items-center overflow-x-hidden select-none font-sans"
    >
      {/* Background Directional Studio Lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[520px] bg-gradient-to-b from-white/[0.05] via-white/[0.015] to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-white/[0.02] blur-3xl pointer-events-none rounded-full" />

      {/* SMARTPHONE-PROPORTIONED CANVAS (Centered on Pure Black Full Viewport) */}
      <div className="w-full max-w-[420px] sm:max-w-[440px] flex flex-col justify-between px-3 sm:px-4 pt-1 pb-4 relative z-10">

        {/* 1. TOP HEADER BAR (Mobile Only) */}
        <header 
          className="flex items-center justify-between w-full pt-1.5 pb-1 md:hidden"
          style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}
        >
          {/* Top Left: Circular Profile Portrait + "Hello, Aarav!" -> Click to return to landing page */}
          <div 
            onClick={() => {
              sound.playClick();
              navigateTo('landing');
            }}
            className="flex items-center space-x-2.5 cursor-pointer group active:scale-95 transition-all"
            title="Return to Landing Page"
            role="button"
            tabIndex={0}
            aria-label="Return to Landing Page"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#DDBA78] via-[#C2CAD4] to-[#757E8C] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#12141A] flex items-center justify-center font-bold text-xs text-[#DDBA78]">
                  <span>{userProfile?.name ? userProfile.name.charAt(0) : 'A'}</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#111317] border border-[#DDBA78]/60 flex items-center justify-center shadow-xs">
                <span className="text-[8px] font-bold text-[#DDBA78]">F</span>
              </div>
            </div>
            <div className="leading-tight">
              <span className="text-[#8E929C] text-xs font-normal block -mb-0.5">Hello,</span>
              <span className="text-white text-sm font-bold tracking-tight group-hover:text-[#DDBA78] transition-colors">
                {userProfile?.name ? userProfile.name.split(' ')[0] : 'Aarav'}!
              </span>
            </div>
          </div>

          {/* Top Right: Notification Bell with Gold Dot + 2x2 App Grid Button */}
          <div className="flex items-center space-x-2.5">
            {/* Notification Icon */}
            <button 
              onClick={() => sound.playClick()}
              className="w-8 h-8 rounded-full flex items-center justify-center relative text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DDBA78] ring-2 ring-black" />
            </button>

            {/* App Grid Icon Button [::] -> Opens FUTURA 4-Grid Launcher */}
            <button 
              onClick={() => {
                sound.playChime();
                setIsAppLauncherOpen(true);
              }}
              className="w-9 h-9 rounded-2xl bg-[#1C1F26] border border-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-[#282D37] hover:border-white/25 active:scale-95 transition-all shadow-sm group cursor-pointer"
              title="Open Navigation Menu"
              aria-label="Open navigation menu"
            >
              <div className="grid grid-cols-2 gap-[3px] w-3.5 h-3.5 group-hover:scale-105 transition-transform">
                <div className="w-1.5 h-1.5 rounded-[2px] bg-white/90" />
                <div className="w-1.5 h-1.5 rounded-[2px] bg-white/90" />
                <div className="w-1.5 h-1.5 rounded-[2px] bg-white/90" />
                <div className="w-1.5 h-1.5 rounded-[2px] bg-white/90" />
              </div>
            </button>
          </div>
        </header>

        {/* 2. UPPER RIGHT: "Your future, in progress." CAPTION & DYNAMIC WHITE BALANCE */}
        <div className="w-full pt-3 pb-1">
          <div className="flex flex-col items-end text-right">
            {/* Mandated Caption */}
            <span className="text-[11px] sm:text-xs text-[#8E929C] tracking-wide font-normal mb-0.5">
              Your future, in progress.
            </span>

            {/* Large White Balance: Dynamic from User Profile (Click opens Balance page) */}
            <div 
              onClick={() => {
                sound.playClick();
                navigateTo('balance');
              }}
              className="flex items-baseline justify-end text-3xl sm:text-[40px] font-extrabold text-white tracking-tight leading-none font-display cursor-pointer hover:opacity-95 transition-opacity"
              title="Click to view Balance page"
            >
              <span>{formatINR(currentBalance)}</span>
            </div>

            {/* Dynamic Goal Milestone Progress Indicator */}
            <div className="flex items-center space-x-1.5 mt-1.5">
              <span className="text-[10px] font-mono text-[#8E929C]">Goal Milestone</span>
              <div className="w-16 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#DDBA78] to-white rounded-full transition-all duration-500" 
                  style={{ width: `${goalProgressPct}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-[#DDBA78] font-bold">{goalProgressPct}%</span>
            </div>
          </div>
        </div>

        {/* 3. CENTER STAGE: DRAMATIC ASYMMETRIC 3D METALLIC CARD SUSPENDED OVER PEDESTAL */}
        <div className="relative w-full my-auto py-2 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[410px]">
          
          {/* FLOATING SUPPORTING FINANCIAL DETAILS (FUTURA Instruments, positioned in negative space) */}
          {/* Upper Right Metric: [+12.4%] [Nifty 50 SIP from user profile] */}
          <div className="absolute right-0 top-3 z-30 flex items-center space-x-1.5 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-[#181B22] border border-[#8BC6A1]/30 text-[#8BC6A1] text-[10px] font-mono font-medium shadow-sm">
              +12.4%
            </span>
            <div className="text-right leading-none">
              <span className="block text-[10px] text-[#8E929C] -mb-0.5">Nifty 50 SIP</span>
              <span className="text-xs sm:text-sm font-semibold text-white font-mono tracking-tight">{formatINR(monthlySip)}</span>
            </div>
          </div>

          {/* Lower Left Metric: [Gold ETF] [+8.2%] */}
          <div className="absolute left-0 bottom-16 z-30 flex items-center space-x-1.5 pointer-events-none">
            <div className="text-left leading-none">
              <span className="block text-[10px] text-[#8E929C] -mb-0.5">Gold ETF</span>
              <span className="text-xs sm:text-sm font-semibold text-white font-mono tracking-tight">{formatINR(Math.round(monthlySip * 0.2))}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#181B22] border border-[#DDBA78]/30 text-[#DDBA78] text-[10px] font-mono font-medium shadow-sm">
              +8.2%
            </span>
          </div>

          {/* Left Navigation Chevron Button (<) */}
          <button
            onClick={() => cycleCard('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-[#13151A]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#1E222A] hover:border-white/25 active:scale-95 transition-all shadow-lg"
            title="Previous Card Finish"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Navigation Chevron Button (>) */}
          <button
            onClick={() => cycleCard('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-[#13151A]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#1E222A] hover:border-white/25 active:scale-95 transition-all shadow-lg"
            title="Next Card Finish"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* 3D PERSPECTIVE SCENE CONTAINER */}
          <div 
            className="relative w-[300px] h-[370px] flex items-center justify-center"
            style={{
              perspective: '1200px',
              transform: `rotateX(${-mouseTilt.y * 0.4}deg) rotateY(${mouseTilt.x * 0.4}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s ease-out'
            }}
          >
            {/* THE ASYMMETRIC 3D METALLIC SILVER CARD (Poised diagonally from upper-left to lower-right) */}
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
              onClick={() => cycleCard('next')}
            >
              {/* Card Chassis: Vertical Card with Sharp Diagonal Reflection Seam */}
              <div 
                className={`w-[215px] sm:w-[228px] h-[335px] sm:h-[355px] rounded-[18px] p-5 relative overflow-hidden transition-all duration-500`}
                style={{
                  background: activeFinish === 'silver'
                    ? 'linear-gradient(134deg, #F0F4F8 0%, #D4DDE8 32%, #A8B4C2 41%, #14171E 42%, #0A0C10 70%, #050608 100%)'
                    : activeFinish === 'gold'
                    ? 'linear-gradient(134deg, #FFF4DC 0%, #E8CD96 32%, #D5B477 41%, #241D12 42%, #0F0C07 70%, #050402 100%)'
                    : 'linear-gradient(134deg, #5A6270 0%, #303642 32%, #1C2028 41%, #0D0E12 42%, #060709 70%, #020203 100%)',
                  boxShadow: `
                    0 40px 90px -20px rgba(0, 0, 0, 0.95),
                    0 15px 35px -10px rgba(0, 0, 0, 0.8),
                    inset 0 1.5px 2px rgba(255, 255, 255, 0.85),
                    inset -1.5px -1.5px 2px rgba(0, 0, 0, 0.85),
                    0 0 0 1px rgba(255, 255, 255, 0.28)
                  `
                }}
              >
                {/* 1. Razor-sharp 1px diagonal specular reflection seam */}
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

                {/* 2. Soft Moving Specular Highlight across the brushed metal */}
                <div 
                  className={`absolute inset-0 pointer-events-none ${
                    reducedMotion ? 'hidden' : 'animate-card-shimmer'
                  }`}
                  style={{
                    background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.7) 52%, transparent 80%)',
                    backgroundSize: '200% 200%'
                  }}
                />

                {/* 3. Razor-Sharp Specular Rim Edge on the right boundary */}
                <div 
                  className="absolute inset-y-0 right-0 w-[3px] pointer-events-none opacity-85"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.2) 100%)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.85)'
                  }}
                />

                {/* 4. Fine Metallic Chamfered Edge */}
                <div className="absolute inset-0 rounded-[18px] pointer-events-none border border-white/30" />

                {/* CARD CONTENT (Clean, elegant, FUTURA-branded) */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between">
                  {/* Top Wordmark: "futura" in clean lowercase */}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base tracking-widest lowercase text-white/90 drop-shadow-sm">
                      futura
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                      Vault
                    </span>
                  </div>

                  {/* Upper-Left: EMV Microchip Contacts */}
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

            {/* THE ANGULAR METALLIC PEDESTAL (Shifted under the hovering tip with ~14px levitation gap) */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-[42%] w-[250px] pointer-events-none z-10 flex flex-col items-center">
              {/* Illuminated Top Facet of the Pedestal (Trapezoid in perspective) */}
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
                {/* Specular Light Reflection directly beneath the card's hovering bottom tip */}
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-white/80 blur-[2px] rounded-full" />
              </div>

              {/* Front Shadowed Underside Facet of the Pedestal */}
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

        {/* 4. BOTTOM DOCK & INTERACTIVE EXPANDED DRAWER (Images 2 & 3) */}
        <div 
          className={`w-full transition-all duration-500 ease-out z-50 ${
            isDrawerOpen 
              ? 'fixed inset-x-0 bottom-0 max-w-[440px] mx-auto h-[70%] rounded-t-[36px] bg-[#0E1015]/98 border-t border-white/20 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-5'
              : 'rounded-2xl bg-[#0E1015]/90 border border-white/10 pt-3 pb-3 px-4 shadow-xl backdrop-blur-md cursor-pointer'
          }`}
          style={isDrawerOpen ? { paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' } : undefined}
          onClick={() => {
            if (!isDrawerOpen) {
              sound.playClick();
              setIsDrawerOpen(true);
            }
          }}
        >
          {/* Top Close Notch Button (Image 3) */}
          {isDrawerOpen && (
            <div className="relative -mt-9 mb-2 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  setIsDrawerOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                title="Close Overview"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Header Row: "Smart Allocations 5" + 4-Dot Grid Icon */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold text-white tracking-tight">
                Smart Allocations
              </span>
              <span className="text-xs font-mono text-[#8E929C] font-normal">
                5
              </span>
            </div>

            {/* 4-dot Grid Action Icon (::) */}
            <div className="grid grid-cols-2 gap-[2px] w-3 h-3 text-[#8E929C]">
              <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
              <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
              <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
              <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
            </div>
          </div>

          {/* Row of 5 Circular Profile Portraits */}
          <div className="flex items-center justify-between px-0.5 mb-2">
            {quickContacts.map((contact) => {
              const isSelected = selectedAvatar === contact.id;

              return (
                <div 
                  key={contact.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setSelectedAvatar(contact.id);
                  }}
                  className="flex flex-col items-center cursor-pointer group transition-transform active:scale-95"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[1.5px] transition-all duration-300 relative ${
                    isSelected 
                      ? 'ring-2 ring-white/85 shadow-[0_0_12px_rgba(255,255,255,0.3)]' 
                      : 'hover:ring-1 hover:ring-white/40'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#1C1F26] relative">
                      <img 
                        src={contact.image} 
                        alt={contact.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className={`absolute inset-0 flex items-center justify-center font-bold text-xs text-white ${contact.fallbackBg} -z-10`}>
                        {contact.name[0]}
                      </div>
                    </div>
                  </div>

                  {/* Indicator Triangle (as in Image 3 under Karina) */}
                  <div className="h-2 flex items-center justify-center my-0.5">
                    {contact.hasIndicator ? (
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-white" />
                    ) : (
                      <div className="w-1.5 h-1.5" />
                    )}
                  </div>

                  <span className={`text-[10px] font-medium transition-colors ${
                    isSelected ? 'text-white font-semibold' : 'text-[#8E929C] group-hover:text-white'
                  }`}>
                    {contact.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* EXPANDED CONTENT (Shown only when Drawer is opened as in Image 3) */}
          {isDrawerOpen && (
            <div className="flex-1 overflow-y-auto space-y-4 pt-2 pb-1 animate-fadeIn">
              {/* Overview Section with Habit Bars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Overview</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('moneyflow');
                    }}
                    className="text-[11px] text-[#8E929C] hover:text-white flex items-center space-x-0.5"
                  >
                    <span>Manage</span>
                    <ChevronRightSmall className="w-3 h-3" />
                  </button>
                </div>

                {/* 4 Frosted Habit Bars matching Image 3 */}
                <div className="grid grid-cols-4 gap-2.5 h-28 items-end p-2 rounded-2xl bg-[#14171E] border border-white/5">
                  {habitBars.map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-end h-full space-y-1">
                      <div className="w-full h-full flex items-end justify-center">
                        <div 
                          className={`w-full rounded-xl transition-all duration-500 flex flex-col justify-between p-1.5 items-center ${
                            bar.active 
                              ? 'bg-[#2A2E38] border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                              : 'bg-[#1C1F26] border border-white/5'
                          }`}
                          style={{ height: bar.height }}
                        >
                          <span className={`text-[10px] font-mono font-semibold ${bar.active ? 'text-white' : 'text-[#8E929C]'}`}>
                            {bar.pct}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono ${bar.active ? 'text-white font-bold' : 'text-[#8E929C]'}`}>
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Plans / Monthly Instruments (replacing subscriptions) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Active Plans</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('portfolio');
                    }}
                    className="text-[11px] text-[#8E929C] hover:text-white flex items-center space-x-0.5"
                  >
                    <span>Manage</span>
                    <ChevronRightSmall className="w-3 h-3" />
                  </button>
                </div>

                {/* Overlapping Asset Icons row */}
                <div className="flex items-center space-x-1.5 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#8BC6A1] flex items-center justify-center text-[10px] font-bold text-black ring-2 ring-black">
                    📈
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#D5B477] flex items-center justify-center text-[10px] font-bold text-black -ml-2 ring-2 ring-black">
                    🪙
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#A9B8C8] flex items-center justify-center text-[10px] font-bold text-black -ml-2 ring-2 ring-black">
                    🏦
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#20242B] border border-white/20 flex items-center justify-center text-[9px] font-mono text-white -ml-2 ring-2 ring-black">
                    +2
                  </div>
                </div>

                {/* Instrument Item 1: Nifty 50 */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('explorer');
                  }}
                  className="p-3 rounded-2xl bg-[#14171E] border border-white/10 hover:border-white/25 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#20242B] border border-[#8BC6A1]/40 flex items-center justify-center text-[#8BC6A1]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#D5B477] transition-colors">
                        Nifty 50 Index SIP
                      </h4>
                      <p className="text-[10px] text-[#8E929C]">Next SIP 15 Oct · Disciplined</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-white">₹1,000.00</span>
                    <span className="text-[9px] text-[#8BC6A1] block font-mono">+12.4% p.a.</span>
                  </div>
                </div>

                {/* Instrument Item 2: Gold ETF */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('explorer');
                  }}
                  className="p-3 rounded-2xl bg-[#14171E] border border-white/10 hover:border-white/25 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#20242B] border border-[#D5B477]/40 flex items-center justify-center text-[#D5B477]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#D5B477] transition-colors">
                        Sovereign Gold ETF
                      </h4>
                      <p className="text-[10px] text-[#8E929C]">Next SIP 15 Oct · Inflation Hedge</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-white">₹200.00</span>
                    <span className="text-[9px] text-[#D5B477] block font-mono">+8.2% p.a.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FuturaCardHero;

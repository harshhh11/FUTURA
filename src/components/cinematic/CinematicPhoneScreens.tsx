import React, { useState } from 'react';
import { 
  CreditCard,
  Lock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bell,
  X,
  ChevronRight as ChevronRightSmall
} from 'lucide-react';

interface PhoneScreenProps {
  timestamp: string; // '0s' | '1s' | '2s' | '3s' | '4s' | '5s' | '6s' | '7s' | '8s' | '9s' | '10s'
  onActionClick?: (route: string) => void;
}

/**
 * Phone A (Left Phone): FUTURA Wealth Interface
 * Follows the 0s - 10s video storyboard:
 * - 0s, 3s, 4s, 9s: 3D metallic card suspended over pedestal, balance, floating metrics, avatars row.
 * - 1s - 2s: Minimal transition state.
 * - 5s - 8s: Bottom drawer sheet slides up (scoop notch, 'X' close button, habit bars 22%, 56%, 31%, 67%, active plans).
 * - 10s: Standby locked state with padlock.
 */
export const PhoneOneScreen: React.FC<PhoneScreenProps> = ({ timestamp, onActionClick }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1); // Karina
  const [activeFinish, setActiveFinish] = useState<'silver' | 'gold'>('silver');

  const quickContacts = [
    { id: 0, name: 'Aarav', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', fallbackBg: 'bg-emerald-600' },
    { id: 1, name: 'Karina', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', fallbackBg: 'bg-pink-500', hasIndicator: true },
    { id: 2, name: 'Yash', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', fallbackBg: 'bg-amber-500' },
    { id: 3, name: 'Priya', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', fallbackBg: 'bg-blue-600' },
    { id: 4, name: 'Rohan', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', fallbackBg: 'bg-purple-600' }
  ];

  const habitBars = [
    { month: 'Apr', pct: '22%', height: '35%', active: false },
    { month: 'May', pct: '56%', height: '65%', active: false },
    { month: 'Jun', pct: '31%', height: '45%', active: false },
    { month: 'Aug', pct: '67%', height: '88%', active: true } // Highlighted active bar as in reference
  ];

  // Screen states based on storyboard timestamps
  const isMinimal = timestamp === '1s';
  const isChipReveal = timestamp === '2s';
  const isDrawerOpen = timestamp === '5s' || timestamp === '6s' || timestamp === '7s' || timestamp === '8s';
  const isStandbyLocked = timestamp === '10s';

  // 1. Standby Lock Screen (Frame 10s)
  if (isStandbyLocked) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-6 bg-black select-none animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-[#14171E] border border-white/10 flex items-center justify-center text-[#D5B477] shadow-[0_0_30px_rgba(213,180,119,0.15)] mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <span className="font-display font-bold text-sm text-white tracking-wider">FUTURA VAULT</span>
        <p className="text-[10px] text-[#8E929C] mt-1 font-mono">Plan Secured · Touch to Unlock</p>
      </div>
    );
  }

  // 2. Minimal Chip Transition (Frames 1s - 2s)
  if (isMinimal || isChipReveal) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-6 bg-black select-none animate-fadeIn">
        <div className="w-12 h-8 rounded-md bg-gradient-to-br from-[#E2E6EC] via-[#A8B2C0] to-[#757E8C] p-[1px] shadow-sm relative overflow-hidden border border-white/50 mb-3 animate-pulse">
          <div className="w-full h-full rounded-[4px] bg-[#C2CAD4] relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-[1px] bg-black/35 top-2.5" />
            <div className="absolute inset-x-0 h-[1px] bg-black/35 bottom-2.5" />
            <div className="w-3 h-3 rounded-full border border-black/35" />
          </div>
        </div>
        <div className="w-16 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-[#D5B477] animate-pulse" />
        </div>
      </div>
    );
  }

  // 3. Primary Wealth Interface (Frames 0s, 3s, 4s, 5s-8s, 9s)
  return (
    <div className="flex flex-col h-full justify-between select-none font-sans text-left relative overflow-hidden bg-black py-0.5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#D5B477] via-purple-500 to-indigo-400 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#12141A]">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="Aarav" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[#8E929C] -mb-0.5 block">Hello, Aarav!</span>
            <span className="text-xs font-semibold text-white">Tier-1 Student</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center relative text-white/80">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#B692F6]" />
          </div>
          <div className="w-7 h-7 rounded-xl bg-[#1C1F26] border border-white/10 flex items-center justify-center text-white/90">
            <div className="grid grid-cols-2 gap-[2px] w-2.5 h-2.5">
              <div className="w-1 h-1 rounded-[1px] bg-white/90" />
              <div className="w-1 h-1 rounded-[1px] bg-white/90" />
              <div className="w-1 h-1 rounded-[1px] bg-white/90" />
              <div className="w-1 h-1 rounded-[1px] bg-white/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Upper Right: "Your future, in progress." and Balance */}
      <div className="flex flex-col items-end text-right pt-1.5 pb-1 z-10">
        <span className="text-[9px] text-[#8E929C] tracking-wide font-normal">
          Your future, in progress.
        </span>
        <div className="flex items-baseline justify-end text-2xl font-extrabold text-white tracking-tight leading-none font-display">
          <span>₹12,450</span>
          <span className="text-sm font-bold text-white/90">.00</span>
        </div>
        <div className="flex items-center space-x-1.5 mt-1">
          <span className="text-[8px] font-mono text-[#8E929C]">Goal Milestone</span>
          <div className="w-12 h-1 bg-white/15 rounded-full overflow-hidden">
            <div className="w-[42%] h-full bg-gradient-to-r from-[#D5B477] to-white rounded-full" />
          </div>
          <span className="text-[8px] font-mono text-white/80 font-bold">42%</span>
        </div>
      </div>

      {/* Center 3D Floating Metallic Card Scene */}
      <div className="relative my-auto flex flex-col items-center justify-center h-[260px]">
        {/* Floating Metrics */}
        <div className="absolute right-0 top-1 z-20 flex items-center space-x-1 pointer-events-none">
          <span className="px-1.5 py-0.2 rounded-full bg-[#181B22] border border-[#8BC6A1]/30 text-[#8BC6A1] text-[8px] font-mono font-medium">
            +12.4%
          </span>
          <div className="text-right leading-none">
            <span className="block text-[8px] text-[#8E929C]">Nifty 50</span>
            <span className="text-[10px] font-semibold text-white font-mono">₹1,000</span>
          </div>
        </div>

        <div className="absolute left-0 bottom-10 z-20 flex items-center space-x-1 pointer-events-none">
          <div className="text-left leading-none">
            <span className="block text-[8px] text-[#8E929C]">Gold ETF</span>
            <span className="text-[10px] font-semibold text-white font-mono">₹200</span>
          </div>
          <span className="px-1.5 py-0.2 rounded-full bg-[#181B22] border border-[#D5B477]/30 text-[#D5B477] text-[8px] font-mono font-medium">
            +8.2%
          </span>
        </div>

        {/* Minimal Navigation Buttons */}
        <button
          onClick={() => setActiveFinish(activeFinish === 'silver' ? 'gold' : 'silver')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-[#13151A]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveFinish(activeFinish === 'silver' ? 'gold' : 'silver')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-[#13151A]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* 3D Perspective Card Container */}
        <div 
          className="relative w-[210px] h-[250px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {/* THE 3D METALLIC CARD */}
          <div
            className="relative select-none z-20 animate-card-floating cursor-pointer"
            onClick={() => setActiveFinish(activeFinish === 'silver' ? 'gold' : 'silver')}
          >
            <div 
              className="w-[150px] h-[230px] rounded-[14px] p-3.5 relative overflow-hidden transition-all duration-500"
              style={{
                background: activeFinish === 'silver'
                  ? 'linear-gradient(134deg, #F0F4F8 0%, #D4DDE8 32%, #A8B4C2 41%, #14171E 42%, #0A0C10 70%, #050608 100%)'
                  : 'linear-gradient(134deg, #FFF4DC 0%, #E8CD96 32%, #D5B477 41%, #241D12 42%, #0F0C07 70%, #050402 100%)',
                boxShadow: `
                  0 30px 60px -15px rgba(0, 0, 0, 0.95),
                  0 10px 20px -5px rgba(0, 0, 0, 0.8),
                  inset 0 1.5px 2px rgba(255, 255, 255, 0.85),
                  inset -1.5px -1.5px 2px rgba(0, 0, 0, 0.85),
                  0 0 0 1px rgba(255, 255, 255, 0.28)
                `
              }}
            >
              {/* Sharp 1px diagonal specular reflection seam */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(134deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.95) 41%, rgba(0,0,0,0.6) 42%, rgba(0,0,0,0.8) 75%, rgba(255,255,255,0.15) 100%)'
                }}
              />

              {/* Shimmer Highlight */}
              <div 
                className="absolute inset-0 pointer-events-none animate-card-shimmer"
                style={{
                  background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.7) 52%, transparent 80%)',
                  backgroundSize: '200% 200%'
                }}
              />

              {/* Glowing Specular Rim Edge on Right */}
              <div 
                className="absolute inset-y-0 right-0 w-[2.5px] pointer-events-none opacity-85"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.2) 100%)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.85)'
                }}
              />

              {/* Card Face Content */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs tracking-widest lowercase text-white/90">
                    futura
                  </span>
                  <span className="text-[7px] font-mono tracking-widest text-white/50 uppercase">
                    Vault
                  </span>
                </div>

                {/* EMV Microchip */}
                <div className="w-8 h-6 rounded bg-gradient-to-br from-[#E2E6EC] via-[#A8B2C0] to-[#757E8C] p-[1px] relative overflow-hidden border border-white/50 -mt-6">
                  <div className="w-full h-full rounded-[3px] bg-[#C2CAD4] relative flex items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-black/35 top-2" />
                    <div className="absolute inset-x-0 h-[1px] bg-black/35 bottom-2" />
                    <div className="w-2 h-2 rounded-full border border-black/35" />
                  </div>
                </div>

                {/* Contactless Waves */}
                <div className="flex items-end justify-end">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/80">
                    <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M12 7.5C14.7614 7.5 17 9.73858 17 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="12" cy="13.5" r="1" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pedestal (Positioned under hovering bottom corner) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-[42%] w-[180px] pointer-events-none z-10 flex flex-col items-center">
            <div 
              className="w-full h-6 relative animate-pedestal-glow"
              style={{
                clipPath: 'polygon(16% 0%, 84% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(90deg, #8E97A4 0%, #E6EDF5 30%, #FFFFFF 50%, #CAD2DC 70%, #76808E 100%)',
                boxShadow: '0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-white/80 blur-[1px] rounded-full" />
            </div>
            <div 
              className="w-full h-7 -mt-[1px]"
              style={{
                background: 'linear-gradient(180deg, #20242C 0%, #0F1116 65%, #050608 100%)',
                boxShadow: '0 20px 25px rgba(0,0,0,0.95)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Dock / Expanded Drawer (Animated based on 5s-8s timestamp) */}
      <div className={`w-full transition-all duration-500 ease-out z-40 ${
        isDrawerOpen 
          ? 'absolute inset-x-0 bottom-0 h-[72%] rounded-t-3xl bg-[#0E1015]/95 border-t border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-3.5'
          : 'rounded-t-2xl bg-[#0E1015]/90 border-t border-white/10 pt-2.5 pb-3 px-3 shadow-xl'
      }`}>
        {/* Top Close Scoop Notch (Frame 6s-8s) */}
        {isDrawerOpen && (
          <div className="relative -mt-7 mb-1 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        )}

        {/* Header Row */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-white tracking-tight">Smart Allocations</span>
            <span className="text-[10px] font-mono text-[#8E929C]">5</span>
          </div>
          <div className="grid grid-cols-2 gap-[2px] w-2.5 h-2.5 text-[#8E929C]">
            <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
            <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
            <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
            <div className="w-1 h-1 rounded-[1px] bg-[#8E929C]" />
          </div>
        </div>

        {/* Avatars Row */}
        <div className="flex items-center justify-between px-0.5">
          {quickContacts.map((contact) => (
            <div key={contact.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full p-[1px] ${selectedAvatar === contact.id ? 'ring-2 ring-white/80' : ''}`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1C1F26] relative">
                  <img src={contact.image} alt={contact.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className={`absolute inset-0 flex items-center justify-center font-bold text-[9px] text-white ${contact.fallbackBg} -z-10`}>
                    {contact.name[0]}
                  </div>
                </div>
              </div>
              <div className="h-1.5 flex items-center justify-center my-0.2">
                {contact.hasIndicator && (
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-white" />
                )}
              </div>
              <span className="text-[8px] font-medium text-[#8E929C]">{contact.name}</span>
            </div>
          ))}
        </div>

        {/* Expanded Drawer Sections (Frames 6s - 8s) */}
        {isDrawerOpen && (
          <div className="flex-1 overflow-hidden space-y-2.5 pt-2 animate-fadeIn">
            {/* Overview with Habit Bars */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-white">Overview</span>
                <span className="text-[9px] text-[#8E929C] flex items-center">Manage <ChevronRightSmall className="w-2.5 h-2.5 ml-0.5" /></span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-16 items-end p-1.5 rounded-xl bg-[#14171E] border border-white/5 relative">
                {habitBars.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end h-full">
                    <div className="w-full h-full flex items-end justify-center">
                      <div 
                        className={`w-full rounded-md transition-all duration-300 flex items-center justify-center ${
                          bar.active ? 'bg-[#2A2E38] border border-white/30' : 'bg-[#1C1F26]'
                        }`}
                        style={{ height: bar.height }}
                      >
                        <span className="text-[7px] font-mono text-white/90">{bar.pct}</span>
                      </div>
                    </div>
                    <span className="text-[7px] font-mono text-[#8E929C] mt-0.5">{bar.month}</span>
                  </div>
                ))}
                {/* Tooltip bubble on Aug bar at frame 7s */}
                {timestamp === '7s' && (
                  <div className="absolute top-1 right-2 bg-white text-black text-[7px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    ₹1,000 SIP
                  </div>
                )}
              </div>
            </div>

            {/* Active Plan Card */}
            <div className="p-2 rounded-xl bg-[#14171E] border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#20242B] text-[#8BC6A1] flex items-center justify-center text-[10px]">
                  📈
                </div>
                <div>
                  <h4 className="text-[9px] font-semibold text-white">Nifty 50 Index SIP</h4>
                  <p className="text-[7px] text-[#8E929C]">Next SIP 15 Oct</p>
                </div>
              </div>
              <span className="font-mono text-[9px] text-white font-bold">₹1,000/mo</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Phone B (Right Phone): FUTURA Personal Goal Card Interface
 * Follows the 0s - 10s video storyboard:
 * - 0s - 1s, 6s - 10s: Minimal dark luxury interface with large editorial typography "Personal", virtual silver card, and "Silver" badge.
 * - 2s - 5s: Passcode prompt ("Come up with a password to secure your plan." with `9 2 8 7` and floating rock crystal).
 */
export const PhoneTwoScreen: React.FC<PhoneScreenProps> = ({ timestamp, onActionClick }) => {
  const isPasscodeActive = timestamp === '2s' || timestamp === '3s' || timestamp === '4s' || timestamp === '5s';

  return (
    <div className="flex flex-col h-full justify-between select-none font-sans text-left relative overflow-hidden bg-black p-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10">
        <div className="flex items-center space-x-1.5">
          <span className="font-display font-bold text-xs tracking-wider text-white">futura</span>
          <span className="text-[8px] font-mono text-[#D5B477] uppercase">Vault</span>
        </div>
        <div className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-[#171A20] text-[#A2A5AC] border border-[#30343B]">
          SIMULATOR
        </div>
      </div>

      {/* DYNAMIC SCREEN CONTENT BASED ON STORYBOARD TIMESTAMPS */}
      {isPasscodeActive ? (
        /* Frames 2s - 5s: Passcode Security Setup Prompt with Floating Crystal Shard */
        <div className="flex-1 flex flex-col justify-between py-4 animate-fadeIn">
          <div>
            <div className="flex items-center space-x-1.5 text-[#D5B477] mb-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#A2A5AC]">
                Plan Security
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white leading-snug">
              Come up with a password to secure your plan.
            </h3>
            <p className="text-[9px] text-[#8E929C] mt-1 leading-relaxed">
              Protects your financial milestone simulation, monthly habit streak, and recovery models.
            </p>
          </div>

          {/* Passcode Digits Box (9 2 8 7 from video frame 4s) */}
          <div className="my-auto py-3 px-4 rounded-xl bg-[#12141A] border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {['9', '2', '8', '7'].map((digit, idx) => (
                <span key={idx} className="font-mono text-base font-bold text-white">
                  {digit}
                </span>
              ))}
              <span className="font-mono text-base text-[#D5B477] animate-pulse">_</span>
            </div>
            <span className="text-[8px] text-[#8BC6A1] font-mono bg-[#8BC6A1]/10 px-1.5 py-0.5 rounded border border-[#8BC6A1]/30">
              Encrypted
            </span>
          </div>

          {/* Floating Monolith Shard Graphic in Phone B */}
          <div className="h-28 w-full relative flex items-center justify-center">
            <svg viewBox="0 0 160 100" className="w-full h-full">
              <defs>
                <linearGradient id="crystalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A9B8C8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2A2E38" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0E1015" stopOpacity="1" />
                </linearGradient>
              </defs>
              <polygon points="80,10 135,45 110,90 50,85 25,40" fill="url(#crystalGrad)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <polyline points="80,10 65,55 110,90" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <polyline points="135,45 65,55 25,40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      ) : (
        /* Frames 0s-1s & 6s-10s: Sleek "Personal" Editorial Card Screen */
        <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
          {/* Virtual Card Frame */}
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#1F242D] via-[#14171E] to-[#0D0F13] border border-white/20 shadow-2xl overflow-hidden mt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#A9B8C8]" />
                <span className="text-[8px] font-mono tracking-widest text-[#A2A5AC] uppercase">Virtual Card</span>
              </div>
              <span className="text-[8px] font-mono text-[#D5B477] bg-[#D5B477]/10 px-1.5 py-0.5 rounded border border-[#D5B477]/30">
                Silver
              </span>
            </div>

            {/* Editorial "Personal" Typography matching reference video */}
            <div className="my-6">
              <p className="text-[8px] text-[#8E929C] font-mono uppercase tracking-widest -mb-1">
                Plan Category
              </p>
              <h2 className="text-3xl font-display font-bold tracking-tight text-white italic">
                Personal
              </h2>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px]">
              <span className="font-mono text-[#A2A5AC]">**** 4812</span>
              <span className="text-[#8BC6A1] font-mono flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active Vault</span>
              </span>
            </div>
          </div>

          {/* Rocky Monolith Fragment Graphic in Lower Portion of Phone B */}
          <div className="h-28 w-full relative flex items-center justify-center -mb-2">
            <svg viewBox="0 0 180 80" className="w-full h-full opacity-70">
              <polygon points="10,75 50,30 90,50 130,20 170,75" fill="#1C2028" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <polygon points="50,30 90,50 70,75 30,75" fill="#252A35" />
              <polygon points="90,50 130,20 150,75 110,75" fill="#2E3442" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

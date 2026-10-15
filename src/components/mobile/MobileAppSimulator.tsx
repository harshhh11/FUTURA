import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from '../layout/BottomNav';
import { FuturaCardHero } from '../cinematic/FuturaCardHero';
import { AppLauncherModal } from './AppLauncherModal';
import { sound } from '../../utils/sound';
import { 
  Wifi, 
  Battery, 
  Sparkles, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Smartphone 
} from 'lucide-react';

interface MobileAppSimulatorProps {
  children: React.ReactNode;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({ children }) => {
  const { 
    currentRoute,
    navigateTo,
    deviceViewMode, 
    setDeviceViewMode, 
    userProfile, 
    setIsOnboardingOpen,
    setIsAppLauncherOpen,
    soundEnabled,
    setSoundEnabled 
  } = useApp();

  const [scale, setScale] = useState<number>(0.92);

  if (deviceViewMode !== 'mobile_frame') {
    return <>{children}</>;
  }

  const isVaultHome = currentRoute === 'dashboard' || currentRoute === 'landing';

  const getScreenTitle = () => {
    switch (currentRoute) {
      case 'balance':
        return 'Balance';
      case 'budget':
        return 'Budget';
      case 'moneyflow':
        return 'Smart MoneyFlow';
      case 'simulator':
        return 'Goal Simulator';
      case 'portfolio':
        return 'Portfolio Builder';
      case 'explorer':
        return 'Investment Explorer';
      case 'comparison':
        return 'Compare Assets';
      case 'bad_year':
        return 'Bad-Year Rehearsal';
      case 'recovery':
        return 'Recovery Scenarios';
      case 'learning':
        return 'Learning Hub';
      case 'settings':
        return 'Profile & Settings';
      default:
        return 'FUTURA App';
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center relative overflow-x-hidden select-none">
      {/* Background Ambient Directional Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#A9B8C8]/10 via-[#D5B477]/5 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Simulator Minimal Top Toolbar */}
      <div className="w-full max-w-md mb-4 p-2.5 rounded-2xl bg-[#101216]/90 border border-[#30343B] shadow-xl flex items-center justify-between z-30 text-xs backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#20242B] border border-[#D5B477]/40 flex items-center justify-center font-bold text-xs text-[#D5B477]">
            F
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-xs text-[#F4F1EA]">FUTURA Mobile</span>
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded-full bg-[#8BC6A1]/15 text-[#8BC6A1] text-[9px] font-mono border border-[#8BC6A1]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BC6A1] animate-pulse" />
                <span>ACTIVE APP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Audio toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-[#171A20] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]"
            title={soundEnabled ? 'Mute haptic audio' : 'Enable haptic audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#D5B477]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Scale toggle (85% / 92% / 100%) */}
          <button
            onClick={() => {
              sound.playClick();
              setScale(prev => prev === 0.92 ? 1.0 : (prev === 1.0 ? 0.85 : 0.92));
            }}
            className="px-2 py-1 rounded-lg bg-[#171A20] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B] font-mono text-[10px]"
            title="Toggle device zoom"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Switch to Desktop view */}
          <button
            onClick={() => {
              sound.playClick();
              setDeviceViewMode('responsive');
            }}
            className="px-2.5 py-1 rounded-lg font-medium bg-[#171A20] hover:bg-[#20242B] text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B] flex items-center space-x-1 text-[11px]"
            title="Switch to wide desktop view"
          >
            <Monitor className="w-3 h-3 text-[#D5B477]" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* THE SMARTPHONE DEVICE CHASSIS (iPhone 16 Pro Dimensions: 393 × 852 pt) */}
      <div 
        className="transition-transform duration-300 relative select-none"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* Outer Titanium Chamfered Bezel */}
        <div className="w-[393px] h-[852px] rounded-[54px] p-[10px] bg-gradient-to-b from-[#383E4C] via-[#1D212A] to-[#0E1015] shadow-phone-glow border border-[#A9B8C8]/35 relative flex flex-col">
          {/* Inner Glare Border */}
          <div className="absolute inset-0 rounded-[54px] pointer-events-none border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />

          {/* Side Hardware Buttons */}
          <div className="absolute -left-[13px] top-[140px] w-[3px] h-[32px] bg-[#2A2F3B] rounded-l-sm" />
          <div className="absolute -left-[13px] top-[190px] w-[3px] h-[55px] bg-[#2A2F3B] rounded-l-sm" />
          <div className="absolute -left-[13px] top-[260px] w-[3px] h-[55px] bg-[#2A2F3B] rounded-l-sm" />
          <div className="absolute -right-[13px] top-[210px] w-[3px] h-[80px] bg-[#2A2F3B] rounded-r-sm" />

          {/* SCREEN DISPLAY */}
          <div className="w-full h-full rounded-[44px] bg-[#000000] border border-[#1A1E26] overflow-hidden flex flex-col relative">
            {/* iOS Status Bar */}
            <div className="h-11 px-7 pt-3 flex items-center justify-between text-[13px] font-semibold text-[#F4F1EA] z-40 shrink-0">
              <span className="font-mono">9:41</span>

              {/* Dynamic Island Pill */}
              <div className="w-28 h-6 bg-black rounded-full border border-[#252830] flex items-center justify-between px-3 mx-auto -translate-x-1 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#15171D] border border-white/10" />
                <div className="w-2 h-2 rounded-full bg-[#1E232E]" />
              </div>

              <div className="flex items-center space-x-1.5 text-[#F4F1EA]/90">
                <span className="text-[10px] font-mono font-bold">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* SCREEN CONTENT */}
            {isVaultHome ? (
              /* THE REFERENCE 3D METALLIC CARD HOME SCREEN */
              <div className="flex-1 overflow-hidden relative flex flex-col">
                <FuturaCardHero onExplore={() => navigateTo('moneyflow')} />
              </div>
            ) : (
              /* IN-APP SUB-VIEWS (MoneyFlow, Goal Simulator, Portfolio, Rehearse, etc.) */
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Sub-view Header */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#30343B]/60 bg-[#090A0C]/90 backdrop-blur-md z-30 shrink-0">
                  <button
                    onClick={() => {
                      sound.playClick();
                      navigateTo('dashboard');
                    }}
                    className="flex items-center space-x-1 text-xs text-[#A2A5AC] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#D5B477]" />
                    <span>Vault</span>
                  </button>

                  <span className="font-display font-bold text-sm text-[#F4F1EA]">
                    {getScreenTitle()}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        sound.playChime();
                        setIsAppLauncherOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#171A20] hover:bg-[#20242B] text-[#D5B477] border border-[#30343B] hover:border-[#D5B477]/50 active:scale-95 transition-all cursor-pointer"
                      title="Open Navigation Menu"
                      aria-label="Open navigation menu"
                    >
                      <div className="grid grid-cols-2 gap-[2px] w-3 h-3">
                        <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                        <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                        <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                        <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsOnboardingOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#171A20] text-[#A2A5AC] hover:text-[#D5B477] border border-[#30343B] hover:border-[#D5B477]/40 cursor-pointer"
                      title="Adjust Baseline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable View Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 text-[#F4F1EA] scrollbar-none">
                  {children}
                </div>
              </div>
            )}

            {/* PINNED 5-TAB BOTTOM NAVIGATION */}
            <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#090A0C]/95 backdrop-blur-lg border-t border-[#30343B]">
              <BottomNav isInsideFrame={true} />
            </div>

            {/* iOS Home Indicator Line */}
            <div className="absolute bottom-1 left-0 right-0 h-3 flex items-center justify-center z-40 pointer-events-none">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            </div>

            {/* In-Frame Mobile 4-Grid App Launcher Drawer */}
            <AppLauncherModal isInsideFrame={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppSimulator;

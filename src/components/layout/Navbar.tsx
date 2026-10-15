import React from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    setIsOnboardingOpen, 
    soundEnabled, 
    setSoundEnabled,
    setIsAppLauncherOpen
  } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090A0C]/90 backdrop-blur-md border-b border-[#30343B]/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Emblem */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => navigateTo('dashboard')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20242B] to-[#101216] border border-[#A9B8C8]/25 flex items-center justify-center shadow-md group-hover:border-[#D5B477]/50 transition-colors">
            <span className="font-display font-bold text-base text-[#D5B477] tracking-wider">F</span>
          </div>
          <span className="font-display font-extrabold tracking-widest text-lg text-[#F4F1EA]">
            FUTURA
          </span>
        </div>

        {/* Center Application Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          <button
            onClick={() => navigateTo('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'dashboard'
                ? 'text-[#F4F1EA] bg-[#20242B] shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateTo('balance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'balance'
                ? 'text-[#F4F1EA] bg-[#20242B] shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
            }`}
          >
            Balance
          </button>
          <button
            onClick={() => navigateTo('moneyflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'moneyflow'
                ? 'text-[#F4F1EA] bg-[#20242B] shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
            }`}
          >
            MoneyFlow
          </button>
          <button
            onClick={() => navigateTo('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'simulator'
                ? 'text-[#F4F1EA] bg-[#20242B] shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => navigateTo('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'explorer' || currentRoute === 'comparison'
                ? 'text-[#F4F1EA] bg-[#20242B] shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
            }`}
          >
            Investments
          </button>
          <button
            onClick={() => navigateTo('portfolio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'portfolio'
                ? 'text-[#F4F1EA] bg-[#20242B] shadow-sm font-semibold'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => navigateTo('bad_year')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'bad_year' || currentRoute === 'recovery'
                ? 'text-[#E27D78] bg-[#E27D78]/10 border border-[#E27D78]/25 font-semibold'
                : 'text-[#A2A5AC] hover:text-[#E27D78] hover:bg-[#171A20]'
            }`}
          >
            Rehearse
          </button>
          <button
            onClick={() => navigateTo('learning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'learning'
                ? 'text-[#8BC6A1] bg-[#8BC6A1]/10 border border-[#8BC6A1]/25 font-semibold'
                : 'text-[#A2A5AC] hover:text-[#8BC6A1] hover:bg-[#171A20]'
            }`}
          >
            Learn
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-2.5">
          {/* Subtle Tactile Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-[#171A20] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] hover:border-[#A9B8C8]/40 transition-colors"
            title={soundEnabled ? 'Mute tactile clicks' : 'Enable tactile audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D5B477]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 4-Grid App Launcher Button */}
          <button
            onClick={() => {
              sound.playChime();
              setIsAppLauncherOpen(true);
            }}
            className="p-2 rounded-lg bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] hover:border-[#D5B477]/50 text-[#F4F1EA] active:scale-95 transition-all cursor-pointer shadow-sm group"
            title="Open Feature Launcher"
            aria-label="Open navigation menu"
          >
            <div className="grid grid-cols-2 gap-[2.5px] w-3.5 h-3.5 group-hover:scale-105 transition-transform">
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#D5B477]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#D5B477]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#D5B477]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#D5B477]" />
            </div>
          </button>

          {/* Adjust Plan Baseline Modal Button */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adjust Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

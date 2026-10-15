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
    <header className="sticky top-0 z-50 w-full bg-[#08090B]/90 backdrop-blur-md border-b border-[#30343C]/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Emblem: Click to return to landing page */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => {
            sound.playClick();
            navigateTo('landing');
          }}
          title="Return to Landing Page"
          role="button"
          tabIndex={0}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20232A] to-[#15171C] border border-[#30343C] flex items-center justify-center shadow-md group-hover:border-[#E6C17D]/50 transition-colors">
            <span className="font-display font-bold text-base text-[#E6C17D] tracking-wider">F</span>
          </div>
          <span className="font-display font-extrabold tracking-widest text-lg text-[#F5F3EF] group-hover:text-[#E6C17D] transition-colors">
            FUTURA
          </span>
        </div>

        {/* Center Application Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          <button
            onClick={() => navigateTo('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'dashboard'
                ? 'text-[#F5F3EF] bg-[#20232A] shadow-sm font-semibold'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#15171C]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigateTo('balance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'balance'
                ? 'text-[#F5F3EF] bg-[#20232A] shadow-sm font-semibold'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#15171C]'
            }`}
          >
            Balance
          </button>
          <button
            onClick={() => navigateTo('moneyflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'moneyflow'
                ? 'text-[#F5F3EF] bg-[#20232A] shadow-sm font-semibold'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#15171C]'
            }`}
          >
            MoneyFlow
          </button>
          <button
            onClick={() => navigateTo('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'simulator'
                ? 'text-[#F5F3EF] bg-[#20232A] shadow-sm font-semibold'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#15171C]'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => navigateTo('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'explorer' || currentRoute === 'comparison'
                ? 'text-[#F5F3EF] bg-[#20232A] shadow-sm font-semibold'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#15171C]'
            }`}
          >
            Investments
          </button>
          <button
            onClick={() => navigateTo('portfolio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'portfolio'
                ? 'text-[#F5F3EF] bg-[#20232A] shadow-sm font-semibold'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#15171C]'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => navigateTo('bad_year')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'bad_year' || currentRoute === 'recovery'
                ? 'text-[#E27D78] bg-[#E27D78]/10 border border-[#E27D78]/25 font-semibold'
                : 'text-[#A6AFBD] hover:text-[#E27D78] hover:bg-[#15171C]'
            }`}
          >
            Rehearse
          </button>
          <button
            onClick={() => navigateTo('learning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentRoute === 'learning'
                ? 'text-[#80C9A0] bg-[#80C9A0]/10 border border-[#80C9A0]/25 font-semibold'
                : 'text-[#A6AFBD] hover:text-[#80C9A0] hover:bg-[#15171C]'
            }`}
          >
            Learn
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Subtle Tactile Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl bg-[#15171C] border border-[#30343C] text-[#A6AFBD] hover:text-[#F5F3EF] hover:border-[#E6C17D]/40 transition-colors flex items-center justify-center cursor-pointer"
            title={soundEnabled ? 'Mute tactile clicks' : 'Enable tactile audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E6C17D]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 4-Grid App Launcher Button */}
          <button
            onClick={() => {
              sound.playChime();
              setIsAppLauncherOpen(true);
            }}
            className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl bg-[#15171C] hover:bg-[#20232A] border border-[#30343C] hover:border-[#E6C17D]/50 text-[#F5F3EF] active:scale-95 transition-all cursor-pointer shadow-sm group flex items-center justify-center"
            title="Open Feature Launcher"
            aria-label="Open navigation menu"
          >
            <div className="grid grid-cols-2 gap-[2.5px] w-3.5 h-3.5 group-hover:scale-105 transition-transform">
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#E6C17D]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#E6C17D]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#E6C17D]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#E6C17D]" />
            </div>
          </button>

          {/* Adjust Plan Baseline Modal Button */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold bg-gradient-to-r from-[#E6C17D] to-[#F0D399] text-[#08090B] hover:shadow-subtle-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Adjust Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

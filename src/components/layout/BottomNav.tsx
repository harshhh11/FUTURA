import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, PiggyBank, User } from 'lucide-react';
import { ViewRoute } from '../../types/finance';
import { sound } from '../../utils/sound';

interface BottomNavProps {
  isInsideFrame?: boolean;
}

// Custom Currency Cycle icon matching the 2nd icon in Image 2 / Image 3 (Circle with arrow & currency)
const MoneyCycleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
    {/* Centered currency stroke */}
    <path d="M12 8v8" strokeWidth="1.8" />
    <path d="M9.5 10c0-1.1.9-2 2.5-2s2.5.9 2.5 2c0 2-5 1.5-5 3.5 0 1.1.9 2 2.5 2s2.5-.9 2.5-2" strokeWidth="1.8" />
  </svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({ isInsideFrame = false }) => {
  const { currentRoute, navigateTo, reducedMotion } = useApp();

  // 4 iconic tabs exactly matching Image 2 & Image 3
  const tabs: { 
    id: string;
    route: ViewRoute; 
    label: string; 
    icon: React.ElementType; 
    altRoutes?: ViewRoute[];
  }[] = [
    { 
      id: 'home',
      route: 'dashboard', 
      label: 'Home', 
      icon: Home,
      altRoutes: ['landing']
    },
    { 
      id: 'activity',
      route: 'activity', 
      label: 'Transactions', 
      icon: MoneyCycleIcon,
      altRoutes: ['balance', 'moneyflow']
    },
    { 
      id: 'budget',
      route: 'budget', 
      label: 'Plan', 
      icon: PiggyBank,
      altRoutes: ['simulator', 'portfolio', 'explorer', 'comparison', 'bad_year', 'recovery']
    },
    { 
      id: 'profile',
      route: 'settings', 
      label: 'Profile', 
      icon: User,
      altRoutes: ['learning']
    },
  ];

  return (
    <div 
      className={`${
        isInsideFrame 
          ? 'absolute inset-x-0 bottom-0 z-40' 
          : 'md:hidden fixed inset-x-0 bottom-0 z-40'
      } pointer-events-none select-none`}
    >
      {/* 
        ========================================================================
        DESIGN REQUIREMENT — TRANSLUCENT FADE EFFECT (Reference Image 2)
        - Subtle vertical gradient: transparent at the top, becoming darker and slightly more opaque toward the bottom
        - Restrained backdrop blur so content behind softly blends into the background
        - Content behind upper part remains faintly visible, creating the layered floating appearance
        - Does NOT block touch interactions with visible content (pointer-events-none)
        ========================================================================
      */}
      <div 
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080A]/95 via-[#07080A]/75 to-transparent backdrop-blur-[6px] pointer-events-none"
        aria-hidden="true"
      />

      {/* FLOATING CAPSULE PILL DOCK (Pointer-events-auto) */}
      <div className="relative z-10 w-full flex items-center justify-center pb-3 pt-2 px-4 pointer-events-none">
        <nav 
          className={`w-full max-w-[320px] h-[58px] rounded-full bg-[#111319]/90 border border-[#2D313B]/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] px-2.5 flex items-center justify-between gap-1 pointer-events-auto transition-transform duration-300 ${
            reducedMotion ? '' : 'animate-fadeIn'
          }`}
          aria-label="Mobile Navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentRoute === tab.route || (tab.altRoutes && tab.altRoutes.includes(currentRoute));

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  navigateTo(tab.route);
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 relative cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#1A1D24] border-2 border-[#D5B477] text-[#D5B477] shadow-[0_0_12px_rgba(213,180,119,0.3)] scale-105'
                    : 'bg-[#101217]/40 border border-transparent text-[#8E929C] hover:text-[#F4F1EA] hover:bg-[#1A1E26]'
                }`}
                title={tab.label}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />

                {/* Subtle indicator dot on active state */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#D5B477]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;

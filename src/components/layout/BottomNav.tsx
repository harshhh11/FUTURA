import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, PiggyBank, ShieldAlert, User } from 'lucide-react';
import { ViewRoute } from '../../types/finance';
import { sound } from '../../utils/sound';

interface BottomNavProps {
  isInsideFrame?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const { currentRoute, navigateTo, reducedMotion } = useApp();

  // 5 iconic tabs matching Section 8: Home, Explore, Plan, Rehearse, Profile
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
      id: 'explore',
      route: 'explorer', 
      label: 'Explore', 
      icon: Compass,
      altRoutes: ['portfolio', 'comparison']
    },
    { 
      id: 'plan',
      route: 'budget', 
      label: 'Plan', 
      icon: PiggyBank,
      altRoutes: ['simulator', 'moneyflow', 'balance', 'activity']
    },
    { 
      id: 'rehearse',
      route: 'bad_year', 
      label: 'Rehearse', 
      icon: ShieldAlert,
      altRoutes: ['recovery']
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
      className="md:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
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
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080A]/95 via-[#07080A]/80 to-transparent backdrop-blur-[8px] pointer-events-none"
        aria-hidden="true"
      />

      {/* FLOATING CAPSULE PILL DOCK (Pointer-events-auto) */}
      <div className="relative z-10 w-full flex items-center justify-center pb-2.5 pt-1 px-4 pointer-events-none">
        <nav 
          className={`w-full max-w-[340px] h-[58px] rounded-full bg-[#15171C]/90 border border-[#30343C]/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] px-2.5 flex items-center justify-between gap-1 pointer-events-auto transition-transform duration-300 ${
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
                    ? 'bg-[#20232A] border-2 border-[#E6C17D] text-[#E6C17D] shadow-[0_0_12px_rgba(230,193,125,0.3)] scale-105'
                    : 'bg-[#15171C]/40 border border-transparent text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#20232A]'
                }`}
                title={tab.label}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />

                {/* Subtle indicator dot on active state */}
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#E6C17D]" />
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

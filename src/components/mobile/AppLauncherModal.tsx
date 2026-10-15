import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewRoute } from '../../types/finance';
import { sound } from '../../utils/sound';
import { 
  Home, 
  Layers, 
  Target, 
  Compass, 
  Scale, 
  PieChart, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Settings, 
  X, 
  ChevronRight,
  Sparkles,
  Wallet,
  PiggyBank
} from 'lucide-react';

interface LauncherItem {
  id: string;
  name: string;
  route: ViewRoute;
  icon: React.ElementType;
  badge?: string;
}

interface LauncherGroup {
  heading: string;
  items: LauncherItem[];
}

interface AppLauncherModalProps {
  isInsideFrame?: boolean;
}

export const AppLauncherModal: React.FC<AppLauncherModalProps> = ({ isInsideFrame = false }) => {
  const { 
    isAppLauncherOpen, 
    setIsAppLauncherOpen, 
    currentRoute, 
    navigateTo, 
    reducedMotion 
  } = useApp();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 11 destinations organized into the exact 4 mandated groups
  // (Balance & Activity and Budget & Savings are excluded as they have dedicated pages)
  const groups: LauncherGroup[] = [
    {
      heading: 'CORE PLANNING',
      items: [
        { id: 'dashboard', name: 'Overview Dashboard', route: 'dashboard', icon: Home },
        { id: 'moneyflow', name: 'Smart MoneyFlow', route: 'moneyflow', icon: Layers },
        { id: 'simulator', name: 'Goal Simulator', route: 'simulator', icon: Target },
      ]
    },
    {
      heading: 'INVESTMENTS',
      items: [
        { id: 'explorer', name: 'Investment Explorer', route: 'explorer', icon: Compass },
        { id: 'comparison', name: 'Side-by-Side Compare', route: 'comparison', icon: Scale },
        { id: 'portfolio', name: 'Portfolio Builder', route: 'portfolio', icon: PieChart },
      ]
    },
    {
      heading: 'RESILIENCE & STRESS TEST',
      items: [
        { id: 'bad_year', name: 'Bad-Year Rehearsal', route: 'bad_year', icon: ShieldAlert, badge: 'Signature' },
        { id: 'recovery', name: 'Recovery Scenarios', route: 'recovery', icon: TrendingUp },
      ]
    },
    {
      heading: 'RECORDS & GROWTH',
      items: [
        { id: 'activity', name: 'Transactions & Log', route: 'activity', icon: Clock },
        { id: 'learning', name: 'Financial Learning Hub', route: 'learning', icon: BookOpen },
        { id: 'settings', name: 'Profile & Settings', route: 'settings', icon: Settings },
      ]
    }
  ];

  // Handle ESC key and focus management
  useEffect(() => {
    if (!isAppLauncherOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick();
        setIsAppLauncherOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Autofocus close button for accessibility
    closeButtonRef.current?.focus();

    // Prevent background scrolling
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isAppLauncherOpen, setIsAppLauncherOpen]);

  if (!isAppLauncherOpen) return null;

  const handleSelectDestination = (route: ViewRoute) => {
    sound.playClick();
    navigateTo(route);
    setIsAppLauncherOpen(false);
  };

  const handleClose = () => {
    sound.playClick();
    setIsAppLauncherOpen(false);
  };

  return (
    <div 
      className={
        isInsideFrame
          ? "absolute inset-0 z-50 flex flex-col justify-end select-none"
          : "fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 select-none"
      }
      role="dialog"
      aria-modal="true"
      aria-label="Application Navigation Menu"
    >
      {/* Backdrop with blur & smooth fade */}
      <div 
        onClick={handleClose}
        className={`${
          isInsideFrame ? 'absolute inset-0' : 'fixed inset-0'
        } bg-black/75 backdrop-blur-[12px] transition-opacity duration-300 ${
          reducedMotion ? '' : 'animate-fadeIn'
        }`}
        aria-hidden="true"
      />

      {/* Launcher Drawer / Modal Card with Translucent Charcoal Glass Surface */}
      <div 
        ref={drawerRef}
        className={
          isInsideFrame
            ? `relative z-10 w-full h-[92%] bg-[#0A0C10]/90 backdrop-blur-[18px] backdrop-saturate-[125%] rounded-t-[32px] border-t border-white/15 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-[#F4F1EA] ${
                reducedMotion ? '' : 'animate-slideUp'
              }`
            : `relative z-10 w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] bg-[#0A0C10]/92 backdrop-blur-[18px] backdrop-saturate-[125%] sm:rounded-3xl border-0 sm:border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-[#F4F1EA] ${
                reducedMotion ? '' : 'animate-slideUp'
              }`
        }
      >
        {/* Subtle Ambient Specular Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#D5B477]/[0.03] via-transparent to-transparent pointer-events-none rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* 1. TOP HEADER GLASS */}
        <div className="px-5 pt-5 pb-3.5 flex items-center justify-between border-b border-white/[0.08] bg-[#0E1015]/75 backdrop-blur-[16px] backdrop-saturate-[125%] shrink-0 relative z-20">
          <div className="flex items-center space-x-2.5">
            {/* 4-Square Branded Badge */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20242B]/90 to-[#14171E]/90 border border-[#D5B477]/40 flex items-center justify-center shadow-inner">
              <div className="grid grid-cols-2 gap-[2.5px] w-3 h-3">
                <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
                <div className="w-1.2 h-1.2 rounded-[1.5px] bg-[#D5B477]" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-sm tracking-wider text-[#F4F1EA]">
                  FUTURA
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#1C1F26] border border-white/10 text-[9px] font-mono text-[#D5B477]">
                  LAUNCHER
                </span>
              </div>
              <p className="text-[11px] text-[#8E929C] leading-none mt-0.5">
                Quick Feature Directory
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/10 flex items-center justify-center text-[#A2A5AC] hover:text-[#F4F1EA] transition-all cursor-pointer active:scale-95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
            aria-label="Close navigation menu"
            title="Close menu (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. SCROLLABLE FEATURE GROUPS */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-none text-xs">
          {groups.map((group) => (
            <div key={group.heading} className="space-y-1.5">
              {/* Group Heading */}
              <div className="px-2 flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[#8E929C] uppercase">
                  {group.heading}
                </span>
                <span className="text-[9px] font-mono text-[#4E5360]">
                  {group.items.length} items
                </span>
              </div>

              {/* Group Items List */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.route;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectDestination(item.route)}
                      className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group active:scale-[0.99] backdrop-blur-[6px] ${
                        isActive
                          ? 'bg-[#D5B477]/[0.08] border border-[#D5B477]/40 text-[#D5B477] shadow-[inset_0_1px_0_0_rgba(213,180,119,0.25),0_2px_12px_rgba(213,180,119,0.12)] font-semibold'
                          : 'bg-white/[0.04] hover:bg-white/[0.065] active:bg-white/[0.085] border border-white/10 hover:border-white/15 active:border-white/20 text-[#CAD2DC] hover:text-[#F4F1EA] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive 
                            ? 'bg-[#D5B477]/15 border border-[#D5B477]/30 text-[#D5B477] shadow-[inset_0_1px_0_0_rgba(213,180,119,0.2)]' 
                            : 'bg-white/[0.05] border border-white/[0.08] text-[#8E929C] group-hover:text-[#F4F1EA] group-hover:bg-white/[0.08] group-hover:border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                        }`}>
                          <Icon className="w-4 h-4 stroke-[2]" />
                        </div>

                        <span className="truncate text-xs tracking-tight">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#E27D78]/15 border border-[#E27D78]/30 text-[9px] font-mono text-[#E27D78] font-bold">
                            {item.badge}
                          </span>
                        )}

                        {isActive ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D5B477] animate-pulse" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#636875] group-hover:text-[#A2A5AC] transition-transform group-hover:translate-x-0.5" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. DOCK REMINDER FOOTER GLASS */}
        <div 
          className="px-4 py-3 bg-[#0A0C10]/85 backdrop-blur-[18px] backdrop-saturate-[125%] border-t border-white/[0.08] shadow-[0_-4px_16px_rgba(0,0,0,0.4)] flex items-center justify-between text-[11px] text-[#A6AFBD] shrink-0 relative z-20"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6C17D]/70 shadow-[0_0_6px_rgba(230,193,125,0.4)]" />
            <span>Dedicated bottom dock:</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono">
            <button
              onClick={() => handleSelectDestination('balance')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.09] active:bg-white/[0.12] border border-white/10 hover:border-[#E6C17D]/40 active:border-[#E6C17D]/60 text-[#E6C17D] hover:text-[#F5F3EF] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] active:scale-95"
            >
              <Wallet className="w-3 h-3" />
              <span>Balance</span>
            </button>
            <button
              onClick={() => handleSelectDestination('budget')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.09] active:bg-white/[0.12] border border-white/10 hover:border-[#E6C17D]/40 active:border-[#E6C17D]/60 text-[#E6C17D] hover:text-[#F5F3EF] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] active:scale-95"
            >
              <PiggyBank className="w-3 h-3" />
              <span>Budget</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

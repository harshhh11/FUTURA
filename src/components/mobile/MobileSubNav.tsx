import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewRoute } from '../../types/finance';
import { sound } from '../../utils/sound';

export const MobileSubNav: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();

  // Determine which sub-pills to show based on parent category
  const isPlanGroup = currentRoute === 'moneyflow' || currentRoute === 'simulator' || currentRoute === 'portfolio';
  const isExploreGroup = currentRoute === 'explorer' || currentRoute === 'comparison';
  const isRehearseGroup = currentRoute === 'bad_year' || currentRoute === 'recovery';
  const isProfileGroup = currentRoute === 'settings' || currentRoute === 'activity' || currentRoute === 'learning';

  if (!isPlanGroup && !isExploreGroup && !isRehearseGroup && !isProfileGroup) {
    return null;
  }

  const handleNav = (route: ViewRoute) => {
    sound.playClick();
    navigateTo(route);
  };

  return (
    <div className="w-full overflow-x-auto pb-1 pt-1 scrollbar-none select-none">
      <div className="flex items-center space-x-2 px-1">
        {/* Plan Group Sub-tabs */}
        {isPlanGroup && (
          <>
            <button
              onClick={() => handleNav('moneyflow')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'moneyflow'
                  ? 'bg-[#D5B477] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              MoneyFlow
            </button>
            <button
              onClick={() => handleNav('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'simulator'
                  ? 'bg-[#D5B477] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Goal Simulator
            </button>
            <button
              onClick={() => handleNav('portfolio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'portfolio'
                  ? 'bg-[#D5B477] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Portfolio Builder
            </button>
          </>
        )}

        {/* Explore Group Sub-tabs */}
        {isExploreGroup && (
          <>
            <button
              onClick={() => handleNav('explorer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'explorer'
                  ? 'bg-[#A9B8C8] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              6 Instruments
            </button>
            <button
              onClick={() => handleNav('comparison')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'comparison'
                  ? 'bg-[#A9B8C8] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Side-by-Side Compare
            </button>
          </>
        )}

        {/* Rehearse Group Sub-tabs */}
        {isRehearseGroup && (
          <>
            <button
              onClick={() => handleNav('bad_year')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'bad_year'
                  ? 'bg-[#E27D78] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Bad-Year Shock Test
            </button>
            <button
              onClick={() => handleNav('recovery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'recovery'
                  ? 'bg-[#8BC6A1] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Recovery Trajectories
            </button>
          </>
        )}

        {/* Profile Group Sub-tabs */}
        {isProfileGroup && (
          <>
            <button
              onClick={() => handleNav('settings')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'settings'
                  ? 'bg-[#20242B] text-[#F4F1EA] font-bold border border-[#A9B8C8]/40 shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Profile & Settings
            </button>
            <button
              onClick={() => handleNav('activity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'activity'
                  ? 'bg-[#20242B] text-[#F4F1EA] font-bold border border-[#A9B8C8]/40 shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Simulation Ledger
            </button>
            <button
              onClick={() => handleNav('learning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentRoute === 'learning'
                  ? 'bg-[#8BC6A1] text-[#090A0C] font-bold shadow-sm'
                  : 'bg-[#171A20] text-[#A2A5AC] border border-[#30343B]'
              }`}
            >
              Learning Hub
            </button>
          </>
        )}
      </div>
    </div>
  );
};

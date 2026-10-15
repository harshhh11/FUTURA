import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewRoute } from '../../types/finance';
import { formatINR } from '../../utils/calculations';
import { 
  Home, 
  Wallet,
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
  Sparkles,
  ArrowUpRight,
  PiggyBank
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface NavItem {
  route: ViewRoute;
  label: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

export const Sidebar: React.FC = () => {
  const { currentRoute, navigateTo, userProfile, setIsOnboardingOpen } = useApp();

  const navGroups: { group: string; items: NavItem[] }[] = [
    {
      group: 'Core Planning',
      items: [
        { route: 'dashboard', label: 'Overview Dashboard', icon: Home },
        { route: 'balance', label: 'Balance & Activity', icon: Wallet, color: 'text-[#D5B477]', badge: 'New' },
        { route: 'budget', label: 'Budget & Savings', icon: PiggyBank, color: 'text-[#D5B477]', badge: 'Reference' },
        { route: 'moneyflow', label: 'Smart MoneyFlow', icon: Layers, color: 'text-[#D5B477]' },
        { route: 'simulator', label: 'Goal Simulator', icon: Target },
      ]
    },
    {
      group: 'Investments',
      items: [
        { route: 'explorer', label: 'Investment Explorer', icon: Compass },
        { route: 'comparison', label: 'Side-by-Side Compare', icon: Scale },
        { route: 'portfolio', label: 'Portfolio Builder', icon: PieChart },
      ]
    },
    {
      group: 'Resilience & Stress Test',
      items: [
        { route: 'bad_year', label: 'Bad-Year Rehearsal', icon: ShieldAlert, color: 'text-[#E27D78]', badge: 'Signature' },
        { route: 'recovery', label: 'Recovery Scenarios', icon: TrendingUp },
      ]
    },
    {
      group: 'Records & Growth',
      items: [
        { route: 'activity', label: 'Transactions & Log', icon: Clock },
        { route: 'learning', label: 'Financial Learning Hub', icon: BookOpen, color: 'text-[#8BC6A1]' },
        { route: 'settings', label: 'Profile & Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-[260px] xl:w-[280px] bg-[#15171C] border-r border-[#30343C]/60 flex flex-col flex-shrink-0 sticky top-16 h-[calc(100dvh-4rem)] p-4 xl:p-4.5 select-none">
      {/* Student Profile Snapshot Card */}
      <div className="p-4 mb-5 rounded-2xl bg-gradient-to-b from-[#20232A]/90 to-[#191C22] border border-[#30343C] shadow-card-depth">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6C17D]/15 border border-[#E6C17D]/40 flex items-center justify-center text-xs font-bold text-[#E6C17D]">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F5F3EF] truncate max-w-[130px]">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-[#A6AFBD] font-mono">
                Age {userProfile.age} · Student
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOnboardingOpen(true)}
            className="p-1.5 rounded-lg bg-[#191C22] hover:bg-[#20232A] text-[#A6AFBD] hover:text-[#E6C17D] transition-colors cursor-pointer"
            title="Re-run Plan Wizard"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2.5 border-t border-[#30343C]/60 grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-[#A6AFBD]">Monthly Income</span>
            <p className="font-mono font-medium text-[#F5F3EF]">{formatINR(userProfile.monthlyIncome)}</p>
          </div>
          <div>
            <span className="text-[#A6AFBD]">Planned Savings</span>
            <p className="font-mono font-medium text-[#E6C17D]">{formatINR(userProfile.comfortableMonthlyContribution)}/mo</p>
          </div>
        </div>
      </div>

      {/* Nav Menu Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[10px] uppercase font-mono tracking-wider text-[#A6AFBD]/60 font-semibold mb-2">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => navigateTo(item.route)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#20232A] text-[#F5F3EF] shadow-sm border border-[#E6C17D]/35 font-semibold'
                        : 'text-[#A6AFBD] hover:text-[#F5F3EF] hover:bg-[#191C22]/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        item.color || (isActive ? 'text-[#E6C17D]' : 'text-[#A6AFBD] group-hover:text-[#F5F3EF]')
                      }`} />
                      <span className="truncate whitespace-nowrap">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#E27D78]/15 text-[#E27D78] border border-[#E27D78]/30 flex-shrink-0 ml-2 whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Educational Disclaimer callout */}
      <div className="mt-4 pt-3 border-t border-[#30343C]/60">
        <button
          onClick={() => navigateTo('learning')}
          className="w-full text-left p-2.5 rounded-xl bg-[#191C22] hover:bg-[#20232A] border border-[#30343C]/60 transition-colors flex items-center justify-between group cursor-pointer"
        >
          <div>
            <p className="text-[11px] font-medium text-[#F5F3EF] group-hover:text-[#E6C17D] transition-colors">
              First-Time Investor Tips
            </p>
            <p className="text-[9px] text-[#A6AFBD]">10 bite-sized guides</p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#A6AFBD] group-hover:text-[#E6C17D] transition-colors" />
        </button>
      </div>
    </aside>
  );
};

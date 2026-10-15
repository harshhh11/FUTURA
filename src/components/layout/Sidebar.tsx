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
    <aside className="w-64 bg-[#101216] border-r border-[#30343B]/60 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 select-none">
      {/* Student Profile Snapshot Card */}
      <div className="p-3.5 mb-5 rounded-2xl bg-gradient-to-b from-[#20242B]/90 to-[#171A20] border border-[#30343B] shadow-card-depth">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D5B477]/15 border border-[#D5B477]/40 flex items-center justify-center text-xs font-bold text-[#D5B477]">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F4F1EA] truncate max-w-[110px]">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-[#A2A5AC] font-mono">
                Age {userProfile.age} · Student
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOnboardingOpen(true)}
            className="p-1.5 rounded-lg bg-[#171A20] hover:bg-[#20242B] text-[#A2A5AC] hover:text-[#D5B477] transition-colors"
            title="Re-run Plan Wizard"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 border-t border-[#30343B]/60 grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-[#A2A5AC]">Monthly Income</span>
            <p className="font-mono font-medium text-[#F4F1EA]">{formatINR(userProfile.monthlyIncome)}</p>
          </div>
          <div>
            <span className="text-[#A2A5AC]">Planned Savings</span>
            <p className="font-mono font-medium text-[#D5B477]">{formatINR(userProfile.comfortableMonthlyContribution)}/mo</p>
          </div>
        </div>
      </div>

      {/* Nav Menu Groups */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[10px] uppercase font-mono tracking-wider text-[#A2A5AC]/70 mb-1.5">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => navigateTo(item.route)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-[#20242B] text-[#F4F1EA] shadow-sm border border-[#A9B8C8]/20'
                        : 'text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#171A20]/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${
                        item.color || (isActive ? 'text-[#D5B477]' : 'text-[#A2A5AC] group-hover:text-[#F4F1EA]')
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#E27D78]/15 text-[#E27D78] border border-[#E27D78]/30">
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
      <div className="mt-4 pt-3 border-t border-[#30343B]/60">
        <button
          onClick={() => navigateTo('learning')}
          className="w-full text-left p-2.5 rounded-xl bg-[#171A20] hover:bg-[#20242B] border border-[#30343B]/60 transition-colors flex items-center justify-between group"
        >
          <div>
            <p className="text-[11px] font-medium text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
              First-Time Investor Tips
            </p>
            <p className="text-[9px] text-[#A2A5AC]">10 bite-sized guides</p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#A2A5AC] group-hover:text-[#D5B477] transition-colors" />
        </button>
      </div>
    </aside>
  );
};

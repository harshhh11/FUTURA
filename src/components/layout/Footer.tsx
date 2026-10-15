import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setIsOnboardingOpen } = useApp();

  return (
    <footer className="w-full bg-[#090A0C] border-t border-[#30343B]/60 text-[#A2A5AC] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#20242B] border border-[#D5B477]/40 flex items-center justify-center font-display font-bold text-xs text-[#D5B477]">
              F
            </div>
            <span className="font-display font-extrabold tracking-widest text-base text-[#F4F1EA]">
              FUTURA
            </span>
          </div>
          <p className="text-xs text-[#A2A5AC] leading-relaxed max-w-md">
            Product Promise: <span className="text-[#F4F1EA]">Understand your money. Prepare for uncertainty. Plan your future with confidence.</span>
          </p>
          <p className="text-[11px] text-[#A2A5AC]/80 leading-relaxed max-w-md">
            Designed for 19-year-old student Aarav and first-time investors learning to navigate real-world money, compounding, and unavoidable market cycles without fear.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#F4F1EA]">
            Navigation
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => navigateTo('dashboard')} className="hover:text-[#D5B477] transition-colors">
                Overview Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('moneyflow')} className="hover:text-[#D5B477] transition-colors">
                Smart MoneyFlow
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('simulator')} className="hover:text-[#D5B477] transition-colors">
                Goal Simulator
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('explorer')} className="hover:text-[#D5B477] transition-colors">
                Investment Explorer
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('bad_year')} className="hover:text-[#E27D78] transition-colors">
                Bad-Year Rehearsal
              </button>
            </li>
          </ul>
        </div>

        {/* Actions & Prototype Info */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#F4F1EA]">
            Prototype & QA
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => setIsOnboardingOpen(true)} className="hover:text-[#D5B477] transition-colors flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#D5B477]" />
                <span>Rerun Onboarding</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('learning')} className="hover:text-[#8BC6A1] transition-colors flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-[#8BC6A1]" />
                <span>Financial Learning Hub</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('settings')} className="hover:text-[#A9B8C8] transition-colors">
                Settings & Accessibility
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mandatory Regulatory / Educational Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#30343B]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] text-[#A2A5AC]/70">
        <div className="flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#D5B477] flex-shrink-0 mt-0.5" />
          <p className="max-w-3xl leading-relaxed">
            <strong className="text-[#F4F1EA]">Educational Prototype Notice:</strong> FUTURA is a financial education and planning prototype, not a registered investment advisor, broker, or financial depository. All projections, calculations, portfolio allocations, and simulated declines are strictly illustrative mathematical models based on user inputs. Past market performance or hypothetical rates do not guarantee future returns.
          </p>
        </div>
        <p className="font-mono text-[9px] text-[#A2A5AC]/50 flex-shrink-0">
          UI/UX COMPETITION BUILD · 2026
        </p>
      </div>
    </footer>
  );
};

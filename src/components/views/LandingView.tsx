import React from 'react';
import { useApp } from '../../context/AppContext';
import { CinematicHero } from '../cinematic/CinematicHero';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Layers, 
  ShieldAlert, 
  Compass
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { navigateTo, setIsOnboardingOpen } = useApp();

  return (
    <div className="w-full space-y-16 animate-fadeIn pb-16">
      {/* 1. CINEMATIC CONCEPT 2 HERO WITH DUAL FLOATING PHONES & ROCKY MONOLITH */}
      <CinematicHero />

      {/* 2. THE AARAV STORY: DESIGNED FOR THE 19-YEAR-OLD FIRST-TIME INVESTOR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#20242B]/80 via-[#171A20] to-[#101216] border border-[#30343B] shadow-card-depth relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#D5B477]/5 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#090A0C] border border-[#D5B477]/30 text-xs font-mono text-[#D5B477]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MEET AARAV · THE STUDENT PERSONA</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] leading-tight">
                "I want to become a millionaire, but where do I actually start?"
              </h2>

              <p className="text-xs sm:text-sm text-[#A2A5AC] leading-relaxed">
                Aarav receives ₹8,000 each month from a small academic stipend and pocket money. Traditional finance apps intimidate him with complex jargon, live candlesticks, and risky day-trading.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-[#30343B]">
                  <span className="text-[#A2A5AC] text-[10px] font-mono">Monthly Cash</span>
                  <p className="font-mono font-bold text-[#F4F1EA] text-sm mt-0.5">₹8,000</p>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-[#30343B]">
                  <span className="text-[#A2A5AC] text-[10px] font-mono">Disciplined SIP</span>
                  <p className="font-mono font-bold text-[#D5B477] text-sm mt-0.5">₹1,000/mo</p>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-[#30343B] col-span-2 sm:col-span-1">
                  <span className="text-[#A2A5AC] text-[10px] font-mono">First Milestone</span>
                  <p className="font-mono font-bold text-[#8BC6A1] text-sm mt-0.5">₹10 Lakhs</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#090A0C] border border-[#30343B] min-w-[280px] space-y-3 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A2A5AC]">
                WHAT FUTURA TEACHES HIM
              </span>
              <ul className="space-y-2 text-xs text-[#F4F1EA]">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC6A1] shrink-0 mt-0.5" />
                  <span>How much he can realistically set aside</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC6A1] shrink-0 mt-0.5" />
                  <span>The difference between savings and investing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC6A1] shrink-0 mt-0.5" />
                  <span>Why projected market returns are uncertain</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8BC6A1] shrink-0 mt-0.5" />
                  <span>What happens when a bad year arrives</span>
                </li>
              </ul>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow transition-all flex items-center justify-center space-x-1"
              >
                <span>Customize Aarav's Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FEATURE HIGHLIGHTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-[#D5B477] uppercase tracking-wider">
            PRODUCT ARCHITECTURE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
            Built to answer four vital student questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Smart MoneyFlow */}
          <div 
            onClick={() => navigateTo('moneyflow')}
            className="p-6 rounded-3xl bg-[#171A20] border border-[#30343B] hover:border-[#D5B477]/40 transition-all cursor-pointer group shadow-card-depth flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#20242B] flex items-center justify-center text-[#D5B477] group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
                Smart MoneyFlow Allocator
              </h3>
              <p className="text-xs text-[#A2A5AC] leading-relaxed">
                Calculates available cash surplus after canteen, commute, and weekend spending. Warns you against over-allocating your money so you always maintain a healthy buffer.
              </p>
            </div>

            <div className="pt-3 border-t border-[#30343B]/60 flex items-center justify-between text-xs font-semibold text-[#D5B477]">
              <span>Try MoneyFlow</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Goal Simulator */}
          <div 
            onClick={() => navigateTo('simulator')}
            className="p-6 rounded-3xl bg-[#171A20] border border-[#30343B] hover:border-[#D5B477]/40 transition-all cursor-pointer group shadow-card-depth flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#20242B] flex items-center justify-center text-[#8BC6A1] group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F1EA] group-hover:text-[#8BC6A1] transition-colors">
                Compounding Goal Simulator
              </h3>
              <p className="text-xs text-[#A2A5AC] leading-relaxed">
                Clear mathematical separation between the money you personally deposit and the exponential compounding growth generated by time.
              </p>
            </div>

            <div className="pt-3 border-t border-[#30343B]/60 flex items-center justify-between text-xs font-semibold text-[#8BC6A1]">
              <span>Launch Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Bad-Year Rehearsal */}
          <div 
            onClick={() => navigateTo('bad_year')}
            className="p-6 rounded-3xl bg-[#171A20] border border-[#30343B] hover:border-[#E27D78]/50 transition-all cursor-pointer group shadow-card-depth flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#20242B] flex items-center justify-center text-[#E27D78] group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F1EA] group-hover:text-[#E27D78] transition-colors">
                Bad-Year Rehearsal (Signature Feature)
              </h3>
              <p className="text-xs text-[#A2A5AC] leading-relaxed">
                Simulate a 10%, 20%, or 30% market downturn before investing real rupees. Learn why temporary paper losses are not permanent and how continuing your SIP speeds up recovery.
              </p>
            </div>

            <div className="pt-3 border-t border-[#30343B]/60 flex items-center justify-between text-xs font-semibold text-[#E27D78]">
              <span>Rehearse a Downturn</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Plain-Language Explorer */}
          <div 
            onClick={() => navigateTo('explorer')}
            className="p-6 rounded-3xl bg-[#171A20] border border-[#30343B] hover:border-[#A9B8C8]/50 transition-all cursor-pointer group shadow-card-depth flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#20242B] flex items-center justify-center text-[#A9B8C8] group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F1EA] group-hover:text-[#A9B8C8] transition-colors">
                Six Plain-Language Categories
              </h3>
              <p className="text-xs text-[#A2A5AC] leading-relaxed">
                Savings, FDs, Bonds, Gold, Index Funds, and Mutual Funds compared across liquidity, return uncertainty, and hidden fees.
              </p>
            </div>

            <div className="pt-3 border-t border-[#30343B]/60 flex items-center justify-between text-xs font-semibold text-[#A9B8C8]">
              <span>Explore Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#171A20] via-[#20242B] to-[#101216] border border-[#D5B477]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F4F1EA]">
              Ready to plan with confidence?
            </h2>
            <p className="text-xs sm:text-sm text-[#A2A5AC] leading-relaxed">
              No live bank accounts needed. 100% interactive educational simulator designed for first-time investors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build My Plan Now</span>
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className="px-6 py-3.5 rounded-xl font-medium text-xs bg-[#101216] hover:bg-[#171A20] text-[#F4F1EA] border border-[#30343B] transition-colors"
            >
              Open Dashboard Directly
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;

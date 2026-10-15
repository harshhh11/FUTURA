import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateBadYearImpact, formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  ShieldAlert, 
  ArrowRight, 
  HelpCircle, 
  AlertTriangle 
} from 'lucide-react';

export const BadYearRehearsalView: React.FC = () => {
  const { 
    userProfile, 
    badYearDeclinePct, 
    setBadYearDeclinePct, 
    navigateTo, 
    addActivity,
    reducedMotion
  } = useApp();

  const [activePreset, setActivePreset] = useState<number>(badYearDeclinePct);

  const baselinePortfolio = Math.max(15000, userProfile.currentSavings);
  const targetGoal = userProfile.goalTargetAmount;
  const contribution = userProfile.comfortableMonthlyContribution;
  const normalRate = 0.105;

  const impact = calculateBadYearImpact(
    baselinePortfolio,
    badYearDeclinePct,
    targetGoal,
    contribution,
    normalRate
  );

  const handleSelectPreset = (pct: number) => {
    sound.playDecline();
    setActivePreset(pct);
    setBadYearDeclinePct(pct);
    addActivity({
      title: `Bad-Year Rehearsal: -${pct}% Shock`,
      type: 'scenario',
      details: `Simulated paper loss of ${formatINR(impact.amountLost)} and a ${impact.delayMonths}-month goal delay under a ${pct}% downturn.`,
      badge: 'Shock Simulated',
    });
  };

  const chartWidth = 600;
  const chartHeight = 220;
  const dropRatio = badYearDeclinePct / 100;
  const baselineY = 50;
  const dropY = baselineY + dropRatio * 130;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12 w-full">
      {/* Signature Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E27D78]/10 border border-[#E27D78]/30 text-xs font-mono text-[#E27D78]">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SIGNATURE STRESS-TEST ENGINE</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F4F1EA] tracking-tight">
          What if your investments had a bad year?
        </h1>

        <p className="text-xs sm:text-sm text-[#A2A5AC] max-w-2xl leading-relaxed">
          Explore how a market decline could affect your hypothetical portfolio and your long-term goal.
        </p>
      </div>

      {/* SELECTABLE DECLINE SCENARIOS (Section 13) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-wider text-[#A2A5AC]">
            Select Shock Scenario
          </span>
          <span className="font-mono font-bold text-[#E27D78]">
            -{badYearDeclinePct}% Simulated Shock
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: '10% Drop', pct: 10, desc: 'Routine correction' },
            { label: '20% Drop', pct: 20, desc: 'Standard bear market' },
            { label: '30% Drop', pct: 30, desc: 'Severe economic crash' },
            { label: 'Custom %', pct: badYearDeclinePct, desc: 'Adjustable slider' }
          ].map((item, idx) => {
            const isSelected = activePreset === item.pct;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPreset(item.pct)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#20242B] border-[#E27D78] shadow-coral-glow'
                    : 'bg-[#101216] border-[#30343B] hover:border-[#A9B8C8]/40'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-[#E27D78]' : 'text-[#F4F1EA]'}`}>
                  {item.label}
                </p>
                <p className="text-[10px] text-[#A2A5AC] mt-0.5 truncate">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-[#A2A5AC] mb-1">
            <span>Custom Shock Slider</span>
            <span className="font-mono text-[#E27D78] font-bold">-{badYearDeclinePct}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={badYearDeclinePct}
            onChange={(e) => {
              const val = Number(e.target.value);
              setActivePreset(val);
              setBadYearDeclinePct(val);
            }}
            className="w-full accent-[#E27D78] bg-[#101216] rounded-lg h-2 cursor-pointer"
          />
        </div>
      </div>

      {/* METRIC IMPACT CARDS (Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#30343B] min-w-0">
          <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider">1. Baseline</span>
          <p className="text-base sm:text-lg font-mono font-bold text-[#F4F1EA] mt-1 truncate">
            {formatINR(impact.originalValue)}
          </p>
          <p className="text-[10px] text-[#A2A5AC] truncate">Pre-drop value</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#E27D78]/40 shadow-coral-glow min-w-0">
          <span className="text-[10px] text-[#E27D78] font-mono uppercase tracking-wider">2. Drawdown</span>
          <p className="text-base sm:text-lg font-mono font-bold text-[#E27D78] mt-1 truncate">
            -{formatINR(impact.amountLost)}
          </p>
          <p className="text-[10px] text-[#E27D78] truncate">({impact.declinePercentage}% paper drop)</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#30343B] min-w-0">
          <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider">3. Revised Value</span>
          <p className="text-base sm:text-lg font-mono font-bold text-[#A9B8C8] mt-1 truncate">
            {formatINR(impact.revisedPortfolioValue)}
          </p>
          <p className="text-[10px] text-[#A2A5AC] truncate">At the trough</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#D5B477]/40 min-w-0">
          <span className="text-[10px] text-[#D5B477] font-mono uppercase tracking-wider">4. Goal Delay</span>
          <p className="text-base sm:text-lg font-mono font-bold text-[#D5B477] mt-1 truncate">
            +{impact.delayMonths} Mo
          </p>
          <p className="text-[10px] text-[#D5B477] truncate">(~{impact.delayYears} extra years)</p>
        </div>
      </div>

      {/* ANIMATED DECLINE CHART (Section 13) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#30343B] shadow-card-depth space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#F4F1EA]">
              Simulated Market Plunge Curve
            </h3>
            <p className="text-xs text-[#A2A5AC]">
              Coral path traces the sharp drawdown; gold line indicates your original goal trajectory.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E27D78]" />
              <span className="text-[#E27D78]">Market Plunge</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5B477]" />
              <span className="text-[#D5B477]">Goal Baseline</span>
            </div>
          </div>
        </div>

        {/* SVG Shock Chart */}
        <div className="w-full h-52 sm:h-56 relative pt-3 pb-1 overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-hidden">
            <defs>
              <linearGradient id="coralDropGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E27D78" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#E27D78" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid references */}
            <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#30343B" strokeDasharray="3 3" opacity="0.4" />
            <line x1="0" y1="120" x2={chartWidth} y2="120" stroke="#30343B" strokeDasharray="3 3" opacity="0.4" />
            <line x1="0" y1="190" x2={chartWidth} y2="190" stroke="#30343B" strokeDasharray="3 3" opacity="0.4" />

            {/* Original Trajectory Line (Gold) */}
            <line 
              x1="20" 
              y1={baselineY} 
              x2={chartWidth - 20} 
              y2={baselineY - 20} 
              stroke="#D5B477" 
              strokeWidth="2" 
              strokeDasharray="5 3" 
              opacity="0.6" 
            />

            {/* Drawdown Curve Polygon (Coral) */}
            <polygon 
              points={`20,${baselineY} 160,${baselineY + 5} 320,${dropY} 460,${dropY - 15} ${chartWidth - 20},${dropY - 30} ${chartWidth - 20},${chartHeight} 20,${chartHeight}`} 
              fill="url(#coralDropGrad)" 
            />

            {/* Drawdown Line */}
            <polyline 
              points={`20,${baselineY} 160,${baselineY + 5} 320,${dropY} 460,${dropY - 15} ${chartWidth - 20},${dropY - 30}`} 
              fill="none" 
              stroke="#E27D78" 
              strokeWidth="3" 
            />

            {/* Trough Marker */}
            <circle cx="320" cy={dropY} r="5" fill="#E27D78" stroke="#090A0C" strokeWidth="2" />
          </svg>

          {/* Floating Callout at Trough */}
          <div 
            className="absolute bg-[#171A20] border border-[#E27D78] text-[#E27D78] px-2.5 py-1 rounded-xl text-xs font-mono shadow-md pointer-events-none"
            style={{
              left: '46%',
              top: `${Math.min(140, dropY - 25)}px`,
            }}
          >
            -{impact.declinePercentage}% ({formatINR(-impact.amountLost)})
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
          <span>Month 0 (Pre-drop)</span>
          <span>Month 6 (Trough Decline)</span>
          <span>Month 12 (Stabilized Bottom)</span>
        </div>
      </div>

      {/* CALM EDUCATIONAL GUIDANCE (Section 13) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-4">
        <div className="flex items-center space-x-2 text-[#D5B477]">
          <HelpCircle className="w-5 h-5 shrink-0" />
          <h3 className="font-display text-base font-bold text-[#F4F1EA]">
            Why Rehearsing This Matters For Aarav
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#A2A5AC]">
          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1.5">
            <h4 className="font-semibold text-[#F4F1EA] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E27D78]" />
              <span>Paper Loss vs. Realized Loss</span>
            </h4>
            <p>
              When markets drop, your screen turns red, but you have not actually lost money unless you panic-sell. Your units remain intact, ready to compound when normal economic activity resumes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1.5">
            <h4 className="font-semibold text-[#F4F1EA] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8BC6A1]" />
              <span>The Student Advantage: Time Horizon</span>
            </h4>
            <p>
              At 19 years old, Aarav has a 10 to 15-year runway. A bad year today simply means his regular ₹1,000 monthly SIP purchases more units at discounted prices.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#20242B] border border-[#30343B] flex items-start space-x-2 text-[11px] text-[#A2A5AC]">
          <AlertTriangle className="w-4 h-4 text-[#D5B477] shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Economic recoveries are mathematical models, not contractual guarantees. Never invest money required for immediate living expenses in volatile assets.
          </span>
        </div>
      </div>

      {/* TWO MANDATED ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <button
          onClick={() => navigateTo('moneyflow')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#F4F1EA] transition-colors"
        >
          Review My Baseline Plan
        </button>

        <button
          onClick={() => navigateTo('recovery')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow transition-all flex items-center justify-center space-x-2"
        >
          <span>Explore Recovery Scenarios</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

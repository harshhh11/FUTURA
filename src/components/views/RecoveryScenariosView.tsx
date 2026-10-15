import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateBadYearImpact, calculateFutureValue, formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  TrendingUp, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  RotateCcw,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const RecoveryScenariosView: React.FC = () => {
  const { 
    userProfile, 
    badYearDeclinePct, 
    navigateTo, 
    addActivity 
  } = useApp();

  // Illustrative annual rebound assumption (8% to 18%)
  const [reboundRate, setReboundRate] = useState<number>(12); // 12% p.a.
  const [stepUpAmount, setStepUpAmount] = useState<number>(1500);

  // Exact same post-shock starting point for all 3 scenarios
  const initialBase = Math.max(15000, userProfile.currentSavings);
  const shockMetrics = calculateBadYearImpact(
    initialBase,
    badYearDeclinePct,
    userProfile.goalTargetAmount,
    userProfile.comfortableMonthlyContribution,
    0.105
  );

  const postShockStartingPoint = shockMetrics.revisedPortfolioValue;
  const originalPortfolioTarget = initialBase; // Level needed to break even

  // Mathematical recovery projections over 36 months (3 years)
  const months = [0, 6, 12, 18, 24, 30, 36];
  const rateFraction = reboundRate / 100;

  // Scenario A: No additional deposits (Hold)
  const seriesA = months.map(m => calculateFutureValue(postShockStartingPoint, 0, rateFraction, m));

  // Scenario B: Continue planned contribution (₹1,000/mo)
  const seriesB = months.map(m => calculateFutureValue(postShockStartingPoint, userProfile.comfortableMonthlyContribution, rateFraction, m));

  // Scenario C: Step up contribution during dip (e.g. ₹1,500/mo)
  const seriesC = months.map(m => calculateFutureValue(postShockStartingPoint, stepUpAmount, rateFraction, m));

  // Time to break even (reach initialBase)
  const getMonthsToBreakEven = (deposit: number) => {
    for (let m = 1; m <= 60; m++) {
      if (calculateFutureValue(postShockStartingPoint, deposit, rateFraction, m) >= originalPortfolioTarget) {
        return m;
      }
    }
    return 60;
  };

  const monthsA = getMonthsToBreakEven(0);
  const monthsB = getMonthsToBreakEven(userProfile.comfortableMonthlyContribution);
  const monthsC = getMonthsToBreakEven(stepUpAmount);

  // SVG Chart Setup
  const chartWidth = 600;
  const chartHeight = 220;
  const maxVal = Math.max(seriesC[seriesC.length - 1], originalPortfolioTarget * 1.3);

  const pointsA = seriesA.map((val, i) => `${(i / (months.length - 1)) * chartWidth},${chartHeight - (val / maxVal) * (chartHeight - 30)}`);
  const pointsB = seriesB.map((val, i) => `${(i / (months.length - 1)) * chartWidth},${chartHeight - (val / maxVal) * (chartHeight - 30)}`);
  const pointsC = seriesC.map((val, i) => `${(i / (months.length - 1)) * chartWidth},${chartHeight - (val / maxVal) * (chartHeight - 30)}`);

  const breakEvenY = chartHeight - (originalPortfolioTarget / maxVal) * (chartHeight - 30);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#8BC6A1]" />
            <span>POST-DOWNTURN RESILIENCE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
            Recovery Scenario Comparison
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Compare 3 distinct paths starting from the exact same post-decline portfolio: {formatINR(postShockStartingPoint)}.
          </p>
        </div>

        {/* Return to baseline plan button */}
        <button
          onClick={() => {
            sound.playClick();
            navigateTo('dashboard');
          }}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-medium bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] transition-colors flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Return to Baseline Plan</span>
        </button>
      </div>

      {/* ADJUSTABLE RECOVERY RATE SLIDER */}
      <div className="p-4 rounded-2xl bg-[#171A20] border border-[#30343B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#A2A5AC]">
            Illustrative Annual Rebound Rate
          </span>
          <p className="text-[11px] text-[#A2A5AC] mt-0.5">
            Hypothetical post-crash recovery pace (historical Indian market rebound average: 12%–14% p.a.)
          </p>
        </div>
        <div className="flex items-center space-x-3 min-w-[220px]">
          <input
            type="range"
            min="6"
            max="20"
            step="1"
            value={reboundRate}
            onChange={(e) => setReboundRate(Number(e.target.value))}
            className="w-full accent-[#8BC6A1] bg-[#101216] rounded-lg h-2 cursor-pointer"
          />
          <span className="font-mono text-sm font-bold text-[#8BC6A1] min-w-[45px]">
            {reboundRate}%
          </span>
        </div>
      </div>

      {/* THREE SCENARIOS COMPARISON CARDS (Mandated by Section 14) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario A: No Additional Contribution */}
        <div className="p-5 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-3 shadow-card-depth flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A2A5AC]/10 text-[#A2A5AC] border border-[#30343B]">
                SCENARIO A
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#A2A5AC]" />
            </div>

            <h3 className="font-display text-base font-bold text-[#F4F1EA]">
              No Additional Contribution
            </h3>

            <p className="text-[11px] text-[#A2A5AC] leading-relaxed">
              Stop monthly deposits. Leave remaining {formatINR(postShockStartingPoint)} to recover purely via market bounce.
            </p>

            <div className="pt-2 border-t border-[#30343B]/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Monthly Deposit:</span>
                <span className="font-mono text-[#F4F1EA]">₹0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Time to Break-Even:</span>
                <span className="font-mono font-bold text-[#A9B8C8]">{monthsA} Months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Value in 3 Years:</span>
                <span className="font-mono font-bold text-[#F4F1EA]">{formatINR(seriesA[seriesA.length - 1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario B: Continue Planned Contribution (Recommended) */}
        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#D5B477]/50 space-y-3 shadow-card-depth flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D5B477]/20 text-[#D5B477] border border-[#D5B477]/40 font-bold">
                SCENARIO B (RECOMMENDED)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5B477]" />
            </div>

            <h3 className="font-display text-base font-bold text-[#F4F1EA]">
              Continue Planned SIP
            </h3>

            <p className="text-[11px] text-[#A2A5AC] leading-relaxed">
              Maintain disciplined {formatINR(userProfile.comfortableMonthlyContribution)}/mo. Rupee cost averaging scoops up discounted units.
            </p>

            <div className="pt-2 border-t border-[#30343B]/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Monthly Deposit:</span>
                <span className="font-mono font-bold text-[#D5B477]">{formatINR(userProfile.comfortableMonthlyContribution)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Time to Break-Even:</span>
                <span className="font-mono font-bold text-[#D5B477]">{monthsB} Months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Value in 3 Years:</span>
                <span className="font-mono font-bold text-[#8BC6A1]">{formatINR(seriesB[seriesB.length - 1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario C: Step-Up Contribution During Discount */}
        <div className="p-5 rounded-3xl bg-[#171A20] border border-[#8BC6A1]/40 space-y-3 shadow-card-depth flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8BC6A1]/20 text-[#8BC6A1] border border-[#8BC6A1]/40 font-bold">
                SCENARIO C
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#8BC6A1]" />
            </div>

            <h3 className="font-display text-base font-bold text-[#F4F1EA]">
              Step-Up During Dip
            </h3>

            <p className="text-[11px] text-[#A2A5AC] leading-relaxed">
              Increase monthly deposit to {formatINR(stepUpAmount)} to exploit the discount, accelerating recovery.
            </p>

            <div className="pt-2 border-t border-[#30343B]/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Step-Up Deposit:</span>
                <span className="font-mono font-bold text-[#8BC6A1]">{formatINR(stepUpAmount)}/mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Time to Break-Even:</span>
                <span className="font-mono font-bold text-[#8BC6A1]">{monthsC} Months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A2A5AC]">Value in 3 Years:</span>
                <span className="font-mono font-bold text-[#8BC6A1]">{formatINR(seriesC[seriesC.length - 1])}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-LINE PROJECTION CHART */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#30343B] shadow-card-depth space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-[#F4F1EA]">
              Multi-Trajectory 3-Year Recovery Comparison
            </h3>
            <p className="text-xs text-[#A2A5AC]">
              All lines originate from the identical post-shock bottom ({formatINR(postShockStartingPoint)}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A2A5AC]" />
              <span className="text-[#A2A5AC]">A: Hold</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5B477]" />
              <span className="text-[#D5B477]">B: Continue SIP</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8BC6A1]" />
              <span className="text-[#8BC6A1]">C: Step-Up SIP</span>
            </div>
          </div>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="w-full h-60 relative pt-4 pb-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
            {/* Break-even dotted line */}
            <line 
              x1="0" 
              y1={breakEvenY} 
              x2={chartWidth} 
              y2={breakEvenY} 
              stroke="#D5B477" 
              strokeDasharray="4 3" 
              opacity="0.5" 
            />

            {/* Trajectory Lines */}
            <polyline points={pointsA.join(' ')} fill="none" stroke="#A2A5AC" strokeWidth="2" strokeDasharray="3 2" />
            <polyline points={pointsB.join(' ')} fill="none" stroke="#D5B477" strokeWidth="2.5" />
            <polyline points={pointsC.join(' ')} fill="none" stroke="#8BC6A1" strokeWidth="2.5" />

            {/* End Point Dots */}
            <circle cx={chartWidth} cy={Number(pointsA[pointsA.length - 1].split(',')[1])} r="3.5" fill="#A2A5AC" />
            <circle cx={chartWidth} cy={Number(pointsB[pointsB.length - 1].split(',')[1])} r="4" fill="#D5B477" />
            <circle cx={chartWidth} cy={Number(pointsC[pointsC.length - 1].split(',')[1])} r="4" fill="#8BC6A1" />
          </svg>

          {/* Dotted Break-Even Indicator Label */}
          <div 
            className="absolute right-2 text-[9px] font-mono text-[#D5B477] bg-[#171A20] px-2 py-0.5 rounded border border-[#D5B477]/40 pointer-events-none"
            style={{ top: `${Math.max(10, breakEvenY - 14)}px` }}
          >
            Pre-Drop Value: {formatINR(originalPortfolioTarget)}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
          <span>Month 0 (Trough)</span>
          <span>Month 12</span>
          <span>Month 24</span>
          <span>Month 36</span>
        </div>
      </div>

      {/* MATHEMATICAL SCENARIO DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] flex items-start space-x-3 text-xs text-[#A2A5AC]">
        <Info className="w-4 h-4 text-[#D5B477] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F4F1EA]">Important Planning Rule:</strong> These recovery comparisons are mathematical scenario models, not market predictions. They assume continuous disciplined contributions and a constant rebound rate. In reality, market recoveries are choppy and non-linear.
        </p>
      </div>
    </div>
  );
};

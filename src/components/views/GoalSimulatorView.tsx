import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  calculateFutureValue, 
  generateProjectionSeries, 
  estimateTimeToGoal, 
  formatINR 
} from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Target, 
  Info 
} from 'lucide-react';

export const GoalSimulatorView: React.FC = () => {
  const { userProfile, updateUserProfile, addActivity } = useApp();

  const [targetAmount, setTargetAmount] = useState<number>(userProfile.goalTargetAmount);
  const [currentSavings, setCurrentSavings] = useState<number>(userProfile.currentSavings);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(userProfile.comfortableMonthlyContribution);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(10.5);
  const [selectedHorizonYears, setSelectedHorizonYears] = useState<number>(15);

  const [activeScenario, setActiveScenario] = useState<'current' | 'save_more' | 'extend'>('current');

  const handleScenarioChange = (scenario: 'current' | 'save_more' | 'extend') => {
    sound.playClick();
    setActiveScenario(scenario);
    if (scenario === 'current') {
      setMonthlyContribution(userProfile.comfortableMonthlyContribution);
      setSelectedHorizonYears(15);
    } else if (scenario === 'save_more') {
      setMonthlyContribution(userProfile.comfortableMonthlyContribution + 500);
      setSelectedHorizonYears(12);
    } else if (scenario === 'extend') {
      setMonthlyContribution(Math.max(500, userProfile.comfortableMonthlyContribution - 300));
      setSelectedHorizonYears(20);
    }
  };

  const rateFraction = annualReturnRate / 100;
  const timeToGoal = estimateTimeToGoal(targetAmount, currentSavings, monthlyContribution, rateFraction);

  const totalMonths = selectedHorizonYears * 12;
  const estimatedFutureValue = calculateFutureValue(currentSavings, monthlyContribution, rateFraction, totalMonths);
  const totalContributed = currentSavings + (monthlyContribution * totalMonths);
  const totalGrowth = Math.max(0, estimatedFutureValue - totalContributed);
  const growthPercentage = estimatedFutureValue > 0 ? (totalGrowth / estimatedFutureValue) * 100 : 0;

  const projectionSeries = generateProjectionSeries(currentSavings, monthlyContribution, rateFraction, selectedHorizonYears);

  const chartHeight = 220;
  const chartWidth = 600;
  const maxChartValue = Math.max(targetAmount, estimatedFutureValue, 100000);

  const pointsContributed = projectionSeries.map((pt, i) => {
    const x = (i / (projectionSeries.length - 1)) * chartWidth;
    const y = chartHeight - (pt.totalContributed / maxChartValue) * (chartHeight - 35);
    return `${x},${y}`;
  });

  const pointsProjected = projectionSeries.map((pt, i) => {
    const x = (i / (projectionSeries.length - 1)) * chartWidth;
    const y = chartHeight - (pt.projectedValue / maxChartValue) * (chartHeight - 35);
    return `${x},${y}`;
  });

  const areaProjected = `0,${chartHeight} ${pointsProjected.join(' ')} ${chartWidth},${chartHeight}`;
  const areaContributed = `0,${chartHeight} ${pointsContributed.join(' ')} ${chartWidth},${chartHeight}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>COMPOUNDING PROJECTION SIMULATOR</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Goal Simulator
          </h1>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Model the exact mathematical impact of time, regular deposits, and compounding growth.
          </p>
        </div>

        {/* 3 Interactive Scenarios */}
        <div className="flex flex-wrap items-center p-1 rounded-2xl bg-[#171A20] border border-[#30343B] gap-1 self-start sm:self-auto">
          <button
            onClick={() => handleScenarioChange('current')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeScenario === 'current'
                ? 'bg-[#D5B477] text-[#090A0C] font-bold shadow-sm'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
          >
            Current (₹{userProfile.comfortableMonthlyContribution})
          </button>
          <button
            onClick={() => handleScenarioChange('save_more')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeScenario === 'save_more'
                ? 'bg-[#8BC6A1] text-[#090A0C] font-bold shadow-sm'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
          >
            +₹500 / mo
          </button>
          <button
            onClick={() => handleScenarioChange('extend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeScenario === 'extend'
                ? 'bg-[#20242B] text-[#F4F1EA] font-semibold border border-[#30343B]'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
          >
            Extend Years
          </button>
        </div>
      </div>

      {/* METRICS SHOWCASE ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#30343B] min-w-0">
          <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider">Estimated Time</span>
          <p className="text-lg sm:text-xl font-mono font-bold text-[#D5B477] mt-1 truncate">
            {timeToGoal.reachable ? `${timeToGoal.years} Yrs` : '50+ Yrs'}
          </p>
          <p className="text-[10px] text-[#A2A5AC] mt-0.5 truncate">To reach {formatINR(targetAmount, true)}</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#30343B] min-w-0">
          <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider">Total Contributed</span>
          <p className="text-lg sm:text-xl font-mono font-bold text-[#A9B8C8] mt-1 truncate">
            {formatINR(totalContributed, true)}
          </p>
          <p className="text-[10px] text-[#A2A5AC] mt-0.5 truncate">Deposited student cash</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#30343B] min-w-0">
          <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider">Growth</span>
          <p className="text-lg sm:text-xl font-mono font-bold text-[#8BC6A1] mt-1 truncate">
            +{formatINR(totalGrowth, true)}
          </p>
          <p className="text-[10px] text-[#8BC6A1] mt-0.5 truncate">+{growthPercentage.toFixed(0)}% from compounding</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#171A20] border border-[#30343B] min-w-0">
          <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider">Future Value</span>
          <p className="text-lg sm:text-xl font-mono font-bold text-[#F4F1EA] mt-1 truncate">
            {formatINR(estimatedFutureValue, true)}
          </p>
          <p className="text-[10px] text-[#A2A5AC] mt-0.5 truncate">In {selectedHorizonYears} Years</p>
        </div>
      </div>

      {/* DYNAMIC PROJECTION CHART */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#30343B] shadow-card-depth space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#F4F1EA]">
              Wealth Projection Trajectory
            </h3>
            <p className="text-xs text-[#A2A5AC]">
              Gold curve represents hypothetical compounding growth; silver base represents your deposited principal.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5B477]" />
              <span className="text-[#F4F1EA]">Total Value</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A9B8C8]" />
              <span className="text-[#A2A5AC]">Principal</span>
            </div>
          </div>
        </div>

        {/* SVG Chart with strict responsive bounding */}
        <div className="w-full h-56 sm:h-64 relative pt-3 pb-1 overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-hidden">
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D5B477" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#D5B477" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="contributedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A9B8C8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#A9B8C8" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#30343B" strokeDasharray="3 3" opacity="0.4" />
            <line x1="0" y1={chartHeight * 0.50} x2={chartWidth} y2={chartHeight * 0.50} stroke="#30343B" strokeDasharray="3 3" opacity="0.4" />
            <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#30343B" strokeDasharray="3 3" opacity="0.4" />

            {/* Shaded Areas */}
            <polygon points={areaProjected} fill="url(#growthGradient)" />
            <polygon points={areaContributed} fill="url(#contributedGradient)" />

            {/* Projection Line (Gold) */}
            <polyline points={pointsProjected.join(' ')} fill="none" stroke="#D5B477" strokeWidth="2.5" />

            {/* Contributed Line (Silver) */}
            <polyline points={pointsContributed.join(' ')} fill="none" stroke="#A9B8C8" strokeWidth="2" strokeDasharray="4 2" />

            {/* End Point Markers */}
            {pointsProjected.length > 0 && (
              <circle 
                cx={chartWidth} 
                cy={Number(pointsProjected[pointsProjected.length - 1].split(',')[1])} 
                r="4.5" 
                fill="#D5B477" 
                stroke="#090A0C" 
                strokeWidth="2" 
              />
            )}
          </svg>

          {/* Target Milestone Indicator Line */}
          {targetAmount <= maxChartValue && (
            <div 
              className="absolute left-0 right-0 border-b border-dashed border-[#8BC6A1]/60 flex items-center justify-end pr-2 text-[10px] font-mono text-[#8BC6A1] pointer-events-none"
              style={{
                top: `${chartHeight - (targetAmount / maxChartValue) * (chartHeight - 35)}px`,
              }}
            >
              <span className="bg-[#171A20] px-1.5 py-0.5 rounded border border-[#8BC6A1]/30">
                Target: {formatINR(targetAmount, true)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
          <span>Today (Yr 0)</span>
          <span>Yr {Math.round(selectedHorizonYears / 2)}</span>
          <span>Yr {selectedHorizonYears}</span>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#F4F1EA]">
            Goal & Contribution Parameters
          </h4>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-[#A2A5AC]">Target Goal Amount</label>
              <span className="font-mono font-bold text-[#F4F1EA]">{formatINR(targetAmount)}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="5000000"
              step="50000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full accent-[#D5B477] bg-[#101216] rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-[#A2A5AC]">Current Initial Savings</label>
              <span className="font-mono font-bold text-[#A9B8C8]">{formatINR(currentSavings)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full accent-[#A9B8C8] bg-[#101216] rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="text-[#D5B477] font-semibold">Monthly Contribution</label>
              <span className="font-mono font-bold text-[#D5B477]">{formatINR(monthlyContribution)}/mo</span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-[#D5B477] bg-[#101216] rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[#171A20] border border-[#30343B] space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F4F1EA]">
              Compounding Assumptions
            </h4>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="text-[#A2A5AC]">Illustrative Return Rate</label>
                <span className="font-mono font-bold text-[#8BC6A1]">{annualReturnRate.toFixed(1)}% p.a.</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full accent-[#8BC6A1] bg-[#101216] rounded-lg h-2 cursor-pointer"
              />
              <p className="text-[10px] text-[#A2A5AC] mt-1 font-mono">
                0% (Cash) · 6.8% (FD) · 10.5% (Balanced) · 12.0% (Nifty Index)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="text-[#A2A5AC]">Planning Horizon (Years)</label>
                <span className="font-mono font-bold text-[#F4F1EA]">{selectedHorizonYears} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="35"
                step="1"
                value={selectedHorizonYears}
                onChange={(e) => setSelectedHorizonYears(Number(e.target.value))}
                className="w-full accent-[#A9B8C8] bg-[#101216] rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playChime();
                updateUserProfile({
                  goalTargetAmount: targetAmount,
                  currentSavings: currentSavings,
                  comfortableMonthlyContribution: monthlyContribution,
                });
                addActivity({
                  title: 'Goal Parameters Synchronized',
                  type: 'goal_update',
                  amount: targetAmount,
                  details: `Set simulator target to ${formatINR(targetAmount)} with ${formatINR(monthlyContribution)}/month contribution.`,
                  badge: 'Synchronized',
                });
              }}
              className="w-full py-2.5 rounded-xl bg-[#20242B] hover:bg-[#2A2F3B] border border-[#30343B] text-xs font-semibold text-[#F4F1EA] transition-colors"
            >
              Sync Values to Dashboard Profile
            </button>
          </div>
        </div>
      </div>

      {/* DISCLOSURE */}
      <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] flex items-start space-x-3 text-xs text-[#A2A5AC]">
        <Info className="w-4 h-4 text-[#D5B477] shrink-0 mt-0.5" />
        <div className="space-y-1 text-[11px] leading-relaxed">
          <p>
            <strong className="text-[#F4F1EA]">Mathematical Compounding Disclosure:</strong> Calculations use the standard monthly annuity formula FV = P(1 + r/12)^n + PMT × [((1 + r/12)^n - 1) / (r/12)] with contributions assumed at end-of-month.
          </p>
          <p>
            Taxes, fund management fees, and inflation are excluded unless explicitly modeled. Actual market returns are non-linear and include downturns.
          </p>
        </div>
      </div>
    </div>
  );
};

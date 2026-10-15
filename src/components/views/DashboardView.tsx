import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  formatINR, 
  estimateTimeToGoal, 
  generateProjectionSeries 
} from '../../utils/calculations';
import { 
  Target, 
  ArrowRight, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  PieChart, 
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Concept2MilestoneCard } from './Concept2MilestoneCard';

export const DashboardView: React.FC = () => {
  const { userProfile, allocations, navigateTo, setIsOnboardingOpen } = useApp();

  // Cash flow metrics
  const income = userProfile.monthlyIncome;
  const essentials = userProfile.essentialExpenses;
  const discretionary = userProfile.otherSpending;
  const plannedSip = userProfile.comfortableMonthlyContribution;
  const availableAmount = Math.max(0, income - essentials - discretionary);
  const remainingBuffer = Math.max(0, availableAmount - plannedSip);

  // Growth & timeline metrics
  const returnRate = userProfile.riskTolerance === 'stability' ? 0.07 : (userProfile.riskTolerance === 'growth' ? 0.12 : 0.105);
  const timeEstimate = estimateTimeToGoal(
    userProfile.goalTargetAmount,
    userProfile.currentSavings,
    plannedSip,
    returnRate
  );
  const progressPct = Math.min(100, Math.max(1.2, (userProfile.currentSavings / userProfile.goalTargetAmount) * 100));

  // Concept 5 Performance Mountain Curve calculation
  const projectionSeries = generateProjectionSeries(
    userProfile.currentSavings,
    plannedSip,
    returnRate,
    userProfile.goalTargetYears || 15
  );

  const chartWidth = 600;
  const chartHeight = 190;
  const paddingX = 24;
  const paddingBottom = 30;
  const paddingTop = 20;

  const maxVal = Math.max(
    userProfile.goalTargetAmount * 1.15,
    projectionSeries[projectionSeries.length - 1]?.projectedValue || 1000000
  );

  const pointsProjected = projectionSeries.map((p, i) => {
    const x = paddingX + (i / (projectionSeries.length - 1)) * (chartWidth - paddingX * 2);
    const y = (chartHeight - paddingBottom) - (p.projectedValue / maxVal) * (chartHeight - paddingBottom - paddingTop);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pointsContributed = projectionSeries.map((p, i) => {
    const x = paddingX + (i / (projectionSeries.length - 1)) * (chartWidth - paddingX * 2);
    const y = (chartHeight - paddingBottom) - (p.totalContributed / maxVal) * (chartHeight - paddingBottom - paddingTop);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const areaProjected = [
    `${paddingX},${chartHeight - paddingBottom}`,
    ...pointsProjected,
    `${chartWidth - paddingX},${chartHeight - paddingBottom}`
  ].join(' ');

  const targetLineY = (chartHeight - paddingBottom) - (userProfile.goalTargetAmount / maxVal) * (chartHeight - paddingBottom - paddingTop);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-16 w-full">
      {/* 1. WELCOME & PROFILE SUMMARY HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider mb-1">
            <span>FUTURA FINANCIAL OS</span>
            <span>·</span>
            <span className="text-[#D5B477]">ACTIVE SIMULATION</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
            Hello, {userProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-[#A2A5AC] mt-1 max-w-2xl leading-relaxed">
            19-year-old student · <span className="text-[#F4F1EA] font-mono font-medium">{formatINR(income)}/mo</span> allowance · 
            Working toward <span className="text-[#D5B477] font-semibold">{userProfile.goalName}</span> with disciplined monthly contributions.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#F4F1EA] transition-all flex items-center space-x-2 shrink-0 group hover:border-[#D5B477]/50 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D5B477] group-hover:rotate-12 transition-transform" />
          <span>Adjust Baseline</span>
        </button>
      </div>

      {/* 2. PRIMARY GOAL & CONCEPT 2 MILESTONE VAULT (Dual Desktop Grid / Mobile Stack) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Primary Milestone Overview */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#20242B] via-[#171A20] to-[#101216] border border-[#30343B] shadow-card-depth flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Top Header of Goal Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#090A0C] border border-[#30343B] text-[10px] font-mono text-[#D5B477]">
                  <Target className="w-3 h-3" />
                  <span>PRIMARY FINANCIAL MILESTONE</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F1EA] tracking-tight">
                  {userProfile.goalName}
                </h2>
              </div>

              <div className="flex items-center space-x-3 self-start sm:self-auto">
                {/* Circular Progress Badge */}
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#090A0C] border border-[#30343B]">
                  <div className="w-5 h-5 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="10" cy="10" r="8" stroke="#20242B" strokeWidth="2.5" fill="transparent" />
                      <circle cx="10" cy="10" r="8" stroke="#D5B477" strokeWidth="2.5" strokeDasharray={50} strokeDashoffset={50 - (50 * progressPct) / 100} strokeLinecap="round" fill="transparent" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F4F1EA]">{progressPct.toFixed(1)}%</span>
                </div>

                <button
                  onClick={() => navigateTo('simulator')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] hover:shadow-subtle-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <span>Review Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3 Prominent Metrics Spanning Full Card Width */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-2xl bg-[#090A0C]/80 border border-[#30343B]/80 flex flex-col justify-between space-y-1.5">
                <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider block">
                  Target Amount
                </span>
                <p className="text-lg sm:text-xl font-mono font-bold text-[#F4F1EA] tracking-tight">
                  {formatINR(userProfile.goalTargetAmount)}
                </p>
                <p className="text-[11px] text-[#A2A5AC] font-normal">
                  15-Year Horizon
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090A0C]/80 border border-[#30343B]/80 flex flex-col justify-between space-y-1.5">
                <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider block">
                  Current Savings
                </span>
                <p className="text-lg sm:text-xl font-mono font-bold text-[#8BC6A1] tracking-tight">
                  {formatINR(userProfile.currentSavings)}
                </p>
                <p className="text-[11px] text-[#8BC6A1]">
                  Student Baseline
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#090A0C]/80 border border-[#30343B]/80 flex flex-col justify-between space-y-1.5">
                <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider block">
                  Timeline
                </span>
                <p className="text-lg sm:text-xl font-mono font-bold text-[#D5B477] tracking-tight">
                  {timeEstimate.years} Years
                </p>
                <p className="text-[11px] text-[#A2A5AC] font-normal">
                  ~10.5% Annual
                </p>
              </div>
            </div>
          </div>

          {/* Linear Progress Bar with Clean Non-Overlapping Labels */}
          <div className="space-y-2 pt-2 border-t border-[#30343B]/60">
            <div className="flex items-center justify-between text-xs font-mono text-[#A2A5AC]">
              <span>Accumulated: <strong className="text-[#8BC6A1]">{formatINR(userProfile.currentSavings)}</strong></span>
              <span>Target: <strong className="text-[#F4F1EA]">{formatINR(userProfile.goalTargetAmount)}</strong></span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#090A0C] overflow-hidden p-0.5 border border-[#30343B]">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#D5B477] to-[#8BC6A1] transition-all duration-700"
                style={{ width: `${Math.max(2, progressPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: 3D Concept 2 Milestone Metallic Card */}
        <div className="lg:col-span-5 flex">
          <Concept2MilestoneCard className="w-full h-full" />
        </div>
      </div>

      {/* 3. MONEYFLOW SUMMARY CARD (5 Columns - Clean Responsive Grid) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#171A20] border border-[#30343B] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#20242B] border border-[#30343B] text-[#D5B477]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#F4F1EA]">
                Monthly MoneyFlow Breakdown
              </h3>
              <p className="text-xs text-[#A2A5AC]">
                Real student cashflow: Every single rupee accounted for with zero leakage.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('moneyflow')}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] border border-[#30343B] hover:border-[#D5B477]/40 text-[#F4F1EA] transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Adjust MoneyFlow</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D5B477]" />
          </button>
        </div>

        {/* 5-Column MoneyFlow Grid with Ample Breathing Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1">
            <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider block">1. Monthly Income</span>
            <p className="text-lg font-mono font-bold text-[#F4F1EA]">
              {formatINR(income)}
            </p>
            <p className="text-[11px] text-[#A2A5AC]">Stipend / Allowance</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1">
            <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider block">2. Essentials</span>
            <p className="text-lg font-mono font-bold text-[#A9B8C8]">
              {formatINR(essentials)}
            </p>
            <p className="text-[11px] text-[#A2A5AC]">Canteen, Books, Transit</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1">
            <span className="text-[10px] text-[#A2A5AC] font-mono uppercase tracking-wider block">3. Discretionary</span>
            <p className="text-lg font-mono font-bold text-[#A2A5AC]">
              {formatINR(discretionary)}
            </p>
            <p className="text-[11px] text-[#A2A5AC]">Campus Life & Hobbies</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#D5B477]/40 shadow-sm space-y-1">
            <span className="text-[10px] text-[#D5B477] font-mono uppercase tracking-wider block">4. Planned SIP</span>
            <p className="text-lg font-mono font-bold text-[#D5B477]">
              {formatINR(plannedSip)}/mo
            </p>
            <p className="text-[11px] text-[#D5B477]/80">Disciplined Growth</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B] space-y-1 col-span-1 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] text-[#8BC6A1] font-mono uppercase tracking-wider block">5. Buffer Cushion</span>
            <p className="text-lg font-mono font-bold text-[#8BC6A1]">
              {formatINR(remainingBuffer)}
            </p>
            <p className="text-[11px] text-[#8BC6A1]/80">Balanced Equation</p>
          </div>
        </div>

        {/* Narrative Callout */}
        <div className="p-4 rounded-2xl bg-[#101216] border border-[#30343B]/80 text-xs sm:text-sm text-[#F4F1EA] leading-relaxed flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-[#8BC6A1] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">
              You allocate <span className="text-[#D5B477] font-mono font-bold">{formatINR(plannedSip)}</span> every month into your growth plan from your <span className="text-[#F4F1EA] font-mono font-bold">{formatINR(income)}</span> monthly cash.
            </p>
            <p className="text-xs text-[#A2A5AC]">
              Essential living expenses (<span className="text-[#F4F1EA] font-mono">{formatINR(essentials)}</span>) and discretionary spending (<span className="text-[#F4F1EA] font-mono">{formatINR(discretionary)}</span>) are fully protected with zero over-allocation danger.
            </p>
          </div>
        </div>
      </div>

      {/* 4. PORTFOLIO OVERVIEW CARD (50% / 20% / 30% + Concept 5 Curve) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#20242B] to-[#171A20] border border-[#30343B] shadow-card-depth space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-[#D5B477]" />
              <h3 className="font-display text-base sm:text-lg font-bold text-[#F4F1EA]">
                Portfolio Allocation & Multi-Year Projection
              </h3>
            </div>
            <p className="text-xs text-[#A2A5AC]">
              Diversified student asset allocation model designed for balanced compounding and downside protection.
            </p>
          </div>

          <button
            onClick={() => navigateTo('portfolio')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#20242B] hover:bg-[#2A2F3B] border border-[#30343B] hover:border-[#D5B477]/40 text-[#F4F1EA] transition-all flex items-center space-x-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>Build Portfolio</span>
          </button>
        </div>

        {/* 3 Core Asset Allocation Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#101216] border border-[#D5B477]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A2A5AC] font-mono uppercase">Equity Engine</span>
              <p className="text-sm font-bold text-[#F4F1EA] mt-0.5">Nifty 50 Index Fund</p>
              <p className="text-xs text-[#D5B477] font-mono mt-0.5">{formatINR(plannedSip * 0.50)}/month</p>
            </div>
            <span className="text-2xl font-mono font-extrabold text-[#D5B477]">50%</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#E5C68A]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A2A5AC] font-mono uppercase">Inflation Hedge</span>
              <p className="text-sm font-bold text-[#F4F1EA] mt-0.5">Gold ETF</p>
              <p className="text-xs text-[#E5C68A] font-mono mt-0.5">{formatINR(plannedSip * 0.20)}/month</p>
            </div>
            <span className="text-2xl font-mono font-extrabold text-[#E5C68A]">20%</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#101216] border border-[#8BC6A1]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#A2A5AC] font-mono uppercase">Safety Foundation</span>
              <p className="text-sm font-bold text-[#F4F1EA] mt-0.5">Fixed Deposit (FD)</p>
              <p className="text-xs text-[#8BC6A1] font-mono mt-0.5">{formatINR(plannedSip * 0.30)}/month</p>
            </div>
            <span className="text-2xl font-mono font-extrabold text-[#8BC6A1]">30%</span>
          </div>
        </div>

        {/* CONCEPT 5-INSPIRED PERFORMANCE MOUNTAIN CURVE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101216] border border-[#30343B] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5B477]" />
              <span className="text-[#F4F1EA] font-medium">Compounded Trajectory</span>
              <span className="text-[#A2A5AC] hidden sm:inline">(~10.5% Annualized)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8BC6A1]" />
              <span className="text-[#8BC6A1]">Target: ₹10 Lakhs</span>
            </div>
          </div>

          <div className="w-full h-52 sm:h-60 relative overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-hidden">
              <defs>
                <linearGradient id="curveGoldGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D5B477" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#D5B477" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#D5B477" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              <line x1={paddingX} y1={chartHeight * 0.25} x2={chartWidth - paddingX} y2={chartHeight * 0.25} stroke="#30343B" strokeDasharray="3 3" opacity="0.3" />
              <line x1={paddingX} y1={chartHeight * 0.50} x2={chartWidth - paddingX} y2={chartHeight * 0.50} stroke="#30343B" strokeDasharray="3 3" opacity="0.3" />
              <line x1={paddingX} y1={chartHeight * 0.75} x2={chartWidth - paddingX} y2={chartHeight * 0.75} stroke="#30343B" strokeDasharray="3 3" opacity="0.3" />

              {/* Shaded Area */}
              <polygon points={areaProjected} fill="url(#curveGoldGlow)" />

              {/* Milestone Target Line (₹10 Lakhs) */}
              <line 
                x1={paddingX} 
                y1={targetLineY} 
                x2={chartWidth - paddingX} 
                y2={targetLineY} 
                stroke="#8BC6A1" 
                strokeWidth="1.5" 
                strokeDasharray="4 3" 
                opacity="0.8" 
              />

              {/* Deposited Cash Baseline Line */}
              <polyline points={pointsContributed.join(' ')} fill="none" stroke="#A9B8C8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

              {/* Compounding Curve Line */}
              <polyline points={pointsProjected.join(' ')} fill="none" stroke="#D5B477" strokeWidth="2.5" />

              {/* Final Milestone Dot */}
              {pointsProjected.length > 0 && (
                <circle 
                  cx={chartWidth - paddingX} 
                  cy={Number(pointsProjected[pointsProjected.length - 1].split(',')[1])} 
                  r="5" 
                  fill="#D5B477" 
                  stroke="#090A0C" 
                  strokeWidth="2.5" 
                />
              )}
            </svg>

            {/* X-Axis Milestone Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[10px] font-mono text-[#A2A5AC]">
              <span>Year 0 (Today)</span>
              <span>Year 3</span>
              <span>Year 5</span>
              <span>Year 10</span>
              <span className="text-[#D5B477] font-semibold">Year 15 (₹10L)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. NEXT RECOMMENDED ACTION: REHEARSE A BAD YEAR */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#20242B] via-[#1C1819] to-[#251817] border border-[#E27D78]/30 shadow-card-depth relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E27D78]/15 border border-[#E27D78]/30 text-[10px] font-mono text-[#E27D78]">
              <ShieldAlert className="w-3 h-3" />
              <span>SIGNATURE STRESS TEST</span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-[#F4F1EA]">
              Next Critical Step: Rehearse a Bad Year Shock
            </h3>

            <p className="text-xs sm:text-sm text-[#A2A5AC] leading-relaxed">
              Every long-term investor experiences market corrections. Rehearse a <span className="text-[#E27D78] font-semibold">10%, 20%, or 30% drop</span> before investing real money. See why continuing your ₹1,000 monthly SIP during downturns accelerates recovery.
            </p>
          </div>

          <button
            onClick={() => navigateTo('bad_year')}
            className="px-5 py-3 rounded-2xl text-xs font-semibold bg-[#E27D78] hover:bg-[#E88C88] text-[#090A0C] hover:shadow-subtle-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 shrink-0 self-stretch sm:self-auto justify-center cursor-pointer shadow-sm"
          >
            <span>Rehearse a Bad Year</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. SUPPORTING FAST JUMP TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => navigateTo('explorer')}
          className="p-5 rounded-2xl bg-[#101216] border border-[#30343B] hover:border-[#A9B8C8]/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Compass className="w-5 h-5 text-[#A9B8C8] group-hover:rotate-45 transition-transform" />
            <ArrowRight className="w-3.5 h-3.5 text-[#A2A5AC] group-hover:translate-x-1 group-hover:text-[#F4F1EA] transition-all" />
          </div>
          <h4 className="text-xs font-bold text-[#F4F1EA]">Explore 6 Asset Classes</h4>
          <p className="text-[11px] text-[#A2A5AC] mt-1 leading-relaxed">
            Understand Index Funds, FDs, Gold, Bonds, Savings, and Mutual Funds in plain language.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('simulator')}
          className="p-5 rounded-2xl bg-[#101216] border border-[#30343B] hover:border-[#D5B477]/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-[#D5B477] group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-3.5 h-3.5 text-[#A2A5AC] group-hover:translate-x-1 group-hover:text-[#F4F1EA] transition-all" />
          </div>
          <h4 className="text-xs font-bold text-[#F4F1EA]">Goal Timeline Simulator</h4>
          <p className="text-[11px] text-[#A2A5AC] mt-1 leading-relaxed">
            Simulate what happens if you step up to ₹1,500/month or alter your time horizon.
          </p>
        </div>

        <div 
          onClick={() => navigateTo('learning')}
          className="p-5 rounded-2xl bg-[#101216] border border-[#30343B] hover:border-[#8BC6A1]/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-5 h-5 text-[#8BC6A1] group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-3.5 h-3.5 text-[#A2A5AC] group-hover:translate-x-1 group-hover:text-[#F4F1EA] transition-all" />
          </div>
          <h4 className="text-xs font-bold text-[#F4F1EA]">Financial Learning Hub</h4>
          <p className="text-[11px] text-[#A2A5AC] mt-1 leading-relaxed">
            10 interactive student guides covering rupee cost averaging, risk, and discipline.
          </p>
        </div>
      </div>
    </div>
  );
};

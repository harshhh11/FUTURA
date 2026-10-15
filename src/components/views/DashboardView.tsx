import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Eye, 
  EyeOff, 
  Bell, 
  ChevronRight, 
  TrendingUp, 
  Wallet, 
  Shield, 
  Target, 
  Sparkles,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    accountAllocations, 
    navigateTo, 
    setIsAppLauncherOpen,
    reducedMotion 
  } = useApp();

  // Local UI State
  const [showWealth, setShowWealth] = useState<boolean>(true);
  const [chartTimeframe, setChartTimeframe] = useState<'Monthly' | 'Quarterly' | 'Annual' | '1Y'>('Monthly');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(6); // Default: Jul (last)
  const [isChartAnimated, setIsChartAnimated] = useState<boolean>(false);

  // Trigger chart entrance animation
  useEffect(() => {
    if (reducedMotion) {
      setIsChartAnimated(true);
      return;
    }
    const timer = setTimeout(() => setIsChartAnimated(true), 150);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Aggregate Total Wealth
  const totalWealth = useMemo(() => {
    return (accountAllocations.cash || 0) + (accountAllocations.investments || 0) + (accountAllocations.reserve || 0);
  }, [accountAllocations]);

  const cashPct = totalWealth > 0 ? Math.round((accountAllocations.cash / totalWealth) * 100) : 28;
  const invPct = totalWealth > 0 ? Math.round((accountAllocations.investments / totalWealth) * 100) : 66;
  const reservePct = totalWealth > 0 ? Math.round((accountAllocations.reserve / totalWealth) * 100) : 6;

  // Monthly Portfolio Growth Series (Matching Screen 1 Mountain Curve)
  const monthlyData = [
    { month: 'Jan', value: 240000, returnPct: '+5.2%' },
    { month: 'Feb', value: 255000, returnPct: '+6.8%' },
    { month: 'Mar', value: 248000, returnPct: '+5.9%' },
    { month: 'Apr', value: 275000, returnPct: '+8.4%' },
    { month: 'May', value: 320000, returnPct: '+10.6%' },
    { month: 'Jun', value: 310000, returnPct: '+9.8%' },
    { month: 'Jul', value: totalWealth, returnPct: '+12.4%' },
  ];

  // SVG Chart Geometry
  const chartWidth = 320;
  const chartHeight = 130;
  const paddingX = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const minVal = 210000;
  const maxVal = 380000;

  const points = monthlyData.map((d, i) => {
    const x = paddingX + (i / (monthlyData.length - 1)) * (chartWidth - paddingX * 2);
    const y = (chartHeight - paddingBottom) - ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, data: d };
  });

  // Smooth bezier curve path
  const curvePath = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p1.x - (p1.x - p0.x) * 0.45;
      const cy2 = p1.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  const areaPath = useMemo(() => {
    if (!curvePath || points.length === 0) return '';
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = chartHeight - paddingBottom + 5;
    return `${curvePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [curvePath, points, chartHeight, paddingBottom]);

  const activePoint = points[selectedMonthIndex] || points[points.length - 1];

  return (
    <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-5 animate-fadeIn pb-32 text-[#F4F1EA] select-none">
      
      {/* 1. TOP PROFILE GREETING & NOTIFICATION HEADER (Screen 1 Source of Truth) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          {/* Avatar with subtle gold ring */}
          <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-[#D5B477]/80 via-[#CAD2DC]/40 to-transparent shadow-md">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#16181F]">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                alt="Aarav"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          <div>
            <h1 className="font-display font-bold text-sm sm:text-base text-[#F4F1EA] leading-tight">
              Hello, {userProfile?.name ? userProfile.name.split(' ')[0] : 'Aarav'}!
            </h1>
            <p className="text-[11px] text-[#8E929C] flex items-center space-x-1 mt-0.5">
              <span>Keep building</span>
              <span className="text-xs">✌️</span>
            </p>
          </div>
        </div>

        {/* Top Right Controls: Notification Bell + 4-Square Grid Launcher Button */}
        <div className="flex items-center space-x-2">
          {/* Notification Bell with red dot */}
          <button
            onClick={() => sound.playClick()}
            className="w-9 h-9 rounded-2xl bg-[#14161C] hover:bg-[#1C1F26] border border-[#2D313B] flex items-center justify-center text-[#A2A5AC] hover:text-[#F4F1EA] relative transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E27D78] ring-2 ring-[#14161C]" />
          </button>

          {/* 4-Square Grid Launcher Icon Button [::] */}
          <button
            onClick={() => {
              sound.playChime();
              setIsAppLauncherOpen(true);
            }}
            className="w-9 h-9 rounded-2xl bg-[#1C1F26] hover:bg-[#252932] border border-[#30343B] hover:border-[#D5B477]/50 flex items-center justify-center text-white/90 active:scale-95 transition-all shadow-sm group cursor-pointer"
            title="Open Navigation Menu"
            aria-label="Open navigation menu"
          >
            <div className="grid grid-cols-2 gap-[2.5px] w-3.5 h-3.5 group-hover:scale-105 transition-transform">
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#F4F1EA]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#F4F1EA]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#F4F1EA]" />
              <div className="w-1.5 h-1.5 rounded-[1.5px] bg-[#F4F1EA]" />
            </div>
          </button>
        </div>
      </div>

      {/* 2. TOTAL WEALTH & METALLIC CARD AREA (Exact Screen 1 Reference) */}
      <div className="pt-2 pb-1 flex items-center justify-between">
        {/* Left Column: Wealth Metrics */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#8E929C]">
            <span className="tracking-tight">Total Wealth (Simulated)</span>
            <button
              onClick={() => {
                sound.playClick();
                setShowWealth(!showWealth);
              }}
              className="text-[#8E929C] hover:text-[#D5B477] transition-colors cursor-pointer"
              title={showWealth ? 'Hide balance' : 'Show balance'}
            >
              {showWealth ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-[#D5B477]" />}
            </button>
          </div>

          <div className="font-display font-extrabold text-3xl sm:text-[34px] tracking-tight text-[#F4F1EA] leading-tight">
            {showWealth ? formatINR(totalWealth) : '••••••••'}
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-mono font-medium pt-0.5">
            <span className="text-[#8BC6A1] flex items-center">
              <span>↑</span>
              <span className="ml-0.5">+12.4%</span>
            </span>
            <span className="text-[#D5B477]">+₹39,450 this year</span>
          </div>
        </div>

        {/* Right Column: Mini Floating Metallic 3D Silver Card */}
        <div 
          onClick={() => {
            sound.playChime();
            navigateTo('balance');
          }}
          className="relative w-28 h-20 cursor-pointer group shrink-0"
          title="FUTURA Metallic Vault Card"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-[#D5B477]/10 blur-xl rounded-full group-hover:bg-[#D5B477]/20 transition-all pointer-events-none" />

          {/* Diagonally Angled Card Body */}
          <div 
            className="w-full h-full rounded-xl p-2 relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]"
            style={{
              transform: 'rotate(-7deg) skewX(-2deg)',
              background: 'linear-gradient(135deg, #F0F4F8 0%, #D4DDE8 28%, #A8B4C2 40%, #171A21 41%, #0A0C10 75%, #050608 100%)',
              boxShadow: '0 12px 25px -5px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.7), 0 0 0 1px rgba(255,255,255,0.2)'
            }}
          >
            {/* Razor-sharp diagonal reflection seam */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.8) 40%, rgba(0,0,0,0.6) 41%, transparent 70%)'
              }}
            />

            <div className="relative z-10 w-full h-full flex flex-col justify-between text-[8px] text-white/90">
              <div className="flex items-center justify-between font-display font-bold uppercase tracking-wider text-[9px]">
                <span>FUTURA</span>
              </div>

              {/* EMV chip */}
              <div className="w-5 h-3.5 rounded-sm bg-gradient-to-br from-[#E2E6EC] to-[#757E8C] border border-white/40 shadow-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. THREE FINANCIAL CATEGORY CARDS (Screen 1 3-Column Responsive Grid) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Card 1: Cash & Savings */}
        <div
          onClick={() => {
            sound.playClick();
            navigateTo('balance');
          }}
          className="p-3 rounded-2xl bg-gradient-to-b from-[#1C1F26] to-[#12141A] border border-[#2D313B] hover:border-[#D5B477]/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between min-h-[110px]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-xl bg-[#242832] flex items-center justify-center text-[#D5B477] shadow-inner">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <ChevronRight className="w-3 h-3 text-[#5A5F6D] group-hover:text-[#D5B477] transition-colors" />
          </div>

          <div>
            <span className="block text-[10px] text-[#8E929C] font-medium leading-tight">
              Cash & Savings
            </span>
            <span className="block font-mono font-bold text-xs sm:text-sm text-[#F4F1EA] mt-0.5">
              {showWealth ? formatINR(accountAllocations.cash || 100000) : '••••'}
            </span>
            <span className="block text-[9px] text-[#6E7380] font-mono mt-0.5">
              {cashPct}% of total
            </span>
          </div>
        </div>

        {/* Card 2: Investments */}
        <div
          onClick={() => {
            sound.playClick();
            navigateTo('portfolio');
          }}
          className="p-3 rounded-2xl bg-gradient-to-b from-[#1C1F26] to-[#12141A] border border-[#2D313B] hover:border-[#D5B477]/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between min-h-[110px]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-xl bg-[#242832] flex items-center justify-center text-[#D5B477] shadow-inner">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <ChevronRight className="w-3 h-3 text-[#5A5F6D] group-hover:text-[#D5B477] transition-colors" />
          </div>

          <div>
            <span className="block text-[10px] text-[#8E929C] font-medium leading-tight">
              Investments
            </span>
            <span className="block font-mono font-bold text-xs sm:text-sm text-[#F4F1EA] mt-0.5">
              {showWealth ? formatINR(accountAllocations.investments || 235720) : '••••'}
            </span>
            <span className="block text-[9px] text-[#6E7380] font-mono mt-0.5">
              {invPct}% of total
            </span>
          </div>
        </div>

        {/* Card 3: Emergency Buffer */}
        <div
          onClick={() => {
            sound.playClick();
            navigateTo('bad_year');
          }}
          className="p-3 rounded-2xl bg-gradient-to-b from-[#1C1F26] to-[#12141A] border border-[#2D313B] hover:border-[#D5B477]/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between min-h-[110px]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-xl bg-[#242832] flex items-center justify-center text-[#D5B477] shadow-inner">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <ChevronRight className="w-3 h-3 text-[#5A5F6D] group-hover:text-[#D5B477] transition-colors" />
          </div>

          <div>
            <span className="block text-[10px] text-[#8E929C] font-medium leading-tight">
              Emergency Buffer
            </span>
            <span className="block font-mono font-bold text-xs sm:text-sm text-[#F4F1EA] mt-0.5">
              {showWealth ? formatINR(accountAllocations.reserve || 21000) : '••••'}
            </span>
            <span className="block text-[9px] text-[#6E7380] font-mono mt-0.5">
              {reservePct}% of total
            </span>
          </div>
        </div>
      </div>

      {/* 4. PORTFOLIO GROWTH SECTION (Golden Mountain Curve with Live Tooltip) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#171A21] to-[#0E1015] border border-[#2D313B] shadow-card-depth space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              navigateTo('portfolio');
            }}
            className="flex items-center space-x-1 group cursor-pointer text-left"
          >
            <span className="font-display font-bold text-sm sm:text-base text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors">
              Portfolio Growth
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E929C] group-hover:text-[#D5B477] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Timeframe Selector Pill */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setChartTimeframe(prev => prev === 'Monthly' ? 'Quarterly' : prev === 'Quarterly' ? 'Annual' : 'Monthly');
              }}
              className="px-2.5 py-1 rounded-full bg-[#12141A] border border-[#30343B] text-[10px] font-mono text-[#CAD2DC] hover:text-[#F4F1EA] flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>{chartTimeframe}</span>
              <ChevronDown className="w-3 h-3 text-[#8E929C]" />
            </button>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative w-full h-[145px] pt-1">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Golden Mountain Area Gradient */}
              <linearGradient id="goldMountainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D5B477" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#D5B477" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#D5B477" stopOpacity="0.0" />
              </linearGradient>

              {/* Glowing Line Shadow Filter */}
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle Vertical Grid Lines */}
            {points.map((p, idx) => (
              <line
                key={`grid-${idx}`}
                x1={p.x}
                y1={paddingTop - 5}
                x2={p.x}
                y2={chartHeight - paddingBottom + 5}
                stroke="#252932"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            ))}

            {/* Gradient Fill under Mountain Curve */}
            <path
              d={areaPath}
              fill="url(#goldMountainGradient)"
              className={`transition-opacity duration-700 ${
                isChartAnimated ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Golden Mountain Bezier Stroke */}
            <path
              d={curvePath}
              fill="none"
              stroke="#D5B477"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#goldGlow)"
              style={{
                strokeDasharray: isChartAnimated ? 'none' : '600',
                strokeDashoffset: isChartAnimated ? '0' : '600',
                transition: 'stroke-dashoffset 1s ease-out'
              }}
            />

            {/* Interactive Point Targets */}
            {points.map((p, idx) => {
              const isSelected = selectedMonthIndex === idx;
              return (
                <g key={`pt-${idx}`} className="cursor-pointer" onClick={() => {
                  sound.playClick();
                  setSelectedMonthIndex(idx);
                }}>
                  {/* Invisible hit area for comfortable tapping */}
                  <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                  {/* Visual Node */}
                  {isSelected && (
                    <>
                      <circle cx={p.x} cy={p.y} r="7" fill="#D5B477" opacity="0.3" className="animate-ping" />
                      <circle cx={p.x} cy={p.y} r="4.5" fill="#D5B477" stroke="#12141A" strokeWidth="2" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Dark Tooltip Pill at Active Point */}
          {activePoint && (
            <div 
              className="absolute z-20 pointer-events-none transition-all duration-300 transform -translate-x-1/2"
              style={{
                left: `${(activePoint.x / chartWidth) * 100}%`,
                top: `${(activePoint.y / chartHeight) * 100 - 32}%`
              }}
            >
              <div className="px-2.5 py-1 rounded-xl bg-[#12141A]/95 border border-[#D5B477]/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center space-x-1 text-center">
                <span className="font-mono text-[11px] font-bold text-[#F4F1EA]">
                  {formatINR(activePoint.data.value)}
                </span>
                <span className="font-mono text-[10px] text-[#8BC6A1] font-semibold">
                  {activePoint.data.returnPct}
                </span>
              </div>
            </div>
          )}

          {/* Month Labels along X-Axis */}
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-[#8E929C]">
            {monthlyData.map((d, idx) => (
              <button
                key={d.month}
                onClick={() => {
                  sound.playClick();
                  setSelectedMonthIndex(idx);
                }}
                className={`transition-colors cursor-pointer ${
                  selectedMonthIndex === idx ? 'text-[#D5B477] font-bold' : 'hover:text-[#F4F1EA]'
                }`}
              >
                {d.month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. GOAL PROGRESS SUMMARY CARD (Screen 1 Target Milestone) */}
      <div 
        onClick={() => {
          sound.playClick();
          navigateTo('budget');
        }}
        className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#1A1D24] to-[#12141A] border border-[#2D313B] hover:border-[#D5B477]/50 shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center space-x-3 truncate">
          {/* Bullseye Icon */}
          <div className="w-9 h-9 rounded-full bg-[#20242E] border border-[#30343B] flex items-center justify-center text-[#D5B477] shrink-0 shadow-inner">
            <Target className="w-4 h-4 stroke-[2.2]" />
          </div>

          <div className="truncate">
            <h3 className="font-display font-bold text-xs sm:text-sm text-[#F4F1EA] tracking-tight">
              You're 12% closer to your goal
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#8E929C] truncate mt-0.5">
              Keep your monthly contribution going.
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#6A707E] group-hover:text-[#D5B477] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </div>

    </div>
  );
};

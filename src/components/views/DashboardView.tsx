import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { FuturaCardHero } from '../cinematic/FuturaCardHero';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Wallet, 
  Shield, 
  Target, 
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Compass,
  BookOpen
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    userProfile, 
    accountAllocations, 
    navigateTo, 
    reducedMotion 
  } = useApp();

  // Local UI State
  const [showWealth, setShowWealth] = useState<boolean>(true);
  const [chartTimeframe, setChartTimeframe] = useState<'Monthly' | 'Quarterly' | 'Annual' | '1Y'>('Monthly');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(6); // Default: Jul (last)
  const [isChartAnimated, setIsChartAnimated] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'card' | 'analytics'>('card');

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
    <div className="w-full space-y-4 sm:space-y-6 animate-fadeIn pb-28 md:pb-12 text-[#F4F1EA] select-none">
      
      {/* MOBILE SEGMENTED VIEW SWITCHER (Mobile Only - Quick switch between 3D Card and Financial Analytics) */}
      <div className="lg:hidden flex items-center justify-center pt-1 pb-1 px-4">
        <div className="inline-flex p-1 rounded-full bg-[#15171C]/90 border border-[#30343C]/80 backdrop-blur-md shadow-sm">
          <button
            onClick={() => {
              sound.playClick();
              setMobileTab('card');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mobileTab === 'card'
                ? 'bg-[#20232A] text-[#E6C17D] shadow-sm border border-[#E6C17D]/35'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] border border-transparent'
            }`}
          >
            3D Card View
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setMobileTab('analytics');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mobileTab === 'analytics'
                ? 'bg-[#20232A] text-[#E6C17D] shadow-sm border border-[#E6C17D]/35'
                : 'text-[#A6AFBD] hover:text-[#F5F3EF] border border-transparent'
            }`}
          >
            Financial Analytics
          </button>
        </div>
      </div>

      {/* RESPONSIVE LAYOUT: 1-Column on Mobile with View Switching, 2-Column on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
        
        {/* LEFT COLUMN: THE ICONIC 3D METALLIC CARD HERO + CAROUSEL + SMART ALLOCATIONS */}
        <div className={`lg:col-span-5 w-full flex-col items-center justify-center ${
          mobileTab === 'analytics' ? 'hidden lg:flex' : 'flex'
        }`}>
          <FuturaCardHero />

          {/* Quick jump to analytics on mobile */}
          <div className="lg:hidden w-full px-4 pt-2 pb-1 text-center">
            <button
              onClick={() => {
                sound.playClick();
                setMobileTab('analytics');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-[#15171C]/90 hover:bg-[#1E222A] border border-[#30343C] text-[#A6AFBD] hover:text-[#E6C17D] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>View Total Wealth & Growth Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E6C17D]" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS, CATEGORY CARDS & GROWTH TRAJECTORY */}
        <div className={`lg:col-span-7 w-full space-y-4 sm:space-y-5 lg:space-y-6 px-3.5 sm:px-6 lg:px-0 ${
          mobileTab === 'card' ? 'hidden lg:block' : 'block'
        }`}>
          
          {/* Mobile Back to Card button (when viewing analytics on mobile) */}
          <div className="lg:hidden pb-1 flex items-center justify-between">
            <button
              onClick={() => {
                sound.playClick();
                setMobileTab('card');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#15171C] border border-[#30343C] text-[#A6AFBD] hover:text-[#E6C17D] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>← Return to 3D Card</span>
            </button>
            <span className="text-[11px] font-mono text-[#E6C17D]">
              Live Portfolio
            </span>
          </div>
          
          {/* Total Wealth Header */}
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 shadow-card-depth flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs text-[#A6AFBD]">
                <span className="tracking-tight">Total Portfolio Wealth</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowWealth(!showWealth);
                  }}
                  className="text-[#A6AFBD] hover:text-[#E6C17D] transition-colors cursor-pointer"
                  title={showWealth ? 'Hide balance' : 'Show balance'}
                >
                  {showWealth ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-[#E6C17D]" />}
                </button>
              </div>

              <div className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[34px] tracking-tight text-[#F5F3EF] leading-tight">
                {showWealth ? formatINR(totalWealth) : '••••••••'}
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono font-medium pt-0.5">
                <span className="text-[#80C9A0] flex items-center">
                  <span>↑</span>
                  <span className="ml-0.5">+12.4%</span>
                </span>
                <span className="text-[#A6AFBD] font-normal">·</span>
                <span className="text-[#E6C17D]">+₹39,450 this year</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                navigateTo('balance');
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold bg-[#20232A] hover:bg-[#282C35] border border-[#30343C] hover:border-[#E6C17D]/50 text-[#F5F3EF] flex items-center space-x-1.5 transition-all cursor-pointer min-h-[44px] shrink-0 shadow-sm"
            >
              <span>Balance Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E6C17D]" />
            </button>
          </div>

          {/* 3 Financial Category Cards (Cash & Savings, Investments, Emergency Buffer) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4">
            {/* 1. Cash & Savings */}
            <div 
              onClick={() => {
                sound.playClick();
                navigateTo('budget');
              }}
              className="p-3 sm:p-4 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 hover:border-[#E6C17D]/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center justify-between text-[#A6AFBD] mb-2">
                <span className="text-[10px] sm:text-xs font-medium leading-tight truncate">Cash & Savings</span>
                <Wallet className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#E6C17D] shrink-0" />
              </div>
              <div>
                <div className="font-display font-bold text-xs sm:text-sm lg:text-base text-[#F5F3EF] tracking-tight truncate">
                  {formatINR(accountAllocations.cash)}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-[#E6C17D] mt-0.5 font-medium">
                  {cashPct}%
                </div>
              </div>
            </div>

            {/* 2. Investments */}
            <div 
              onClick={() => {
                sound.playClick();
                navigateTo('portfolio');
              }}
              className="p-3 sm:p-4 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 hover:border-[#80C9A0]/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center justify-between text-[#A6AFBD] mb-2">
                <span className="text-[10px] sm:text-xs font-medium leading-tight truncate">Investments</span>
                <TrendingUp className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#80C9A0] shrink-0" />
              </div>
              <div>
                <div className="font-display font-bold text-xs sm:text-sm lg:text-base text-[#F5F3EF] tracking-tight truncate">
                  {formatINR(accountAllocations.investments)}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-[#80C9A0] mt-0.5 font-medium">
                  {invPct}%
                </div>
              </div>
            </div>

            {/* 3. Emergency Buffer */}
            <div 
              onClick={() => {
                sound.playClick();
                navigateTo('moneyflow');
              }}
              className="p-3 sm:p-4 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 hover:border-[#A6AFBD]/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center justify-between text-[#A6AFBD] mb-2">
                <span className="text-[10px] sm:text-xs font-medium leading-tight truncate">Emergency Buffer</span>
                <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#A6AFBD] shrink-0" />
              </div>
              <div>
                <div className="font-display font-bold text-xs sm:text-sm lg:text-base text-[#F5F3EF] tracking-tight truncate">
                  {formatINR(accountAllocations.reserve)}
                </div>
                <div className="text-[10px] sm:text-xs font-mono text-[#A6AFBD] mt-0.5 font-medium">
                  {reservePct}%
                </div>
              </div>
            </div>
          </div>


      {/* 4. PORTFOLIO GROWTH SECTION (Golden Mountain Curve with Live Tooltip) */}
      <div className="p-4 sm:p-5 lg:p-6 rounded-2xl bg-gradient-to-b from-[#171A21] to-[#0E1015] border border-[#2D313B] shadow-card-depth space-y-3.5 lg:space-y-4">
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
                <stop offset="0%" stopColor="#E6C17D" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#E6C17D" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#E6C17D" stopOpacity="0.0" />
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
              stroke="#E6C17D"
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
                      <circle cx={p.x} cy={p.y} r="7" fill="#E6C17D" opacity="0.3" className="animate-ping" />
                      <circle cx={p.x} cy={p.y} r="4.5" fill="#E6C17D" stroke="#12141A" strokeWidth="2" />
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
              <div className="px-2.5 py-1 rounded-xl bg-[#15171C]/95 border border-[#E6C17D]/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center space-x-1 text-center">
                <span className="font-mono text-[11px] font-bold text-[#F5F3EF]">
                  {formatINR(activePoint.data.value)}
                </span>
                <span className="font-mono text-[10px] text-[#80C9A0] font-semibold">
                  {activePoint.data.returnPct}
                </span>
              </div>
            </div>
          )}

          {/* Month Labels along X-Axis */}
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-[#A6AFBD]">
            {monthlyData.map((d, idx) => (
              <button
                key={d.month}
                onClick={() => {
                  sound.playClick();
                  setSelectedMonthIndex(idx);
                }}
                className={`transition-colors cursor-pointer py-1 ${
                  selectedMonthIndex === idx ? 'text-[#E6C17D] font-bold' : 'hover:text-[#F5F3EF]'
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
        className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#20232A] to-[#15171C] border border-[#30343C] hover:border-[#E6C17D]/50 shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center space-x-3 truncate">
          {/* Bullseye Icon */}
          <div className="w-9 h-9 rounded-full bg-[#20232A] border border-[#30343C] flex items-center justify-center text-[#E6C17D] shrink-0 shadow-inner">
            <Target className="w-4 h-4 stroke-[2.2]" />
          </div>

          <div className="truncate">
            <h3 className="font-display font-bold text-xs sm:text-sm text-[#F5F3EF] tracking-tight">
              You're 12% closer to your goal
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#A6AFBD] truncate mt-0.5">
              Keep your monthly contribution going.
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-[#6A707E] group-hover:text-[#E6C17D] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </div>

      {/* 6. SIGNATURE STRESS TEST: REHEARSE A BAD YEAR */}
      <div className="p-4 sm:p-5 lg:p-6 rounded-2xl bg-gradient-to-r from-[#20232A] via-[#1C1819] to-[#251817] border border-[#E27D78]/30 shadow-card-depth flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#E27D78]/15 border border-[#E27D78]/30 text-[9px] font-mono text-[#E27D78]">
            <ShieldAlert className="w-3 h-3" />
            <span>SIGNATURE STRESS TEST</span>
          </div>
          <h4 className="font-display text-sm font-bold text-[#F5F3EF]">
            Rehearse a Bad Year Shock
          </h4>
          <p className="text-xs text-[#A6AFBD] leading-relaxed max-w-md">
            Simulate a 10%, 20%, or 30% correction before investing real money. See why continuing your monthly SIP during downturns accelerates wealth recovery.
          </p>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            navigateTo('bad_year');
          }}
          className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-[#E27D78] hover:bg-[#E88C88] text-[#08090B] transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95"
        >
          <span>Stress Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7. QUICK ACCESS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div 
          onClick={() => {
            sound.playClick();
            navigateTo('explorer');
          }}
          className="p-3.5 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 hover:border-[#A9B8C8]/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <Compass className="w-4 h-4 text-[#A9B8C8] group-hover:rotate-45 transition-transform" />
            <ArrowRight className="w-3 h-3 text-[#A6AFBD] group-hover:translate-x-1 group-hover:text-[#F5F3EF] transition-all" />
          </div>
          <h5 className="text-xs font-bold text-[#F5F3EF]">6 Asset Classes</h5>
          <p className="text-[10px] text-[#A6AFBD] mt-0.5 leading-snug">
            Index Funds, FDs, Gold, Bonds in plain English.
          </p>
        </div>

        <div 
          onClick={() => {
            sound.playClick();
            navigateTo('simulator');
          }}
          className="p-3.5 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 hover:border-[#E6C17D]/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <TrendingUp className="w-4 h-4 text-[#E6C17D] group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-3 h-3 text-[#A6AFBD] group-hover:translate-x-1 group-hover:text-[#F5F3EF] transition-all" />
          </div>
          <h5 className="text-xs font-bold text-[#F5F3EF]">Goal Simulator</h5>
          <p className="text-[10px] text-[#A6AFBD] mt-0.5 leading-snug">
            Simulate stepping up to ₹1,500/mo SIP.
          </p>
        </div>

        <div 
          onClick={() => {
            sound.playClick();
            navigateTo('learning');
          }}
          className="p-3.5 rounded-2xl bg-[#15171C]/90 border border-[#30343C]/80 hover:border-[#80C9A0]/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <BookOpen className="w-4 h-4 text-[#80C9A0] group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-3 h-3 text-[#A6AFBD] group-hover:translate-x-1 group-hover:text-[#F5F3EF] transition-all" />
          </div>
          <h5 className="text-xs font-bold text-[#F5F3EF]">Learning Hub</h5>
          <p className="text-[10px] text-[#A6AFBD] mt-0.5 leading-snug">
            10 interactive student guides & lessons.
          </p>
        </div>
      </div>

    </div>
  </div>

</div>
  );
};

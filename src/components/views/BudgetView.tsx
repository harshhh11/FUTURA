import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { BudgetCategoryItem, SavingsGoal } from '../../types/finance';
import { 
  PiggyBank, 
  Plus, 
  SlidersHorizontal, 
  Layers, 
  Coffee, 
  Car, 
  Gamepad2, 
  Laptop, 
  ShieldCheck, 
  Plane, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Edit3, 
  ArrowUpRight, 
  DollarSign, 
  ChevronRight, 
  Calendar,
  TrendingUp,
  Receipt
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const { 
    monthlyBudget, 
    budgetCategories, 
    savingsGoals, 
    accountAllocations, 
    reducedMotion, 
    updateMonthlyBudget, 
    addBudgetExpense, 
    contributeToSavingsGoal, 
    addSavingsGoal,
    navigateTo
  } = useApp();

  // Animation Stage Tracker (5-Stage Reveal)
  // Stage 0: Initial Mount
  // Stage 1: Header & Monthly Budget Card
  // Stage 2: Arc visualization draws
  // Stage 3: Center metrics count up & reveal
  // Stage 4: Category chips slide in
  // Stage 5: Savings Goals cascade in with progress bars
  const [animationStage, setAnimationStage] = useState<number>(reducedMotion ? 5 : 0);
  const [displayedCenterAmount, setDisplayedCenterAmount] = useState<number>(reducedMotion ? monthlyBudget : 0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [centerMetricMode, setCenterMetricMode] = useState<'total' | 'remaining' | 'spent'>('total');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState<boolean>(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState<boolean>(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<SavingsGoal | null>(null);

  // Form States
  const [expenseAmount, setExpenseAmount] = useState<string>('250');
  const [expenseCategoryId, setExpenseCategoryId] = useState<string>('food');
  const [expenseNote, setExpenseNote] = useState<string>('Coffee & Snack');
  const [expenseError, setExpenseError] = useState<string>('');

  const [contributeAmount, setContributeAmount] = useState<string>('1000');
  const [contributeError, setContributeError] = useState<string>('');

  const [newGoalName, setNewGoalName] = useState<string>('');
  const [newGoalTarget, setNewGoalTarget] = useState<string>('25000');
  const [newGoalDeposit, setNewGoalDeposit] = useState<string>('2000');
  const [newGoalCategory, setNewGoalCategory] = useState<string>('Personal');
  const [newGoalIcon, setNewGoalIcon] = useState<string>('Sparkles');

  const [editBudgetAmount, setEditBudgetAmount] = useState<string>(monthlyBudget.toString());

  // Aggregate Calculations
  const totalSpent = useMemo(() => {
    return budgetCategories.reduce((acc, cat) => acc + cat.spentAmount, 0);
  }, [budgetCategories]);

  const totalRemaining = Math.max(0, monthlyBudget - totalSpent);
  const spentPercentage = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

  // Category Icon Map
  const getCategoryIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case 'Layers': return <Layers className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'Car': return <Car className={className} />;
      case 'Gamepad2': return <Gamepad2 className={className} />;
      case 'PiggyBank': return <PiggyBank className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Plane': return <Plane className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // Progressive 5-Stage Reveal Effect
  useEffect(() => {
    if (reducedMotion) {
      setAnimationStage(5);
      setDisplayedCenterAmount(monthlyBudget);
      return;
    }

    // Sequence stages
    const timer1 = setTimeout(() => setAnimationStage(1), 50);
    const timer2 = setTimeout(() => setAnimationStage(2), 250);
    const timer3 = setTimeout(() => {
      setAnimationStage(3);
      // Animate counter from 0 to target
      const targetVal = monthlyBudget;
      const duration = 650;
      const start = performance.now();
      const countUp = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayedCenterAmount(Math.round(easeOut * targetVal));
        if (progress < 1) {
          requestAnimationFrame(countUp);
        } else {
          setDisplayedCenterAmount(targetVal);
        }
      };
      requestAnimationFrame(countUp);
    }, 550);
    const timer4 = setTimeout(() => setAnimationStage(4), 850);
    const timer5 = setTimeout(() => setAnimationStage(5), 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [reducedMotion, monthlyBudget]);

  // Semicircular Ring Geometry Calculations
  // Horseshoe / Open Ring arc spanning 210 degrees from 165° to 375°
  const radius = 95;
  const strokeWidth = 16;
  const center = 120;
  // Arc angle in degrees: 210 deg
  const arcLength = (210 / 360) * 2 * Math.PI * radius; // approx 348px

  // Compute category segments along the 210° arc
  const arcSegments = useMemo(() => {
    let accumulatedOffset = 0;
    const totalBudgetForRing = budgetCategories.reduce((acc, cat) => acc + cat.budgetAmount, 0) || monthlyBudget;

    return budgetCategories.map((cat) => {
      const proportion = cat.budgetAmount / totalBudgetForRing;
      const segLength = proportion * arcLength;
      const offset = accumulatedOffset;
      accumulatedOffset += segLength;

      return {
        ...cat,
        segLength: Math.max(8, segLength - 4), // small gap between segments
        offset,
        proportion,
      };
    });
  }, [budgetCategories, monthlyBudget, arcLength]);

  const handleOpenContribute = (goal: SavingsGoal) => {
    sound.playClick();
    setSelectedGoalForContribution(goal);
    setContributeAmount('1000');
    setContributeError('');
    setIsContributeModalOpen(true);
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForContribution) return;
    const amount = Number(contributeAmount);
    if (isNaN(amount) || amount <= 0) {
      setContributeError('Enter a valid contribution amount');
      return;
    }
    if (accountAllocations.cash < amount) {
      setContributeError(`Insufficient cash balance (${formatINR(accountAllocations.cash)})`);
      return;
    }
    contributeToSavingsGoal(selectedGoalForContribution.id, amount);
    setIsContributeModalOpen(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      setExpenseError('Enter a valid amount');
      return;
    }
    addBudgetExpense(expenseCategoryId, amount, expenseNote);
    setIsExpenseModalOpen(false);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;
    const target = Number(newGoalTarget);
    const deposit = Number(newGoalDeposit) || 0;
    if (isNaN(target) || target <= 0) return;

    addSavingsGoal({
      name: newGoalName.trim(),
      targetAmount: target,
      initialDeposit: deposit,
      category: newGoalCategory,
      icon: newGoalIcon,
    });
    setNewGoalName('');
    setIsGoalModalOpen(false);
  };

  const handleBudgetUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = Number(editBudgetAmount);
    if (isNaN(newBudget) || newBudget <= 0) return;
    updateMonthlyBudget(newBudget);
    setIsEditBudgetModalOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-7 animate-fadeIn pb-28 text-[#F4F1EA] select-none">
      
      {/* 1. COMPACT PAGE HEADER (Reference B Inspired) */}
      <div 
        className={`flex items-center justify-between pt-1 transition-all duration-500 ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F4F1EA]">
              Budget
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#171A20] border border-[#30343B] text-[10px] font-mono text-[#D5B477]">
              FUTURA OS
            </span>
          </div>
          <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-[#A2A5AC]">
            <Calendar className="w-3.5 h-3.5 text-[#D5B477]" />
            <span>October 2026</span>
            <span className="text-white/20">·</span>
            <span className="text-[#8BC6A1] font-medium">{100 - spentPercentage}% safe</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsEditBudgetModalOpen(true);
            }}
            className="p-2 rounded-xl bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] transition-all cursor-pointer"
            title="Edit Monthly Budget Target"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D5B477]" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsExpenseModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#D5B477] hover:bg-[#E5C68A] text-[#090A0C] font-semibold text-xs flex items-center space-x-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Expense</span>
          </button>
        </div>
      </div>

      {/* 2. MONTHLY BUDGET SUMMARY CARD (Reference B layout with Reference A Dark Metallic Theme) */}
      <div 
        className={`relative rounded-3xl bg-gradient-to-br from-[#1C2028] via-[#14171E] to-[#0E1015] border border-[#30343B] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-600 ${
          animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Subtle Diagonal Metallic Reflection */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#D5B477]/[0.025] blur-2xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col space-y-4">
          {/* Card Top Row: Title + Progress Circle Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-mono text-[#A2A5AC]">
                Monthly Budget
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsEditBudgetModalOpen(true);
                }}
                className="text-[#8E929C] hover:text-[#D5B477] transition-colors cursor-pointer"
                title="Edit Budget"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Circular Percentage Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#101217] border border-[#30343B]">
              <div className="w-2 h-2 rounded-full bg-[#D5B477] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#F4F1EA]">
                {spentPercentage}% Used
              </span>
            </div>
          </div>

          {/* Card Main Figure: Target Budget */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F1EA]">
                {formatINR(monthlyBudget)}
              </div>
              <p className="text-[11px] text-[#8E929C] mt-0.5 font-sans">
                Allocated across {budgetCategories.length} active spending envelopes
              </p>
            </div>
          </div>

          {/* Card Bottom Row: Spent vs Available Split */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#30343B]/60">
            <div className="p-2.5 rounded-xl bg-[#101217]/60 border border-[#252830]">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C68A]" />
                <span className="text-[11px] text-[#A2A5AC]">Total Spent</span>
              </div>
              <div className="font-mono text-base font-bold text-[#F4F1EA]">
                {formatINR(totalSpent)}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#101217]/60 border border-[#252830]">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BC6A1]" />
                <span className="text-[11px] text-[#A2A5AC]">Available Left</span>
              </div>
              <div className="font-mono text-base font-bold text-[#8BC6A1]">
                {formatINR(totalRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CIRCULAR OPEN-RING BUDGET VISUALIZATION (Signature 5-Stage Reveal) */}
      <div 
        className={`relative rounded-3xl bg-gradient-to-b from-[#181B22] to-[#101217] border border-[#30343B] p-6 shadow-card-depth flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
          animationStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Soft Radial Center Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-radial from-[#D5B477]/10 via-transparent to-transparent blur-2xl pointer-events-none" />

        {/* SVG Arc Container */}
        <div className="relative w-[240px] h-[210px] flex items-center justify-center">
          <svg 
            width="240" 
            height="210" 
            viewBox="0 0 240 210" 
            className="transform -rotate-[105deg] overflow-visible"
          >
            {/* Background Base Ring Arc Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#20242E"
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} 999`}
              strokeLinecap="round"
            />

            {/* Segmented Category Arcs */}
            {arcSegments.map((seg) => {
              const isSelected = selectedCategoryId === 'all' || selectedCategoryId === seg.id;
              const segDashArray = `${seg.segLength} 999`;
              // Progressive draw using animationStage
              const strokeOffset = animationStage >= 2 ? -seg.offset : arcLength;

              return (
                <circle
                  key={seg.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isSelected ? strokeWidth + 2 : strokeWidth - 2}
                  strokeDasharray={segDashArray}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out cursor-pointer hover:opacity-100"
                  style={{
                    opacity: isSelected ? 1 : 0.25,
                    filter: isSelected && selectedCategoryId === seg.id ? `drop-shadow(0 0 8px ${seg.color}88)` : 'none'
                  }}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategoryId(selectedCategoryId === seg.id ? 'all' : seg.id);
                  }}
                />
              );
            })}
          </svg>

          {/* Inner Central Metric Display (Stage 3 Animated Reveal) */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center text-center pt-5 transition-all duration-700 ${
              animationStage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <button
              onClick={() => {
                sound.playClick();
                setCenterMetricMode(prev => prev === 'total' ? 'remaining' : prev === 'remaining' ? 'spent' : 'total');
              }}
              className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Click to toggle metric"
            >
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A2A5AC] group-hover:text-[#D5B477] transition-colors flex items-center space-x-1">
                <span>{centerMetricMode === 'total' ? 'Save In Total' : centerMetricMode === 'remaining' ? 'Left to Spend' : 'Total Spent'}</span>
              </span>

              <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F1EA] mt-0.5">
                {formatINR(
                  centerMetricMode === 'total' 
                    ? displayedCenterAmount 
                    : centerMetricMode === 'remaining' 
                    ? totalRemaining 
                    : totalSpent
                )}
              </span>

              <span className="text-[10px] text-[#D5B477] font-mono mt-0.5 px-2 py-0.5 rounded-full bg-[#101217] border border-[#30343B]">
                {centerMetricMode === 'total' 
                  ? `${budgetCategories.length} Categories` 
                  : centerMetricMode === 'remaining' 
                  ? `${100 - spentPercentage}% Remaining` 
                  : `${spentPercentage}% Spent`}
              </span>
            </button>
          </div>
        </div>

        {/* Selected Category Quick Peek */}
        {selectedCategoryId !== 'all' && (
          <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#101217] border border-[#30343B] flex items-center space-x-2 text-xs animate-fadeIn">
            <span 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: budgetCategories.find(c => c.id === selectedCategoryId)?.color }}
            />
            <span className="font-semibold text-[#F4F1EA]">
              {budgetCategories.find(c => c.id === selectedCategoryId)?.name}:
            </span>
            <span className="font-mono text-[#D5B477]">
              {formatINR(budgetCategories.find(c => c.id === selectedCategoryId)?.spentAmount || 0)}
            </span>
            <span className="text-[#8E929C]">/</span>
            <span className="font-mono text-[#CAD2DC]">
              {formatINR(budgetCategories.find(c => c.id === selectedCategoryId)?.budgetAmount || 0)}
            </span>
            <button
              onClick={() => setSelectedCategoryId('all')}
              className="ml-1 text-[10px] text-[#A2A5AC] hover:text-[#F4F1EA] underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* 4. HORIZONTALLY SCROLLABLE CATEGORY CHIPS (Reference B Component) */}
      <div 
        className={`space-y-2.5 transition-all duration-600 ${
          animationStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase tracking-wider font-mono text-[#A2A5AC]">
            Spending Categories
          </span>
          <span className="text-[11px] text-[#8E929C]">
            Select chip to filter ring
          </span>
        </div>

        {/* Horizontal Scroll Pill Row */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-1 px-1">
          {/* "All" Chip */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedCategoryId('all');
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedCategoryId === 'all'
                ? 'bg-[#20242B] border border-[#D5B477] text-[#D5B477] shadow-[0_0_12px_rgba(213,180,119,0.2)]'
                : 'bg-[#14171E] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#1A1D24]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          {/* Individual Category Chips */}
          {budgetCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const pct = Math.round((cat.spentAmount / cat.budgetAmount) * 100);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategoryId(isSelected ? 'all' : cat.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-[#20242B] border-2 text-[#F4F1EA] shadow-md scale-102'
                    : 'bg-[#14171E] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] hover:bg-[#1A1D24]'
                }`}
                style={{
                  borderColor: isSelected ? cat.color : undefined
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span>{cat.name}</span>
                <span className="font-mono text-[11px] opacity-75">
                  {formatINR(cat.spentAmount)}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#101217] text-[#8E929C]">
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. SAVINGS GOALS SECTION (Reference B Layout + Muted Gold Theme) */}
      <div 
        className={`space-y-3.5 transition-all duration-700 ${
          animationStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#F4F1EA]">
              Savings Goals
            </h2>
            <p className="text-[11px] text-[#A2A5AC]">
              Automated allocations & milestone progress
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsGoalModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#171A20] hover:bg-[#20242B] border border-[#D5B477]/40 text-[#D5B477] text-xs font-semibold flex items-center space-x-1 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {savingsGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

            return (
              <div 
                key={goal.id}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1A1D24] to-[#12141A] border border-[#30343B] hover:border-[#D5B477]/50 shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#20242B] border border-[#30343B] flex items-center justify-center text-[#D5B477] shadow-inner">
                      {getCategoryIcon(goal.icon || 'Sparkles', 'w-5 h-5')}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#F4F1EA]">
                        {goal.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-[#A2A5AC]">
                        <span>{goal.category}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-[#D5B477] font-mono">{pct}% reached</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenContribute(goal)}
                    className="px-3 py-1.5 rounded-xl bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] hover:border-[#D5B477]/50 text-xs font-semibold text-[#F4F1EA] flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <span>Contribute</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D5B477]" />
                  </button>
                </div>

                {/* Progress Bar (Animated 0 -> target %) */}
                <div className="space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-[#101217] overflow-hidden border border-[#252830]">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#D5B477] to-[#E5C68A] transition-all duration-1000 ease-out"
                      style={{ 
                        width: animationStage >= 5 ? `${pct}%` : '0%' 
                      }}
                    />
                  </div>

                  {/* Financial Values Under Progress Bar */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#D5B477] font-bold">
                      {formatINR(goal.savedAmount)}
                    </span>
                    <span className="text-[#8E929C]">
                      Target: {formatINR(goal.targetAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: LOG EXPENSE MODAL */}
      {/* ======================================================== */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#30343B]/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#20242B] border border-[#D5B477]/40 flex items-center justify-center text-[#D5B477]">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#F4F1EA]">Log Quick Expense</h3>
                  <p className="text-[10px] text-[#A2A5AC]">Deducted from budget and cash balance</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1.5 block">Category</label>
                <select
                  value={expenseCategoryId}
                  onChange={(e) => setExpenseCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                >
                  {budgetCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name} (Budget: {formatINR(cat.budgetAmount)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] font-mono text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  placeholder="250"
                  min="1"
                  required
                />
                <div className="flex items-center space-x-1.5 mt-2">
                  {['100', '250', '500', '1000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setExpenseAmount(val)}
                      className="px-2 py-1 rounded-lg bg-[#1A1D24] text-[11px] font-mono text-[#A2A5AC] hover:text-[#D5B477] border border-[#30343B]"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1.5 block">Note / Merchant</label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  placeholder="e.g., Grocery Store"
                />
              </div>

              {expenseError && (
                <p className="text-xs text-[#E27D78] flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{expenseError}</span>
                </p>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#171A20] text-xs text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#D5B477] hover:bg-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONTRIBUTE TO GOAL MODAL */}
      {/* ======================================================== */}
      {isContributeModalOpen && selectedGoalForContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#30343B]/60">
              <div>
                <h3 className="font-display font-bold text-sm text-[#F4F1EA]">
                  Contribute to {selectedGoalForContribution.name}
                </h3>
                <p className="text-[10px] text-[#A2A5AC]">
                  Available Cash: {formatINR(accountAllocations.cash)}
                </p>
              </div>
              <button 
                onClick={() => setIsContributeModalOpen(false)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContributeSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1.5 block">Amount to Save (₹)</label>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] font-mono text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  min="1"
                  required
                />
                <div className="flex items-center space-x-1.5 mt-2">
                  {['500', '1000', '2000', '5000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setContributeAmount(val)}
                      className="px-2 py-1 rounded-lg bg-[#1A1D24] text-[11px] font-mono text-[#A2A5AC] hover:text-[#D5B477] border border-[#30343B]"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {contributeError && (
                <p className="text-xs text-[#E27D78] flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{contributeError}</span>
                </p>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsContributeModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#171A20] text-xs text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#D5B477] hover:bg-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD NEW GOAL MODAL */}
      {/* ======================================================== */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#30343B]/60">
              <h3 className="font-display font-bold text-sm text-[#F4F1EA]">Add Savings Goal</h3>
              <button 
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1 block">Goal Name</label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  placeholder="e.g. Electric Scooter"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1 block">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] font-mono text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  placeholder="50000"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1 block">Initial Deposit (₹)</label>
                <input
                  type="number"
                  value={newGoalDeposit}
                  onChange={(e) => setNewGoalDeposit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] font-mono text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1 block">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] text-xs text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                >
                  <option value="Tech & Career">Tech & Career</option>
                  <option value="Safety Net">Safety Net</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#171A20] text-xs text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#D5B477] hover:bg-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: EDIT MONTHLY BUDGET MODAL */}
      {/* ======================================================== */}
      {isEditBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#30343B]/60">
              <h3 className="font-display font-bold text-sm text-[#F4F1EA]">Set Monthly Budget</h3>
              <button 
                onClick={() => setIsEditBudgetModalOpen(false)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBudgetUpdateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-mono text-[#A2A5AC] mb-1.5 block">Total Budget (₹)</label>
                <input
                  type="number"
                  value={editBudgetAmount}
                  onChange={(e) => setEditBudgetAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101217] border border-[#30343B] font-mono text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D5B477]"
                  min="1000"
                  step="500"
                  required
                />
                <div className="flex items-center space-x-1.5 mt-2">
                  {['8000', '10000', '15000', '20000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditBudgetAmount(val)}
                      className="px-2 py-1 rounded-lg bg-[#1A1D24] text-[11px] font-mono text-[#A2A5AC] hover:text-[#D5B477] border border-[#30343B]"
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditBudgetModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#171A20] text-xs text-[#A2A5AC] hover:text-[#F4F1EA] border border-[#30343B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#D5B477] hover:bg-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Update Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

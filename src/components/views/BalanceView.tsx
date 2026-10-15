import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Grid, 
  Search, 
  Filter, 
  Layers, 
  PieChart, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRightLeft, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  X,
  CreditCard,
  Building,
  Coffee,
  Bus,
  Tv,
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const BalanceView: React.FC = () => {
  const { 
    userProfile, 
    accountAllocations, 
    balanceTransactions, 
    addMoneyToBalance, 
    moveBalanceFunds,
    navigateTo 
  } = useApp();

  // Local UI State
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cash' | 'investments' | 'reserve'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense' | 'contribution'>('all');
  const [showAllTransactions, setShowAllTransactions] = useState<boolean>(false);

  // Modals state
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<boolean>(false);
  const [isMoveFundsOpen, setIsMoveFundsOpen] = useState<boolean>(false);
  
  // Add Money Form State
  const [addAmount, setAddAmount] = useState<string>('1000');
  const [addCategory, setAddCategory] = useState<'cash' | 'investments' | 'reserve'>('cash');
  const [addDescription, setAddDescription] = useState<string>('Monthly Allowance');
  const [addError, setAddError] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<string>('');

  // Move Funds Form State
  const [moveAmount, setMoveAmount] = useState<string>('500');
  const [moveFrom, setMoveFrom] = useState<'cash' | 'investments' | 'reserve'>('cash');
  const [moveTo, setMoveTo] = useState<'cash' | 'investments' | 'reserve'>('investments');
  const [moveError, setMoveError] = useState<string>('');
  const [moveSuccess, setMoveSuccess] = useState<string>('');

  // Derived Totals
  const totalBalance = accountAllocations.cash + accountAllocations.investments + accountAllocations.reserve;

  const cashPct = totalBalance > 0 ? Math.round((accountAllocations.cash / totalBalance) * 100) : 0;
  const investmentsPct = totalBalance > 0 ? Math.round((accountAllocations.investments / totalBalance) * 100) : 0;
  const reservePct = totalBalance > 0 ? Math.round((accountAllocations.reserve / totalBalance) * 100) : 0;

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return balanceTransactions.filter(tx => {
      // Category filter (from Account Cards selection)
      if (selectedCategory === 'cash') {
        if (tx.category === 'Investments') return false;
      } else if (selectedCategory === 'investments') {
        if (tx.category !== 'Investments') return false;
      } else if (selectedCategory === 'reserve') {
        if (tx.type !== 'Contribution') return false;
      }

      // Filter tabs: All, Income, Expenses, Contributions
      if (activeFilter === 'income' && tx.type !== 'Income') return false;
      if (activeFilter === 'expense' && tx.type !== 'Expense') return false;
      if (activeFilter === 'contribution' && tx.type !== 'Contribution') return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesMerchant = tx.merchant?.toLowerCase().includes(query) || false;
        const matchesCat = tx.category.toLowerCase().includes(query);
        if (!matchesDesc && !matchesMerchant && !matchesCat) return false;
      }

      return true;
    });
  }, [balanceTransactions, selectedCategory, activeFilter, searchQuery]);

  // Display limited or full list
  const displayedTransactions = showAllTransactions 
    ? filteredTransactions 
    : filteredTransactions.slice(0, 6);

  // Group by Date Label
  const groupedTransactions = useMemo(() => {
    const groups: { label: string; items: typeof filteredTransactions }[] = [];
    const dates = ['Today', 'Yesterday', 'Earlier this month'];

    dates.forEach(date => {
      const items = displayedTransactions.filter(t => t.dateLabel === date);
      if (items.length > 0) {
        groups.push({ label: date, items });
      }
    });

    // Catch any remaining
    const remaining = displayedTransactions.filter(t => !dates.includes(t.dateLabel));
    if (remaining.length > 0) {
      groups.push({ label: 'Previous', items: remaining });
    }

    return groups;
  }, [displayedTransactions]);

  // Handle Add Money Submit
  const handleAddMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      setAddError('Please enter a valid positive amount.');
      return;
    }
    const success = addMoneyToBalance(amt, addCategory, addDescription);
    if (success) {
      setAddSuccess(`Successfully added ${formatINR(amt)} to ${addCategory.toUpperCase()}!`);
      setTimeout(() => {
        setIsAddMoneyOpen(false);
        setAddSuccess('');
      }, 1200);
    } else {
      setAddError('Failed to process addition.');
    }
  };

  // Handle Move Funds Submit
  const handleMoveFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMoveError('');
    setMoveSuccess('');
    const amt = parseFloat(moveAmount);
    if (isNaN(amt) || amt <= 0) {
      setMoveError('Please enter a valid amount.');
      return;
    }
    if (moveFrom === moveTo) {
      setMoveError('Source and destination categories must be different.');
      return;
    }
    if (accountAllocations[moveFrom] < amt) {
      setMoveError(`Insufficient funds in ${moveFrom.toUpperCase()} (Available: ${formatINR(accountAllocations[moveFrom])}).`);
      return;
    }
    const success = moveBalanceFunds(amt, moveFrom, moveTo);
    if (success) {
      setMoveSuccess(`Transferred ${formatINR(amt)} from ${moveFrom.toUpperCase()} to ${moveTo.toUpperCase()}!`);
      setTimeout(() => {
        setIsMoveFundsOpen(false);
        setMoveSuccess('');
      }, 1200);
    } else {
      setMoveError('Failed to transfer funds.');
    }
  };

  // Helper for transaction icon
  const getTransactionIcon = (category: string, type: string) => {
    switch (category) {
      case 'Income':
        return <ArrowDownLeft className="w-4 h-4 text-[#8BC6A1]" />;
      case 'Investments':
        return <TrendingUp className="w-4 h-4 text-[#D5B477]" />;
      case 'Travel':
        return <Bus className="w-4 h-4 text-[#A9B8C8]" />;
      case 'Lifestyle':
        return <Tv className="w-4 h-4 text-[#D5B477]" />;
      case 'Essentials':
      default:
        return <Coffee className="w-4 h-4 text-[#E27D78]" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-7 animate-fadeIn pb-24 text-[#F4F1EA]">
      {/* 1. COMPACT PAGE HEADER (Image 2 Inspired) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F4F1EA]">
              Balance
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#171A20] border border-[#30343B] text-[10px] font-mono text-[#D5B477]">
              FUTURA OS
            </span>
          </div>
          <p className="text-xs text-[#A2A5AC] mt-0.5">
            Your money, in one place.
          </p>
        </div>

        {/* Visibility & Settings Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowBalance(!showBalance);
            }}
            className="p-2 rounded-xl bg-[#171A20] hover:bg-[#20242B] border border-[#30343B] text-[#A2A5AC] hover:text-[#F4F1EA] transition-all cursor-pointer"
            title={showBalance ? 'Hide balances' : 'Show balances'}
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-[#D5B477]" />}
          </button>
        </div>
      </div>

      {/* 2. TOTAL BALANCE HERO CARD (FUTURA Black & Metallic Gold Surface) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#20242B] via-[#171A20] to-[#101216] border border-[#30343B] p-6 sm:p-7 shadow-card-depth overflow-hidden">
        {/* Soft Metallic Glare Sweep */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#D5B477]/[0.025] blur-2xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#A2A5AC] uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5 text-[#D5B477]" />
              <span>Total Balance</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#090A0C]/80 border border-[#30343B] text-[11px] font-mono text-[#A2A5AC]">
              <CreditCard className="w-3 h-3 text-[#D5B477]" />
              <span>FUTURA Vault · ****4291</span>
            </div>
          </div>

          {/* Large Balance Display */}
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#F4F1EA] flex items-baseline">
              {showBalance ? (
                <>
                  <span>₹{totalBalance.toLocaleString('en-IN')}</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#A2A5AC]">.00</span>
                </>
              ) : (
                <span className="tracking-widest text-2xl sm:text-3xl text-[#A2A5AC]">••••••••••</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A2A5AC] pt-1">
              <span>
                Available: <strong className="text-[#F4F1EA] font-mono">{showBalance ? formatINR(accountAllocations.cash) : '••••'}</strong>
              </span>
              <span>·</span>
              <span>
                Invested: <strong className="text-[#D5B477] font-mono">{showBalance ? formatINR(accountAllocations.investments) : '••••'}</strong>
              </span>
              <span>·</span>
              <span>
                Reserve: <strong className="text-[#8BC6A1] font-mono">{showBalance ? formatINR(accountAllocations.reserve) : '••••'}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HORIZONTAL ACCOUNT ALLOCATION CARDS (Cash, Investments, Reserve) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A2A5AC]">
            Account Allocations
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] text-[#D5B477] hover:underline cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* 3 Horizontal Cards + Add Shortcut */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Cash */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedCategory(selectedCategory === 'cash' ? 'all' : 'cash');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'cash'
                ? 'bg-[#20242B] border-[#D5B477] shadow-[0_0_15px_rgba(213,180,119,0.2)]'
                : 'bg-[#14171E] hover:bg-[#1A1E26] border-[#30343B]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#F4F1EA]">Liquid Cash</span>
              <span className="text-[10px] font-mono text-[#A2A5AC]">***2450</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#A2A5AC] block">Stipend & Buffer</span>
              <p className="text-lg font-bold font-mono text-[#F4F1EA]">
                {showBalance ? formatINR(accountAllocations.cash) : '••••'}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
              <span>{cashPct}% of Total</span>
              <span className="text-[#8BC6A1]">Instant</span>
            </div>
          </div>

          {/* Card 2: Investments */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedCategory(selectedCategory === 'investments' ? 'all' : 'investments');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'investments'
                ? 'bg-[#20242B] border-[#D5B477] shadow-[0_0_15px_rgba(213,180,119,0.2)]'
                : 'bg-[#14171E] hover:bg-[#1A1E26] border-[#30343B]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#D5B477]">Investments</span>
              <span className="text-[10px] font-mono text-[#A2A5AC]">***8000</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#A2A5AC] block">Nifty 50 + Gold</span>
              <p className="text-lg font-bold font-mono text-[#D5B477]">
                {showBalance ? formatINR(accountAllocations.investments) : '••••'}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
              <span>{investmentsPct}% of Total</span>
              <span className="text-[#D5B477]">+10.5% p.a.</span>
            </div>
          </div>

          {/* Card 3: Reserve */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedCategory(selectedCategory === 'reserve' ? 'all' : 'reserve');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedCategory === 'reserve'
                ? 'bg-[#20242B] border-[#D5B477] shadow-[0_0_15px_rgba(213,180,119,0.2)]'
                : 'bg-[#14171E] hover:bg-[#1A1E26] border-[#30343B]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8BC6A1]">Reserve Cushion</span>
              <span className="text-[10px] font-mono text-[#A2A5AC]">***2000</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#A2A5AC] block">Fixed Deposit FD</span>
              <p className="text-lg font-bold font-mono text-[#8BC6A1]">
                {showBalance ? formatINR(accountAllocations.reserve) : '••••'}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#A2A5AC] pt-2 border-t border-[#30343B]/60">
              <span>{reservePct}% of Total</span>
              <span className="text-[#8BC6A1]">6.8% Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS ROW (Image 2: Send, Receive, Top Up, More) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Action 1: Add Money */}
        <button
          onClick={() => {
            sound.playClick();
            setIsAddMoneyOpen(true);
          }}
          className="p-3 sm:p-4 rounded-2xl bg-[#14171E] hover:bg-[#20242B] border border-[#30343B] hover:border-[#D5B477]/40 flex flex-col items-center justify-center space-y-1.5 transition-all group cursor-pointer active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#1C2028] group-hover:bg-[#D5B477]/20 flex items-center justify-center text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors border border-white/10">
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-medium text-[#F4F1EA] tracking-tight">Add Money</span>
        </button>

        {/* Action 2: Move Funds */}
        <button
          onClick={() => {
            sound.playClick();
            setIsMoveFundsOpen(true);
          }}
          className="p-3 sm:p-4 rounded-2xl bg-[#14171E] hover:bg-[#20242B] border border-[#30343B] hover:border-[#D5B477]/40 flex flex-col items-center justify-center space-y-1.5 transition-all group cursor-pointer active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#1C2028] group-hover:bg-[#D5B477]/20 flex items-center justify-center text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors border border-white/10">
            <ArrowRightLeft className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-medium text-[#F4F1EA] tracking-tight">Move Funds</span>
        </button>

        {/* Action 3: Plan Contribution */}
        <button
          onClick={() => {
            sound.playClick();
            navigateTo('moneyflow');
          }}
          className="p-3 sm:p-4 rounded-2xl bg-[#14171E] hover:bg-[#20242B] border border-[#30343B] hover:border-[#D5B477]/40 flex flex-col items-center justify-center space-y-1.5 transition-all group cursor-pointer active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#1C2028] group-hover:bg-[#D5B477]/20 flex items-center justify-center text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors border border-white/10">
            <Layers className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-medium text-[#F4F1EA] tracking-tight">Plan SIP</span>
        </button>

        {/* Action 4: View Reports */}
        <button
          onClick={() => {
            sound.playClick();
            navigateTo('portfolio');
          }}
          className="p-3 sm:p-4 rounded-2xl bg-[#14171E] hover:bg-[#20242B] border border-[#30343B] hover:border-[#D5B477]/40 flex flex-col items-center justify-center space-y-1.5 transition-all group cursor-pointer active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-[#1C2028] group-hover:bg-[#D5B477]/20 flex items-center justify-center text-[#F4F1EA] group-hover:text-[#D5B477] transition-colors border border-white/10">
            <PieChart className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-medium text-[#F4F1EA] tracking-tight">Reports</span>
        </button>
      </div>

      {/* 5. TRANSACTION HISTORY & RECENT ACTIVITY (Image 2 Inspired) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-display text-base font-bold text-[#F4F1EA]">
              Recent Activity
            </h3>
            <span className="text-xs font-mono text-[#A2A5AC]">
              ({filteredTransactions.length})
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowAllTransactions(!showAllTransactions);
            }}
            className="text-xs text-[#D5B477] hover:underline font-medium cursor-pointer"
          >
            {showAllTransactions ? 'Show fewer' : 'See all'}
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A2A5AC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by description or merchant..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14171E] border border-[#30343B] text-xs text-[#F4F1EA] placeholder-[#A2A5AC]/60 focus:outline-none focus:border-[#D5B477]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A2A5AC] hover:text-[#F4F1EA]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#14171E] border border-[#30343B] overflow-x-auto text-[11px] font-mono">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all' ? 'bg-[#20242B] text-[#F4F1EA] font-bold shadow-sm' : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('income')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'income' ? 'bg-[#8BC6A1]/20 text-[#8BC6A1] font-bold' : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveFilter('expense')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'expense' ? 'bg-[#E27D78]/20 text-[#E27D78] font-bold' : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveFilter('contribution')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'contribution' ? 'bg-[#D5B477]/20 text-[#D5B477] font-bold' : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
              }`}
            >
              SIP
            </button>
          </div>
        </div>

        {/* Transactions Grouped List */}
        {groupedTransactions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#14171E] border border-[#30343B] text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-[#A2A5AC] mx-auto" />
            <p className="text-xs text-[#A2A5AC]">No transactions found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setSelectedCategory('all');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#20242B] text-xs text-[#D5B477] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTransactions.map(group => (
              <div key={group.label} className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A2A5AC] px-1 block">
                  {group.label}
                </span>

                <div className="space-y-1.5">
                  {group.items.map(tx => {
                    const isIncome = tx.amount > 0;
                    const isSip = tx.type === 'Contribution';

                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-2xl bg-[#14171E] hover:bg-[#1A1E26] border border-[#30343B]/80 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Category Round Icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isIncome 
                              ? 'bg-[#8BC6A1]/10 border-[#8BC6A1]/30' 
                              : isSip 
                              ? 'bg-[#D5B477]/10 border-[#D5B477]/30' 
                              : 'bg-[#20242B] border-white/10'
                          }`}>
                            {getTransactionIcon(tx.category, tx.type)}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#F4F1EA] truncate group-hover:text-[#D5B477] transition-colors">
                              {tx.description}
                            </h4>
                            <div className="flex items-center space-x-1.5 text-[10px] text-[#A2A5AC] mt-0.5">
                              <span>{tx.merchant || tx.category}</span>
                              <span>·</span>
                              <span>{tx.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount Aligned Right */}
                        <div className="text-right shrink-0 pl-3">
                          <p className={`font-mono font-bold text-xs sm:text-sm ${
                            isIncome 
                              ? 'text-[#8BC6A1]' 
                              : isSip 
                              ? 'text-[#D5B477]' 
                              : 'text-[#F4F1EA]'
                          }`}>
                            {isIncome ? '+' : ''}{formatINR(tx.amount)}
                          </p>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#A2A5AC] block">
                            {tx.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. MODAL: ADD MONEY (Simulated Top-up) */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#D5B477]" />
                <h3 className="font-display font-bold text-base text-[#F4F1EA]">Add Money (Simulated)</h3>
              </div>
              <button
                onClick={() => setIsAddMoneyOpen(false)}
                className="p-1 rounded-lg text-[#A2A5AC] hover:text-[#F4F1EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMoneySubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#A2A5AC] font-mono block mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0C] border border-[#30343B] text-base font-mono font-bold text-[#F4F1EA] focus:border-[#D5B477]"
                  placeholder="1000"
                />
                {/* Preset Chips */}
                <div className="flex items-center space-x-2 mt-2">
                  {['500', '1000', '2500', '5000'].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAddAmount(chip)}
                      className="px-2 py-1 rounded-lg bg-[#20242B] hover:bg-[#2A2F3B] text-[10px] font-mono text-[#D5B477] border border-[#30343B]"
                    >
                      +₹{chip}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A2A5AC] font-mono block mb-1.5">Destination Bucket</label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0C] border border-[#30343B] text-xs font-medium text-[#F4F1EA] focus:border-[#D5B477]"
                >
                  <option value="cash">Liquid Cash (Daily/Buffer)</option>
                  <option value="investments">Investments (Nifty 50 + Gold)</option>
                  <option value="reserve">Reserve (Fixed Deposit)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#A2A5AC] font-mono block mb-1.5">Description</label>
                <input
                  type="text"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090A0C] border border-[#30343B] text-xs text-[#F4F1EA] focus:border-[#D5B477]"
                  placeholder="e.g. Allowance from parents"
                />
              </div>

              {addError && <p className="text-xs text-[#E27D78]">{addError}</p>}
              {addSuccess && <p className="text-xs text-[#8BC6A1]">{addSuccess}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: MOVE FUNDS (Simulated Transfer) */}
      {isMoveFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 text-[#D5B477]" />
                <h3 className="font-display font-bold text-base text-[#F4F1EA]">Move Funds</h3>
              </div>
              <button
                onClick={() => setIsMoveFundsOpen(false)}
                className="p-1 rounded-lg text-[#A2A5AC] hover:text-[#F4F1EA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMoveFundsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#A2A5AC] font-mono block mb-1.5">From</label>
                  <select
                    value={moveFrom}
                    onChange={(e) => setMoveFrom(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#090A0C] border border-[#30343B] text-xs text-[#F4F1EA]"
                  >
                    <option value="cash">Cash ({formatINR(accountAllocations.cash)})</option>
                    <option value="investments">Invest ({formatINR(accountAllocations.investments)})</option>
                    <option value="reserve">Reserve ({formatINR(accountAllocations.reserve)})</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#A2A5AC] font-mono block mb-1.5">To</label>
                  <select
                    value={moveTo}
                    onChange={(e) => setMoveTo(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#090A0C] border border-[#30343B] text-xs text-[#F4F1EA]"
                  >
                    <option value="cash">Cash</option>
                    <option value="investments">Investments</option>
                    <option value="reserve">Reserve</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-[#A2A5AC] font-mono">Amount (₹)</label>
                  <button
                    type="button"
                    onClick={() => setMoveAmount(String(accountAllocations[moveFrom]))}
                    className="text-[10px] font-mono text-[#D5B477] hover:underline"
                  >
                    Max ({formatINR(accountAllocations[moveFrom])})
                  </button>
                </div>
                <input
                  type="number"
                  value={moveAmount}
                  onChange={(e) => setMoveAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0C] border border-[#30343B] text-base font-mono font-bold text-[#F4F1EA] focus:border-[#D5B477]"
                  placeholder="500"
                />
              </div>

              {moveError && <p className="text-xs text-[#E27D78]">{moveError}</p>}
              {moveSuccess && <p className="text-xs text-[#8BC6A1]">{moveSuccess}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D5B477] to-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                Execute Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceView;

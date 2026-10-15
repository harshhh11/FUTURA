import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/calculations';
import { sound } from '../../utils/sound';
import { BalanceTransaction } from '../../types/finance';
import { 
  Search, 
  Calendar, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeftRight, 
  ShoppingCart, 
  BookOpen, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Plus,
  Receipt,
  Layers,
  PiggyBank
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { balanceTransactions, addMoneyToBalance, addBudgetExpense } = useApp();

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Contribution' | 'Savings' | 'Investment' | 'Goal'>('All');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  
  // Modals
  const [selectedTx, setSelectedTx] = useState<BalanceTransaction | null>(null);
  const [isAddTxOpen, setIsAddTxOpen] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  // New Transaction Form State
  const [newTxDesc, setNewTxDesc] = useState<string>('');
  const [newTxSubtitle, setNewTxSubtitle] = useState<string>('Personal expense');
  const [newTxAmount, setNewTxAmount] = useState<string>('500');
  const [newTxType, setNewTxType] = useState<'Expense' | 'Income' | 'Contribution'>('Expense');
  const [newTxCat, setNewTxCat] = useState<'Contribution' | 'Savings' | 'Investment' | 'Goal'>('Savings');

  // Category Pills (Screen 2 Source of Truth)
  const categoryPills: ('All' | 'Contribution' | 'Savings' | 'Investment' | 'Goal')[] = [
    'All',
    'Contribution',
    'Savings',
    'Investment',
    'Goal'
  ];

  // Filtered transactions
  const filteredList = useMemo(() => {
    return balanceTransactions.filter((tx) => {
      // Category filter
      if (activeCategory !== 'All') {
        const catMatch = tx.category?.toLowerCase() === activeCategory.toLowerCase();
        if (!catMatch) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inDesc = tx.description.toLowerCase().includes(q);
        const inSub = tx.subtitle?.toLowerCase().includes(q) || false;
        const inMerchant = tx.merchant?.toLowerCase().includes(q) || false;
        const inAmount = Math.abs(tx.amount).toString().includes(q);
        if (!inDesc && !inSub && !inMerchant && !inAmount) return false;
      }
      return true;
    });
  }, [balanceTransactions, activeCategory, searchQuery]);

  // Group by dateLabel
  const groupedTransactions = useMemo(() => {
    const groups: { label: string; items: BalanceTransaction[]; netAmount: number }[] = [];
    const dateOrder: string[] = ['Today', 'Yesterday', '12 Oct 2024'];

    dateOrder.forEach((dLabel) => {
      const items = filteredList.filter(t => t.dateLabel === dLabel);
      if (items.length > 0) {
        const net = items.reduce((acc, curr) => acc + curr.amount, 0);
        groups.push({ label: dLabel, items, netAmount: net });
      }
    });

    // Handle any other dates
    const otherItems = filteredList.filter(t => !dateOrder.includes(t.dateLabel));
    if (otherItems.length > 0) {
      const net = otherItems.reduce((acc, curr) => acc + curr.amount, 0);
      groups.push({ label: 'Earlier Transactions', items: otherItems, netAmount: net });
    }

    return groups;
  }, [filteredList]);

  const toggleGroup = (groupLabel: string) => {
    sound.playClick();
    setCollapsedGroups(prev => ({
      ...prev,
      [groupLabel]: !prev[groupLabel]
    }));
  };

  const getTransactionIcon = (tx: BalanceTransaction) => {
    if (tx.iconType === 'contribution' || tx.type === 'Contribution') {
      return <ArrowUp className="w-4 h-4 text-[#D5B477]" />;
    }
    if (tx.iconType === 'food' || tx.description.toLowerCase().includes('food')) {
      return <ShoppingCart className="w-4 h-4 text-[#CAD2DC]" />;
    }
    if (tx.iconType === 'income' || tx.type === 'Income' || tx.amount > 0) {
      return <ArrowDown className="w-4 h-4 text-[#8BC6A1]" />;
    }
    if (tx.iconType === 'transfer' || tx.description.toLowerCase().includes('transfer')) {
      return <ArrowLeftRight className="w-4 h-4 text-[#CAD2DC]" />;
    }
    if (tx.iconType === 'study' || tx.description.toLowerCase().includes('study')) {
      return <BookOpen className="w-4 h-4 text-[#CAD2DC]" />;
    }
    return <Sparkles className="w-4 h-4 text-[#D5B477]" />;
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newTxAmount);
    if (isNaN(val) || val <= 0) return;

    if (newTxType === 'Income') {
      addMoneyToBalance(val, 'cash', newTxDesc || 'Simulated Income');
    } else {
      addBudgetExpense('essentials', val, newTxDesc || 'Logged Expense');
    }
    setIsAddTxOpen(false);
    setNewTxDesc('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-5 animate-fadeIn pb-32 text-[#F4F1EA] select-none">
      
      {/* 1. HEADER ROW (Screen 2 Source of Truth) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-[#F4F1EA] tracking-tight">
            Transactions
          </h1>
          <p className="text-xs text-[#8E929C] mt-0.5">
            Track your financial journey
          </p>
        </div>

        {/* Top Right Action Controls: Calendar & Filter */}
        <div className="flex items-center space-x-2">
          {/* Calendar Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsDatePickerOpen(true);
            }}
            className="w-9 h-9 rounded-2xl bg-[#14161C] hover:bg-[#1C1F26] border border-[#2D313B] flex items-center justify-center text-[#A2A5AC] hover:text-[#F4F1EA] transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Select Date Scope"
            aria-label="Select Date Scope"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Filter / Add Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsAddTxOpen(true);
            }}
            className="w-9 h-9 rounded-2xl bg-[#1C1F26] hover:bg-[#252932] border border-[#30343B] hover:border-[#D5B477]/50 flex items-center justify-center text-[#D5B477] transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Log Simulated Transaction"
            aria-label="Filter or Log Transaction"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH INPUT (Screen 2 Rounded Charcoal Search) */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6A707E] absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#12141A] border border-[#2D313B] focus:border-[#D5B477]/70 text-xs text-[#F4F1EA] placeholder-[#6A707E] outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-[#6A707E] hover:text-[#F4F1EA]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. CATEGORY FILTER PILLS (Screen 2 Filter Row) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categoryPills.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D5B477] text-[#090A0C] shadow-[0_2px_10px_rgba(213,180,119,0.3)]'
                  : 'bg-[#14161C] border border-[#2D313B] text-[#8E929C] hover:text-[#F4F1EA] hover:bg-[#1C1F26]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 4. GROUPED TRANSACTIONS LIST (Screen 2 Layout) */}
      <div className="space-y-4 pt-1">
        {groupedTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8E929C] space-y-2">
            <p>No transactions found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="text-[#D5B477] underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          groupedTransactions.map((group) => {
            const isCollapsed = collapsedGroups[group.label];
            const isNetPositive = group.netAmount > 0;

            return (
              <div key={group.label} className="space-y-2">
                {/* Group Date Header with Net Amount & Collapse Chevron */}
                <div 
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between px-1 py-1 text-xs cursor-pointer select-none group"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-[#CAD2DC] group-hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D5B477]" />
                    <span>{group.label}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 font-mono text-xs">
                    <span className={`font-semibold ${
                      isNetPositive ? 'text-[#8BC6A1]' : 'text-[#CAD2DC]'
                    }`}>
                      {isNetPositive ? `+ ${formatINR(group.netAmount)}` : formatINR(group.netAmount)}
                    </span>
                    {isCollapsed ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[#6A707E]" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5 text-[#6A707E]" />
                    )}
                  </div>
                </div>

                {/* Group Transaction Cards */}
                {!isCollapsed && (
                  <div className="space-y-2">
                    {group.items.map((tx) => {
                      const isPositive = tx.amount > 0;

                      return (
                        <div
                          key={tx.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedTx(tx);
                          }}
                          className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#16181F] to-[#101217] border border-[#262A33] hover:border-[#D5B477]/50 shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                        >
                          <div className="flex items-center space-x-3 truncate">
                            {/* Category Icon in Round Container */}
                            <div className="w-9 h-9 rounded-xl bg-[#1C1F26] border border-[#2D313B] flex items-center justify-center shrink-0 shadow-inner">
                              {getTransactionIcon(tx)}
                            </div>

                            <div className="truncate">
                              <h3 className="font-display font-bold text-xs sm:text-sm text-[#F4F1EA] tracking-tight">
                                {tx.description}
                              </h3>
                              <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-[#8E929C] mt-0.5">
                                <span>{tx.subtitle || tx.merchant || tx.category}</span>
                                <span className="text-white/20">·</span>
                                <span className="font-mono">{tx.timestamp}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 ml-2">
                            {/* Amount Display */}
                            <span className={`font-mono text-xs sm:text-sm font-bold ${
                              isPositive ? 'text-[#8BC6A1]' : 'text-[#E27D78]'
                            }`}>
                              {isPositive ? `+ ${formatINR(tx.amount)}` : `- ${formatINR(Math.abs(tx.amount))}`}
                            </span>

                            <ChevronRight className="w-3.5 h-3.5 text-[#5A5F6D] group-hover:text-[#D5B477] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TRANSACTION DETAIL RECEIPT MODAL */}
      {/* ======================================================== */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative text-[#F4F1EA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D313B]">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-[#D5B477]" />
                <span className="font-display font-bold text-sm">Transaction Details</span>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className={`font-mono text-2xl sm:text-3xl font-extrabold ${
                selectedTx.amount > 0 ? 'text-[#8BC6A1]' : 'text-[#E27D78]'
              }`}>
                {selectedTx.amount > 0 ? `+ ${formatINR(selectedTx.amount)}` : `- ${formatINR(Math.abs(selectedTx.amount))}`}
              </span>
              <p className="text-xs text-[#8E929C]">{selectedTx.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F1116] border border-[#252830] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Subtitle / Merchant</span>
                <span className="font-medium text-[#F4F1EA]">{selectedTx.subtitle || selectedTx.merchant || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Category</span>
                <span className="font-medium text-[#D5B477]">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Time & Date</span>
                <span className="font-mono text-[#F4F1EA]">{selectedTx.dateLabel}, {selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E929C]">Transaction ID</span>
                <span className="font-mono text-[#8E929C]">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#20232B]">
                <span className="text-[#8E929C]">Status</span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-[#8BC6A1]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Simulated Settlement</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-[#D5B477] text-[#090A0C] font-semibold text-xs transition-all shadow-md cursor-pointer hover:bg-[#E5C68A]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD SIMULATED TRANSACTION MODAL */}
      {/* ======================================================== */}
      {isAddTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative text-[#F4F1EA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D313B]">
              <span className="font-display font-bold text-sm">Log Simulated Transaction</span>
              <button 
                onClick={() => setIsAddTxOpen(false)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-mono text-[#8E929C] mb-1 block">Description</label>
                <input
                  type="text"
                  value={newTxDesc}
                  onChange={(e) => setNewTxDesc(e.target.value)}
                  placeholder="e.g., Tech Books & Course"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1116] border border-[#2D313B] text-xs text-[#F4F1EA] outline-none focus:border-[#D5B477]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#8E929C] mb-1 block">Subtitle / Label</label>
                <input
                  type="text"
                  value={newTxSubtitle}
                  onChange={(e) => setNewTxSubtitle(e.target.value)}
                  placeholder="e.g., Education expense"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1116] border border-[#2D313B] text-xs text-[#F4F1EA] outline-none focus:border-[#D5B477]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-[#8E929C] mb-1 block">Type</label>
                  <select
                    value={newTxType}
                    onChange={(e) => setNewTxType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1116] border border-[#2D313B] text-xs text-[#F4F1EA] outline-none focus:border-[#D5B477]"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Contribution">Contribution</option>
                    <option value="Income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#8E929C] mb-1 block">Category</label>
                  <select
                    value={newTxCat}
                    onChange={(e) => setNewTxCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F1116] border border-[#2D313B] text-xs text-[#F4F1EA] outline-none focus:border-[#D5B477]"
                  >
                    <option value="Contribution">Contribution</option>
                    <option value="Savings">Savings</option>
                    <option value="Investment">Investment</option>
                    <option value="Goal">Goal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#8E929C] mb-1 block">Amount (₹)</label>
                <input
                  type="number"
                  value={newTxAmount}
                  onChange={(e) => setNewTxAmount(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 rounded-xl bg-[#0F1116] border border-[#2D313B] font-mono text-sm text-[#F4F1EA] outline-none focus:border-[#D5B477]"
                  min="1"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-[#171A20] text-xs text-[#8E929C] hover:text-[#F4F1EA] border border-[#2D313B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#D5B477] hover:bg-[#E5C68A] text-[#090A0C] font-semibold text-xs transition-all shadow-md cursor-pointer"
                >
                  Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CALENDAR SCOPE PICKER MODAL */}
      {/* ======================================================== */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs rounded-3xl bg-[#14171E] border border-[#30343B] p-5 shadow-2xl relative text-[#F4F1EA] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D313B]">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#D5B477]" />
                <span className="font-display font-bold text-sm">Date Scope</span>
              </div>
              <button 
                onClick={() => setIsDatePickerOpen(false)}
                className="p-1 rounded-lg text-[#8E929C] hover:text-[#F4F1EA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {['All Time', 'This Month (October 2026)', 'Last Month', 'Past 90 Days'].map((scope, idx) => (
                <button
                  key={scope}
                  onClick={() => {
                    sound.playClick();
                    setIsDatePickerOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left font-medium transition-all cursor-pointer ${
                    idx === 1 
                      ? 'bg-[#20242B] border border-[#D5B477]/60 text-[#D5B477]' 
                      : 'bg-[#101217] hover:bg-[#1A1D24] text-[#CAD2DC]'
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

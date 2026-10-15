import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserFinancialProfile, 
  PortfolioAllocation, 
  ActivityItem, 
  ViewRoute,
  InvestmentCategoryId,
  InvestmentCategory,
  BalanceTransaction,
  SavingsGoal,
  BudgetCategoryItem
} from '../types/finance';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_PORTFOLIO_ALLOCATION, 
  INITIAL_ACTIVITIES,
  INITIAL_BALANCE_TRANSACTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BUDGET_CATEGORIES
} from '../data/initialData';
import { INVESTMENT_CATEGORIES } from '../data/investmentsData';
import { sound } from '../utils/sound';

interface AppContextType {
  currentRoute: ViewRoute;
  navigateTo: (route: ViewRoute) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAppLauncherOpen: boolean;
  setIsAppLauncherOpen: (open: boolean) => void;
  userProfile: UserFinancialProfile;
  updateUserProfile: (updates: Partial<UserFinancialProfile>) => void;
  allocations: PortfolioAllocation[];
  updateAllocation: (categoryId: InvestmentCategoryId, percentage: number) => void;
  resetAllocations: () => void;
  autoBalanceAllocations: () => void;
  moneyFlowScenario: 'typical' | 'lower' | 'higher';
  setMoneyFlowScenario: (scenario: 'typical' | 'lower' | 'higher') => void;
  badYearDeclinePct: number;
  setBadYearDeclinePct: (pct: number) => void;
  comparedCategoryIds: InvestmentCategoryId[];
  toggleCompareCategory: (id: InvestmentCategoryId) => void;
  selectedCategoryForDetail: InvestmentCategory | null;
  setSelectedCategoryForDetail: (cat: InvestmentCategory | null) => void;
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp' | 'simulated'>) => void;
  completedLessonIds: string[];
  markLessonCompleted: (lessonId: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  compactMode: boolean;
  setCompactMode: (enabled: boolean) => void;
  deviceViewMode: 'responsive' | 'mobile_frame';
  setDeviceViewMode: (mode: 'responsive' | 'mobile_frame') => void;
  accountAllocations: Record<'cash' | 'investments' | 'reserve', number>;
  balanceTransactions: BalanceTransaction[];
  addMoneyToBalance: (amount: number, category: 'cash' | 'investments' | 'reserve', description?: string) => boolean;
  moveBalanceFunds: (amount: number, from: 'cash' | 'investments' | 'reserve', to: 'cash' | 'investments' | 'reserve') => boolean;
  savingsGoals: SavingsGoal[];
  budgetCategories: BudgetCategoryItem[];
  monthlyBudget: number;
  addSavingsGoal: (goal: { name: string; targetAmount: number; initialDeposit?: number; category?: string; icon?: string }) => void;
  contributeToSavingsGoal: (goalId: string, amount: number) => boolean;
  addBudgetExpense: (categoryId: string, amount: number, note?: string) => boolean;
  updateMonthlyBudget: (amount: number) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation - default to working application dashboard
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserFinancialProfile>(() => {
    try {
      const saved = localStorage.getItem('futura_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.essentialExpenses === 4000 && parsed.monthlyIncome === 8000) {
          return INITIAL_USER_PROFILE;
        }
        return parsed;
      }
      return INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // Portfolio Allocations (50% Nifty 50, 20% Gold ETF, 30% FD)
  const [allocations, setAllocations] = useState<PortfolioAllocation[]>(() => {
    try {
      const saved = localStorage.getItem('futura_allocations');
      if (saved) {
        const parsed = JSON.parse(saved);
        const isOld = parsed.some((p: { categoryId: string; percentage: number }) => p.categoryId === 'fd' && p.percentage === 25);
        if (isOld) return INITIAL_PORTFOLIO_ALLOCATION;
        return parsed;
      }
      return INITIAL_PORTFOLIO_ALLOCATION;
    } catch {
      return INITIAL_PORTFOLIO_ALLOCATION;
    }
  });

  // MoneyFlow Scenario
  const [moneyFlowScenario, setMoneyFlowScenario] = useState<'typical' | 'lower' | 'higher'>('typical');

  // Bad Year Shock State
  const [badYearDeclinePct, setBadYearDeclinePct] = useState<number>(20);

  // Comparison State (default: Index Funds & Fixed Deposits)
  const [comparedCategoryIds, setComparedCategoryIds] = useState<InvestmentCategoryId[]>(['index_funds', 'fd']);

  // Investment details modal
  const [selectedCategoryForDetail, setSelectedCategoryForDetail] = useState<InvestmentCategory | null>(null);

  // Activities Ledger
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('futura_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Completed Lessons
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('futura_completed_lessons');
      return saved ? JSON.parse(saved) : ['what-is-a-sip'];
    } catch {
      return ['what-is-a-sip'];
    }
  });

  // Settings
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [deviceViewMode, setDeviceViewMode] = useState<'responsive' | 'mobile_frame'>('mobile_frame');

  // Account & Category Balance Allocations (Screen 1 - Cash & Savings, Investments, Emergency Buffer)
  const [accountAllocations, setAccountAllocations] = useState<Record<'cash' | 'investments' | 'reserve', number>>(() => {
    try {
      const saved = localStorage.getItem('futura_account_allocations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cash === 2450 && parsed.investments === 8000) {
          return { cash: 100000, investments: 235720, reserve: 21000 };
        }
        return parsed;
      }
      return { cash: 100000, investments: 235720, reserve: 21000 };
    } catch {
      return { cash: 100000, investments: 235720, reserve: 21000 };
    }
  });

  // Balance Transactions (Image 2)
  const [balanceTransactions, setBalanceTransactions] = useState<BalanceTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('futura_balance_transactions');
      return saved ? JSON.parse(saved) : INITIAL_BALANCE_TRANSACTIONS;
    } catch {
      return INITIAL_BALANCE_TRANSACTIONS;
    }
  });

  // Budget & Savings State
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('futura_monthly_budget');
      return saved ? Number(saved) : 10000;
    } catch {
      return 10000;
    }
  });

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('futura_budget_categories');
      return saved ? JSON.parse(saved) : INITIAL_BUDGET_CATEGORIES;
    } catch {
      return INITIAL_BUDGET_CATEGORIES;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem('futura_savings_goals');
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  // Sync settings with audio singleton
  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.enabled = enabled;
  };

  // LocalStorage Persistence
  useEffect(() => {
    try {
      localStorage.setItem('futura_user_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_allocations', JSON.stringify(allocations));
    } catch {}
  }, [allocations]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_activities', JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_completed_lessons', JSON.stringify(completedLessonIds));
    } catch {}
  }, [completedLessonIds]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_account_allocations', JSON.stringify(accountAllocations));
    } catch {}
  }, [accountAllocations]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_balance_transactions', JSON.stringify(balanceTransactions));
    } catch {}
  }, [balanceTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_monthly_budget', monthlyBudget.toString());
    } catch {}
  }, [monthlyBudget]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_budget_categories', JSON.stringify(budgetCategories));
    } catch {}
  }, [budgetCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('futura_savings_goals', JSON.stringify(savingsGoals));
    } catch {}
  }, [savingsGoals]);

  const addMoneyToBalance = (amount: number, category: 'cash' | 'investments' | 'reserve', description = 'Added Funds'): boolean => {
    if (isNaN(amount) || amount <= 0) return false;
    sound.playChime();
    setAccountAllocations(prev => ({
      ...prev,
      [category]: prev[category] + amount,
    }));
    setUserProfile(prev => ({
      ...prev,
      currentSavings: prev.currentSavings + amount,
    }));
    const newTx: BalanceTransaction = {
      id: `tx-${Date.now()}`,
      description,
      category: category === 'investments' ? 'Investments' : 'Income',
      amount: amount,
      type: 'Income',
      dateLabel: 'Today',
      timestamp: 'Today, Just now',
      merchant: `Simulated Top-up to ${category.toUpperCase()}`,
    };
    setBalanceTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const moveBalanceFunds = (amount: number, from: 'cash' | 'investments' | 'reserve', to: 'cash' | 'investments' | 'reserve'): boolean => {
    if (isNaN(amount) || amount <= 0 || from === to) return false;
    if (accountAllocations[from] < amount) return false;
    sound.playChime();
    setAccountAllocations(prev => ({
      ...prev,
      [from]: prev[from] - amount,
      [to]: prev[to] + amount,
    }));
    const newTx: BalanceTransaction = {
      id: `tx-${Date.now()}`,
      description: `Transferred ${from.toUpperCase()} → ${to.toUpperCase()}`,
      category: to === 'investments' ? 'Investments' : 'Essentials',
      amount: -amount,
      type: 'Contribution',
      dateLabel: 'Today',
      timestamp: 'Today, Just now',
      merchant: `Transfer: ${from} to ${to}`,
    };
    setBalanceTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const navigateTo = (route: ViewRoute) => {
    sound.playClick();
    setCurrentRoute(route);
    setIsAppLauncherOpen(false);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const updateUserProfile = (updates: Partial<UserFinancialProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const updateAllocation = (categoryId: InvestmentCategoryId, percentage: number) => {
    setAllocations(prev => 
      prev.map(item => item.categoryId === categoryId ? { ...item, percentage } : item)
    );
  };

  const resetAllocations = () => {
    sound.playClick();
    setAllocations(INITIAL_PORTFOLIO_ALLOCATION);
  };

  const autoBalanceAllocations = () => {
    sound.playChime();
    const active = allocations.filter(a => a.percentage > 0);
    const count = active.length > 0 ? active.length : 3;
    const basePct = Math.floor(100 / count);
    const remainder = 100 - (basePct * count);

    let assigned = 0;
    setAllocations(prev => {
      const activeIds = active.length > 0 ? active.map(a => a.categoryId) : ['index_funds', 'fd', 'gold'];
      return prev.map(a => {
        if (activeIds.includes(a.categoryId)) {
          assigned++;
          return {
            ...a,
            percentage: basePct + (assigned === 1 ? remainder : 0)
          };
        }
        return { ...a, percentage: 0 };
      });
    });
  };

  const toggleCompareCategory = (id: InvestmentCategoryId) => {
    sound.playClick();
    setComparedCategoryIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter(c => c !== id);
      } else {
        if (prev.length >= 3) {
          // Replace last one if already 3
          return [prev[0], prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp' | 'simulated'>) => {
    const newItem: ActivityItem = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      simulated: true,
    };
    setActivities(prev => [newItem, ...prev]);
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      sound.playChime();
      setCompletedLessonIds(prev => [...prev, lessonId]);
      addActivity({
        title: 'Completed Financial Lesson',
        type: 'learning',
        details: `Finished reading lesson module: ${lessonId}`,
        badge: 'Knowledge Gained',
      });
    }
  };

  const updateMonthlyBudget = (amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    sound.playChime();
    setMonthlyBudget(amount);
  };

  const addBudgetExpense = (categoryId: string, amount: number, note = 'Expense'): boolean => {
    if (isNaN(amount) || amount <= 0) return false;
    sound.playClick();
    setBudgetCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, spentAmount: cat.spentAmount + amount } : cat))
    );
    // Deduct from cash balance
    setAccountAllocations(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - amount),
    }));
    const targetCat = budgetCategories.find(c => c.id === categoryId);
    const newTx: BalanceTransaction = {
      id: `tx-${Date.now()}`,
      description: note || `Expense: ${targetCat?.name || categoryId}`,
      category: 'Lifestyle',
      amount: -amount,
      type: 'Expense',
      dateLabel: 'Today',
      timestamp: 'Today, Just now',
      merchant: targetCat?.name || 'Quick Expense',
    };
    setBalanceTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const contributeToSavingsGoal = (goalId: string, amount: number): boolean => {
    if (isNaN(amount) || amount <= 0) return false;
    sound.playChime();
    setSavingsGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, savedAmount: Math.min(g.targetAmount, g.savedAmount + amount) } : g))
    );
    // Deduct from cash, add to reserve
    setAccountAllocations(prev => ({
      ...prev,
      cash: Math.max(0, prev.cash - amount),
      reserve: prev.reserve + amount,
    }));
    const targetGoal = savingsGoals.find(g => g.id === goalId);
    const newTx: BalanceTransaction = {
      id: `tx-${Date.now()}`,
      description: `Saved for ${targetGoal?.name || 'Goal'}`,
      category: 'Essentials',
      amount: -amount,
      type: 'Contribution',
      dateLabel: 'Today',
      timestamp: 'Today, Just now',
      merchant: `Goal: ${targetGoal?.name || 'Savings'}`,
    };
    setBalanceTransactions(prev => [newTx, ...prev]);
    return true;
  };

  const addSavingsGoal = (goal: { name: string; targetAmount: number; initialDeposit?: number; category?: string; icon?: string }) => {
    sound.playChime();
    const deposit = goal.initialDeposit && goal.initialDeposit > 0 ? goal.initialDeposit : 0;
    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name: goal.name,
      targetAmount: goal.targetAmount,
      savedAmount: deposit,
      category: goal.category || 'Personal Goal',
      icon: goal.icon || 'Sparkles',
    };
    setSavingsGoals(prev => [newGoal, ...prev]);
    if (deposit > 0) {
      setAccountAllocations(prev => ({
        ...prev,
        cash: Math.max(0, prev.cash - deposit),
        reserve: prev.reserve + deposit,
      }));
    }
  };

  const resetToDefaults = () => {
    sound.playChime();
    setUserProfile(INITIAL_USER_PROFILE);
    setAllocations(INITIAL_PORTFOLIO_ALLOCATION);
    setActivities(INITIAL_ACTIVITIES);
    setCompletedLessonIds(['what-is-a-sip']);
    setMoneyFlowScenario('typical');
    setBadYearDeclinePct(20);
    setAccountAllocations({ cash: 100000, investments: 235720, reserve: 21000 });
    setBalanceTransactions(INITIAL_BALANCE_TRANSACTIONS);
    setMonthlyBudget(10000);
    setBudgetCategories(INITIAL_BUDGET_CATEGORIES);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    localStorage.removeItem('futura_user_profile');
    localStorage.removeItem('futura_allocations');
    localStorage.removeItem('futura_activities');
    localStorage.removeItem('futura_completed_lessons');
    localStorage.removeItem('futura_account_allocations');
    localStorage.removeItem('futura_balance_transactions');
    localStorage.removeItem('futura_monthly_budget');
    localStorage.removeItem('futura_budget_categories');
    localStorage.removeItem('futura_savings_goals');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAppLauncherOpen,
        setIsAppLauncherOpen,
        userProfile,
        updateUserProfile,
        allocations,
        updateAllocation,
        resetAllocations,
        autoBalanceAllocations,
        moneyFlowScenario,
        setMoneyFlowScenario,
        badYearDeclinePct,
        setBadYearDeclinePct,
        comparedCategoryIds,
        toggleCompareCategory,
        selectedCategoryForDetail,
        setSelectedCategoryForDetail,
        activities,
        addActivity,
        completedLessonIds,
        markLessonCompleted,
        soundEnabled,
        setSoundEnabled,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        compactMode,
        setCompactMode,
        deviceViewMode,
        setDeviceViewMode,
        accountAllocations,
        balanceTransactions,
        addMoneyToBalance,
        moveBalanceFunds,
        savingsGoals,
        budgetCategories,
        monthlyBudget,
        addSavingsGoal,
        contributeToSavingsGoal,
        addBudgetExpense,
        updateMonthlyBudget,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

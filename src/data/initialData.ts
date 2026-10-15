import { 
  UserFinancialProfile, 
  PortfolioAllocation, 
  ActivityItem,
  SavingsGoal,
  BudgetCategoryItem,
  BalanceTransaction
} from '../types/finance';

export const INITIAL_USER_PROFILE: UserFinancialProfile = {
  name: 'Aarav Sharma',
  age: 19,
  persona: '19-year-old college student (Tier-1 University)',
  monthlyIncome: 8000,
  essentialExpenses: 4500, // Canteen, textbooks, transit, mobile plan
  otherSpending: 2500,    // Weekend campus outings, tech gear, personal discretionary
  currentSavings: 12450,   // Accumulated student savings and birthday funds
  comfortableMonthlyContribution: 1000, // Safe disciplined monthly savings (SIP)
  riskTolerance: 'moderate',
  goalName: 'First Milestone: ₹10 Lakhs',
  goalTargetAmount: 1000000,
  goalTargetYears: 15,
};

export const INITIAL_PORTFOLIO_ALLOCATION: PortfolioAllocation[] = [
  { categoryId: 'index_funds', percentage: 50 },
  { categoryId: 'gold', percentage: 20 },
  { categoryId: 'fd', percentage: 30 },
  { categoryId: 'savings', percentage: 0 },
  { categoryId: 'bonds', percentage: 0 },
  { categoryId: 'mutual_funds', percentage: 0 },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Simulated Monthly SIP Executed',
    type: 'contribution',
    timestamp: 'Today, 09:30 AM',
    amount: 1000,
    details: 'Allocated ₹500 to Nifty 50 Index, ₹250 to 1-Yr FD, ₹150 to Gold ETF, ₹100 to Emergency Savings.',
    badge: 'Automated Routine',
    simulated: true,
  },
  {
    id: 'act-2',
    title: 'Bad-Year Rehearsal Simulation (-20%)',
    type: 'scenario',
    timestamp: 'Yesterday, 04:15 PM',
    details: 'Tested a hypothetical 20% market decline shock. Observed ₹2,400 paper loss and 14-month delay on goal.',
    badge: 'Shock Tested',
    simulated: true,
  },
  {
    id: 'act-3',
    title: 'Goal Target Initialized: ₹10 Lakhs',
    type: 'goal_update',
    timestamp: '3 days ago',
    amount: 1000000,
    details: 'Set 15-year wealth milestone with baseline ₹1,000/month contribution at 10.5% projected return.',
    badge: 'Milestone Created',
    simulated: true,
  },
  {
    id: 'act-4',
    title: 'Completed Lesson: What is a SIP?',
    type: 'learning',
    timestamp: '5 days ago',
    details: 'Understood rupee cost averaging and why monthly discipline beats trying to time the market.',
    badge: 'Mastered',
    simulated: true,
  },
  {
    id: 'act-5',
    title: 'MoneyFlow Allocation Audit',
    type: 'contribution',
    timestamp: '1 week ago',
    amount: 8000,
    details: 'Budget verified: ₹4,000 essentials, ₹2,000 discretionary, ₹2,000 surplus (₹1,000 invested, ₹1,000 buffer).',
    badge: 'Balanced Budget',
    simulated: true,
  }
];

export const INITIAL_BALANCE_TRANSACTIONS: BalanceTransaction[] = [
  // Today (-₹1,450)
  {
    id: 'tx-1',
    description: 'Monthly Contribution',
    subtitle: 'To Index Fund Plan',
    category: 'Contribution',
    amount: -1000,
    type: 'Contribution',
    dateLabel: 'Today',
    timestamp: '10:30 AM',
    merchant: 'Index Fund Plan',
    iconType: 'contribution',
  },
  {
    id: 'tx-2',
    description: 'Food & Dining',
    subtitle: 'Personal expense',
    category: 'Savings',
    amount: -450,
    type: 'Expense',
    dateLabel: 'Today',
    timestamp: '02:15 PM',
    merchant: 'Campus Dining',
    iconType: 'food',
  },
  // Yesterday (+₹8,000)
  {
    id: 'tx-3',
    description: 'Income Received',
    subtitle: 'Part-time Work',
    category: 'Goal',
    amount: 8000,
    type: 'Income',
    dateLabel: 'Yesterday',
    timestamp: '09:00 AM',
    merchant: 'Part-time Work',
    iconType: 'income',
  },
  {
    id: 'tx-4',
    description: 'Transfer to Savings',
    subtitle: 'Emergency Buffer',
    category: 'Savings',
    amount: -2000,
    type: 'Contribution',
    dateLabel: 'Yesterday',
    timestamp: '06:20 PM',
    merchant: 'Emergency Buffer',
    iconType: 'transfer',
  },
  // 12 Oct 2024 (-₹1,200)
  {
    id: 'tx-5',
    description: 'Study Material',
    subtitle: 'Education expense',
    category: 'Investment',
    amount: -1200,
    type: 'Expense',
    dateLabel: '12 Oct 2024',
    timestamp: '05:10 PM',
    merchant: 'Education expense',
    iconType: 'study',
  },
  {
    id: 'tx-6',
    description: 'Digital Subscriptions',
    subtitle: 'Cloud Learning Tools',
    category: 'Goal',
    amount: -350,
    type: 'Expense',
    dateLabel: '12 Oct 2024',
    timestamp: '01:45 PM',
    merchant: 'Skill Upgrade',
    iconType: 'study',
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'New Laptop',
    targetAmount: 80000,
    savedAmount: 51200,
    category: 'Tech & Career',
    icon: 'Laptop',
  },
  {
    id: 'goal-2',
    name: 'Emergency Fund',
    targetAmount: 20000,
    savedAmount: 15000,
    category: 'Safety Net',
    icon: 'ShieldCheck',
  },
  {
    id: 'goal-3',
    name: 'Travel Fund',
    targetAmount: 15000,
    savedAmount: 6000,
    category: 'Lifestyle',
    icon: 'Plane',
  },
];

export const INITIAL_BUDGET_CATEGORIES: BudgetCategoryItem[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    budgetAmount: 3500,
    spentAmount: 2100,
    color: '#CAD2DC', // Pure Silver
    iconName: 'Layers',
  },
  {
    id: 'food',
    name: 'Food',
    budgetAmount: 2500,
    spentAmount: 1450,
    color: '#D5B477', // Muted Champagne Gold
    iconName: 'Coffee',
  },
  {
    id: 'transport',
    name: 'Transportation',
    budgetAmount: 1000,
    spentAmount: 450,
    color: '#7B8494', // Graphite Slate
    iconName: 'Car',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    budgetAmount: 1000,
    spentAmount: 600,
    color: '#E5C68A', // Warm Gold
    iconName: 'Gamepad2',
  },
  {
    id: 'savings',
    name: 'Savings',
    budgetAmount: 2000,
    spentAmount: 400,
    color: '#8BC6A1', // Muted Mint
    iconName: 'PiggyBank',
  },
];



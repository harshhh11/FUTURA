export type InvestmentCategoryId = 
  | 'savings' 
  | 'fd' 
  | 'bonds' 
  | 'gold' 
  | 'index_funds' 
  | 'mutual_funds'
  | 'equities';

export interface ApplicableRisk {
  name: string; // e.g., 'Inflation Risk' | 'Credit Risk' | 'Market Volatility' | 'Interest Rate Risk' | 'Liquidity Risk' | 'Concentration Risk' | 'Reinvestment Risk'
  level: 'Low' | 'Moderate' | 'High' | 'Severe';
  description: string;
  whyItMatters: string;
}

export interface InvestmentScenario {
  rate: number; // e.g. 0.08
  label: string; // e.g. "Conservative"
  description: string;
}

export interface CostFeeItem {
  name: string;
  typicalAmount: string;
  description: string;
}

export interface TaxInfo {
  summary: string;
  details: string;
  slabDependent: boolean;
  regulatoryNote: string;
}

export interface SuitabilityGuidance {
  whenItFits: string[];
  whenItDoesNotFit: string[];
}

export interface InvestmentCategory {
  id: InvestmentCategoryId;
  name: string;
  tagline: string;
  description: string;
  returnMechanism: string;
  illustrativeReturnRate: number; // e.g., 0.12 for 12%
  returnRange?: string; // e.g., '~11.0% – 13.5% p.a.'
  riskLevel: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  volatilityRating: number; // 1 to 5
  mainRiskTag?: string;
  isMarketLinked?: boolean;
  capitalProtection?: string;
  liquidity: 'Instant (24/7)' | '1-3 Business Days' | 'Fixed Lock-in (1-5 yrs)' | 'Market Hours (T+1)';
  withdrawalRestrictions: string;
  costsToCheck: string[];
  planningHorizon: string;
  suitability: string;
  realWorldExample: string;
  historicalContext: string;
  pros: string[];
  cons: string[];
  scenarios?: {
    conservative: InvestmentScenario;
    middle: InvestmentScenario;
    strong: InvestmentScenario;
  };
  applicableRisks?: ApplicableRisk[];
  costsAndFees?: CostFeeItem[];
  taxConsiderations?: TaxInfo;
  detailedSuitability?: SuitabilityGuidance;
  howItWorksSteps?: string[];
  dataSourceNote?: string;
}

export interface UserFinancialProfile {
  name: string;
  age: number;
  persona: string;
  monthlyIncome: number;
  essentialExpenses: number;
  otherSpending: number;
  currentSavings: number;
  comfortableMonthlyContribution: number;
  riskTolerance: 'stability' | 'moderate' | 'growth';
  goalName: string;
  goalTargetAmount: number;
  goalTargetYears: number;
}

export interface PortfolioAllocation {
  categoryId: InvestmentCategoryId;
  percentage: number;
}

export interface BadYearScenario {
  declinePercentage: number; // e.g. 20 for 20%
  name: string;
  description: string;
  historicalReference: string;
}

export interface RecoveryScenario {
  id: 'no_add' | 'continue' | 'step_up';
  title: string;
  description: string;
  monthlyAddition: number;
  projectedMonthsToRecover: number;
  finalProjectedValue: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'contribution' | 'scenario' | 'goal_update' | 'learning';
  timestamp: string;
  amount?: number;
  details: string;
  badge: string;
  simulated: boolean;
}

export interface LearningLesson {
  id: string;
  title: string;
  readTime: string;
  category: 'Fundamentals' | 'Investing' | 'Risk & Psychology';
  summary: string;
  content: string[];
  keyTakeaway: string;
  aaravExample: string;
  actionRoute: string;
  actionLabel: string;
}

export type ViewRoute = 
  | 'landing'
  | 'dashboard'
  | 'balance'
  | 'budget'
  | 'moneyflow'
  | 'simulator'
  | 'explorer'
  | 'comparison'
  | 'portfolio'
  | 'bad_year'
  | 'recovery'
  | 'activity'
  | 'learning'
  | 'settings';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  category?: string;
  icon?: string;
}

export interface BudgetCategoryItem {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  color: string;
  iconName: string;
}

export interface BalanceTransaction {
  id: string;
  description: string;
  subtitle?: string;
  category: 'Contribution' | 'Savings' | 'Investment' | 'Goal' | 'Income' | 'Essentials' | 'Lifestyle' | string;
  amount: number; // positive for income, negative for expense/contribution
  type: 'Income' | 'Expense' | 'Contribution';
  dateLabel: string;
  timestamp: string;
  merchant?: string;
  iconType?: 'contribution' | 'food' | 'income' | 'transfer' | 'study' | string;
}

export interface AccountAllocation {
  id: 'cash' | 'investments' | 'reserve';
  name: string;
  label: string;
  amount: number;
  percentage: number;
  maskedId: string;
  color: string;
}


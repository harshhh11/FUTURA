/**
 * FUTURA Financial Calculations Engine
 * 
 * Implements deterministic compounding, allocation validation,
 * bad-year shock modelling, and recovery projections.
 */

export interface ProjectionPoint {
  month: number;
  year: number;
  totalContributed: number;
  projectedValue: number;
  interestEarned: number;
}

/**
 * Calculates monthly compound future value with regular end-of-period deposits.
 * 
 * Formula:
 * FV = P * (1 + r)^n + PMT * [ ((1 + r)^n - 1) / r ]
 * where r = annualRate / 12, n = total months
 * 
 * If r == 0:
 * FV = P + PMT * n
 */
export function calculateFutureValue(
  principal: number,
  monthlyDeposit: number,
  annualRate: number, // e.g. 0.10 for 10%
  months: number
): number {
  if (months <= 0) return principal;

  if (annualRate <= 0.0001) {
    return principal + monthlyDeposit * months;
  }

  const r = annualRate / 12;
  const fvPrincipal = principal * Math.pow(1 + r, months);
  const fvDeposits = monthlyDeposit * ((Math.pow(1 + r, months) - 1) / r);

  return Math.round(fvPrincipal + fvDeposits);
}

/**
 * Generates month-by-month progression points for charts.
 */
export function generateProjectionSeries(
  principal: number,
  monthlyDeposit: number,
  annualRate: number,
  totalYears: number
): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  const totalMonths = Math.min(Math.max(totalYears * 12, 12), 480); // clamp between 1 and 40 years

  // Add month 0
  points.push({
    month: 0,
    year: 0,
    totalContributed: principal,
    projectedValue: principal,
    interestEarned: 0,
  });

  // Sample at regular intervals (every 6 months or 12 months for clean rendering)
  const step = totalMonths > 120 ? 12 : (totalMonths > 60 ? 6 : 3);

  for (let m = step; m <= totalMonths; m += step) {
    const projected = calculateFutureValue(principal, monthlyDeposit, annualRate, m);
    const contributed = principal + monthlyDeposit * m;
    const interest = Math.max(0, projected - contributed);

    points.push({
      month: m,
      year: Number((m / 12).toFixed(1)),
      totalContributed: contributed,
      projectedValue: projected,
      interestEarned: interest,
    });
  }

  // Ensure last month is included
  if (points[points.length - 1].month !== totalMonths) {
    const projected = calculateFutureValue(principal, monthlyDeposit, annualRate, totalMonths);
    const contributed = principal + monthlyDeposit * totalMonths;
    points.push({
      month: totalMonths,
      year: Number((totalMonths / 12).toFixed(1)),
      totalContributed: contributed,
      projectedValue: projected,
      interestEarned: Math.max(0, projected - contributed),
    });
  }

  return points;
}

/**
 * Calculates estimated months required to reach a target amount.
 */
export function estimateTimeToGoal(
  targetAmount: number,
  currentSavings: number,
  monthlyContribution: number,
  annualRate: number
): { reachable: boolean; months: number; years: number; explanation: string } {
  if (currentSavings >= targetAmount) {
    return {
      reachable: true,
      months: 0,
      years: 0,
      explanation: 'Target already achieved with current savings.',
    };
  }

  if (monthlyContribution <= 0 && annualRate <= 0) {
    return {
      reachable: false,
      months: Infinity,
      years: Infinity,
      explanation: 'No monthly contributions or growth. Target cannot be reached.',
    };
  }

  // Numerical solution bounded to 50 years (600 months)
  const maxMonths = 600;
  for (let m = 1; m <= maxMonths; m++) {
    const fv = calculateFutureValue(currentSavings, monthlyContribution, annualRate, m);
    if (fv >= targetAmount) {
      return {
        reachable: true,
        months: m,
        years: Number((m / 12).toFixed(1)),
        explanation: `Estimated to reach in ${Math.floor(m / 12)} years and ${m % 12} months.`,
      };
    }
  }

  return {
    reachable: false,
    months: maxMonths,
    years: 50,
    explanation: 'Will require over 50 years under current assumptions. Try increasing contribution or adjusting target.',
  };
}

/**
 * Formats Indian Currency in INR with commas
 * E.g., 1000000 -> ₹10,00,000 or ₹10 Lakhs
 */
export function formatINR(amount: number, compact = false): string {
  if (isNaN(amount) || amount === null) return '₹0';
  
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${Math.round(amount)}`;
  }

  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  if (absStr.length <= 3) {
    return `${isNegative ? '-' : ''}₹${absStr}`;
  }

  const lastThree = absStr.substring(absStr.length - 3);
  const otherNumbers = absStr.substring(0, absStr.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedOther},${lastThree}`;
}

/**
 * Calculate Bad-Year decline metrics
 */
export function calculateBadYearImpact(
  currentPortfolioValue: number,
  declinePercentage: number,
  targetAmount: number,
  monthlyContribution: number,
  normalReturnRate: number
) {
  const declineFraction = Math.max(0, Math.min(declinePercentage, 90)) / 100;
  const amountLost = Math.round(currentPortfolioValue * declineFraction);
  const revisedPortfolioValue = Math.max(0, currentPortfolioValue - amountLost);

  // Calculate baseline time remaining without drop
  const baselineTime = estimateTimeToGoal(
    targetAmount,
    currentPortfolioValue,
    monthlyContribution,
    normalReturnRate
  );

  // Calculate revised time remaining after drop
  const revisedTime = estimateTimeToGoal(
    targetAmount,
    revisedPortfolioValue,
    monthlyContribution,
    normalReturnRate
  );

  const delayMonths = revisedTime.reachable && baselineTime.reachable
    ? Math.max(0, revisedTime.months - baselineTime.months)
    : 0;

  return {
    originalValue: currentPortfolioValue,
    declinePercentage,
    amountLost,
    revisedPortfolioValue,
    baselineMonths: baselineTime.months,
    revisedMonths: revisedTime.months,
    delayMonths,
    delayYears: Number((delayMonths / 12).toFixed(1)),
  };
}

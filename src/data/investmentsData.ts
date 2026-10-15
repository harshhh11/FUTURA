import { InvestmentCategory } from '../types/finance';

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  {
    id: 'savings',
    name: 'Savings Account',
    tagline: 'Instant access safety reserve with modest interest',
    description: 'A bank deposit account where your cash remains immediately accessible while earning a small daily interest credited quarterly.',
    returnMechanism: 'Fixed bank interest rate (typically 2.7% – 3.5% p.a.), calculated daily and credited periodically.',
    illustrativeReturnRate: 0.03,
    riskLevel: 'Very Low',
    volatilityRating: 1,
    liquidity: 'Instant (24/7)',
    withdrawalRestrictions: 'None. Immediate ATM, UPI, and net-banking access.',
    costsToCheck: ['Minimum average balance penalty', 'Annual debit card fee', 'SMS alert charges'],
    planningHorizon: 'Immediate / Emergency reserve (0 – 12 months)',
    suitability: 'Ideal for everyday spending buffer and emergency funds. Not built for beating inflation.',
    realWorldExample: 'Aarav keeps ₹4,000 here to pay monthly phone bills and college canteen food with zero lock-in.',
    historicalContext: 'Insured up to ₹5 Lakhs per bank under DICGC in India, providing near absolute capital safety.',
    pros: [
      'Instant liquidity anytime via UPI or ATM',
      'Capital guarantee backed by regulatory insurance',
      'Zero price fluctuation or market volatility'
    ],
    cons: [
      'Returns fall below inflation (purchasing power slowly declines)',
      'Interest earned above ₹10,000 is taxable',
      'Minimum balance charges if balance drops'
    ]
  },
  {
    id: 'fd',
    name: 'Fixed Deposit (FD)',
    tagline: 'Guaranteed fixed returns locked for a chosen duration',
    description: 'You lock away a fixed sum with a bank for a predefined duration (e.g. 1 year or 3 years) in exchange for a guaranteed interest rate that does not change with market moods.',
    returnMechanism: 'Guaranteed contractual interest rate (typically 6.5% – 7.2% p.a.), compounded quarterly or paid out on maturity.',
    illustrativeReturnRate: 0.068,
    riskLevel: 'Low',
    volatilityRating: 1,
    liquidity: 'Fixed Lock-in (1-5 yrs)',
    withdrawalRestrictions: 'Can be broken prematurely, but incurs a 0.5% – 1% interest rate penalty on early withdrawal.',
    costsToCheck: ['Premature breakage penalty', 'Tax Deducted at Source (TDS) on interest exceeding ₹40k/yr'],
    planningHorizon: 'Short to Medium term (1 – 3 years)',
    suitability: 'Great for known upcoming expenses (e.g. next semester college fees or buying a laptop in 18 months).',
    realWorldExample: 'Aarav sets aside ₹10,000 for 12 months knowing he will receive exactly ₹10,700 on his target date.',
    historicalContext: 'A cornerstone of Indian household savings for decades, offering rock-solid predictability regardless of stock market crashes.',
    pros: [
      'Predictable, guaranteed payout agreed in advance',
      'Completely insulated from stock market swings',
      'Premature liquidity available in emergency (with small penalty)'
    ],
    cons: [
      'Barely keeps pace with real-world inflation',
      'Interest is fully taxable at your income tax slab',
      'Lock-in discourages frequent adjustments'
    ]
  },
  {
    id: 'bonds',
    name: 'Government & Corporate Bonds',
    tagline: 'Lending money to institutions for regular interest payments',
    description: 'When you buy a bond, you lend money to the government (G-Sec) or high-credit companies for a coupon interest payment before the principal is returned on maturity.',
    returnMechanism: 'Periodic coupon yield payments (typically 7.0% – 8.2% p.a.) plus principal repayment on maturity date.',
    illustrativeReturnRate: 0.075,
    riskLevel: 'Low',
    volatilityRating: 2,
    liquidity: '1-3 Business Days',
    withdrawalRestrictions: 'Can be sold on secondary debt exchanges, but bond price fluctuates with broader interest rate changes.',
    costsToCheck: ['Brokerage transaction fees', 'Bid-ask spread on exchange', 'Depository charges'],
    planningHorizon: 'Medium term (3 – 5 years)',
    suitability: 'Investors seeking higher yields than savings accounts while maintaining significantly lower volatility than equities.',
    realWorldExample: 'Investing ₹5,000 in RBI Sovereign Green Bonds or AAA corporate debt providing steady semi-annual yields.',
    historicalContext: 'Government securities (G-Secs) have zero credit default risk since they are backed by the sovereign authority.',
    pros: [
      'Higher fixed yields than ordinary savings accounts',
      'Government bonds carry zero sovereign default risk',
      'Predictable periodic cash flow'
    ],
    cons: [
      'Secondary market liquidity can be low for retail investors',
      'Bond market prices drop when interest rates in the economy rise',
      'Corporate bonds carry credit default risk if company struggles'
    ]
  },
  {
    id: 'gold',
    name: 'Digital Gold & Gold ETFs',
    tagline: 'Historical store of value and crisis hedge',
    description: 'Physical or digital ownership of 99.9% pure gold through Sovereign Gold Bonds (SGB), Gold ETFs, or digital gold vaults, without jewellery making charges.',
    returnMechanism: 'Appreciation of the global gold commodity price, driven by currency movements, inflation, and geopolitical events.',
    illustrativeReturnRate: 0.085,
    riskLevel: 'Moderate',
    volatilityRating: 3,
    liquidity: 'Market Hours (T+1)',
    withdrawalRestrictions: 'Gold ETFs can be traded instantly on stock exchanges during market hours. SGBs have an 8-year maturity with 5-year exit windows.',
    costsToCheck: ['ETF Expense Ratio (0.3% – 0.6%)', 'Digital gold spread margin (2% – 3%)', 'Brokerage fee'],
    planningHorizon: 'Long term (5+ years)',
    suitability: 'A stabilizing hedge representing 5% – 15% of a portfolio to buffer against severe stock market drops.',
    realWorldExample: 'Holding ₹2,000 in a Gold ETF so that if markets panic, gold often holds or increases its value.',
    historicalContext: 'Gold has protected purchasing power over centuries during currency devaluations and market panics.',
    pros: [
      'Negative or low correlation with equities during market panics',
      'No storage hassle, locker rent, or theft risk with ETFs',
      'Hedge against long-term domestic currency depreciation'
    ],
    cons: [
      'Generates zero internal cash flow or dividends (pure price speculation)',
      'Can experience multi-year periods of stagnant or negative returns',
      'Physical jewellery has high 10-25% making charge deductions'
    ]
  },
  {
    id: 'index_funds',
    name: 'Broad Market Index Funds',
    tagline: 'Low-cost ownership of India\'s top 50 corporate leaders',
    description: 'A passive fund that automatically mirrors a leading market index like Nifty 50 or Sensex, giving you direct fractional ownership in the nation\'s top 50 blue-chip companies at ultra-low expense fees.',
    returnMechanism: 'Long-term corporate earnings growth and reinvested dividends across the 50 largest companies.',
    illustrativeReturnRate: 0.12,
    riskLevel: 'Moderate',
    volatilityRating: 4,
    liquidity: '1-3 Business Days',
    withdrawalRestrictions: 'Can be redeemed any working day. Money is credited to your bank account within T+2 days.',
    costsToCheck: ['Ultra-low Expense Ratio (typically 0.1% – 0.25%)', 'Exit load (usually 0% after 7–15 days)', 'Capital gains tax'],
    planningHorizon: 'Long term (5 – 10+ years)',
    suitability: 'The foundation for long-term wealth creation. Suited for college students and first-timers starting disciplined SIPs.',
    realWorldExample: 'Aarav starts a ₹500/month SIP in a Nifty 50 Index Fund, buying fractional pieces of TCS, Infosys, Reliance, and HDFC Bank.',
    historicalContext: 'The Nifty 50 has historically delivered ~12%–13% CAGR over rolling 10-year periods, despite experiencing temporary 20%–40% crashes along the journey.',
    pros: [
      'Ultra-low fees compared to actively managed funds',
      'Eliminates fund manager bias and human stock-picking blunders',
      'Diversified across 14 major economic sectors automatically'
    ],
    cons: [
      'Prices fluctuate every second during market hours',
      'Will experience inevitable market declines (-15% to -35% in bad years)',
      'Requires emotional discipline not to panic-sell during crashes'
    ]
  },
  {
    id: 'mutual_funds',
    name: 'Active Mutual Funds',
    tagline: 'Professionally managed baskets aiming to outperform',
    description: 'A pool of money managed by experienced portfolio managers who research and select specific stocks or sectors with the goal of beating the broad market average.',
    returnMechanism: 'Capital gains and dividend payouts driven by the performance of the active manager\'s chosen stock selections.',
    illustrativeReturnRate: 0.135,
    riskLevel: 'High',
    volatilityRating: 4,
    liquidity: '1-3 Business Days',
    withdrawalRestrictions: 'Redeemable on any market day at prevailing Net Asset Value (NAV).',
    costsToCheck: ['Higher Expense Ratio (0.7% – 1.8% annually)', 'Exit load (1% if withdrawn before 1 year)', 'Capital gains tax'],
    planningHorizon: 'Long term (5+ years)',
    suitability: 'Investors comfortable with higher fund manager risk in pursuit of alpha (market-beating returns).',
    realWorldExample: 'A mid-cap equity mutual fund investing in rapidly growing companies like renewable energy or healthcare innovators.',
    historicalContext: 'While some active funds beat the market, data shows over 65% of large-cap active funds underperform their benchmark index after accounting for management fees.',
    pros: [
      'Potential to outperform broad market indices during specific economic cycles',
      'Professional fund managers actively trim losing positions',
      'Convenient automated SIP starting as low as ₹100/month'
    ],
    cons: [
      'Higher annual expense ratios drag down long-term compounded wealth',
      'Fund manager risk: strategy can underperform benchmark for years',
      'Past performance is never a guarantee of future returns'
    ]
  }
];

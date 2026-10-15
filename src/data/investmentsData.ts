import { InvestmentCategory } from '../types/finance';

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  {
    id: 'savings',
    name: 'Savings Account',
    tagline: 'Instant access safety reserve with modest interest',
    description: 'A liquid bank deposit where your cash remains immediately accessible 24/7 via UPI, debit card, or net-banking while earning daily interest credited quarterly.',
    returnMechanism: 'Fixed bank interest rate (typically 2.7% – 3.5% p.a.), calculated daily on end-of-day balances and credited every quarter.',
    illustrativeReturnRate: 0.032,
    returnRange: '~2.7% – 3.5% p.a.',
    riskLevel: 'Very Low',
    volatilityRating: 1,
    mainRiskTag: 'Inflation Drag',
    isMarketLinked: false,
    capitalProtection: 'DICGC Insured up to ₹5 Lakhs per bank (Principal + Interest)',
    liquidity: 'Instant (24/7)',
    withdrawalRestrictions: 'None. Unlimited free UPI transactions, ATM withdrawals subject to daily bank limits.',
    costsToCheck: ['Minimum average balance penalty', 'Annual debit card fee (₹150 – ₹300)', 'SMS alert charges (₹15 – ₹25/qtr)'],
    planningHorizon: 'Immediate / Emergency reserve (0 – 12 months)',
    suitability: 'Essential for day-to-day spending and a 3-to-6 month emergency cushion. Vulnerable to inflation over long periods.',
    realWorldExample: 'Aarav keeps ₹4,000 here to pay monthly phone recharges, canteen meals, and transit passes with zero lock-in.',
    historicalContext: 'Covered under DICGC (Deposit Insurance and Credit Guarantee Corporation) for up to ₹5 Lakhs per depositor per bank in India, offering maximum capital security.',
    pros: [
      'Instant 24/7 liquidity anytime via UPI, ATM, or debit card',
      'Capital guarantee backed by regulatory deposit insurance (up to ₹5 Lakhs)',
      'Zero price fluctuation, market volatility, or paper losses'
    ],
    cons: [
      'Returns fall below inflation (purchasing power quietly erodes each year)',
      'Interest earned above ₹10,000 per year is added to taxable income under Sec 80TTA',
      'Banks may levy penalty charges if minimum average balance is not maintained'
    ],
    scenarios: {
      conservative: { rate: 0.027, label: 'Conservative (Tier-1 Bank)', description: 'Typical baseline rate at premier public/private sector banks.' },
      middle: { rate: 0.032, label: 'Middle (Average Retail Bank)', description: 'Standard interest rate across modern Indian retail commercial banks.' },
      strong: { rate: 0.035, label: 'Strong (Competitive Small Finance Bank)', description: 'Promotional high-balance savings tier at select small finance banks.' }
    },
    applicableRisks: [
      {
        name: 'Inflation Drag',
        level: 'High',
        description: 'With India’s retail inflation averaging 5% to 6%, earning 3% means your real purchasing power declines by 2% to 3% each year.',
        whyItMatters: 'Holding excess money beyond your 3-6 month emergency buffer in savings quietly makes you poorer in real goods terms.'
      },
      {
        name: 'Opportunity Cost Risk',
        level: 'Moderate',
        description: 'Leaving surplus long-term funds in savings forfeits the compounding power of fixed income or broad market index funds.',
        whyItMatters: '₹1,000/month saved for 15 years in savings reaches ~₹2.3 Lakhs, but reaches ~₹5.0 Lakhs in a diversified index fund.'
      }
    ],
    costsAndFees: [
      { name: 'Debit Card Annual Fee', typicalAmount: '₹150 – ₹350 / year', description: 'Annual fee charged for physical RuPay/Visa debit card access.' },
      { name: 'Minimum Balance Penalty', typicalAmount: '₹50 – ₹250 / month', description: 'Levied if average quarterly balance drops below the required minimum (₹2,000 – ₹10,000).' },
      { name: 'SMS Alert Charges', typicalAmount: '₹15 – ₹25 / quarter', description: 'Mandatory regulatory transaction notification charge.' }
    ],
    taxConsiderations: {
      summary: 'Exempt up to ₹10,000/yr under Section 80TTA; balance taxed at income slab.',
      details: 'Interest earned up to ₹10,000 across all savings accounts is deductible under Sec 80TTA for individuals. Any excess is taxed at your applicable personal income tax slab rate.',
      slabDependent: true,
      regulatoryNote: 'Senior citizens enjoy deduction up to ₹50,000 under Section 80TTB across savings and FDs.'
    },
    detailedSuitability: {
      whenItFits: [
        'Holding 3 to 6 months of mandatory living expenses for emergencies.',
        'Money needed within days or weeks for tuition, room rent, and food.',
        'Zero tolerance for any paper loss or price fluctuation.'
      ],
      whenItDoesNotFit: [
        'Growing wealth for financial goals more than 12 months away.',
        'Beating inflation or generating inflation-adjusted passive income.',
        'Storing large surplus lump sums for multi-year horizons.'
      ]
    },
    howItWorksSteps: [
      'You deposit cash into your account via UPI, net banking, or cash deposit.',
      'The bank calculates interest on your daily end-of-day balance at the contractual annual rate.',
      'Accumulated interest is credited to your balance every quarter (March, June, Sept, Dec).',
      'You can withdraw or transfer 100% of your funds at any second without penalties.'
    ],
    dataSourceNote: 'RBI Guidelines & DICGC Insurance Framework (Current Indian Banking Standard).'
  },
  {
    id: 'fd',
    name: 'Fixed Deposits & Recurring Deposits (FD/RD)',
    tagline: 'Guaranteed fixed contractual returns locked for a chosen duration',
    description: 'A term deposit where you lock away a lump sum (FD) or regular monthly installment (RD) with a bank for a predefined tenure in exchange for a contractual interest rate insulated from stock market swings.',
    returnMechanism: 'Guaranteed contractual interest rate (typically 6.5% – 7.2% p.a.), compounded quarterly and paid out upon maturity.',
    illustrativeReturnRate: 0.068,
    returnRange: '~6.5% – 7.2% p.a.',
    riskLevel: 'Low',
    volatilityRating: 1,
    mainRiskTag: 'Lock-in & Inflation Risk',
    isMarketLinked: false,
    capitalProtection: 'DICGC Insured up to ₹5 Lakhs per bank (Principal + Accrued Interest)',
    liquidity: 'Fixed Lock-in (1-5 yrs)',
    withdrawalRestrictions: 'Can be broken prematurely in an emergency, but incurs a 0.5% – 1.0% interest rate penalty on the applicable tenure rate.',
    costsToCheck: ['Premature withdrawal penalty (0.5% – 1%)', 'Tax Deducted at Source (TDS) if interest exceeds ₹40k/yr'],
    planningHorizon: 'Short to Medium term (1 – 3 years)',
    suitability: 'Ideal for known upcoming expenses (e.g. next semester college fees, buying a laptop in 18 months, or down payments).',
    realWorldExample: 'Aarav locks ₹10,000 for 12 months at 6.8% knowing he will receive exactly ₹10,697 on maturity day, unaffected by stock market news.',
    historicalContext: 'A cornerstone of Indian household savings for over 50 years, prized for total certainty and zero market correlation.',
    pros: [
      'Completely predictable, contractual payout agreed in advance',
      '100% insulated from stock market panics and economic recessions',
      'Emergency premature liquidity available (with small penalty reduction)'
    ],
    cons: [
      'Barely keeps pace with inflation after personal income tax deductions',
      'Interest is fully taxable at your income tax slab (low post-tax efficiency for higher tax brackets)',
      'Tenure lock-in prevents switching if economy-wide interest rates rise'
    ],
    scenarios: {
      conservative: { rate: 0.060, label: 'Conservative (Short 1-Yr Tenure)', description: 'Short duration deposit (90-365 days) during moderate monetary policy.' },
      middle: { rate: 0.068, label: 'Middle (Standard 2-3 Yr Term)', description: 'Prevailing competitive retail fixed deposit rate at leading commercial banks.' },
      strong: { rate: 0.075, label: 'Strong (Senior / Small Finance Bank 3-5 Yr)', description: 'Peak multi-year promotional rate or small finance bank term deposit.' }
    },
    applicableRisks: [
      {
        name: 'Inflation & Tax Drag',
        level: 'Moderate',
        description: 'A 6.8% return taxed at 20% slab yields an effective post-tax return of 5.44%, which leaves zero real purchasing power gain against 5.5% inflation.',
        whyItMatters: 'Using FDs for 10-15 year wealth building results in stagnant real purchasing power.'
      },
      {
        name: 'Reinvestment Risk',
        level: 'Moderate',
        description: 'When your 1-year FD matures, bank deposit rates may have dropped to 5.2%, forcing reinvestment at a much lower yield.',
        whyItMatters: 'You cannot guarantee that current attractive rates will be available when your deposit matures.'
      },
      {
        name: 'Premature Penalty Risk',
        level: 'Low',
        description: 'Breaking an FD early reduces your earned interest by 0.5% to 1.0% below the rate for the actual completed tenure.',
        whyItMatters: 'Keep emergency money in savings or liquid funds to avoid breaking fixed deposits before maturity.'
      }
    ],
    costsAndFees: [
      { name: 'Premature Breakage Penalty', typicalAmount: '0.5% – 1.0% interest reduction', description: 'Deducted from the applicable rate if funds are withdrawn before the contracted maturity date.' },
      { name: 'TDS (Tax Deducted at Source)', typicalAmount: '10% (20% if no PAN)', description: 'Deducted automatically by the bank if total FD interest exceeds ₹40,000 per year.' }
    ],
    taxConsiderations: {
      summary: 'Interest fully taxable at personal income slab; TDS deducted if interest > ₹40,000/yr.',
      details: 'Unlike equity capital gains, bank FD interest is classified as "Income from Other Sources" and taxed at your regular tax bracket. Submit Form 15G/15H if your total income is below the taxable threshold.',
      slabDependent: true,
      regulatoryNote: 'Tax Saver FDs (5-year lock-in) offer 80C deduction up to ₹1.5L, but interest remains taxable.'
    },
    detailedSuitability: {
      whenItFits: [
        'Target expenses within 1 to 3 years where capital preservation is non-negotiable.',
        'Preserving funds for university tuition, medical procedures, or asset down payments.',
        'Investors seeking guaranteed monthly/quarterly interest payout.'
      ],
      whenItDoesNotFit: [
        'Long-term goals (5+ years) where inflation will silently consume purchasing power.',
        'Emergency reserves that might need to be accessed at midnight via UPI.',
        'High-bracket taxpayers seeking tax-efficient capital growth.'
      ]
    },
    howItWorksSteps: [
      'You deposit a specific sum (or commit to monthly RD deposits) for a chosen duration (e.g. 1, 2, or 3 years).',
      'The bank locks in a contractual rate of return that cannot be changed during the tenure.',
      'Interest compounds every quarter and gets added to the principal balance.',
      'On maturity, the original deposit plus all accumulated interest is credited to your savings account.'
    ],
    dataSourceNote: 'RBI Schedule Commercial Banks Interest Rate Benchmarks & DICGC Act.'
  },
  {
    id: 'bonds',
    name: 'Government & Corporate Bonds',
    tagline: 'Lending money to sovereigns and institutions for regular interest payments',
    description: 'When you buy a bond, you lend capital to the Government of India (G-Sec) or high-credit corporations in exchange for periodic coupon interest payments before your full principal is returned on the maturity date.',
    returnMechanism: 'Periodic coupon yield payments (typically 7.0% – 8.2% p.a.), paid semi-annually or annually, plus full principal repayment at face value on maturity.',
    illustrativeReturnRate: 0.075,
    returnRange: '~7.0% – 8.2% p.a.',
    riskLevel: 'Low',
    volatilityRating: 2,
    mainRiskTag: 'Interest Rate & Credit Risk',
    isMarketLinked: true,
    capitalProtection: 'Sovereign backing on G-Secs (zero default risk); Corporate bonds depend on issuer credit rating (AAA to BBB)',
    liquidity: '1-3 Business Days',
    withdrawalRestrictions: 'Can be sold on secondary debt exchanges before maturity, but market selling price fluctuates with interest rate cycles.',
    costsToCheck: ['Brokerage transaction fees (₹20 or 0.1%)', 'Secondary market bid-ask spread', 'Demat account AMC'],
    planningHorizon: 'Medium term (3 – 5 years)',
    suitability: 'Investors seeking higher yields than savings accounts while maintaining substantially lower volatility than equities.',
    realWorldExample: 'Investing ₹5,000 in RBI Sovereign Green Bonds or AAA-rated PSU bonds providing steady semi-annual yields.',
    historicalContext: 'Government of India Securities (G-Secs) have a 100% sovereign track record with zero default risk because they are backed by the sovereign taxing authority.',
    pros: [
      'Higher fixed coupon yield than traditional savings accounts and short FDs',
      'Sovereign bonds carry zero credit default risk',
      'Predictable periodic cash flow suited for planned timelines'
    ],
    cons: [
      'Bond market prices drop when economy-wide interest rates rise (Duration Risk)',
      'Secondary debt market liquidity for small retail ticket sizes can be thin',
      'Corporate bonds carry credit downgrade and default risk if the borrower struggles'
    ],
    scenarios: {
      conservative: { rate: 0.068, label: 'Conservative (Sovereign G-Sec 3-Yr)', description: 'Benchmark Government of India treasury securities with zero default risk.' },
      middle: { rate: 0.075, label: 'Middle (AAA PSU & Corporate 5-Yr)', description: 'High-credit public sector and blue-chip corporate debt securities.' },
      strong: { rate: 0.082, label: 'Strong (High-Yield Corporate Bond)', description: 'AA-rated corporate bonds offering higher credit spreads.' }
    },
    applicableRisks: [
      {
        name: 'Interest Rate (Duration) Risk',
        level: 'Moderate',
        description: 'When the RBI hikes repo rates, older bonds with lower coupon rates drop in market price if you must sell before maturity.',
        whyItMatters: 'If you hold a bond until its maturity date, you receive full face value. Price fluctuations only matter if selling early.'
      },
      {
        name: 'Credit & Default Risk',
        level: 'Moderate',
        description: 'Private corporate issuers can face credit downgrades or default on coupon payments if company business falters.',
        whyItMatters: 'Stick to Sovereign (G-Sec, SDL) or AAA-rated bonds for maximum safety. Avoid unrated high-yield debentures.'
      },
      {
        name: 'Liquidity Risk',
        level: 'Moderate',
        description: 'Secondary market retail trading volume can be low, resulting in bid-ask spreads if selling on exchanges.',
        whyItMatters: 'Only invest money you can comfortably keep invested until the bond reaches its stated maturity date.'
      }
    ],
    costsAndFees: [
      { name: 'Brokerage Commission', typicalAmount: '₹20 flat or 0.05% – 0.1%', description: 'Charged by stockbrokers upon purchasing or selling bond units.' },
      { name: 'Demat AMC', typicalAmount: '₹200 – ₹400 / year', description: 'Depository participant maintenance fee for holding bond scrips.' },
      { name: 'Exchange Transaction Charge', typicalAmount: '0.003% – 0.005%', description: 'Regulatory NSE/BSE transaction fee.' }
    ],
    taxConsiderations: {
      summary: 'Coupon interest taxed at income slab; capital gains on sale taxed under debt rules.',
      details: 'Periodic coupon income is taxed at your regular slab rate. For debt securities acquired after April 1, 2023, capital gains are taxed at your income slab without indexation benefits.',
      slabDependent: true,
      regulatoryNote: 'Target Maturity Debt Index Funds offer convenient fractional bond access with diversification.'
    },
    detailedSuitability: {
      whenItFits: [
        'Preserving wealth over a 3 to 5 year horizon with regular periodic coupon cash flow.',
        'Defensive allocation to offset stock market turbulence in a balanced portfolio.',
        'Investors wanting sovereign safety without the 1-year lock-in of traditional FDs.'
      ],
      whenItDoesNotFit: [
        'Immediate cash needs within 30 to 90 days.',
        'Maximum long-term wealth compounding over 15+ years where equities outperform.',
        'Investors unwilling to understand secondary bond price movement.'
      ]
    },
    howItWorksSteps: [
      'You purchase a bond issue directly via RBI Retail Direct, an exchange, or a debt fund.',
      'The borrower promises to pay you a predetermined coupon rate (e.g. 7.5% per annum).',
      'Interest coupons are credited straight to your bank account every 6 or 12 months.',
      'On the maturity date, the borrower repays your original principal face value in full.'
    ],
    dataSourceNote: 'RBI Retail Direct & Clearing Corporation of India (CCIL) Debt Market Data.'
  },
  {
    id: 'gold',
    name: 'Gold & Sovereign Gold Bonds (SGB / ETF)',
    tagline: 'Historical store of value, inflation hedge, and crisis buffer',
    description: 'Ownership of 99.9% pure gold through Sovereign Gold Bonds (SGB), Gold ETFs, or digital gold vaults, bypassing physical jewellery making charges and locker fees.',
    returnMechanism: 'Appreciation of the global gold commodity price, driven by currency movements, inflation, and global macroeconomic turbulence.',
    illustrativeReturnRate: 0.085,
    returnRange: '~7.5% – 10.0% p.a.',
    riskLevel: 'Moderate',
    volatilityRating: 3,
    mainRiskTag: 'No Cash Flow & Price Volatility',
    isMarketLinked: true,
    capitalProtection: 'No capital guarantee; value is linked directly to international bullion prices',
    liquidity: 'Market Hours (T+1)',
    withdrawalRestrictions: 'Gold ETFs can be traded instantly on stock exchanges during market hours. Sovereign Gold Bonds (SGB) have an 8-year maturity with early RBI exit windows after year 5.',
    costsToCheck: ['ETF Expense Ratio (0.3% – 0.5% annually)', 'Digital gold platform spread (2% – 3%)', 'Brokerage fee on exchange'],
    planningHorizon: 'Long term (5+ years)',
    suitability: 'A stabilizing hedge representing 5% – 15% of an investment portfolio to cushion against severe stock market drops and currency weakness.',
    realWorldExample: 'Holding ₹1,500 in a Gold ETF so that if stock markets drop sharply, gold often holds or increases in value.',
    historicalContext: 'Gold has preserved purchasing power across thousands of years during wars, currency devaluations, and market crashes.',
    pros: [
      'Low or negative correlation with equities during major stock market panics',
      'Zero storage hassle, locker rental fees, impurity risk, or theft with ETFs/SGBs',
      'Hedge against long-term domestic currency depreciation (USD/INR)'
    ],
    cons: [
      'Generates zero internal cash flow, corporate profits, or regular dividends (pure commodity pricing)',
      'Can experience multi-year periods of stagnant or negative price performance during economic booms',
      'Physical jewellery carries high 10% – 25% making charge deductions upon resale'
    ],
    scenarios: {
      conservative: { rate: 0.065, label: 'Conservative (Calm Global Growth)', description: 'Period of strong global economic expansion where safe-haven demand softens.' },
      middle: { rate: 0.085, label: 'Middle (Historical Long-Term Trend)', description: 'Long-term historical rupee-denominated gold appreciation matching inflation plus currency movement.' },
      strong: { rate: 0.110, label: 'Strong (Crisis & Inflation Spike)', description: 'High inflation, geopolitical turbulence, and sustained central bank bullion accumulation.' }
    },
    applicableRisks: [
      {
        name: 'Price Volatility & Stagnation Risk',
        level: 'Moderate',
        description: 'Gold prices can remain flat or slightly decline for 3 to 7 consecutive years when corporate equities are booming.',
        whyItMatters: 'Gold is not an engine of compounding business growth; it is an insurance policy and store of value.'
      },
      {
        name: 'Zero Cash Generation',
        level: 'Moderate',
        description: 'Gold bars and ETFs produce no quarterly earnings, dividends, or interest coupons.',
        whyItMatters: 'All return depends strictly on selling it to someone else at a higher price in the future.'
      },
      {
        name: 'Currency & Tariff Sensitivity',
        level: 'Low',
        description: 'Indian domestic gold prices fluctuate with government import custom duties and USD/INR exchange rate shifts.',
        whyItMatters: 'A cut in import duties can cause domestic gold prices to drop overnight even if global gold is steady.'
      }
    ],
    costsAndFees: [
      { name: 'ETF Expense Ratio', typicalAmount: '0.25% – 0.50% / year', description: 'Annual fee deducted automatically by the mutual fund managing the bullion vault.' },
      { name: 'Digital Gold Spread', typicalAmount: '2.5% – 3.5% on purchase', description: 'Difference between the buying and selling price charged by private digital gold platforms.' },
      { name: 'SGB Expense Ratio', typicalAmount: '0.00% (Free)', description: 'Sovereign Gold Bonds have zero expense ratios and pay 2.5% p.a. additional coupon interest.' }
    ],
    taxConsiderations: {
      summary: 'Gold ETFs taxed under capital gains rules; SGBs held to 8-yr maturity are 100% tax-free!',
      details: 'Gold ETFs are taxed under capital gains rules based on holding period. In contrast, Sovereign Gold Bonds (SGB) redeemed upon 8-year maturity enjoy 100% complete exemption from capital gains tax.',
      slabDependent: false,
      regulatoryNote: 'Physical gold jewellery attracts 3% GST on purchase plus making charge deductions.'
    },
    detailedSuitability: {
      whenItFits: [
        'Holding a 5% to 15% portfolio allocation as a disaster hedge against stock market collapses.',
        'Protecting purchasing power against long-term rupee currency depreciation.',
        'Investors with a 5+ year horizon who value physical or sovereign-backed backing.'
      ],
      whenItDoesNotFit: [
        'Putting 100% of your savings into gold expecting business-like compounding.',
        'Investors requiring regular monthly cash dividends or yields.',
        'Short-term speculative trades under 12 months.'
      ]
    },
    howItWorksSteps: [
      'You purchase Gold ETF units on the stock exchange (or buy Sovereign Gold Bonds during RBI tranches).',
      'The fund house purchases 99.9% pure physical gold bullion and stores it in secure audited bank vaults.',
      'Each ETF unit accurately reflects the prevailing real-time price of 1 gram or 0.01 gram of physical gold.',
      'You can sell your units on the stock exchange at market price during trading hours (T+1 settlement).'
    ],
    dataSourceNote: 'World Gold Council & Reserve Bank of India (SGB Guidelines).'
  },
  {
    id: 'index_funds',
    name: 'Broad Market Index Funds & ETFs',
    tagline: 'Low-cost automated ownership of India\'s top 50 corporate leaders',
    description: 'A passive fund that automatically mirrors a leading national market index like Nifty 50 or BSE Sensex, giving you direct fractional ownership in the nation\'s top 50 blue-chip companies at ultra-low expense fees.',
    returnMechanism: 'Long-term corporate earnings growth, expanding economic revenues, and reinvested dividends across 50 diversified industry leaders.',
    illustrativeReturnRate: 0.120,
    returnRange: '~11.0% – 13.5% p.a.',
    riskLevel: 'Moderate',
    volatilityRating: 4,
    mainRiskTag: 'Market Volatility (Paper Drops)',
    isMarketLinked: true,
    capitalProtection: 'No capital guarantee; value fluctuates with stock market prices',
    liquidity: '1-3 Business Days',
    withdrawalRestrictions: 'Can be redeemed on any business day. Money is credited directly to your bank account within T+2 business days.',
    costsToCheck: ['Ultra-low Expense Ratio (typically 0.10% – 0.25% p.a.)', 'Exit load (usually 0% after 7–15 days)', 'Securities Transaction Tax (STT)'],
    planningHorizon: 'Long term (5 – 10+ years)',
    suitability: 'The foundation for long-term wealth creation. Specially suited for college students starting disciplined monthly SIPs.',
    realWorldExample: 'Aarav sets up an automated ₹500/month SIP into a Nifty 50 Index Fund, buying fractional pieces of TCS, Infosys, Reliance, Tata Motors, and HDFC Bank.',
    historicalContext: 'The Nifty 50 Index has delivered ~12% – 13% CAGR over rolling 10-to-15 year periods, despite absorbing temporary 20% – 40% downturns during crisis years (2008, 2020).',
    pros: [
      'Ultra-low fees compared to actively managed funds (0.15% vs 1.5% saves lakhs over decades)',
      'Eliminates fund manager bias, emotional stock-picking blunders, and underperformance',
      'Automatically diversified across 14 major economic sectors (banking, IT, pharma, energy, auto)'
    ],
    cons: [
      'Prices fluctuate second-by-second during stock market trading hours',
      'Will experience inevitable market corrections (-15% to -35% paper drops in bad years)',
      'Requires emotional discipline not to panic-sell during temporary market crashes'
    ],
    scenarios: {
      conservative: { rate: 0.085, label: 'Conservative (Subdued Economic Decade)', description: 'Period of slower GDP growth, high inflation, and compressed price-to-earnings multiples.' },
      middle: { rate: 0.120, label: 'Middle (15-Year Rolling Average)', description: 'Historical long-term compounded growth of India’s benchmark top 50 corporate index.' },
      strong: { rate: 0.145, label: 'Strong (Corporate Earnings Boom)', description: 'Robust economic tailwinds, expanding manufacturing, and strong corporate profit margins.' }
    },
    applicableRisks: [
      {
        name: 'Market Volatility Risk',
        level: 'High',
        description: 'Stock markets can drop 20% to 35% during global crises or economic recessions, causing temporary paper losses.',
        whyItMatters: 'If you panic and sell during a crash, paper loss turns into permanent loss. With a 7+ year horizon, markets have historically recovered and made new highs.'
      },
      {
        name: 'Sequence of Returns Risk',
        level: 'Moderate',
        description: 'A market downturn occurring right before you need to withdraw your funds can reduce your exit portfolio value.',
        whyItMatters: 'As you get within 2-3 years of your final goal, gradually shift profits into safe debt or FDs.'
      },
      {
        name: 'Tracking Error',
        level: 'Low',
        description: 'Small differences between the index return and the fund return due to cash reserves and operational expenses.',
        whyItMatters: 'Look for index funds with tracking errors under 0.05% for maximum fidelity to the benchmark.'
      }
    ],
    costsAndFees: [
      { name: 'Total Expense Ratio (TER)', typicalAmount: '0.10% – 0.25% / year', description: 'Annual fee automatically deducted from NAV to cover index licensing and administration.' },
      { name: 'Exit Load', typicalAmount: '0% (Nil after 7–15 days)', description: 'Penalty for withdrawing shortly after investment. 0% after the brief holding window.' },
      { name: 'STT & Stamp Duty', typicalAmount: '0.005% stamp duty + 0.001% STT', description: 'Statutory government taxes levied upon transaction execution.' }
    ],
    taxConsiderations: {
      summary: 'LTCG (> 1 yr) taxed at 12.5% above ₹1.25L exemption; STCG (< 1 yr) taxed at 20%.',
      details: 'Equity capital gains: Profit made on units held longer than 12 months is Long-Term Capital Gain (LTCG), exempt up to ₹1.25 Lakh per financial year and taxed at 12.5% on the excess. Units sold under 12 months attract 20% STCG.',
      slabDependent: false,
      regulatoryNote: 'No tax is paid while money remains invested and compounding; tax only applies upon redemption.'
    },
    detailedSuitability: {
      whenItFits: [
        'Building wealth over 5, 10, or 15+ years where compounding can outpace inflation.',
        'Disciplined monthly SIP investing from salary or student stipend.',
        'Investors seeking transparent, zero-manager-bias corporate India growth.'
      ],
      whenItDoesNotFit: [
        'Money needed within 1 to 3 years for college tuition or emergency medical expenses.',
        'Investors who check daily prices and panic when their balance drops by 10%.',
        'Guaranteed capital preservation requirements.'
      ]
    },
    howItWorksSteps: [
      'You invest a lump sum or setup an automatic monthly SIP (e.g. ₹500 on the 5th of each month).',
      'The fund pool buys proportional shares of all 50 companies in the Nifty 50 index (TCS, Reliance, etc.).',
      'When these companies earn profits, expand, and pay dividends, the Net Asset Value (NAV) of your fund increases.',
      'Over 5 to 10 years, compounding multiplies your wealth without requiring you to pick individual stocks.'
    ],
    dataSourceNote: 'NSE India Benchmark Nifty 50 Historical Total Return Index (TRI) Data & SEBI MF Regulations.'
  },
  {
    id: 'mutual_funds',
    name: 'Active Equity Mutual Funds',
    tagline: 'Hand-picked stock baskets managed by professional fund managers',
    description: 'A pooled investment vehicle where professional fund managers research, buy, and sell specific stocks and sectors with the goal of outperforming the broad benchmark index.',
    returnMechanism: 'Capital gains and dividend payouts generated by the active manager\'s chosen stock selections and timely sector rotations.',
    illustrativeReturnRate: 0.130,
    returnRange: '~11.5% – 15.0% p.a.',
    riskLevel: 'High',
    volatilityRating: 4,
    mainRiskTag: 'Manager Underperformance & Fee Drag',
    isMarketLinked: true,
    capitalProtection: 'No capital guarantee; market-linked equity risk',
    liquidity: '1-3 Business Days',
    withdrawalRestrictions: 'Redeemable on any market working day at the closing Net Asset Value (NAV).',
    costsToCheck: ['Higher Expense Ratio (0.75% – 1.80% annually)', 'Exit load (1% if withdrawn before 1 year)', 'Capital gains tax'],
    planningHorizon: 'Long term (5+ years)',
    suitability: 'Investors comfortable with manager risk in pursuit of alpha (outperforming the market), especially in mid-cap and small-cap sectors.',
    realWorldExample: 'A mid-cap mutual fund investing in rapidly scaling innovators in clean energy, specialized manufacturing, or healthcare.',
    historicalContext: 'While select funds outperform over short cycles, SPIVA (S&P Indices Versus Active) reports indicate over 65% of large-cap active funds underperform benchmark indices over 5+ year horizons after fees.',
    pros: [
      'Potential to beat the broad market index during specific economic cycles through smart stock selection',
      'Professional fund managers actively exit struggling companies and shift into high-conviction winners',
      'Convenient automated SIP setup with fractional ownership starting at ₹100/month'
    ],
    cons: [
      'Higher annual expense ratio (0.8% – 1.8%) eats away a substantial portion of long-term compounded wealth',
      'Fund Manager Risk: A manager can make incorrect calls or leave the fund, causing years of underperformance',
      'Past top performance is never a reliable guarantee of future market leadership'
    ],
    scenarios: {
      conservative: { rate: 0.080, label: 'Conservative (Manager Underperforms)', description: 'Fund strategy lags the benchmark index after accounting for annual management fees.' },
      middle: { rate: 0.130, label: 'Middle (Moderate Alpha Achieved)', description: 'Manager delivers benchmark market returns plus modest 1% alpha over a full cycle.' },
      strong: { rate: 0.160, label: 'Strong (Top-Decile Fund Performance)', description: 'Exceptional sector timing and high-conviction multi-bagger stock picks.' }
    },
    applicableRisks: [
      {
        name: 'Manager & Alpha Risk',
        level: 'High',
        description: 'The fund manager can make poor stock selections, hold losing positions too long, or underperform a cheap index fund for years.',
        whyItMatters: 'Paying 1.5% in fees for a fund that delivers less return than a 0.15% index fund causes severe long-term wealth erosion.'
      },
      {
        name: 'Expense Ratio Drag',
        level: 'High',
        description: 'A 1.5% annual fee compounded over 20 years reduces ending portfolio wealth by roughly 25% compared to low-cost alternatives.',
        whyItMatters: 'Always compare active fund returns against the category benchmark index after deducting all expenses.'
      },
      {
        name: 'Market Volatility Risk',
        level: 'High',
        description: 'Active equity funds hold stocks and will decline during broad market corrections.',
        whyItMatters: 'Requires a 5 to 7+ year horizon to absorb market downturns.'
      }
    ],
    costsAndFees: [
      { name: 'Active Total Expense Ratio (TER)', typicalAmount: '0.75% – 1.80% / year', description: 'Covers research analysts, fund manager salaries, compliance, and marketing expenses.' },
      { name: 'Exit Load', typicalAmount: '1.0% if redeemed < 365 days', description: 'Levied if units are sold before completing 1 full year.' },
      { name: 'STT & Stamp Duty', typicalAmount: 'Standard equity statutory rates', description: 'Government taxes applicable on all equity transactions.' }
    ],
    taxConsiderations: {
      summary: 'Same equity taxation: LTCG 12.5% above ₹1.25L, STCG 20%.',
      details: 'Tax treatment is identical to index funds: 12.5% on LTCG exceeding ₹1.25 Lakh per financial year; 20% on short-term gains under 12 months.',
      slabDependent: false,
      regulatoryNote: 'Direct plans have lower expense ratios than Regular plans (which include distributor commission).'
    },
    detailedSuitability: {
      whenItFits: [
        'Seeking alpha in mid-cap, small-cap, or specialized thematic sectors where active research adds value.',
        'Investors with 7+ year horizons who monitor fund manager performance periodically.',
        'Willingness to tolerate fee drag in exchange for active portfolio pruning.'
      ],
      whenItDoesNotFit: [
        'Large-cap investing where low-cost Index Funds historically beat most active funds on cost.',
        'Cost-sensitive beginners wanting transparent, automated simplicity.',
        'Short-term money needed in less than 3 years.'
      ]
    },
    howItWorksSteps: [
      'Investors pool their money together under an Asset Management Company (AMC).',
      'The designated Fund Manager and research team research company balance sheets and buy high-potential stocks.',
      'The manager actively buys and sells stocks to maintain optimal sector allocations.',
      'You earn returns as the Net Asset Value (NAV) rises with the portfolio companies’ growth.'
    ],
    dataSourceNote: 'AMFI (Association of Mutual Funds in India) & S&P SPIVA India Scorecard.'
  },
  {
    id: 'equities',
    name: 'Direct Equities (Advanced Category)',
    tagline: 'Individual company shares with maximum upside and total loss risk',
    description: 'Direct ownership of individual company shares listed on the stock exchange (BSE/NSE). Offers maximum capital appreciation potential, but carries severe concentration risk and the danger of losing 100% of invested capital.',
    returnMechanism: 'Company share price appreciation driven by corporate revenue and profit growth, plus direct dividend payouts credited to your bank account.',
    illustrativeReturnRate: 0.145,
    returnRange: '~12.0% – 18.0%+ p.a. (or -50%+ loss)',
    riskLevel: 'Very High',
    volatilityRating: 5,
    mainRiskTag: 'Extreme Concentration & Capital Loss',
    isMarketLinked: true,
    capitalProtection: 'Zero capital guarantee; full risk of total capital loss if company defaults',
    liquidity: 'Market Hours (T+1)',
    withdrawalRestrictions: 'Can be sold during stock market hours (9:15 AM – 3:30 PM). Sale proceeds settle to your trading account on T+1 business days.',
    costsToCheck: ['Brokerage charges (₹20 or flat % per order)', 'Depository Participant (DP) sell fee (₹15 – ₹20/scrip)', 'Securities Transaction Tax (STT)'],
    planningHorizon: 'Long term (7+ years)',
    suitability: 'Advanced investors who possess financial statement literacy, time for quarterly research, and the emotional discipline to endure 50% paper crashes.',
    realWorldExample: 'Aarav considers buying individual shares in an EV startup, but discovers that if the startup fails, his entire ₹1,000 investment could vanish permanently.',
    historicalContext: 'While benchmark stock indices rise over decades, over 80% of individual companies that entered the stock exchange over the last 30 years failed to beat a fixed deposit or went bankrupt.',
    pros: [
      'Unlimited upside potential: individual winner stocks can grow 5x to 10x over a decade',
      'Zero ongoing annual management fees or fund expense ratios',
      'Direct voting rights as a shareholder and direct dividend credits to your bank'
    ],
    cons: [
      'Extreme concentration risk: if a chosen company suffers accounting fraud or business failure, capital can be permanently wiped out',
      'Requires dozens of hours analyzing quarterly earnings reports, management conference calls, and debt ratios',
      'Severe psychological stress: individual stocks frequently plunge 40% – 70% during sector downturns'
    ],
    scenarios: {
      conservative: { rate: 0.040, label: 'Conservative (Stagnant / Losing Companies)', description: 'Poor stock picks or sector downturn leading to severe underperformance and paper loss.' },
      middle: { rate: 0.145, label: 'Middle (Solid Quality Companies)', description: 'Carefully researched basket of high-return-on-equity compounders beating the broad index.' },
      strong: { rate: 0.200, label: 'Strong (High-Growth Multi-Bagger)', description: 'Exceptional business execution and multi-fold earnings expansion.' }
    },
    applicableRisks: [
      {
        name: 'Concentration & Total Loss Risk',
        level: 'Severe',
        description: 'Unlike index funds that hold 50 stocks, holding only 1 or 2 individual companies exposes you to catastrophic loss if that specific business fails.',
        whyItMatters: 'Beginners frequently invest all their pocket money into 1 trending stock and suffer devastating 50%-80% permanent losses.'
      },
      {
        name: 'Extreme Volatility Drawdown',
        level: 'High',
        description: 'Even top-tier companies regularly experience 40% to 60% drawdowns during bear markets before recovering.',
        whyItMatters: 'If you lack deep conviction or the stomach to watch your balance cut in half, you will panic-sell at the exact bottom.'
      },
      {
        name: 'Behavioral & FOMO Trap',
        level: 'High',
        description: 'Novice investors often buy at all-time highs following social media hype and sell when prices drop.',
        whyItMatters: 'Direct stock investing requires cold, objective accounting analysis, not tips from WhatsApp or Instagram reels.'
      }
    ],
    costsAndFees: [
      { name: 'Brokerage Charge', typicalAmount: '₹20 flat or 0.05% per trade', description: 'Levied by stockbrokers on execution of buy and sell orders.' },
      { name: 'DP (Depository Participant) Charges', typicalAmount: '₹15 – ₹20 per scrip per day', description: 'Charged when shares are debited from your Demat account upon selling.' },
      { name: 'STT & Exchange Turnover', typicalAmount: '0.1% STT on delivery', description: 'Statutory government taxes levied upon delivery trades.' }
    ],
    taxConsiderations: {
      summary: 'LTCG (> 1 yr) taxed at 12.5% above ₹1.25L exemption; STCG (< 1 yr) taxed at 20%.',
      details: 'Gains on listed equity shares held > 12 months qualify as LTCG (taxed at 12.5% above ₹1.25L aggregate). Held < 12 months is STCG (taxed at 20%). Dividends received are added to your income and taxed at your slab.',
      slabDependent: false,
      regulatoryNote: 'SEBI and exchanges enforce circuit breakers and surveillance measures (GSM/ASM) on volatile scrips.'
    },
    detailedSuitability: {
      whenItFits: [
        'Investors with solid financial knowledge who read balance sheets and annual reports.',
        'High risk tolerance with a well-funded emergency reserve already in place.',
        'Willingness to diversify across at least 15-20 distinct companies and sectors.'
      ],
      whenItDoesNotFit: [
        'First-time student investors starting with their first ₹500 or ₹1,000.',
        'Money needed for living expenses, college fees, or short-term goals.',
        'Anyone looking for passive, set-it-and-forget-it automated wealth creation.'
      ]
    },
    howItWorksSteps: [
      'You open a Demat & Trading account with a SEBI-registered stockbroker.',
      'You research individual companies and place limit or market orders on the BSE/NSE exchange.',
      'Purchased shares are transferred to your National Securities Depository (NSDL/CDSL) Demat account (T+1).',
      'You earn through stock price appreciation and direct dividend payouts into your bank account.'
    ],
    dataSourceNote: 'SEBI Investor Education Guidelines & BSE/NSE Regulatory Standards.'
  }
];

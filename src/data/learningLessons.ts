import { LearningLesson } from '../types/finance';

export const LEARNING_LESSONS: LearningLesson[] = [
  {
    id: 'risk-and-volatility',
    title: 'Understanding Risk: Volatility vs. Permanent Loss',
    readTime: '3 min read',
    category: 'Fundamentals',
    summary: 'Price swings on a screen are not the same as losing your money forever. Discover the difference between temporary turbulence and real capital destruction.',
    content: [
      'For beginners, "risk" usually sounds like gambling or losing everything overnight. But in finance, there are two completely different kinds of risk.',
      'The first is Volatility: the price goes up and down every day based on buyer and seller emotions. If you own a piece of India\'s top 50 companies through an index fund and the market drops 15% this month, you haven\'t lost a single rupee unless you hit the sell button in a panic.',
      'The second is Permanent Loss: putting your money into a dying company, speculative meme tokens, or failing to protect against inflation. That money is genuinely gone.',
      'When you are 19 like Aarav with a 10+ year time horizon, short-term market volatility is not your enemy—it is the price of admission for long-term compounding.'
    ],
    keyTakeaway: 'Temporary price drops are paper losses. You only turn a decline into permanent loss when you panic-sell.',
    aaravExample: 'Aarav puts ₹1,000 into an index fund. Next week it displays ₹940. He still owns the exact same number of fund units; the market just quoted a lower price today.',
    actionRoute: 'bad_year',
    actionLabel: 'Rehearse a Market Shock'
  },
  {
    id: 'fd-vs-market',
    title: 'Fixed Deposits vs. Market-Linked Investments',
    readTime: '4 min read',
    category: 'Investing',
    summary: 'A bank FD guarantees your rupees back with zero stress. An equity investment offers no guarantee, but has historically beaten inflation over decades.',
    content: [
      'A Fixed Deposit is like a contractual promise: you lend the bank ₹10,000 for 12 months at 7%, and in 12 months they give you exactly ₹10,700.',
      'It provides absolute psychological peace of mind. But there is a silent catch called inflation. If consumer prices rise by 6.5% during that year, your real purchasing power only grew by 0.5% (and taxes take a cut of that too).',
      'Market-linked investments (like index funds) do not offer a guaranteed interest coupon. Instead, you own real businesses that produce goods, provide software services, and raise their prices with inflation.',
      'The sweet spot for a young investor isn\'t picking one or the other—it is holding an emergency buffer in safe deposits and investing long-term wealth in market engines.'
    ],
    keyTakeaway: 'FDs protect your nominal capital over months. Equities protect your purchasing power over decades.',
    aaravExample: 'Aarav keeps ₹4,000 in an emergency savings/FD for urgent college project expenses, while putting ₹1,000/month into equity for his future.',
    actionRoute: 'comparison',
    actionLabel: 'Compare FD vs Index Funds'
  },
  {
    id: 'index-vs-active',
    title: 'Index Funds vs. Active Mutual Funds',
    readTime: '4 min read',
    category: 'Investing',
    summary: 'Why paying expensive fund managers often delivers less money in your pocket than buying the entire market index for pennies.',
    content: [
      'An Index Fund is automated and passive. It simply buys the 50 largest companies in India in the exact proportions they exist in the Nifty 50 index. No star managers, no fancy predictions, and rock-bottom fees (0.1% to 0.2%).',
      'An Active Mutual Fund employs a research team and a fund manager who attempts to pick winners and sidestep losers. In exchange, they charge 1.0% to 1.8% of your money every single year, regardless of whether the fund makes or loses money.',
      'Over 10 to 15 years, that tiny-looking 1.5% fee difference compounds into hundreds of thousands of rupees taken out of your final wealth.',
      'Multiple global studies show that over 65% to 80% of active fund managers fail to beat the simple index over long horizons once fees are deducted.'
    ],
    keyTakeaway: 'In investing, you get what you don\'t pay for. Low expense ratios mean more compounded wealth in your pocket.',
    aaravExample: 'If Aarav invests ₹1,000/mo for 20 years, an extra 1.2% in fund fees would quietly eat away over ₹1,80,000 of his potential returns.',
    actionRoute: 'explorer',
    actionLabel: 'Explore Low-Cost Index Funds'
  },
  {
    id: 'what-is-a-sip',
    title: 'Demystifying the SIP: A Method, Not an Asset',
    readTime: '3 min read',
    category: 'Fundamentals',
    summary: 'SIP stands for Systematic Investment Plan. It is an automated habit of investing fixed rupees regularly, not a separate type of stock or scheme.',
    content: [
      'Many beginners say: "I invested in a SIP, is that safer than mutual funds?" This is a fundamental misunderstanding.',
      'A SIP is simply the vehicle and schedule—like setting up an auto-debit on the 5th of every month. The actual investment you buy with that money is the asset (such as an index fund, gold ETF, or debt fund).',
      'Why is a monthly SIP so powerful? Because it automates Rupee Cost Averaging. When the market is booming, your ₹1,000 buys fewer units at higher prices. When the market crashes, your ₹1,000 automatically scoops up more units on sale.',
      'You never need to predict whether today is a "good day" or "bad day" to invest. You simply show up consistently.'
    ],
    keyTakeaway: 'A SIP removes emotions and guesswork by turning investing into an automated monthly discipline.',
    aaravExample: 'Aarav schedules a ₹1,000 auto-SIP right after his monthly stipend arrives, so he never accidentally spends his investment money on impulse purchases.',
    actionRoute: 'simulator',
    actionLabel: 'Simulate a Monthly SIP'
  },
  {
    id: 'magic-of-compounding',
    title: 'The Unstoppable Force of Compounding',
    readTime: '3 min read',
    category: 'Fundamentals',
    summary: 'Albert Einstein famously called compound interest the eighth wonder of the world. Here is why starting at 19 changes the mathematical trajectory of your life.',
    content: [
      'Simple growth is linear: ₹1,000 + ₹100 each year. Compounding is exponential: the growth itself starts generating its own growth.',
      'In Year 1, compounding feels boring. Your ₹1,000 might only earn ₹100. But in Year 15, the returns earned on previous returns completely dwarf the actual monthly money you deposit.',
      'A 19-year-old who invests ₹1,000 a month for 10 years and then stops can end up with more money at age 60 than someone who starts at age 30 and invests ₹1,000 every single month for 30 years straight.',
      'Time in the market is vastly more powerful than timing the market. Every year you delay starting cuts into your exponential curve.'
    ],
    keyTakeaway: 'Starting with a small amount at 19 is mathematically superior to starting with a large amount in your thirties.',
    aaravExample: 'At ₹1,000/mo and a 12% illustrative return, Aarav contributes ₹1.2 Lakhs over 10 years, but his portfolio grows to over ₹2.3 Lakhs—more than half the money comes from growth!',
    actionRoute: 'simulator',
    actionLabel: 'See Your Compounding Curve'
  },
  {
    id: 'diversification-rules',
    title: 'The Art of Diversification: Never One Basket',
    readTime: '4 min read',
    category: 'Investing',
    summary: 'How spreading your money across equities, debt, and gold ensures one bad sector or market crash never destroys your financial peace of mind.',
    content: [
      'If you invest 100% of your savings into a single high-flying tech stock or crypto token, a single accounting scandal or regulatory ban can wipe out everything you built.',
      'Diversification means holding assets that do not move in lockstep. When equities experience a recessionary dip, government bonds continue delivering steady interest, and gold often rallies as investors seek historical safe-havens.',
      'By combining growth assets (Index funds) with stabilizing assets (Fixed deposits/Bonds) and crisis buffers (Gold), your overall journey becomes far smoother.',
      'A smoother ride prevents the biggest trap for young investors: panic-selling during market crashes because the portfolio dropped too fast.'
    ],
    keyTakeaway: 'Diversification does not maximize upside on a lucky day; it guarantees survival through all market seasons.',
    aaravExample: 'Aarav splits his ₹1,000 monthly contribution into 60% Index Funds (₹600), 25% Fixed Deposits (₹250), and 15% Gold (₹150) for a balanced sleep-well mix.',
    actionRoute: 'portfolio',
    actionLabel: 'Build Your Custom Portfolio'
  },
  {
    id: 'inflation-silent-thief',
    title: 'Inflation: The Silent Wealth Destroyer',
    readTime: '3 min read',
    category: 'Fundamentals',
    summary: 'Why hiding cash under your mattress or leaving it in a basic savings account is guaranteed to make you poorer over time.',
    content: [
      'Suppose a cinema ticket and popcorn costs ₹250 today. If inflation is 6% per year, that exact same movie outing will cost ₹335 in five years and ₹450 in ten years.',
      'Your ₹250 cash note will still say "₹250" on the paper, but it can only buy half the popcorn it used to.',
      'If your money is parked in a savings account earning 3% per year while living costs inflate at 6%, you are losing 3% of your real purchasing power every single year.',
      'To build long-term wealth, your investments must earn an after-tax return that comfortably outpaces the inflation rate of everyday goods.'
    ],
    keyTakeaway: 'Capital preservation is not safety if inflation eats its purchasing power. True wealth requires beating inflation.',
    aaravExample: 'If Aarav saves ₹8,000 purely in physical cash for 10 years, it will feel like only ₹4,400 in purchasing power due to 6% inflation.',
    actionRoute: 'moneyflow',
    actionLabel: 'Audit Your Cash Allocation'
  },
  {
    id: 'emergency-funds-first',
    title: 'Emergency Buffer: Your Armor Before Investing',
    readTime: '3 min read',
    category: 'Fundamentals',
    summary: 'Why you should never invest money in volatile assets if you might need it for rent, medicine, or college fees in the next 30 days.',
    content: [
      'The worst mistake a beginner can make is investing their last rupee into the stock market on Monday, only to have their laptop break on Wednesday.',
      'If you have no emergency cash cushion, you are forced to sell your investments immediately—often at a loss during a market dip—and pay penalty fees.',
      'An emergency fund is 1 to 3 months of essential living costs parked in a boring, instantly accessible savings account or liquid FD.',
      'It doesn\'t aim to make you rich. Its sole job is to protect your long-term investments so you never have to interrupt your compounding journey for an unexpected bill.'
    ],
    keyTakeaway: 'An emergency fund is not an investment; it is the financial shield that allows your investments to grow undisturbed.',
    aaravExample: 'Aarav maintains ₹4,000 (1 month of his essential living expenses) in a savings account before investing a single rupee into index funds.',
    actionRoute: 'moneyflow',
    actionLabel: 'Set Up Your Emergency Buffer'
  },
  {
    id: 'fees-and-lockins',
    title: 'Fees, Lock-ins, and Hidden Friction',
    readTime: '4 min read',
    category: 'Risk & Psychology',
    summary: 'How exit loads, expense ratios, brokerage spreads, and premature withdrawal penalties silently bite into your returns.',
    content: [
      'Financial institutions make money on fees. As an intelligent investor, you must learn to read the fine print.',
      'Expense Ratio: The annual percentage cut deducted from mutual fund and ETF values. A 1.5% fee on an active fund vs. 0.15% on an index fund seems small, but over 20 years it can eat a quarter of your total profit.',
      'Exit Loads: Penalties charged if you withdraw your mutual fund money before a designated period (e.g. 1% if redeemed within 365 days).',
      'Premature FD breakage: Banks deduct 0.5% to 1.0% from your promised interest rate if you break a fixed deposit early.',
      'Always know the lock-in duration and exit cost before entering any financial commitment.'
    ],
    keyTakeaway: 'Always choose direct mutual funds with low expense ratios and check exit penalties before committing money.',
    aaravExample: 'Aarav selects "Direct Plans" of index funds instead of "Regular Plans", saving approximately 1% in distributor commissions every year.',
    actionRoute: 'explorer',
    actionLabel: 'Inspect Fee Structures'
  },
  {
    id: 'psychology-of-crashes',
    title: 'Surviving Market Declines: The Psychology of Downturns',
    readTime: '4 min read',
    category: 'Risk & Psychology',
    summary: 'Every 3 to 5 years, the stock market will drop 20% or more. Here is the mental blueprint to stay calm when everyone else is panicking.',
    content: [
      'In 2008, global markets plunged 50%. In March 2020, Indian markets plunged 38% in five weeks. In both cases, headlines screamed that financial systems were ending.',
      'Yet within 18 to 24 months, markets recovered all lost ground and surged to fresh all-time highs as human ingenuity, commerce, and corporate earnings bounced back.',
      'When your screen turns red, your natural human instinct is to run away and sell to stop the emotional pain. But selling at the bottom guarantees the loss and causes you to miss the explosive early days of the recovery.',
      'First-time investors who rehearse bad years beforehand are far less likely to panic when the inevitable storm arrives.'
    ],
    keyTakeaway: 'Market corrections are not bugs; they are features of a healthy economy that create discounts for disciplined buyers.',
    aaravExample: 'When the market drops 20%, Aarav\'s ₹1,000 monthly SIP buys 25% more fund units at a discounted price, supercharging his eventual recovery.',
    actionRoute: 'bad_year',
    actionLabel: 'Launch Bad-Year Rehearsal'
  }
];

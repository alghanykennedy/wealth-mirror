// Core types for WealthMirror

export interface BiasScore {
  name: string
  key: string
  score: number          // 0–100
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: string       // quote/paraphrase from user's answers that triggered this
  interventions: string[]  // 3 personalized tactics
  color: string
}

export interface WealthProfile {
  dominantBias: string
  summary: string             // 2–3 sentence narrative
  archetype: string           // e.g. "The Fearful Protector"
  archetypeDescription: string
  biases: BiasScore[]
  overallRiskScore: number    // 0–100, how much biases threaten wealth
  keyInsight: string          // the one thing they need to hear
  strengths: string[]         // 2–3 things they're doing right
}

export interface AssessmentOption {
  id: string
  text: string
  weights: Record<string, number> // bias key -> weight (e.g. { loss_aversion: 20 })
}

export interface AssessmentQuestion {
  id: string
  text: string
  hint: string
  category: 'loss' | 'gain' | 'risk' | 'social' | 'time' | 'market'
  options: AssessmentOption[]
}

export interface ScenarioResult {
  scenario: string
  biasesDetected: { name: string; evidence: string }[]
  realtimeInsight: string
  recommendation: string
}

export interface ScenarioOption {
  id: string
  text: string
}

export interface Scenario {
  id: string
  title: string
  description: string
  options: ScenarioOption[]
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    text: 'A stock you bought 3 months ago is down 25% due to a general market dip. What is your most likely reaction?',
    hint: 'Think about your immediate emotional response, not just the logical one.',
    category: 'loss',
    options: [
      { id: 'o1a', text: 'Sell immediately to prevent any further losses.', weights: { loss_aversion: 30, status_quo_bias: -10 } },
      { id: 'o1b', text: 'Do nothing and wait for it to recover to my entry price.', weights: { anchoring: 25, status_quo_bias: 20 } },
      { id: 'o1c', text: 'Buy more to lower my average cost basis.', weights: { overconfidence: 15, anchoring: 15 } },
      { id: 'o1d', text: 'Review the fundamentals and decide based on the original thesis.', weights: { confirmation_bias: 5 } }
    ]
  },
  {
    id: 'q2',
    text: 'You see a specific sector (like AI or Green Energy) is up 40% this month. Most of your friends are talking about their gains.',
    hint: 'How does the "social proof" affect your decision making?',
    category: 'market',
    options: [
      { id: 'o2a', text: 'Invest a significant amount now to not miss the next leg up.', weights: { herding: 30, recency_bias: 20 } },
      { id: 'o2b', text: 'Research why it is up and look for a smaller, related play.', weights: { confirmation_bias: 15 } },
      { id: 'o2c', text: 'Assume I missed the boat and look for a different, undervalued sector.', weights: { recency_bias: -10 } },
      { id: 'o2d', text: 'Wait for a "healthy correction" before considering an entry.', weights: { anchoring: 20 } }
    ]
  },
  {
    id: 'q3',
    text: 'How do you typically feel about your ability to "time" the market or pick winning stocks compared to the average investor?',
    hint: 'Be honest — this is about self-perception of skill.',
    category: 'risk',
    options: [
      { id: 'o3a', text: 'I have a clear edge and can consistently beat the indices.', weights: { overconfidence: 40 } },
      { id: 'o3b', text: 'I am better than average but still get caught by market swings.', weights: { overconfidence: 20 } },
      { id: 'o3c', text: 'I prefer index funds because I know the market is hard to beat.', weights: { overconfidence: -20 } },
      { id: 'o3d', text: 'I mostly follow expert recommendations.', weights: { herding: 15 } }
    ]
  },
  {
    id: 'q4',
    text: 'You have a "winner" in your portfolio up 100%. You also have a "loser" down 50%. You need to raise cash today.',
    hint: 'Which one is harder to let go of?',
    category: 'loss',
    options: [
      { id: 'o4a', text: 'Sell the winner to "lock in" the gains.', weights: { mental_accounting: 25, loss_aversion: 10 } },
      { id: 'o4b', text: 'Sell the loser and use the tax loss to my advantage.', weights: { loss_aversion: -20 } },
      { id: 'o4c', text: 'Sell a bit of both to maintain portfolio balance.', weights: { status_quo_bias: 10 } },
      { id: 'o4d', text: 'Wait another week to see if the loser bounces back first.', weights: { status_quo_bias: 30, loss_aversion: 15 } }
    ]
  },
  {
    id: 'q5',
    text: 'When you read news about an investment you already own, what do you usually find yourself looking for?',
    hint: 'This identifies how you process new information.',
    category: 'social',
    options: [
      { id: 'o5a', text: 'Validation that my original thesis is still correct.', weights: { confirmation_bias: 35 } },
      { id: 'o5b', text: 'Potential "red flags" or risks that I might have missed.', weights: { confirmation_bias: -20 } },
      { id: 'o5c', text: 'Price targets and what analysts are saying.', weights: { anchoring: 20, herding: 10 } },
      { id: 'o5d', text: 'I don\'t read much news once I\'ve made the decision.', weights: { status_quo_bias: 20 } }
    ]
  }
]

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: 'Black Monday',
    description: 'The market opens down 18% with no clear explanation. Your portfolio is at a 6-year low.',
    options: [
      { id: 's1a', text: 'Sell everything immediately to preserve what remains.' },
      { id: 's1b', text: 'Close my laptop and refuse to look at my balance for a month.' },
      { id: 's1c', text: 'Look for opportunities to "buy the dip" with any spare cash.' },
      { id: 's1d', text: 'Call my financial advisor or a friend for reassurance.' }
    ]
  },
  {
    id: 's2',
    title: 'FOMO Strike',
    description: 'A trusted contact made 400% in 3 months on a crypto token and is urging you to invest now.',
    options: [
      { id: 's2a', text: 'Invest a small "fun money" amount just in case they are right.' },
      { id: 's2b', text: 'Ignore it entirely; if I missed the first 400%, I missed the boat.' },
      { id: 's2c', text: 'Move funds from my safe investments to catch this trend.' },
      { id: 's2d', text: 'Spend the evening researching the token before deciding.' }
    ]
  },
  {
    id: 's3',
    title: 'The Windfall',
    description: 'You unexpectedly receive $500,000 cash today.',
    options: [
      { id: 's3a', text: 'Pay off my mortgage and all other debts immediately.' },
      { id: 's3b', text: 'Invest the entire amount into the S&P 500 today.' },
      { id: 's3c', text: 'Keep it in high-yield savings while I plan for 6 months.' },
      { id: 's3d', text: 'Use $50,000 for a luxury purchase and invest the rest.' }
    ]
  },
]

export const BIAS_METADATA: Record<string, { color: string; icon: string; shortDesc: string }> = {
  loss_aversion: {
    color: '#e05c2c',
    icon: '⚠',
    shortDesc: 'Fear of loss outweighs the desire for gain',
  },
  overconfidence: {
    color: '#e5a82e',
    icon: '◈',
    shortDesc: 'Overestimating your predictive ability',
  },
  recency_bias: {
    color: '#4c7aed',
    icon: '↻',
    shortDesc: 'Weighting recent events too heavily',
  },
  mental_accounting: {
    color: '#8b5cf6',
    icon: '⊞',
    shortDesc: 'Treating money differently based on origin',
  },
  status_quo_bias: {
    color: '#10b981',
    icon: '⊙',
    shortDesc: 'Preferring inaction over change',
  },
  herding: {
    color: '#ec4899',
    icon: '⋯',
    shortDesc: 'Following the crowd instead of your thesis',
  },
  anchoring: {
    color: '#06b6d4',
    icon: '⚓',
    shortDesc: 'Over-relying on the first number you heard',
  },
  confirmation_bias: {
    color: '#f97316',
    icon: '◉',
    shortDesc: 'Seeking info that confirms your beliefs',
  },
}

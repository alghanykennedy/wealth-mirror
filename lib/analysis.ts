import { ASSESSMENT_QUESTIONS, WealthProfile, BiasScore, BIAS_METADATA } from './types'

export function calculateLocalProfile(answers: Record<string, string>): WealthProfile {
  const biasScores: Record<string, number> = {
    loss_aversion: 0,
    overconfidence: 0,
    recency_bias: 0,
    mental_accounting: 0,
    status_quo_bias: 0,
    herding: 0,
    anchoring: 0,
    confirmation_bias: 0,
  }

  // Calculate scores based on weights
  Object.entries(answers).forEach(([qId, oId]) => {
    const question = ASSESSMENT_QUESTIONS.find((q) => q.id === qId)
    const option = question?.options.find((o) => o.id === oId)
    if (option) {
      Object.entries(option.weights).forEach(([bias, weight]) => {
        if (bias in biasScores) {
          biasScores[bias] += weight
        }
      })
    }
  })

  // Normalize scores to 0-100
  const biases: BiasScore[] = Object.entries(biasScores).map(([key, score]) => {
    const metadata = BIAS_METADATA[key]
    const normalizedScore = Math.min(Math.max(score, 0), 100)
    
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
    if (normalizedScore > 75) severity = 'critical'
    else if (normalizedScore > 50) severity = 'high'
    else if (normalizedScore > 25) severity = 'medium'

    return {
      name: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      key,
      score: normalizedScore,
      severity,
      description: metadata.shortDesc,
      evidence: "Based on your selected patterns.",
      interventions: [
        "Create a pre-trade checklist to counter this bias.",
        "Set automated rules for entry and exit.",
        "Review this decision with a neutral peer."
      ],
      color: metadata.color
    }
  })

  // Sort by score
  biases.sort((a, b) => b.score - a.score)
  const dominant = biases[0]

  return {
    dominantBias: dominant.key,
    summary: `Your profile indicates a primary tendency towards ${dominant.name.toLowerCase()}. This shapes how you perceive risk and opportunity in the markets.`,
    archetype: "The Pattern Seeker",
    archetypeDescription: "You look for structure in market movements, which can lead to both disciplined execution and specific cognitive blind spots.",
    biases,
    overallRiskScore: Math.round(biases.reduce((acc, b) => acc + b.score, 0) / biases.length),
    keyInsight: `Your ${dominant.name.toLowerCase()} is currently your most significant behavioral driver.`,
    strengths: ["Disciplined approach", "Awareness of market cycles"]
  }
}

import type { WealthProfile, ScenarioResult } from './types'
import { ASSESSMENT_QUESTIONS } from './types'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const MODEL = "anthropic/claude-3.7-sonnet"

const BIAS_ANALYSIS_SYSTEM = `You are WealthMirror's behavioral finance AI engine. You will receive a set of multiple-choice answers from a wealth psychology assessment. Your role is to analyze these selections, identify cognitive biases, and generate a comprehensive psychological profile.

BIAS DICTIONARY (detect these 8 biases):
1. loss_aversion
2. overconfidence
3. recency_bias
4. mental_accounting
5. status_quo_bias
6. herding
7. anchoring
8. confirmation_bias

OUTPUT FORMAT: Respond ONLY with a valid JSON object. Do not include markdown code fences.

{
  "dominantBias": "string — the single most prominent bias key",
  "summary": "string — 2-3 sentence narrative about the user's psychological wealth profile",
  "archetype": "string — a memorable 3-word archetype title like 'The Fearful Protector'",
  "archetypeDescription": "string — 1 sentence description of this archetype's core pattern",
  "biases": [
    {
      "name": "Human readable name",
      "key": "snake_case_key",
      "score": 0,
      "severity": "low|medium|high|critical",
      "description": "1 sentence about what this bias looks like for this person specifically",
      "evidence": "brief explanation of why their choices suggest this bias",
      "interventions": ["tactic 1", "tactic 2", "tactic 3"],
      "color": "#hexcolor"
    }
  ],
  "overallRiskScore": 0,
  "keyInsight": "string — the single most important thing this person needs to understand about themselves",
  "strengths": ["strength 1", "strength 2"]
}

Color map:
loss_aversion: #e05c2c, overconfidence: #e5a82e, recency_bias: #4c7aed, mental_accounting: #8b5cf6, status_quo_bias: #10b981, herding: #ec4899, anchoring: #06b6d4, confirmation_bias: #f97316`

const SCENARIO_SYSTEM = `You are WealthMirror's real-time bias detection engine. Given a financial scenario and a user's reaction, identify which cognitive biases are present.

OUTPUT FORMAT: Respond ONLY with valid JSON.`

async function openRouterRequest(system: string, user: string) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://wealthmirror.vercel.app",
      "X-Title": "WealthMirror",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenRouter API error")
  }

  return data.choices[0].message.content
}

export async function analyzeWealthProfile(
  answers: Record<string, string>
): Promise<WealthProfile> {
  const userContent = Object.entries(answers)
    .map(([qId, oId]) => {
      const q = ASSESSMENT_QUESTIONS.find(aq => aq.id === qId)
      const o = q?.options.find(ao => ao.id === oId)
      return `Question: ${q?.text}\nUser selected: ${o?.text}`
    })
    .join('\n\n')

  const content = await openRouterRequest(BIAS_ANALYSIS_SYSTEM, `Analyze these assessment results:\n\n${userContent}`)
  const cleaned = content.replace(/```json|```/g, '').trim()
  
  try {
    return JSON.parse(cleaned) as WealthProfile
  } catch {
    throw new Error(`Failed to parse AI response: ${cleaned.substring(0, 200)}`)
  }
}

export async function analyzeScenario(
  scenario: string,
  userResponse: string
): Promise<ScenarioResult> {
  const userPrompt = `Scenario: ${scenario}\n\nUser's response: ${userResponse}\n\nReturn JSON with: biasesDetected (name, evidence)[], realtimeInsight (string), recommendation (string)`
  
  const content = await openRouterRequest(SCENARIO_SYSTEM, userPrompt)
  const cleaned = content.replace(/```json|```/g, '').trim()

  try {
    const result = JSON.parse(cleaned)
    return { scenario, ...result } as ScenarioResult
  } catch {
    throw new Error(`Failed to parse scenario response: ${cleaned.substring(0, 200)}`)
  }
}

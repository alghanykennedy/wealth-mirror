'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts'
import type { WealthProfile, BiasScore } from '@/lib/types'
import { SCENARIOS } from '@/lib/types'
import { WealthMirrorLogo } from '@/components/Logo'

export default function ReportPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<WealthProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'biases' | 'scenarios'>('profile')
  const [activeBias, setActiveBias] = useState<BiasScore | null>(null)
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [selectedScenarioOption, setSelectedScenarioOption] = useState<string | null>(null)
  const [scenarioResult, setScenarioResult] = useState<{
    biasesDetected: { name: string; evidence: string }[]
    realtimeInsight: string
    recommendation: string
  } | null>(null)
  const [scenarioLoading, setScenarioLoading] = useState(false)
  const [scenarioError, setScenarioError] = useState('')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('wm_profile')
    if (!stored) {
      router.push('/assessment')
      return
    }
    try {
      const p = JSON.parse(stored) as WealthProfile
      setProfile(p)
      if (p.biases?.length > 0) setActiveBias(p.biases[0])
      setTimeout(() => setRevealed(true), 100)
    } catch {
      router.push('/assessment')
    }
  }, [router])

  const handleScenario = async () => {
    if (!selectedScenarioOption) return
    setScenarioLoading(true)
    setScenarioError('')
    
    const scenario = SCENARIOS[scenarioIdx]
    const option = scenario.options.find(o => o.id === selectedScenarioOption)

    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenario.description,
          userResponse: option?.text
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setScenarioResult(data.result)
    } catch (err: unknown) {
      setScenarioError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setScenarioLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
        <div className="w-8 h-8 border border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  const radarData = profile.biases.map((b) => ({
    subject: b.name.split(' ').slice(0, 2).join(' '),
    score: b.score,
    fullMark: 100,
  }))

  const getSeverityColor = (s: string) => {
    if (s === 'critical') return '#e05c2c'
    if (s === 'high') return '#e5a82e'
    if (s === 'medium') return '#4c7aed'
    return '#10b981'
  }

  const getSeverityLabel = (s: string) => {
    if (s === 'critical') return 'Critical'
    if (s === 'high') return 'High'
    if (s === 'medium') return 'Moderate'
    return 'Low'
  }

  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
            <WealthMirrorLogo size={22} />
            <span className="text-sm font-display">WealthMirror</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-white/20 text-xs hidden sm:block">Wealth Psychology Report</span>
            <Link
              href="/assessment"
              className="px-4 py-2 border border-white/10 text-white/40 rounded-full hover:border-gold-500/30 hover:text-gold-400 transition-all text-xs"
            >
              Retake
            </Link>
          </div>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto px-6 py-10 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Hero stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Archetype card */}
          <div className="md:col-span-2 glass-gold rounded-2xl p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-gold-500/50 text-xs font-mono uppercase tracking-widest mb-2">Your archetype</div>
                <h1 className="font-display text-3xl md:text-4xl gold-text mb-3">{profile.archetype}</h1>
                <p className="text-white/50 text-sm leading-relaxed max-w-lg">{profile.archetypeDescription}</p>
              </div>
              <div
                className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: 'rgba(228,168,46,0.08)', border: '1px solid rgba(228,168,46,0.15)' }}
              >
                🪞
              </div>
            </div>
          </div>

          {/* Risk score */}
          <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-white/30 text-xs uppercase tracking-widest mb-4">Behavioral risk score</div>
            <RiskGauge score={profile.overallRiskScore} />
            <div className="text-white/30 text-xs mt-4 max-w-[140px]">
              How much your biases threaten long-term wealth
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-gold-400 text-sm">✦</span>
            </div>
            <div>
              <div className="text-white/30 text-xs uppercase tracking-widest mb-2">Key insight</div>
              <p className="text-white/75 leading-relaxed">{profile.keyInsight}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-obsidian-800/40 rounded-xl p-1 w-fit">
          {(['profile', 'biases', 'scenarios'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-lg text-sm transition-all duration-200 capitalize"
              style={{
                background: activeTab === tab ? 'rgba(228,168,46,0.1)' : 'transparent',
                color: activeTab === tab ? '#e5a82e' : 'rgba(255,255,255,0.3)',
                border: activeTab === tab ? '1px solid rgba(228,168,46,0.2)' : '1px solid transparent',
              }}
            >
              {tab === 'scenarios' ? 'Stress test' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* TAB: Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar chart */}
            <div className="glass rounded-2xl p-6">
              <div className="text-white/30 text-xs uppercase tracking-widest mb-6">Bias radar</div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                  />
                  <Radar
                    name="Bias Score"
                    dataKey="score"
                    stroke="#e5a82e"
                    fill="#e5a82e"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#13131a',
                      border: '1px solid rgba(228,168,46,0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bias bars */}
            <div className="glass rounded-2xl p-6">
              <div className="text-white/30 text-xs uppercase tracking-widest mb-6">Bias breakdown</div>
              <div className="space-y-4">
                {profile.biases
                  .sort((a, b) => b.score - a.score)
                  .map((bias) => (
                    <button
                      key={bias.key}
                      onClick={() => {
                        setActiveBias(bias)
                        setActiveTab('biases')
                      }}
                      className="w-full group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors text-left">{bias.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${getSeverityColor(bias.severity)}18`,
                              color: getSeverityColor(bias.severity),
                            }}
                          >
                            {getSeverityLabel(bias.severity)}
                          </span>
                          <span className="text-white/30 text-xs font-mono w-6 text-right">{bias.score}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${bias.score}%`, background: bias.color || getSeverityColor(bias.severity) }}
                        />
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Strengths */}
            {profile.strengths?.length > 0 && (
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <div className="text-white/30 text-xs uppercase tracking-widest mb-5">Your strengths</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                      <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <polyline points="1.5,4 3,5.5 6.5,2" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Biases deep dive */}
        {activeTab === 'biases' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bias list */}
            <div className="space-y-2">
              {profile.biases.sort((a, b) => b.score - a.score).map((bias) => (
                <button
                  key={bias.key}
                  onClick={() => setActiveBias(bias)}
                  className="w-full text-left p-4 rounded-xl border transition-all duration-200"
                  style={{
                    background: activeBias?.key === bias.key ? `${bias.color || '#e5a82e'}10` : 'rgba(255,255,255,0.02)',
                    borderColor: activeBias?.key === bias.key ? `${bias.color || '#e5a82e'}30` : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: activeBias?.key === bias.key ? bias.color : 'rgba(255,255,255,0.6)' }}>
                      {bias.name}
                    </span>
                    <span className="font-mono text-xs text-white/30">{bias.score}</span>
                  </div>
                  <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bias.score}%`, background: bias.color }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Bias detail */}
            {activeBias && (
              <div className="lg:col-span-2 space-y-4">
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: `${activeBias.color}08`,
                    border: `1px solid ${activeBias.color}20`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-2xl" style={{ color: activeBias.color }}>
                      {activeBias.name}
                    </h3>
                    <div
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${activeBias.color}15`,
                        color: activeBias.color,
                      }}
                    >
                      Score: {activeBias.score} / 100
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{activeBias.description}</p>
                </div>

                <div className="glass rounded-2xl p-6">
                  <div className="text-white/30 text-xs uppercase tracking-widest mb-4">Your 3 personalized interventions</div>
                  <div className="space-y-3">
                    {activeBias.interventions?.map((iv, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono"
                          style={{ background: `${activeBias.color}15`, color: activeBias.color }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-white/65 text-sm leading-relaxed">{iv}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Scenario stress test */}
        {activeTab === 'scenarios' && (
          <div className="max-w-2xl">
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              React to a real market scenario. Choose the response that best matches your instinct to see potential bias signals in real-time.
            </p>

            {/* Scenario selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScenarioIdx(i)
                    setSelectedScenarioOption(null)
                    setScenarioResult(null)
                    setScenarioError('')
                  }}
                  className="px-4 py-2 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: scenarioIdx === i ? 'rgba(228,168,46,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${scenarioIdx === i ? 'rgba(228,168,46,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    color: scenarioIdx === i ? '#e5a82e' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="glass-gold rounded-2xl p-6 mb-6">
              <div className="text-gold-500/60 text-xs uppercase tracking-widest mb-2">Scenario</div>
              <p className="text-white/70 leading-relaxed">{SCENARIOS[scenarioIdx].description}</p>
            </div>

            <div className="space-y-3 mb-6">
              {SCENARIOS[scenarioIdx].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedScenarioOption(option.id)
                    setScenarioResult(null)
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedScenarioOption === option.id
                      ? 'bg-gold-500/10 border-gold-500/30 text-white'
                      : 'bg-white/2 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedScenarioOption === option.id ? 'border-gold-500' : 'border-white/20'
                    }`}>
                      {selectedScenarioOption === option.id && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                    </div>
                    <span className="text-sm">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {scenarioError && <p className="text-red-400/60 text-xs mb-4">{scenarioError}</p>}

            <button
              onClick={handleScenario}
              disabled={scenarioLoading || !selectedScenarioOption}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-obsidian-950 font-medium rounded-full hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm mb-8"
            >
              {scenarioLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border border-obsidian-950/40 border-t-obsidian-950 rounded-full animate-spin" />
                  Analyzing response…
                </>
              ) : (
                <>Analyze my response</>
              )}
            </button>

            {scenarioResult && (
              <div className="space-y-4 animate-fade-up">
                <div className="glass rounded-2xl p-6">
                  <div className="text-white/30 text-xs uppercase tracking-widest mb-4">Biases detected in this response</div>
                  {scenarioResult.biasesDetected.length > 0 ? (
                    <div className="space-y-3">
                      {scenarioResult.biasesDetected.map((b, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/2 border border-white/5">
                          <div className="text-gold-400 text-sm font-medium mb-1.5">{b.name}</div>
                          <p className="text-white/45 text-sm italic">&quot;{b.evidence}&quot;</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400/70 text-sm">No strong bias signals detected — well done.</p>
                  )}
                </div>

                <div className="glass rounded-2xl p-6">
                  <div className="text-white/30 text-xs uppercase tracking-widest mb-3">Real-time insight</div>
                  <p className="text-white/65 text-sm leading-relaxed">{scenarioResult.realtimeInsight}</p>
                </div>

                <div
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(228,168,46,0.05)', border: '1px solid rgba(228,168,46,0.15)' }}
                >
                  <div className="text-gold-500/60 text-xs uppercase tracking-widest mb-3">Recommended action</div>
                  <p className="text-white/70 text-sm leading-relaxed">{scenarioResult.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <WealthMirrorLogo size={16} />
            <span>WealthMirror · Behavioral Finance Analysis</span>
          </div>
          <div className="flex items-center gap-4 text-white/15 text-xs">
            <span>Not financial advice</span>
            <Link href="/assessment" className="hover:text-gold-500/50 transition-colors">
              Retake assessment →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function RiskGauge({ score }: { score: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75 // 270deg arc
  const offset = arc - (score / 100) * arc
  const color = score >= 70 ? '#e05c2c' : score >= 50 ? '#e5a82e' : score >= 30 ? '#4c7aed' : '#10b981'

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circ - arc}`}
        />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${arc - offset} ${circ - (arc - offset)}`}
          style={{ transition: 'stroke-dasharray 1.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl" style={{ color }}>{score}</span>
        <span className="text-white/25 text-xs">/ 100</span>
      </div>
    </div>
  )
}


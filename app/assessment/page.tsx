'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ASSESSMENT_QUESTIONS } from '@/lib/types'

export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0 = intro, 1-5 = questions, 6 = loading
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(0)

  const LOADING_MESSAGES = [
    'Analyzing your behavioral patterns…',
    'Calculating bias coefficients…',
    'Mapping cognitive signatures…',
    'Building your wealth profile…',
    'Finalizing interventions…',
  ]

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length)
      }, 2200)
      return () => clearInterval(interval)
    }
  }, [isSubmitting])

  const questionIndex = step - 1
  const question = ASSESSMENT_QUESTIONS[questionIndex]
  const progress = step === 0 ? 0 : (step / ASSESSMENT_QUESTIONS.length) * 100

  const handleSelect = (optionId: string) => {
    setError('')
    const newAnswers = { ...answers, [question.id]: optionId }
    setAnswers(newAnswers)

    if (step < ASSESSMENT_QUESTIONS.length) {
      // Small delay for visual feedback of selection
      setTimeout(() => setStep(step + 1), 300)
    } else {
      handleSubmit(newAnswers)
    }
  }

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true)
    setStep(6)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      sessionStorage.setItem('wm_profile', JSON.stringify(data.profile))
      router.push('/report')
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
      setStep(ASSESSMENT_QUESTIONS.length)
    }
  }

  // Loading screen
  if (step === 6 && isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-obsidian-950">
        <div className="text-center max-w-md">
          <div className="relative w-24 h-24 mx-auto mb-12">
            <svg
              className="w-full h-full animate-spin-slow"
              viewBox="0 0 96 96"
              fill="none"
            >
              <circle cx="48" cy="48" r="44" stroke="#e5a82e" strokeWidth="0.5" strokeOpacity="0.2" />
              <circle
                cx="48" cy="48" r="44"
                stroke="#e5a82e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="120 160"
                strokeDashoffset="0"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <WealthMirrorLogo size={36} />
            </div>
          </div>
          <div className="text-white/60 text-sm h-6 transition-all duration-500">
            {LOADING_MESSAGES[loadingMsg]}
          </div>
          <div className="mt-8 flex gap-1 justify-center">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-all duration-300"
                style={{ background: i === loadingMsg ? '#e5a82e' : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Intro screen
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col px-6 bg-obsidian-950">
        <nav className="flex items-center justify-between py-6 max-w-3xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
            <WealthMirrorLogo size={24} />
            <span className="text-sm font-display">WealthMirror</span>
          </Link>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center">
          <div
            className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center mx-auto mb-8 animate-fade-in"
          >
            <WealthMirrorLogo size={32} />
          </div>
          <h1
            className="font-display text-4xl md:text-5xl text-white/90 mb-6 leading-tight animate-fade-up"
          >
            Your wealth psychology<br />assessment
          </h1>
          <p
            className="text-white/40 leading-relaxed mb-10 text-base animate-fade-up"
            style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
          >
            A series of 5 questions to map your behavioral profile. 
            Choose the response that most honestly reflects your instinct.
          </p>

          <div
            className="grid grid-cols-3 gap-4 w-full mb-10 animate-fade-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}
          >
            {[
              { label: '5', sublabel: 'questions' },
              { label: '2 min', sublabel: 'time' },
              { label: '8', sublabel: 'biases analyzed' },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl py-4 text-center">
                <div className="font-display text-xl gold-text">{item.label}</div>
                <div className="text-white/25 text-xs mt-1">{item.sublabel}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="px-10 py-4 bg-gold-500 text-obsidian-950 font-medium rounded-full hover:bg-gold-400 transition-all duration-200 glow-gold animate-fade-up"
            style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Begin assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-950">
      <div className="h-px bg-white/5 relative">
        <div
          className="h-full bg-gold-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
          <WealthMirrorLogo size={22} />
        </Link>
        <span className="text-white/25 text-xs font-mono">{step} / {ASSESSMENT_QUESTIONS.length}</span>
      </nav>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6 py-8">
        <div className="mb-2">
          <span className="text-xs font-mono text-gold-500/50 uppercase tracking-widest">
            Question {step}
          </span>
        </div>

        <h2
          key={step}
          className="font-display text-2xl md:text-3xl text-white/90 mb-3 leading-snug animate-fade-up"
        >
          {question?.text}
        </h2>

        <p className="text-white/25 text-sm mb-10 leading-relaxed">{question?.hint}</p>

        <div className="space-y-3">
          {question?.options.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full text-left p-5 rounded-2xl bg-obsidian-800/40 border border-white/5 hover:border-gold-500/30 hover:bg-obsidian-800/60 transition-all duration-200 group animate-fade-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-gold-500/40 group-hover:text-gold-500 transition-colors text-xs font-mono">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-8 text-red-400/70 text-sm text-center">{error}</p>
        )}

        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-12 mx-auto text-white/20 hover:text-white/40 transition-colors text-xs flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous question
          </button>
        )}
      </div>
    </div>
  )
}

function WealthMirrorLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="20" cy="20" r="12" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="20" cy="20" r="6" fill="#e5a82e" fillOpacity="0.15" />
      <circle cx="20" cy="20" r="3" fill="#e5a82e" fillOpacity="0.8" />
      <line x1="20" y1="2" x2="20" y2="7" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="20" y1="33" x2="20" y2="38" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="2" y1="20" x2="7" y2="20" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="33" y1="20" x2="38" y2="20" stroke="#e5a82e" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
    </svg>
  )
}

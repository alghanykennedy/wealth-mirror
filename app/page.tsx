'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { WealthMirrorLogo } from '@/components/Logo'

const BIASES = [
  'Loss Aversion', 'Overconfidence', 'Recency Bias',
  'Mental Accounting', 'Status Quo Bias', 'Herding',
  'Anchoring', 'Confirmation Bias',
]

const STATS = [
  { value: '87%', label: 'of investors underperform due to behavioral biases' },
  { value: '2.4×', label: 'more pain from losses than pleasure from equivalent gains' },
  { value: '$1.4T', label: 'in annual wealth erosion attributed to poor behavioral decisions' },
]

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const draw = () => {
      ctx.clearRect(0, 0, W(), H())
      t += 0.004

      // Draw concentric ripple rings
      const cx = W() / 2
      const cy = H() / 2
      const maxR = Math.min(W(), H()) * 0.45

      for (let i = 0; i < 6; i++) {
        const phase = (t + i * 0.3) % (Math.PI * 2)
        const r = maxR * (0.3 + 0.7 * (i / 6)) + Math.sin(phase) * 8
        const alpha = 0.04 + 0.03 * Math.sin(phase + i)

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(228, 168, 46, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Floating particles
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.3
        const radius = maxR * (0.5 + 0.4 * Math.sin(t * 0.7 + i))
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius
        const size = 1.5 + Math.sin(t + i) * 0.8
        const alpha = 0.3 + 0.3 * Math.sin(t * 1.2 + i)

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(228, 168, 46, ${alpha})`
        ctx.fill()
      }

      // Center orb
      const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60)
      orbGrad.addColorStop(0, 'rgba(228, 168, 46, 0.08)')
      orbGrad.addColorStop(1, 'rgba(228, 168, 46, 0)')
      ctx.beginPath()
      ctx.arc(cx, cy, 60 + Math.sin(t) * 5, 0, Math.PI * 2)
      ctx.fillStyle = orbGrad
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Background grid */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(228,168,46,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(228,168,46,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <WealthMirrorLogo size={36} />
          <span className="font-display text-lg tracking-wide">WealthMirror</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <span className="hidden md:block">Behavioral Finance Intelligence</span>
          <Link
            href="/assessment"
            className="px-5 py-2 border border-gold-500/30 text-gold-400 rounded-full hover:bg-gold-500/10 transition-all duration-200 text-sm"
          >
            Take the Assessment
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-8">
        {/* Canvas background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse-slow" />
            AI-Powered Behavioral Finance Profiler
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 animate-fade-up">
            <span className="text-white/90">Know how your</span>
            <br />
            <span className="gold-text">mind handles</span>
            <br />
            <span className="text-white/90">money.</span>
          </h1>

          <p
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-up"
            style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Before any market does it for you. WealthMirror uses AI to surface the cognitive biases
            silently shaping your financial decisions — and gives you the tools to rewrite the pattern.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <Link
              href="/assessment"
              className="group relative px-8 py-4 bg-gold-500 text-obsidian-950 font-medium rounded-full hover:bg-gold-400 transition-all duration-200 text-base glow-gold"
            >
              <span className="relative z-10">Reveal Your Wealth Psychology</span>
            </Link>
            <span className="text-white/25 text-sm">5 questions · 8 minutes · No financial data needed</span>
          </div>
        </div>

        {/* Floating bias tags */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {BIASES.map((bias, i) => {
            const positions = [
              'top-[20%] left-[5%]', 'top-[15%] right-[8%]',
              'top-[40%] left-[2%]', 'top-[45%] right-[3%]',
              'top-[65%] left-[6%]', 'top-[70%] right-[7%]',
              'bottom-[20%] left-[12%]', 'bottom-[25%] right-[10%]',
            ]
            return (
              <div
                key={bias}
                className={`absolute ${positions[i]} hidden lg:block text-xs text-white/15 border border-white/8 px-3 py-1.5 rounded-full glass animate-fade-in`}
                style={{ animationDelay: `${0.4 + i * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                {bias}
              </div>
            )
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-8 text-center animate-fade-up"
              style={{ animationDelay: `${0.1 * i}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="font-display text-4xl gold-text mb-3">{stat.value}</div>
              <div className="text-white/40 text-sm leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-white/90 mb-4">
              How WealthMirror works
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">
              No portfolio data. No account linking. Just your words — and AI that reads between the lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Answer 5 open questions',
                desc: 'Write about real financial decisions, fears, and reactions. The AI reads your language patterns, not just your answers.',
                icon: '✦',
              },
              {
                step: '02',
                title: 'AI maps your bias profile',
                desc: 'Behavioral finance models score 8 cognitive biases based on how you actually think and talk about money.',
                icon: '◈',
              },
              {
                step: '03',
                title: 'Get your wealth psychology report',
                desc: 'A personalized profile with your archetype, bias radar chart, and 3 specific interventions per bias.',
                icon: '⊙',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group glass rounded-2xl p-8 hover:border-gold-500/20 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 * i}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-gold-500/50 text-xs font-mono">{item.step}</span>
                  <div className="h-px flex-1 bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors" />
                  <span className="text-gold-400 text-lg">{item.icon}</span>
                </div>
                <h3 className="font-display text-xl text-white/85 mb-3">{item.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bias preview */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-10 md:p-14 glass-gold">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-gold-500/60 text-xs font-mono uppercase tracking-widest mb-4">
                  Sample Profile
                </div>
                <h2 className="font-display text-4xl text-white/90 mb-6 leading-tight">
                  Meet "The Fearful Protector"
                </h2>
                <p className="text-white/40 leading-relaxed mb-8 text-sm">
                  Your fear of loss is 2.4× stronger than your desire for gain. You likely exited positions
                  early in Q4 not because of analysis — but because your brain classified paper losses
                  as existential threats.
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Loss Aversion', score: 82, color: '#e05c2c' },
                    { label: 'Status Quo Bias', score: 67, color: '#10b981' },
                    { label: 'Recency Bias', score: 54, color: '#4c7aed' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-4">
                      <span className="text-white/40 text-xs w-28 shrink-0">{b.label}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${b.score}%`, background: b.color }}
                        />
                      </div>
                      <span className="text-white/30 text-xs w-8 text-right">{b.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    title: 'Key intervention',
                    text: 'Before selling any position, write down the specific catalyst that changed your thesis — not how the price made you feel.',
                    color: '#e05c2c',
                  },
                  {
                    title: 'Hidden strength',
                    text: 'Your caution protects capital during euphoric markets. The challenge is deploying that capital when fear peaks.',
                    color: '#e5a82e',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl p-5 border"
                    style={{
                      background: `${card.color}08`,
                      borderColor: `${card.color}20`,
                    }}
                  >
                    <div className="text-xs font-medium mb-2" style={{ color: card.color }}>
                      {card.title}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <WealthMirrorLogo size={64} className="mx-auto mb-8 opacity-60" />
          <h2 className="font-display text-5xl text-white/90 mb-6 leading-tight">
            The market already<br />knows your weaknesses.
          </h2>
          <p className="text-white/35 mb-10 leading-relaxed">
            Your biases are systematic. Your interventions can be too.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gold-500 text-obsidian-950 font-medium rounded-full hover:bg-gold-400 transition-all duration-200 text-base glow-gold"
          >
            Start your free assessment
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="text-white/20 text-xs mt-4">No account required · No financial data needed · 8 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/20 text-xs">
        <div className="flex items-center gap-2">
          <WealthMirrorLogo size={18} />
          <span>WealthMirror</span>
        </div>
        <span>AI-powered · Not financial advice · For educational purposes</span>
      </footer>
    </main>
  )
}


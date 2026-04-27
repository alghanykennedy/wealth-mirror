# WealthMirror 🪞

**AI-powered behavioral finance profiler.** Discover the cognitive biases silently shaping your financial decisions — before the market does.

## What it does

WealthMirror uses Claude AI to analyze how users *think and talk* about money, surfacing 8 behavioral finance biases from open-ended responses. Unlike any existing fintech tool, it requires zero financial data — only your words.

**Core features:**
- 5-question behavioral assessment with depth detection
- AI bias scoring across 8 cognitive biases (loss aversion, overconfidence, recency bias, mental accounting, status quo bias, herding, anchoring, confirmation bias)
- Personalized wealth archetype (e.g. "The Fearful Protector")
- Radar chart visualization + bias breakdown with evidence quotes
- 3 personalized, actionable interventions per bias
- Live scenario stress-tester: react to market events, get real-time bias detection

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** — radar chart + bias visualization
- **Anthropic Claude API** (`claude-opus-4-5`) — structured JSON bias analysis
- **Vercel** — deployment

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourusername/wealthmirror
cd wealthmirror
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wealthmirror)

### Manual deploy

```bash
npm install -g vercel
vercel

# Set environment variable in Vercel dashboard:
# ANTHROPIC_API_KEY = your key
```

Or via CLI:
```bash
vercel env add ANTHROPIC_API_KEY
```

## Project structure

```
wealthmirror/
├── app/
│   ├── page.tsx              # Landing page
│   ├── assessment/
│   │   └── page.tsx          # Multi-step assessment
│   ├── report/
│   │   └── page.tsx          # Results + radar chart + scenario tester
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts      # POST /api/analyze — full profile generation
│   │   └── scenario/
│   │       └── route.ts      # POST /api/scenario — live bias detection
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── ai.ts                 # Anthropic API calls + system prompts
│   └── types.ts              # TypeScript types + assessment data
├── vercel.json
└── tailwind.config.ts
```

## AI architecture

Two Claude API calls power the product:

### 1. Full profile analysis (`/api/analyze`)
- Model: `claude-opus-4-5`
- Input: 5 free-text answers
- System prompt: Behavioral finance expert with structured JSON output schema
- Output: Complete `WealthProfile` with bias scores, archetype, interventions, key insight

### 2. Scenario stress test (`/api/scenario`)
- Model: `claude-opus-4-5`
- Input: Market scenario + user's real-time response
- System prompt: Bias detection engine focused on in-the-moment language patterns
- Output: Detected biases with evidence, insight, recommendation

Both endpoints use structured JSON prompting — no parsing required beyond `JSON.parse()`.

## Why this is different

Every fintech app asks what you *have*. WealthMirror asks who you *are*.

The behavioral finance market is enormous (biases cost investors an estimated $1.4T annually) but has never been addressed with AI-native, language-based profiling. This product is category-defining.

---

Built with Claude AI · Not financial advice · Educational purposes only

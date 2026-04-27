import { NextRequest, NextResponse } from 'next/server'
import { analyzeScenario } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { scenario, userResponse } = await req.json()

    if (!scenario || !userResponse || userResponse.trim().length < 15) {
      return NextResponse.json(
        { error: 'Please provide a more detailed response' },
        { status: 400 }
      )
    }

    const result = await analyzeScenario(scenario, userResponse)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Scenario error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { analyzeWealthProfile } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length < 3) {
      return NextResponse.json({ error: 'Please answer at least 3 questions' }, { status: 400 })
    }

    const profile = await analyzeWealthProfile(answers)
    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Analysis error details:', error)
    return NextResponse.json(
      { error: `Analysis failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

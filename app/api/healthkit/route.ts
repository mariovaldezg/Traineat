import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { format, differenceInDays } from 'date-fns'
import { PLAN_START } from '@/lib/plan'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const date = body.date || format(new Date(), 'yyyy-MM-dd')
    const diff = differenceInDays(new Date(date), PLAN_START)
    const weekNumber = Math.min(Math.max(Math.floor(diff / 7) + 1, 1), 21)

    const typeMap: Record<string, string> = {
      'Running': 'run',
      'Cycling': 'bike',
      'Swimming': 'swim',
      'FunctionalStrengthTraining': 'gym',
      'TraditionalStrengthTraining': 'gym',
    }

    const payload = {
      date,
      week_number: weekNumber,
      day_name: format(new Date(date), 'EEEE'),
      session_type: typeMap[body.workout_type] || 'run',
      completed: true,
      duration_min: body.duration_min ? Math.round(body.duration_min) : null,
      distance_km: body.distance_km ? Math.round(body.distance_km * 10) / 10 : null,
      avg_hr: body.avg_hr ? Math.round(body.avg_hr) : null,
      max_hr: body.max_hr ? Math.round(body.max_hr) : null,
      calories: body.calories ? Math.round(body.calories) : null,
      avg_watts: body.avg_watts ? Math.round(body.avg_watts) : null,
      source: 'healthkit',
      notes: `Auto-importado desde Apple Watch · ${body.workout_type || 'workout'}`,
    }

    const { error } = await supabase.from('workout_logs').insert(payload)
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ success: true, data: payload })
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'HealthKit endpoint active ✓', method: 'POST' })
}

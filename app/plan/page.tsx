'use client'
import { useState } from 'react'
import { PLAN, SESSION_COLORS, PHASE_COLORS } from '@/lib/plan'
import { differenceInDays } from 'date-fns'
import { PLAN_START } from '@/lib/plan'

function getCurrentWeek() {
  const diff = differenceInDays(new Date(), PLAN_START)
  return Math.min(Math.max(Math.floor(diff / 7) + 1, 1), 21)
}

const phaseLabels = { base: 'Base & Fuerza', build: 'Build Triatlón', peak: 'Peak', taper: 'Taper' }
const phases = ['base', 'build', 'peak', 'taper'] as const

export default function PlanPage() {
  const currentWeek = getCurrentWeek()
  const [selectedPhase, setSelectedPhase] = useState<typeof phases[number]>('base')
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)

  const phaseWeeks = PLAN.filter(w => w.phase === selectedPhase)
  const weekPlan = PLAN.find(w => w.week === selectedWeek)

  const phaseColors: Record<string, string> = {
    base: 'bg-purple-100 text-purple-700 border-purple-200',
    build: 'bg-teal-light text-teal-dark border-teal',
    peak: 'bg-amber-100 text-amber-700 border-amber-200',
    taper: 'bg-coral-light text-coral-dark border-coral',
  }
  const activePhaseBg: Record<string, string> = {
    base: 'bg-purple-600 text-white',
    build: 'bg-teal text-white',
    peak: 'bg-amber-600 text-white',
    taper: 'bg-coral text-white',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Plan 21 semanas</h1>
        <p className="text-gray-400 text-sm mt-1">Ironman 70.3 Waco · 4 octubre 2026</p>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {phases.map(p => (
          <button key={p} onClick={() => { setSelectedPhase(p); setSelectedWeek(PLAN.find(w => w.phase === p)!.week) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              selectedPhase === p ? activePhaseBg[p] : `bg-white ${phaseColors[p]}`
            }`}>
            {phaseLabels[p]}
          </button>
        ))}
      </div>

      {/* Week pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {phaseWeeks.map(w => (
          <button key={w.week} onClick={() => setSelectedWeek(w.week)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
              selectedWeek === w.week ? activePhaseBg[selectedPhase] : 'bg-white border border-gray-200 text-gray-600 hover:border-teal'
            } ${w.week === currentWeek ? 'ring-2 ring-teal ring-offset-1' : ''}`}>
            {w.week}
          </button>
        ))}
      </div>

      {/* Week detail */}
      {weekPlan && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">Semana {weekPlan.week} {weekPlan.week === currentWeek ? <span className="ml-2 text-xs bg-teal text-white px-2 py-0.5 rounded-full">actual</span> : ''}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{weekPlan.focus}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${phaseColors[weekPlan.phase]}`}>{phaseLabels[weekPlan.phase]}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {weekPlan.days.map((day, i) => (
              <div key={i} className="flex gap-4 px-5 py-3">
                <div className="w-24 shrink-0 pt-0.5">
                  <span className="text-sm font-medium text-gray-500">{day.day}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {day.sessions.map((s, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${SESSION_COLORS[s.type]}`}>{s.type.toUpperCase()}</span>
                      <span className="text-sm text-gray-700">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

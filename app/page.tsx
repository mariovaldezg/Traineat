'use client'
import { useEffect, useState } from 'react'
import { differenceInDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { PLAN, RACE_DATE, PLAN_START, SESSION_COLORS, MACROS } from '@/lib/plan'
import Link from 'next/link'
import { CheckCircle, Circle, Dumbbell, Apple, Scale } from 'lucide-react'

function getCurrentWeek() {
  const diff = differenceInDays(new Date(), PLAN_START)
  return Math.min(Math.max(Math.floor(diff / 7) + 1, 1), 21)
}

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([])
  const [nutrition, setNutrition] = useState<any>(null)
  const [lastInbody, setLastInbody] = useState<any>(null)
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const daysLeft = differenceInDays(RACE_DATE, today)
  const currentWeek = getCurrentWeek()
  const weekPlan = PLAN.find(w => w.week === currentWeek)
  const todayName = format(today, 'EEEE', { locale: es })
  const todayName2 = todayName.charAt(0).toUpperCase() + todayName.slice(1)
  const todayPlan = weekPlan?.days.find(d =>
    d.day.toLowerCase() === todayName2.toLowerCase() ||
    d.day.toLowerCase().startsWith(todayName2.toLowerCase().slice(0, 3))
  )

  useEffect(() => {
    supabase.from('workout_logs').select('*').eq('date', todayStr).then(({ data }) => setLogs(data || []))
    supabase.from('nutrition_logs').select('*').eq('date', todayStr).order('created_at', { ascending: false }).limit(1).then(({ data }) => setNutrition(data?.[0] || null))
    supabase.from('inbody_logs').select('*').order('date', { ascending: false }).limit(1).then(({ data }) => setLastInbody(data?.[0] || null))
  }, [todayStr])

  const completedToday = logs.filter(l => l.completed)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Buenos días, Mario 👊</h1>
        <p className="text-gray-400 text-sm mt-1">{format(today, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Días para Waco', value: daysLeft, sub: '4 oct 2026', color: 'text-teal' },
          { label: 'Semana actual', value: `${currentWeek}/21`, sub: weekPlan?.phase || '', color: 'text-purple-600' },
          { label: 'Sesiones hoy', value: `${completedToday.length}/${todayPlan?.sessions.length || 0}`, sub: 'completadas', color: 'text-amber-600' },
          { label: 'Peso actual', value: lastInbody ? `${lastInbody.weight_kg} kg` : '—', sub: lastInbody ? `${lastInbody.body_fat_pct}% grasa` : 'Sin datos', color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's plan */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Hoy — Semana {currentWeek}</h2>
            <Link href="/log" className="text-xs text-teal bg-teal-light px-3 py-1.5 rounded-lg">+ Log sesión</Link>
          </div>

          {todayPlan ? (
            <div className="space-y-3">
              {todayPlan.sessions.map((s, i) => {
                const done = logs.some(l => l.session_type === s.type && l.completed)
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    {done ? <CheckCircle size={18} className="text-teal mt-0.5 shrink-0" /> : <Circle size={18} className="text-gray-300 mt-0.5 shrink-0" />}
                    <div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SESSION_COLORS[s.type]}`}>{s.type.toUpperCase()}</span>
                      <p className="text-sm mt-1 text-gray-700">{s.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No hay sesión planificada para hoy</p>
              <p className="text-xs mt-1">Descanso activo o movilidad</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Macros card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Apple size={14} className="text-teal" /> Macros hoy</h3>
              <Link href="/nutrition" className="text-xs text-teal">+ Log</Link>
            </div>
            {nutrition ? (
              <div className="space-y-2">
                {[
                  { label: 'Calorías', val: nutrition.calories, goal: MACROS.calories, unit: 'kcal', color: 'bg-teal' },
                  { label: 'Proteína', val: nutrition.protein_g, goal: MACROS.protein, unit: 'g', color: 'bg-blue-400' },
                  { label: 'Carbos', val: nutrition.carbs_g, goal: MACROS.carbs, unit: 'g', color: 'bg-amber-400' },
                  { label: 'Grasa', val: nutrition.fat_g, goal: MACROS.fat, unit: 'g', color: 'bg-purple-400' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-500">{m.label}</span>
                      <span className="font-medium">{m.val}/{m.goal}{m.unit}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: `${Math.min((m.val/m.goal)*100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">Sin datos hoy</p>
            )}
          </div>

          {/* InBody card */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Scale size={14} className="text-teal" /> InBody</h3>
              <Link href="/inbody" className="text-xs text-teal">+ Agregar</Link>
            </div>
            {lastInbody ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-teal">{lastInbody.weight_kg}</p>
                  <p className="text-xs text-gray-400">kg</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-purple-600">{lastInbody.body_fat_pct}%</p>
                  <p className="text-xs text-gray-400">grasa</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-blue-600">{lastInbody.muscle_mass_kg}</p>
                  <p className="text-xs text-gray-400">kg músculo</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-semibold text-amber-600">{lastInbody.score}</p>
                  <p className="text-xs text-gray-400">score</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">Sin datos InBody</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

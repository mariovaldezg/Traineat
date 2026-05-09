'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts'
import { format, subDays } from 'date-fns'
import { Share2, Download } from 'lucide-react'

export default function ProgressPage() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [inbody, setInbody] = useState<any[]>([])
  const [nutrition, setNutrition] = useState<any[]>([])

  useEffect(() => {
    const d30 = format(subDays(new Date(), 30), 'yyyy-MM-dd')
    supabase.from('workout_logs').select('*').gte('date', d30).eq('completed', true).order('date').then(({ data }) => setWorkouts(data || []))
    supabase.from('inbody_logs').select('*').order('date').then(({ data }) => setInbody(data || []))
    supabase.from('nutrition_logs').select('*').gte('date', d30).order('date').then(({ data }) => setNutrition(data || []))
  }, [])

  const weeklyVolume = workouts.reduce((acc: any, w) => {
    const week = `S${w.week_number}`
    if (!acc[week]) acc[week] = { week, swim: 0, bike: 0, run: 0, gym: 0 }
    if (w.session_type === 'swim') acc[week].swim += w.duration_min || 0
    if (w.session_type === 'bike' || w.session_type === 'brick') acc[week].bike += w.duration_min || 0
    if (w.session_type === 'run') acc[week].run += w.duration_min || 0
    if (w.session_type === 'gym') acc[week].gym += w.duration_min || 0
    return acc
  }, {})

  const volumeData = Object.values(weeklyVolume)
  const hrData = workouts.filter(w => w.avg_hr).map(w => ({ date: w.date.slice(5), hr: w.avg_hr, type: w.session_type }))

  const shareWorkout = () => {
    const lastW = workouts[workouts.length - 1]
    if (!lastW) return
    const text = `💪 Entrenamiento completado!\n🏃 ${lastW.session_type.toUpperCase()} · ${lastW.duration_min} min · ${lastW.distance_km || '—'} km\n❤️ FC: ${lastW.avg_hr || '—'} bpm\n\n#Ironman703 #Waco2026 #TriathlonTraining`
    if (navigator.share) navigator.share({ text })
    else navigator.clipboard.writeText(text)
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Progreso</h1>
          <p className="text-gray-400 text-sm mt-1">Últimos 30 días de entrenamiento</p>
        </div>
        <button onClick={shareWorkout}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white text-sm rounded-xl hover:bg-teal-dark">
          <Share2 size={14} /> Compartir último workout
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Sesiones completadas', value: workouts.length },
          { label: 'Minutos totales', value: workouts.reduce((s, w) => s + (w.duration_min || 0), 0) },
          { label: 'Km totales', value: workouts.reduce((s, w) => s + (w.distance_km || 0), 0).toFixed(1) },
          { label: 'Calorías quemadas', value: workouts.reduce((s, w) => s + (w.calories || 0), 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-teal">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Volume chart */}
      {volumeData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
          <h2 className="font-semibold mb-4 text-sm">Volumen semanal por disciplina (min)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="swim" stackId="a" fill="#378ADD" name="Nado" radius={[0,0,0,0]} />
              <Bar dataKey="bike" stackId="a" fill="#BA7517" name="Bike" />
              <Bar dataKey="run" stackId="a" fill="#1D9E75" name="Run" />
              <Bar dataKey="gym" stackId="a" fill="#7F77DD" name="Gym" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Heart rate trend */}
      {hrData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
          <h2 className="font-semibold mb-4 text-sm">FC promedio por sesión</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hrData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="hr" stroke="#D85A30" strokeWidth={2} dot={{ r: 3 }} name="FC promedio" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* InBody trend */}
      {inbody.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
          <h2 className="font-semibold mb-4 text-sm">Composición corporal</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={inbody} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="weight_kg" stroke="#378ADD" strokeWidth={2} name="Peso (kg)" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="muscle_mass_kg" stroke="#1D9E75" strokeWidth={2} name="Músculo (kg)" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="body_fat_pct" stroke="#D85A30" strokeWidth={2} name="% Grasa" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Protein trend */}
      {nutrition.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold mb-4 text-sm">Proteína diaria (g) · Meta: 160g</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={nutrition} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="protein_g" stroke="#1D9E75" fill="#E1F5EE" strokeWidth={2} name="Proteína (g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {workouts.length === 0 && inbody.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">Aún no hay datos. Empieza a loguear sesiones para ver tu progreso aquí.</p>
        </div>
      )}
    </div>
  )
}

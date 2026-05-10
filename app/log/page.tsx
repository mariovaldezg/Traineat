'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { CheckCircle, Smartphone } from 'lucide-react'

const sessionTypes = ['swim', 'bike', 'run', 'gym', 'brick', 'rest', 'race']
const moods = ['😴', '😐', '🙂', '😄', '🔥']

export default function LogPage() {
  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    week_number: 1,
    day_name: format(new Date(), 'EEEE'),
    session_type: 'run',
    planned: '',
    completed: true,
    duration_min: '',
    distance_km: '',
    avg_hr: '',
    max_hr: '',
    avg_watts: '',
    calories: '',
    rpe: 5,
    mood: 3,
    notes: '',
    source: 'manual',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showHealthkit, setShowHealthkit] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const payload: any = { ...form }
    ;['duration_min','distance_km','avg_hr','max_hr','avg_watts','calories'].forEach(k => {
      if (payload[k] === '') payload[k] = null
      else payload[k] = Number(payload[k])
    })
    await supabase.from('workout_logs').insert(payload)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Log de sesión</h1>
          <p className="text-gray-400 text-sm mt-1">Registra tu entrenamiento manualmente o desde Apple Watch</p>
        </div>
        <button onClick={() => setShowHealthkit(!showHealthkit)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-xl">
          <Smartphone size={14} /> Apple Watch
        </button>
      </div>

      {/* HealthKit instructions */}
      {showHealthkit && (
        <div className="bg-gray-900 text-white rounded-xl p-5 mb-6 text-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2">🍎 Conectar Apple Watch — Shortcut automática</h3>
          <ol className="space-y-2 text-gray-300 list-decimal list-inside">
            <li>Abre la app <strong className="text-white">Atajos (Shortcuts)</strong> en tu iPhone</li>
            <li>Crea un nuevo atajo → "Automatización" → "Entrenamiento"</li>
            <li>Selecciona "Al terminar un entrenamiento"</li>
            <li>Agrega acción: <strong className="text-white">"Obtener detalles de salud"</strong> → Duración, Calorías, FC promedio, FC máxima, Distancia</li>
            <li>Agrega acción: <strong className="text-white">"URL"</strong> → ingresa tu URL de la app + <code className="bg-gray-800 px-1 rounded">/api/healthkit</code></li>
            <li>Agrega acción: <strong className="text-white">"Obtener contenidos de URL"</strong> → Método POST → JSON con los datos del paso 4</li>
            <li>Listo — cada workout registra automáticamente en tu dashboard</li>
          </ol>
          <div className="mt-4 bg-gray-800 rounded-lg p-3 font-mono text-xs text-green-400">
{`POST /api/healthkit
{
  "duration_min": [duración],
  "calories": [calorías],
  "avg_hr": [FC promedio],
  "max_hr": [FC máxima],
  "distance_km": [distancia],
  "workout_type": [tipo],
  "date": [fecha]
}`}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Fecha</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Semana #</label>
            <input type="number" min={1} max={21} value={form.week_number} onChange={e => setForm({...form, week_number: +e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">Tipo de sesión</label>
          <div className="flex flex-wrap gap-2">
            {sessionTypes.map(t => (
              <button key={t} onClick={() => setForm({...form, session_type: t})}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  form.session_type === t ? 'bg-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Sesión planificada</label>
          <input type="text" placeholder="Ej: 5 km Z2 continuo" value={form.planned} onChange={e => setForm({...form, planned: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { key: 'duration_min', label: 'Duración (min)', placeholder: '45' },
            { key: 'distance_km', label: 'Distancia (km)', placeholder: '5.0' },
            { key: 'avg_hr', label: 'FC promedio (bpm)', placeholder: '148' },
            { key: 'max_hr', label: 'FC máxima (bpm)', placeholder: '172' },
            { key: 'avg_watts', label: 'Watts promedio', placeholder: '210' },
            { key: 'calories', label: 'Calorías', placeholder: '450' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
              <input type="number" placeholder={f.placeholder} value={(form as any)[f.key]}
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
        </div>

        {/* RPE */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">Esfuerzo percibido (RPE): {form.rpe}/10</label>
          <input type="range" min={1} max={10} step={1} value={form.rpe}
            onChange={e => setForm({...form, rpe: +e.target.value})}
            className="w-full accent-teal" />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>Muy fácil</span><span>Moderado</span><span>Máximo</span>
          </div>
        </div>

        {/* Mood */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-2">Estado de ánimo</label>
          <div className="flex gap-3">
            {moods.map((m, i) => (
              <button key={i} onClick={() => setForm({...form, mood: i + 1})}
                className={`text-2xl transition-all ${form.mood === i + 1 ? 'scale-125' : 'opacity-40 hover:opacity-70'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="block text-xs text-gray-400 mb-1">Notas</label>
          <textarea rows={3} placeholder="¿Cómo te sentiste? ¿Algo notable?" value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-teal text-white py-3 rounded-xl font-medium text-sm hover:bg-teal-dark transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar sesión'}
          </button>
          {saved && <div className="flex items-center gap-2 text-teal text-sm"><CheckCircle size={16} /> Guardado</div>}
        </div>
      </div>
    </div>
  )
}

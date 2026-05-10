'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format, subDays } from 'date-fns'
import { MACROS } from '@/lib/plan'
import { CheckCircle } from 'lucide-react'

export default function NutritionPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [form, setForm] = useState({ date: today, calories: '', protein_g: '', carbs_g: '', fat_g: '', water_ml: '', notes: '' })
  const [history, setHistory] = useState<any[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const last7 = format(subDays(new Date(), 7), 'yyyy-MM-dd')
    supabase.from('nutrition_logs').select('*').gte('date', last7).order('date', { ascending: false }).then(({ data }) => setHistory(data || []))
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const payload: any = { ...form }
    ;['calories','protein_g','carbs_g','fat_g','water_ml'].forEach(k => {
      payload[k] = payload[k] === '' ? null : Number(payload[k])
    })
    await supabase.from('nutrition_logs').insert(payload)
    setSaved(true)
    setLoading(false)
    setHistory(h => [payload, ...h])
    setTimeout(() => setSaved(false), 3000)
  }

  const macroFields = [
    { key: 'calories', label: 'Calorías', goal: MACROS.calories, unit: 'kcal', color: 'bg-teal' },
    { key: 'protein_g', label: 'Proteína', goal: MACROS.protein, unit: 'g', color: 'bg-blue-400' },
    { key: 'carbs_g', label: 'Carbohidratos', goal: MACROS.carbs, unit: 'g', color: 'bg-amber-400' },
    { key: 'fat_g', label: 'Grasa', goal: MACROS.fat, unit: 'g', color: 'bg-purple-400' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Nutrición</h1>
        <p className="text-gray-400 text-sm mt-1">Meta: {MACROS.calories} kcal · {MACROS.protein}g proteína · {MACROS.carbs}g carbos · {MACROS.fat}g grasa</p>
      </div>

      {/* Goals reference */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {macroFields.map(m => (
          <div key={m.key} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Meta {m.label}</p>
            <p className="text-xl font-semibold text-gray-800">{m.goal}</p>
            <p className="text-xs text-gray-400">{m.unit}</p>
          </div>
        ))}
      </div>

      {/* Log form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold mb-4">Registrar día</h2>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Fecha</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {macroFields.map(m => (
            <div key={m.key}>
              <label className="block text-xs text-gray-400 mb-1">{m.label} ({m.unit})</label>
              <input type="number" placeholder={String(m.goal)} value={(form as any)[m.key]}
                onChange={e => setForm({...form, [m.key]: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Agua (ml)</label>
            <input type="number" placeholder="2500" value={form.water_ml}
              onChange={e => setForm({...form, water_ml: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Notas</label>
          <input type="text" placeholder="Ej: día de sesión larga, +300 kcal" value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={loading}
            className="bg-teal text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-dark disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          {saved && <span className="flex items-center gap-1 text-teal text-sm"><CheckCircle size={14} /> Guardado</span>}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold">Últimos 7 días</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {history.map((h, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <span className="text-sm text-gray-400 w-24">{h.date}</span>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  {macroFields.map(m => (
                    <div key={m.key}>
                      <div className="text-xs text-gray-400">{m.label}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{h[m.key] ?? '—'}</span>
                        <span className="text-xs text-gray-300">{m.unit}</span>
                      </div>
                      {h[m.key] && (
                        <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full`}
                            style={{ width: `${Math.min((h[m.key]/m.goal)*100, 100)}%` }} />
                        </div>
                      )}
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

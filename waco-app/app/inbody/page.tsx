'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { CheckCircle } from 'lucide-react'

export default function InBodyPage() {
  const [form, setForm] = useState({ date: format(new Date(), 'yyyy-MM-dd'), weight_kg: '', muscle_mass_kg: '', body_fat_kg: '', body_fat_pct: '', bmi: '', score: '' })
  const [history, setHistory] = useState<any[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('inbody_logs').select('*').order('date', { ascending: false }).limit(10).then(({ data }) => setHistory(data || []))
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const payload: any = { ...form }
    ;['weight_kg','muscle_mass_kg','body_fat_kg','body_fat_pct','bmi','score'].forEach(k => {
      payload[k] = payload[k] === '' ? null : Number(payload[k])
    })
    await supabase.from('inbody_logs').insert(payload)
    setHistory(h => [payload, ...h])
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const baseline = { weight_kg: 84, body_fat_pct: 16, muscle_mass_kg: 40.2, score: 87 }
  const latest = history[0]

  const fields = [
    { key: 'weight_kg', label: 'Peso', unit: 'kg', placeholder: '84.0' },
    { key: 'muscle_mass_kg', label: 'Masa muscular', unit: 'kg', placeholder: '40.2' },
    { key: 'body_fat_kg', label: 'Masa grasa', unit: 'kg', placeholder: '13.4' },
    { key: 'body_fat_pct', label: '% Grasa', unit: '%', placeholder: '16.0' },
    { key: 'bmi', label: 'BMI', unit: 'kg/m²', placeholder: '25.1' },
    { key: 'score', label: 'Score InBody', unit: 'pts', placeholder: '87' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">InBody</h1>
        <p className="text-gray-400 text-sm mt-1">Baseline: 84 kg · 16% grasa · Meta: 80-81 kg · ~12% grasa</p>
      </div>

      {/* Comparison cards */}
      {latest && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Peso', base: baseline.weight_kg, cur: latest.weight_kg, unit: 'kg', good: (c: number, b: number) => c < b },
            { label: '% Grasa', base: baseline.body_fat_pct, cur: latest.body_fat_pct, unit: '%', good: (c: number, b: number) => c < b },
            { label: 'Músculo', base: baseline.muscle_mass_kg, cur: latest.muscle_mass_kg, unit: 'kg', good: (c: number, b: number) => c >= b },
            { label: 'Score', base: baseline.score, cur: latest.score, unit: 'pts', good: (c: number, b: number) => c >= b },
          ].map(m => {
            const diff = (m.cur - m.base).toFixed(1)
            const isGood = m.good(m.cur, m.base)
            return (
              <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                <p className="text-2xl font-semibold">{m.cur}<span className="text-sm text-gray-400 ml-1">{m.unit}</span></p>
                <p className={`text-xs mt-1 font-medium ${isGood ? 'text-teal' : 'text-coral'}`}>
                  {+diff > 0 ? '+' : ''}{diff} vs baseline
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold mb-4">Agregar medición InBody</h2>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Fecha</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-400 mb-1">{f.label} ({f.unit})</label>
              <input type="number" step="0.1" placeholder={f.placeholder} value={(form as any)[f.key]}
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={loading}
            className="bg-teal text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-dark disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar medición'}
          </button>
          {saved && <span className="flex items-center gap-1 text-teal text-sm"><CheckCircle size={14} /> Guardado</span>}
        </div>
      </div>

      {/* History table */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold">Historial</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Fecha','Peso','Músculo','% Grasa','BMI','Score'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((r, i) => (
                  <tr key={i} className={i === 0 ? 'bg-teal-light/30' : ''}>
                    <td className="px-4 py-3 text-gray-500">{r.date}</td>
                    <td className="px-4 py-3 font-medium">{r.weight_kg} kg</td>
                    <td className="px-4 py-3">{r.muscle_mass_kg} kg</td>
                    <td className="px-4 py-3">{r.body_fat_pct}%</td>
                    <td className="px-4 py-3">{r.bmi}</td>
                    <td className="px-4 py-3"><span className="bg-teal-light text-teal-dark px-2 py-0.5 rounded-full text-xs font-medium">{r.score} pts</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

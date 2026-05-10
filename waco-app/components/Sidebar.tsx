'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Dumbbell, Apple, Scale, TrendingUp } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import { RACE_DATE } from '@/lib/plan'

const nav = [
  { href: '/',          label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/plan',      label: 'Plan 21 sem',  icon: Calendar },
  { href: '/log',       label: 'Log sesión',   icon: Dumbbell },
  { href: '/nutrition', label: 'Nutrición',    icon: Apple },
  { href: '/inbody',    label: 'InBody',       icon: Scale },
  { href: '/progress',  label: 'Progreso',     icon: TrendingUp },
]

export default function Sidebar() {
  const path = usePathname()
  const daysLeft = differenceInDays(RACE_DATE, new Date())

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="Traineat" width={110} height={110} style={{ objectFit: 'contain' }} priority />
        </div>
        <p className="text-xs text-gray-400 text-center">Mario · Waco 70.3 · Oct 4, 2026</p>
        <div className="mt-3 bg-teal-light rounded-lg px-3 py-2">
          <p className="text-2xl font-semibold text-teal">{daysLeft}</p>
          <p className="text-xs text-teal-dark">días para la carrera</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? 'bg-teal text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 text-center">Meta: Sub 5:30 🏁</div>
      </div>
    </aside>
  )
}

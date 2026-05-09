'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SplashScreen() {
    const router = useRouter()
    const [visible, setVisible] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
        const shown = sessionStorage.getItem('splashShown')
        if (shown) { setVisible(false); return }
        const t1 = setTimeout(() => setFadeOut(true), 2200)
        const t2 = setTimeout(() => {
                sessionStorage.setItem('splashShown', '1')
                setVisible(false)
        }, 2800)
        return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!visible) return null

  return (
        <div style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                backgroundColor: '#3D3648',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 0.6s ease',
                opacity: fadeOut ? 0 : 1,
        }}>
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.8s ease forwards' }}>
                          <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    backgroundColor: '#6CC68A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 32px rgba(108,198,138,0.35)'
        }}>
                                      <svg width="56" height="68" viewBox="0 0 56 68" fill="none">
                                                  <rect x="14" y="4" width="32" height="12" rx="2" transform="rotate(-8 14 4)" fill="#3D3648" />
                                                  <rect x="6" y="4" width="12" height="12" rx="2" transform="rotate(-8 6 4)" fill="#3D3648" />
                                                  <rect x="14" y="26" width="26" height="11" rx="2" transform="rotate(-4 14 26)" fill="#3D3648" />
                                                  <rect x="14" y="48" width="20" height="10" rx="2" transform="rotate(-2 14 48)" fill="#3D3648" />
                                      </svg>svg>
                          </div>div>
                        <div style={{ color: 'white', fontSize: 32, letterSpacing: 1 }}>
                                  <span style={{ fontWeight: 300 }}>train</span>span><span style={{ fontWeight: 700 }}>eat</span>span>
                        </div>div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 8, letterSpacing: 2 }}>WACO 70.3 · OCT 4</div>div>
                </div>div>
              <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>style>
        </div>div>
      )
}</svg>

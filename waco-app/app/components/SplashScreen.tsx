'use client'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
      const [visible, setVisible] = useState(false)
      const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
          if (typeof window === 'undefined') return
          const shown = sessionStorage.getItem('splashShown')
          if (shown) return
          setVisible(true)
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
                    <div style={{ textAlign: 'center' }}>
                                <div style={{
                        width: 120, height: 120, borderRadius: '50%',
                        backgroundColor: '#6CC68A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 32px rgba(108,198,138,0.35)'
          }}>
                                              <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                          <rect x="10" y="2" width="32" height="11" rx="2" transform="rotate(-8 10 2)" fill="#3D3648"/>
                                                          <rect x="2" y="2" width="11" height="11" rx="2" transform="rotate(-8 2 2)" fill="#3D3648"/>
                                                          <rect x="10" y="24" width="26" height="10" rx="2" transform="rotate(-4 10 24)" fill="#3D3648"/>
                                                          <rect x="10" y="44" width="20" height="10" rx="2" transform="rotate(-2 10 44)" fill="#3D3648"/>
                                              </svg>svg>
                                </div>div>
                            <div style={{ color: 'white', fontSize: 30, letterSpacing: 1 }}>
                                      <span style={{ fontWeight: 300 }}>train</span>span><span style={{ fontWeight: 700 }}>eat</span>span>
                            </div>div>
                            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 8, letterSpacing: 3, textTransform: 'uppercase' }}>Waco 70.3 · Oct 4</div>div>
                    </div>div>
          </div>div>
        )
}</svg>

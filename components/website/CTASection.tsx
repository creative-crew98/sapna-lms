'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { JSX } from 'react'
import { SparkleIcon } from '@/components/icons'

export default function CTASection(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className='section-sm text-center pb-20'>
      <div
        ref={sectionRef}
        className='reveal rounded-2xl px-6 sm:px-12 py-14 sm:py-20
                   relative overflow-hidden'
        style={{ background: 'var(--magenta-700)' }}
      >
        {/* ── Ambient glows ── */}
        <div
          className='pointer-events-none absolute -top-16 -left-16 w-64 h-64
                     rounded-full blur-[70px] z-0 opacity-25
                     animate-[orbFloat_10s_ease-in-out_infinite]'
          style={{ background: 'var(--pink-300)' }}
        />
        <div
          className='pointer-events-none absolute -bottom-16 -right-16 w-64 h-64
                     rounded-full blur-[70px] z-0 opacity-20
                     animate-[orbFloat_8s_ease-in-out_infinite_reverse]'
          style={{ background: 'var(--pink-400)' }}
        />
        <div
          className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-96 h-40 rounded-full blur-[80px] z-0 opacity-10'
          style={{ background: 'var(--pink-200)' }}
        />

        {/* ── Shimmer border top ── */}
        <div
          className='absolute top-0 left-0 h-px w-1/2 z-0
                     animate-[borderShimmer_3.5s_linear_infinite]'
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--pink-300), transparent)',
          }}
        />
        {/* Shimmer border bottom — mirror */}
        <div
          className='absolute bottom-0 right-0 h-px w-1/2 z-0
                     animate-[borderShimmer_3.5s_linear_infinite_reverse]'
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--pink-300), transparent)',
          }}
        />

        {/* ── Content ── */}
        <div className='relative z-10 flex flex-col items-center stagger-children'>
          {/* Icon orb */}
          <div
            className='w-14 h-14 rounded-full flex items-center justify-center mb-6
                       animate-float cursor-default
                       transition-all duration-300
                       hover:scale-110'
            style={{
              background: 'rgba(196, 56, 138, 0.2)',
              border: '1px solid rgba(196, 56, 138, 0.3)',
              boxShadow: '0 0 24px rgba(196, 56, 138, 0.2)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(196, 56, 138, 0.32)'
              el.style.boxShadow = '0 0 36px rgba(196, 56, 138, 0.4)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(196, 56, 138, 0.2)'
              el.style.boxShadow = '0 0 24px rgba(196, 56, 138, 0.2)'
            }}
          >
            <span style={{ color: 'var(--pink-200)' }}>
              <SparkleIcon size={24} />
            </span>
          </div>

          {/* Headline */}
          <h2
            className='text-3xl sm:text-4xl md:text-5xl mb-3 leading-[1.15]'
            style={{ fontFamily: 'var(--font-serif)', color: '#ffffff' }}
          >
            The pattern ends here.
          </h2>

          {/* Sub italic */}
          <p
            className='text-base sm:text-lg italic mb-5'
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--pink-200)',
            }}
          >
            If not now — when?
          </p>

          {/* Body */}
          <p
            className='text-sm sm:text-base max-w-sm mx-auto leading-relaxed mb-10 font-light'
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            You don&apos;t have to keep figuring this out alone. Healing should
            feel supported, safe, and compassionate.
          </p>

          {/* CTAs */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 w-full'>
            {/* Primary CTA */}
            <Link href='/login' className='w-full sm:w-auto'>
              <span
                className='btn btn-lg w-full sm:w-auto inline-flex
                           transition-all duration-200
                           hover:-translate-y-0.5 hover:scale-[1.03]
                           active:scale-[0.97]'
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: 'var(--pink-300)',
                  color: '#ffffff',
                  borderRadius: '99px',
                  boxShadow: '0 4px 20px rgba(196, 56, 138, 0.4)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--pink-200)'
                  el.style.boxShadow = '0 12px 32px rgba(196, 56, 138, 0.55)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--pink-300)'
                  el.style.boxShadow = '0 4px 20px rgba(196, 56, 138, 0.4)'
                }}
              >
                Start Your Journey
              </span>
            </Link>

            {/* Ghost CTA */}
            <Link href='/login' className='w-full sm:w-auto'>
              <span
                className='btn btn-lg w-full sm:w-auto inline-flex rounded-full
                           transition-all duration-200
                           hover:-translate-y-0.5
                           active:scale-[0.97]'
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--pink-300)'
                  el.style.color = 'rgba(255,255,255,0.85)'
                  el.style.background = 'rgba(196, 56, 138, 0.1)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.15)'
                  el.style.color = 'rgba(255,255,255,0.55)'
                  el.style.background = 'transparent'
                }}
              >
                Already enrolled? Login →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import type { JSX } from 'react'
import { SparkleIcon, ChevronRightIcon } from '@/components/icons'

interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '200+', label: 'Lives Transformed' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '5★', label: 'Average Rating' },
]

const TRUST_BADGES = [
  'Certified Akashic Reader',
  'Life & Relationship Coach',
  'Soul Healing Guide',
]

export default function HeroSection(): JSX.Element {
  return (
    <section
      className='relative overflow-hidden min-h-[92vh] flex flex-col justify-center'
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute inset-0 overflow-hidden'
        aria-hidden='true'
      >
        <div
          className='absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full
                     blur-[100px] opacity-25
                     animate-[orbFloat_12s_ease-in-out_infinite]'
          style={{ background: 'var(--pink-200)' }}
        />
        <div
          className='absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full
                     blur-[90px] opacity-20
                     animate-[orbFloat_10s_ease-in-out_infinite_reverse]'
          style={{ background: 'var(--pink-300)' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     h-72 w-72 rounded-full blur-[80px] opacity-15
                     animate-[orbFloat_14s_ease-in-out_3s_infinite]'
          style={{ background: 'var(--magenta-200)' }}
        />
      </div>

      {/* ── Subtle grid texture ── */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.025]'
        style={{
          backgroundImage:
            'linear-gradient(var(--pink-400) 1px, transparent 1px), linear-gradient(90deg, var(--pink-400) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden='true'
      />

      <div className='relative z-10 max-w-4xl mx-auto px-5 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-28'>
        <div className='flex flex-col items-center text-center'>
          {/* ── Brand pill ── */}
          <div
            className='inline-flex items-center gap-2 backdrop-blur-sm
                       px-4 py-1.5 rounded-full mb-10 cursor-default
                       transition-all duration-300
                       hover:scale-[1.03]
                       animate-[fadeUp_0.5s_ease_0.1s_both] opacity-0'
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid var(--pink-100)',
              boxShadow: 'var(--shadow-card)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-300)'
              el.style.boxShadow = 'var(--shadow-soft)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-100)'
              el.style.boxShadow = 'var(--shadow-card)'
            }}
          >
            <span
              className='animate-float'
              style={{ color: 'var(--pink-400)' }}
            >
              <SparkleIcon size={11} />
            </span>
            <span
              className='text-[10px] font-semibold uppercase tracking-[0.22em] px-5 py-2'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--pink-400)',
              }}
            >
              Soul Awakening With Sapna
            </span>
          </div>

          {/* ── Headline ── */}
          <h1
            className='leading-[1.08] mb-6
                       text-[1.5rem] sm:text-[3rem] lg:text-[3rem]
                       animate-[fadeUp_0.6s_ease_0.2s_both] opacity-0'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            Every attempt is a step forward —
            <br />
            <span className='italic relative'>
              <span style={{ color: 'var(--pink-400)' }}>The pain doesn't</span>{' '}
              stand a chance.
            </span>
          </h1>

          {/* ── Subheadline ── */}
          <p
            className='text-lg sm:text-xl max-w-lg leading-relaxed mb-3 font-light
                       animate-[fadeUp_0.6s_ease_0.3s_both] opacity-0'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-500)' }}
          >
            New year. New partner. New job.{' '}
            <span style={{ color: 'var(--ink-700)', fontWeight: 400 }}>
              Same story. Same heartbreak.
            </span>
          </p>

          {/* ── Body copy ── */}
          <p
            className='text-sm sm:text-[15px] max-w-md leading-relaxed mb-11
                       animate-[fadeUp_0.6s_ease_0.38s_both] opacity-0'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
          >
            The pattern isn&apos;t a coincidence — it&apos;s a soul-level
            blueprint. Through{' '}
            <span style={{ color: 'var(--pink-400)', fontWeight: 500 }}>
              Akashic Record Reading
            </span>{' '}
            and{' '}
            <span style={{ color: 'var(--pink-400)', fontWeight: 500 }}>
              Life &amp; Relationship Coaching
            </span>
            , we go to the root. And we rewrite it.
          </p>

          {/* ── CTAs ── */}
          <div
            className='flex flex-col sm:flex-row items-center gap-3 mb-14
                       w-full sm:w-auto px-4 sm:px-0
                       animate-[fadeUp_0.6s_ease_0.46s_both] opacity-0'
          >
            {/* Primary */}
            <Link href='/login' className='w-full sm:w-auto'>
              <span
                className='btn btn-lg w-full sm:w-auto inline-flex
                           transition-all duration-200
                           hover:-translate-y-1 hover:scale-[1.03]
                           active:scale-[0.97]'
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: 'var(--magenta-700)',
                  color: '#ffffff',
                  borderRadius: '99px',
                  boxShadow: '0 8px 28px rgba(138, 26, 92, 0.28)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--magenta-600)'
                  el.style.boxShadow = '0 12px 36px rgba(138, 26, 92, 0.42)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--magenta-700)'
                  el.style.boxShadow = '0 8px 28px rgba(138, 26, 92, 0.28)'
                }}
              >
                Begin Your Healing
                <ChevronRightIcon size={15} />
              </span>
            </Link>

            {/* Ghost */}
            <a href='#programs' className='w-full sm:w-auto'>
              <span
                className='btn btn-lg w-full sm:w-auto inline-flex
                           transition-all duration-200
                           hover:-translate-y-0.5
                           active:scale-[0.97]'
                style={{
                  fontFamily: 'var(--font-sans)',
                  background: 'transparent',
                  color: 'var(--ink-500)',
                  borderRadius: '99px',
                  border: '1px solid var(--ink-100)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--bg-muted)'
                  el.style.borderColor = 'var(--pink-200)'
                  el.style.color = 'var(--ink-900)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.borderColor = 'var(--ink-100)'
                  el.style.color = 'var(--ink-500)'
                }}
              >
                See Programs
              </span>
            </a>
          </div>

          {/* ── Stats row ── */}
          <div
            className='flex flex-wrap items-center justify-center gap-x-10 gap-y-5 mb-11
                       px-8 py-5 rounded-2xl backdrop-blur-sm
                       transition-all duration-300
                       animate-[fadeUp_0.6s_ease_0.54s_both] opacity-0'
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid var(--pink-100)',
              boxShadow: 'var(--shadow-card)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-200)'
              el.style.boxShadow = 'var(--shadow-soft)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-100)'
              el.style.boxShadow = 'var(--shadow-card)'
            }}
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className='flex flex-col items-center group cursor-default'
              >
                <span
                  className='text-3xl leading-none transition-colors duration-200'
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--magenta-600)',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      'var(--pink-400)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      'var(--magenta-600)')
                  }
                >
                  {value}
                </span>
                <span
                  className='text-[10px] font-semibold uppercase tracking-[0.18em] mt-1.5
                             transition-colors duration-200
                             group-hover:text-[var(--ink-600)]'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--ink-400)',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Trust badges ── */}
          <div
            className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2
                       animate-[fadeUp_0.6s_ease_0.62s_both] opacity-0'
          >
            {TRUST_BADGES.map((badge, i) => (
              <div
                key={badge}
                className='flex items-center gap-2 group cursor-default'
              >
                <span
                  className='h-1.5 w-1.5 rounded-full transition-all duration-200
                             group-hover:scale-125
                             animate-[sparklePop_2.5s_ease-in-out_infinite]'
                  style={{
                    background: 'var(--pink-300)',
                    animationDelay: `${i * 0.7}s`,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      'var(--pink-400)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      'var(--pink-300)')
                  }
                />
                <span
                  className='text-xs transition-colors duration-200
                             group-hover:text-[var(--ink-700)]'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--ink-400)',
                  }}
                >
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className='hidden sm:flex absolute bottom-6 inset-x-0 flex-col items-center gap-2
                   animate-[fadeIn_0.7s_ease_1.8s_forwards] opacity-0'
      >
        <span
          className='text-[9px] uppercase tracking-[0.28em]'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-300)' }}
        >
          Scroll
        </span>
        <span
          className='block h-7 w-px animate-[float_1.4s_ease-in-out_infinite]'
          style={{
            background:
              'linear-gradient(to bottom, var(--pink-300), transparent)',
          }}
        />
      </div>
    </section>
  )
}

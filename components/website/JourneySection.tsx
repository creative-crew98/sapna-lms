'use client'

import type { JSX } from 'react'
import { Divider, SectionHeading } from '@/components/website/Shared'

interface Week {
  title: string
  desc: string
}

const WEEKS: Week[] = [
  {
    title: 'Your Life, Your Responsibility',
    desc: 'Stop asking "why me" and start asking "what now".',
  },
  {
    title: 'Understanding Your True Why',
    desc: 'Dig below goals and find the values that actually run your life.',
  },
  {
    title: 'Breaking Limiting Beliefs',
    desc: 'Expose hidden scripts and dismantle them at the root.',
  },
  {
    title: 'Turning Dreams into Clear Goals',
    desc: 'Vague desires become precise, soul-aligned intentions.',
  },
  {
    title: 'Understanding Inner Resistances',
    desc: 'Fear, procrastination, self-sabotage — named and moved through.',
  },
  {
    title: 'Affirmations — Power of Your Words',
    desc: 'Build an inner language that rewires what you believe.',
  },
  {
    title: 'Visualization — Dream it, Become it',
    desc: 'Emotional alignment precedes physical reality.',
  },
  {
    title: 'Taking Action — Knowing to Doing',
    desc: 'Sustainable habits and a clear, lasting plan.',
  },
]

export default function JourneySection(): JSX.Element {
  return (
    <section
      id='journey'
      className='section rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl my-10 overflow-hidden relative'
      style={{ background: 'var(--magenta-700)' }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute -top-20 -right-20 w-64 h-64
                   rounded-full opacity-20 blur-[80px] z-0
                   animate-[orbFloat_10s_ease-in-out_infinite]'
        style={{ background: 'var(--pink-400)' }}
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -bottom-16 -left-16 w-56 h-56
                   rounded-full opacity-15 blur-[65px] z-0
                   animate-[orbFloat_12s_ease-in-out_infinite_reverse]'
        style={{ background: 'var(--pink-300)' }}
        aria-hidden='true'
      />

      <Divider light />

      <div className='relative z-10 mt-10 mb-9 sm:mb-10'>
        <SectionHeading
          eyebrow='Inside the 8-Week Journey'
          title={
            <>
              Week by week,{' '}
              <span className='italic' style={{ color: 'var(--pink-200)' }}>
                layer by layer
              </span>
            </>
          }
          description='Each week builds on the last. Nothing is skipped. Nothing is surface-level.'
          light
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10 stagger-children'>
        {WEEKS.map((item, i) => (
          <div
            key={item.title}
            className='flex gap-3.5 p-4 sm:p-5 rounded-xl cursor-default
                       transition-all duration-200
                       hover:-translate-y-0.5'
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(224, 96, 192, 0.45)'
              el.style.background = 'rgba(224, 96, 192, 0.07)'
              el.style.boxShadow = '0 4px 20px rgba(138, 26, 92, 0.2)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.background = 'transparent'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Week number orb */}
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center
                         flex-shrink-0 text-xs font-bold
                         transition-all duration-200'
              style={{
                fontFamily: 'var(--font-serif)',
                background: 'rgba(196, 56, 138, 0.18)',
                color: 'var(--pink-200)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(196, 56, 138, 0.32)'
                el.style.color = 'var(--pink-100)'
                el.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(196, 56, 138, 0.18)'
                el.style.color = 'var(--pink-200)'
                el.style.transform = 'scale(1)'
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            <div>
              <p
                className='text-sm font-semibold mb-1 leading-snug transition-colors duration-200'
                style={{ fontFamily: 'var(--font-sans)', color: '#ffffff' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'var(--pink-100)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#ffffff')
                }
              >
                {item.title}
              </p>
              <p
                className='text-xs leading-relaxed transition-colors duration-200'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'rgba(255,255,255,0.42)',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'rgba(255,255,255,0.65)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'rgba(255,255,255,0.42)')
                }
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

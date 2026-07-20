'use client'

import { Divider, SectionHeading } from '@/components/website/Shared'

const QUESTIONS: string[] = [
  '"Why is this happening to me?"',
  '"Why do I keep attracting the wrong relationships?"',
  '"Why do the same painful patterns repeat?"',
  '"Why do I feel emotionally stuck?"',
  '"Why do I struggle despite trying so hard?"',
  '"Why do I feel disconnected, anxious, or incomplete?"',
]

export default function AboutQuestions(): React.JSX.Element {
  return (
    <section
      className='section rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl mt-16 mb-16 overflow-hidden relative'
      style={{ background: 'var(--ink-900)' }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] z-0 opacity-20 animate-[orbFloat_10s_ease-in-out_infinite]'
        style={{ background: 'var(--pink-400)' }}
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-[65px] z-0 opacity-15 animate-[orbFloat_12s_ease-in-out_infinite_reverse]'
        style={{ background: 'var(--pink-300)' }}
        aria-hidden='true'
      />

      <Divider light />

      {/* ── Heading ── */}
      <div className='relative z-10 mt-10 mb-10'>
        <SectionHeading
          eyebrow='The Questions We All Ask'
          title={
            <>
              From a human perspective,{' '}
              <span className='italic' style={{ color: 'var(--pink-200)' }}>
                we only see the surface
              </span>
            </>
          }
          description="Most people spend their lives asking these questions — and never finding real answers, because they're looking at the surface level, not the soul level."
          light
        />
      </div>

      {/* ── Question cards ── */}
      <div className='relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10 stagger-children'>
        {QUESTIONS.map((q) => (
          <div
            key={q}
            className='rounded-xl px-5 py-4 cursor-default
                       transition-all duration-200 hover:-translate-y-0.5'
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(196, 56, 138, 0.38)'
              el.style.background = 'rgba(196, 56, 138, 0.07)'
              el.style.boxShadow = '0 4px 16px rgba(138, 26, 92, 0.15)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.background = 'rgba(255,255,255,0.05)'
              el.style.boxShadow = 'none'
            }}
          >
            <p
              className='text-sm italic leading-relaxed'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--pink-200)',
              }}
            >
              {q}
            </p>
          </div>
        ))}
      </div>

      {/* ── Body text ── */}
      <p
        className='relative z-10 text-center text-sm max-w-2xl mx-auto leading-relaxed font-light
                   animate-[fadeUp_0.5s_ease_0.2s_forwards] opacity-0'
        style={{
          fontFamily: 'var(--font-sans)',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        Through Akashic Record Readings, we go deeper into the soul-level root
        causes behind these experiences. Many times, the challenges we face are
        connected to karmic patterns, unresolved emotional wounds, subconscious
        fears, soul lessons, energetic imbalances, past life experiences,
        relationship contracts, and limiting beliefs carried across lifetimes.
      </p>
    </section>
  )
}

'use client'

import type { JSX } from 'react'
import { Divider, SectionHeading, PainCard } from '@/components/website/Shared'

const PAIN_POINTS: string[] = [
  'You say yes when every part of you wants to say no — people-pleasing until you disappear.',
  'You keep attracting the same painful patterns — unavailable partners, fear of abandonment, repeated heartbreak.',
  "You wake up exhausted from replaying what you said or didn't say, trapped in self-doubt.",
  'You experience repeated setbacks despite working incredibly hard — wondering why you remain stuck.',
  "You've achieved things by every external measure, yet feel disconnected or incomplete inside.",
  "Nothing feels truly aligned. You sense a deeper calling but can't find the path to it.",
]

export default function PainPointsSection(): JSX.Element {
  return (
    <section className='section'>
      <Divider />

      <div className='mt-10 mb-12'>
        <SectionHeading
          eyebrow='Does this sound familiar?'
          title={
            <>
              The patterns that keep{' '}
              <span className='italic' style={{ color: 'var(--pink-400)' }}>
                pulling you back
              </span>
            </>
          }
          description="These aren't character flaws. They're unresolved soul contracts — and they have a root."
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {PAIN_POINTS.map((text, i) => (
          <PainCard key={i} text={text} index={i} />
        ))}
      </div>

      {/* ── Closing quote ── */}
      <div className='mt-10 text-center animate-[fadeUp_0.5s_ease_0.35s_forwards] opacity-0'>
        <div
          className='inline-block px-8 py-6 rounded-2xl
                     transition-all duration-300
                     hover:scale-[1.02] hover:-translate-y-0.5'
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--pink-100)',
            boxShadow: 'var(--shadow-soft)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--pink-200)'
            el.style.boxShadow = '0 8px 32px rgba(196, 56, 138, 0.18)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--pink-100)'
            el.style.boxShadow = 'var(--shadow-soft)'
          }}
        >
          <p
            className='italic text-base leading-snug'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            If even one of these hit —{' '}
            <span
              className='not-italic font-medium'
              style={{ color: 'var(--pink-400)' }}
            >
              your soul is already asking for something deeper.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

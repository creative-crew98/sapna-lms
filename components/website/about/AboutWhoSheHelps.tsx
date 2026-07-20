'use client'

import { CheckIcon } from '@/components/icons'
import { Divider, SectionHeading } from '@/components/website/Shared'

const HELP_AREAS: string[] = [
  'Relationships and marriage',
  'Repeated heartbreaks',
  'Attracting emotionally unavailable partners',
  'Fear of abandonment',
  'Emotional heaviness',
  'Self-doubt and low confidence',
  'Financial struggles',
  'Fear of success',
  'Difficulty conceiving or relationship challenges around children',
  'Family conflicts',
  'Lack of peace',
  'Anxiety and emotional overwhelm',
  'People pleasing',
  'Fear-based living',
  'Purpose confusion',
  'Repeated failures despite hard work',
]

export default function AboutWhoSheHelps(): React.JSX.Element {
  return (
    <section className='section'>
      <Divider />
      <div className='mt-10 mb-10'>
        <SectionHeading
          eyebrow='Who she helps'
          title={
            <>
              Clarity for recurring patterns in{' '}
              <span className='italic' style={{ color: 'var(--pink-400)' }}>
                every area of life
              </span>
            </>
          }
          description='Through Akashic Record Readings, Sapna helps clients gain deeper clarity and awareness about recurring patterns related to:'
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto stagger-children'>
        {HELP_AREAS.map((item) => (
          <div
            key={item}
            className='flex items-start gap-3 p-4 rounded-xl cursor-default
                       transition-all duration-200 hover:-translate-y-0.5'
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--pink-100)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-300)'
              el.style.boxShadow = 'var(--shadow-soft)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-100)'
              el.style.boxShadow = 'none'
            }}
          >
            <span
              className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5
                         transition-all duration-200 group-hover:scale-110'
              style={{
                background: 'var(--pink-50)',
                color: 'var(--pink-400)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-100)'
                el.style.color = 'var(--pink-500)'
                el.style.transform = 'scale(1.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-50)'
                el.style.color = 'var(--pink-400)'
                el.style.transform = 'scale(1)'
              }}
            >
              <CheckIcon size={12} />
            </span>
            <p
              className='text-sm leading-relaxed transition-colors duration-200'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-500)',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--ink-700)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--ink-500)')
              }
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

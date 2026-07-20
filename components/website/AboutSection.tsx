'use client'

import type { JSX } from 'react'
import { Divider, SectionLabel } from '@/components/website/Shared'
import { SparkleIcon } from '@/components/icons'

const STORY_PARAS: string[] = [
  'Professionally, Sapna came from a world of logic — engineering, law, teaching. Credentials stacked. Life still hollow.',
  'When cancer took her father, the grief cracked something open. In the Akashic Records, she found what no degree had given her.',
  "Today she blends ancient spiritual wisdom with grounded, practical coaching — because awareness alone doesn't transform. Action does.",
]

const BADGES: string[] = ['Akashic Reader', 'Life Coach', 'Soul Guide']

export default function AboutSection(): JSX.Element {
  return (
    <section
      id='about'
      className='section mx-4 sm:mx-6 lg:mx-auto max-w-5xl my-8 overflow-hidden relative rounded-2xl
                 transition-shadow duration-500 hover:shadow-[var(--shadow-soft)]'
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--ink-100)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* ── Decorative orbs — pink/magenta palette ── */}
      <div
        className='pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[70px] opacity-40'
        style={{ background: 'var(--pink-100)' }}
      />
      <div
        className='pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[60px] opacity-30'
        style={{ background: 'var(--pink-200)' }}
      />
      {/* Extra shimmer orb top-left */}
      <div
        className='pointer-events-none absolute top-1/2 left-0 w-32 h-32 rounded-full blur-[50px] opacity-20 animate-[orbFloat_10s_ease-in-out_infinite]'
        style={{ background: 'var(--magenta-200)' }}
      />

      <Divider />

      <div
        className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14
                   items-center relative z-10'
      >
        {/* ── Avatar col ── */}
        <div className='flex flex-col items-center animate-[slideInLeft_0.6s_cubic-bezier(0.4,0,0.2,1)_both]'>
          <div className='relative mb-5'>
            {/* Pulse rings — pink palette */}
            <span
              className='absolute inset-0 rounded-full border-2 animate-[pulseRing_3s_ease-out_infinite]'
              style={{ borderColor: 'var(--pink-300)' }}
            />
            <span
              className='absolute inset-0 rounded-full border animate-[pulseRing_3s_ease-out_0.8s_infinite]'
              style={{ borderColor: 'var(--pink-200)' }}
            />

            {/* Avatar wrapper — hover scale + glow */}
            <div
              className='relative h-36 w-36 sm:h-40 sm:w-40 rounded-full overflow-hidden cursor-default
                         transition-all duration-300
                         hover:scale-[1.05]'
              style={{
                background: 'var(--pink-100)',
                border: '4px solid var(--pink-200)',
                boxShadow: '0 4px 20px rgba(138, 26, 92, 0.15)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--pink-400)'
                el.style.boxShadow =
                  '0 0 28px rgba(196, 56, 138, 0.35), 0 4px 20px rgba(138, 26, 92, 0.2)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--pink-200)'
                el.style.boxShadow = '0 4px 20px rgba(138, 26, 92, 0.15)'
              }}
            >
              <img
                src='/sapna.jpeg'
                alt='Sapna Lamba'
                className='w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.04]'
              />
            </div>
          </div>

          {/* Name */}
          <p
            className='text-base'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            Sapna Lamba
          </p>

          {/* Designation */}
          <p
            className='text-xs text-center mt-1 leading-relaxed'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
          >
            Certified Akashic Record Reader
            <br />
            Life &amp; Relationship Coach · Soul Healing Guide
          </p>

          {/* Badges — micro lift on hover */}
          <div className='flex gap-1.5 mt-4 flex-wrap justify-center'>
            {BADGES.map((c) => (
              <span
                key={c}
                className='badge badge-rose text-[10px] cursor-default
                           transition-all duration-200
                           hover:scale-[1.07] hover:-translate-y-0.5
                           active:scale-[0.97]'
                style={{
                  transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--pink-200)'
                  el.style.borderColor = 'var(--pink-300)'
                  el.style.color = 'var(--magenta-700)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = ''
                  el.style.borderColor = ''
                  el.style.color = ''
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Sparkle — float animation */}
          <span
            className='mt-5 animate-float'
            style={{ color: 'var(--pink-400)' }}
          >
            <SparkleIcon size={16} />
          </span>
        </div>

        {/* ── Story col ── */}
        <div className='animate-[slideInRight_0.6s_cubic-bezier(0.4,0,0.2,1)_both]'>
          <SectionLabel>Your Guide</SectionLabel>

          {/* Headline */}
          <h2
            className='text-2xl sm:text-3xl leading-[1.2] mt-2 mb-4'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            She didn&apos;t find this path.{' '}
            <span className='italic' style={{ color: 'var(--pink-400)' }}>
              Grief led her to it.
            </span>
          </h2>

          {/* Blockquote — border-shimmer micro effect on hover */}
          <blockquote
            className='pl-4 mb-5 italic text-sm sm:text-base leading-relaxed
                       transition-all duration-300
                       hover:pl-5'
            style={{
              fontFamily: 'var(--font-serif)',
              borderLeft: '2px solid var(--pink-300)',
              color: 'var(--magenta-600)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-400)'
              el.style.color = 'var(--magenta-700)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-300)'
              el.style.color = 'var(--magenta-600)'
            }}
          >
            &ldquo;I felt connected to my father at a soul level — even though
            he was no longer physically present.&rdquo;
          </blockquote>

          {/* Story paragraphs — stagger + subtle hover underline */}
          <div className='space-y-3 stagger-children'>
            {STORY_PARAS.map((para, i) => (
              <p
                key={i}
                className='text-sm leading-relaxed font-light
                           transition-colors duration-200
                           hover:text-[var(--ink-700)]'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-500)',
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

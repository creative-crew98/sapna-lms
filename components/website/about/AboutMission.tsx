'use client'

import type { ComponentType } from 'react'
import { ShieldIcon, BookIcon, StarIcon } from '@/components/icons'
import { SectionHeading } from '@/components/website/Shared'

interface MissionPillar {
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
  desc: string
}

const MISSION_PILLARS: MissionPillar[] = [
  {
    icon: ShieldIcon,
    title: 'Soul-level clarity',
    desc: 'Akashic Records uncover the deeper soul-level reasons behind your struggles in health, wealth, and relationships.',
  },
  {
    icon: BookIcon,
    title: 'Safe & compassionate space',
    desc: 'A space where you do not feel judged, alone, or misunderstood — where you receive hand-holding and guidance throughout your healing journey.',
  },
  {
    icon: StarIcon,
    title: 'Lasting empowerment',
    desc: 'Moving towards clarity, healing, emotional freedom, and empowerment — because you do not have to figure everything out alone.',
  },
]

const MISSION_LINES: string[] = [
  'To touch as many lives as possible…',
  'To help people heal emotionally at the root cause level…',
  'To help them understand themselves more deeply…',
  'And to guide them towards a more peaceful, empowered, and aligned life.',
]

export default function AboutMission(): React.JSX.Element {
  return (
    <section
      className='section rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl mt-16 mb-16 overflow-hidden relative'
      style={{ background: 'var(--ink-900)' }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute -top-16 -left-16 w-60 h-60 rounded-full blur-[75px] z-0 opacity-15 animate-[orbFloat_12s_ease-in-out_infinite]'
        style={{ background: 'var(--pink-400)' }}
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] z-0 opacity-20 animate-[orbFloat_10s_ease-in-out_infinite_reverse]'
        style={{ background: 'var(--pink-300)' }}
        aria-hidden='true'
      />

      {/* ── Heading ── */}
      <div className='relative z-10 mb-12'>
        <SectionHeading
          eyebrow='Her Mission'
          title={
            <>
              Bridge the gap between{' '}
              <span className='italic' style={{ color: 'var(--pink-200)' }}>
                soul wisdom &amp; human life
              </span>
            </>
          }
          light
        />
      </div>

      {/* ── Pillars ── */}
      <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 stagger-children'>
        {MISSION_PILLARS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className='flex flex-col items-center text-center p-6 rounded-xl cursor-default
                       transition-all duration-200 hover:-translate-y-1'
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(196, 56, 138, 0.4)'
              el.style.background = 'rgba(196, 56, 138, 0.05)'
              el.style.boxShadow = '0 4px 20px rgba(138, 26, 92, 0.15)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(255,255,255,0.1)'
              el.style.background = 'transparent'
              el.style.boxShadow = 'none'
            }}
          >
            <span
              className='flex h-12 w-12 items-center justify-center rounded-full mb-4
                         transition-all duration-200 group-hover:scale-110'
              style={{
                background: 'rgba(196, 56, 138, 0.15)',
                color: 'var(--pink-200)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(196, 56, 138, 0.28)'
                el.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(196, 56, 138, 0.15)'
                el.style.transform = 'scale(1)'
              }}
            >
              <Icon size={20} />
            </span>
            <p
              className='text-base mb-2'
              style={{ fontFamily: 'var(--font-serif)', color: '#ffffff' }}
            >
              {title}
            </p>
            <p
              className='text-sm leading-relaxed font-light'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Mission statement ── */}
      <div
        className='relative z-10 pt-10 text-center space-y-3 max-w-2xl mx-auto animate-[fadeUp_0.5s_ease_forwards]'
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p
          className='text-[11px] font-semibold uppercase tracking-[0.22em]'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-300)' }}
        >
          Today, my mission is simple
        </p>
        {MISSION_LINES.map((line) => (
          <p
            key={line}
            className='text-sm font-light leading-relaxed'
            style={{ fontFamily: 'var(--font-serif)', color: '#ffffff' }}
          >
            {line}
          </p>
        ))}
        <p
          className='text-sm italic mt-4'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--pink-200)' }}
        >
          Because sometimes, the answers we keep searching for externally…
          already exist within the wisdom of our soul.
        </p>
      </div>
    </section>
  )
}

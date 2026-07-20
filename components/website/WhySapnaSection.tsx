'use client'

import type { JSX } from 'react'
import { SectionHeading, Divider } from '@/components/website/Shared'
import { SparkleIcon } from '@/components/icons'

interface Reason {
  number: string
  title: string
  desc: string
}

const REASONS: Reason[] = [
  {
    number: '01',
    title: 'She has lived what she teaches.',
    desc: 'Sapna did not read about grief in a textbook. She lost her father — her greatest strength — to cancer. The pain that broke her open is the same pain she now helps you move through. This is not theory. This is lived.',
  },
  {
    number: '02',
    title: 'She bridges soul and strategy.',
    desc: 'Most healers stop at awareness. Most coaches skip the soul. Sapna does both — Akashic Record Reading to uncover the root, and practical Life Coaching to transform your daily reality. One without the other is incomplete.',
  },
  {
    number: '03',
    title: 'She thinks in systems, not just feelings.',
    desc: 'With a background in engineering and law, Sapna brings rare analytical clarity to spiritual work. She helps you see your patterns precisely — not just feel them — so you can dismantle them with intention.',
  },
  {
    number: '04',
    title: 'She works with you, not at you.',
    desc: 'Every session is 1:1. No group calls where you disappear into the crowd. No pre-recorded scripts. Sapna reads your specific Records, your specific blocks, and builds a path that fits only you.',
  },
  {
    number: '05',
    title: 'She holds the whole of you.',
    desc: 'Your patterns show up in your relationships, your work, your health, your finances. Sapna does not isolate one area and call it done. She works across the full map of your life — because that is where real transformation lives.',
  },
]

export default function WhySapnaSection(): JSX.Element {
  return (
    <section
      id='why-sapna'
      className='section mx-4 sm:mx-6 lg:mx-auto max-w-5xl my-10 rounded-2xl overflow-hidden relative'
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--ink-100)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[80px] opacity-30 animate-[orbFloat_12s_ease-in-out_infinite]'
        style={{ background: 'var(--pink-100)' }}
      />
      <div
        className='pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-[70px] opacity-25 animate-[orbFloat_10s_ease-in-out_infinite_reverse]'
        style={{ background: 'var(--pink-200)' }}
      />

      <Divider />

      <div className='mt-10 mb-2 relative z-10'>
        <SectionHeading
          eyebrow='Why Sapna'
          title={
            <>
              There are many healers.{' '}
              <span className='italic' style={{ color: 'var(--pink-400)' }}>
                Here is what makes her different.
              </span>
            </>
          }
          description='Anyone can hold space. Not everyone can hold you — at the soul level and the human level, at the same time.'
        />
      </div>

      {/* ── Reasons ── */}
      <div className='mt-10 relative z-10 flex flex-col gap-5 stagger-children'>
        {REASONS.map((reason) => (
          <div
            key={reason.number}
            className='group flex gap-5 p-5 sm:p-6 rounded-xl cursor-default
                       transition-all duration-200 hover:-translate-y-0.5'
            style={{
              border: '1px solid var(--ink-100)',
              background: 'var(--bg-base)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-200)'
              el.style.background = 'var(--bg-muted)'
              el.style.boxShadow = '0 4px 20px rgba(196, 56, 138, 0.1)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--ink-100)'
              el.style.background = 'var(--bg-base)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Number */}
            <div
              className='flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                         text-xs font-bold transition-all duration-200
                         group-hover:scale-110'
              style={{
                fontFamily: 'var(--font-serif)',
                background: 'var(--pink-50)',
                border: '1px solid var(--pink-100)',
                color: 'var(--pink-400)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-100)'
                el.style.borderColor = 'var(--pink-300)'
                el.style.color = 'var(--magenta-600)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-50)'
                el.style.borderColor = 'var(--pink-100)'
                el.style.color = 'var(--pink-400)'
              }}
            >
              {reason.number}
            </div>

            {/* Text */}
            <div className='flex flex-col gap-1'>
              <p
                className='text-sm font-semibold leading-snug transition-colors duration-200
                           group-hover:text-[var(--magenta-600)]'
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--ink-900)',
                }}
              >
                {reason.title}
              </p>
              <p
                className='text-sm leading-relaxed font-light transition-colors duration-200
                           group-hover:text-[var(--ink-700)]'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-400)',
                }}
              >
                {reason.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom quote ── */}
      <div className='mt-10 flex flex-col items-center gap-3 pb-2 relative z-10'>
        <span className='animate-float' style={{ color: 'var(--pink-300)' }}>
          <SparkleIcon size={14} />
        </span>
        <p
          className='text-sm italic text-center max-w-md leading-relaxed'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-400)' }}
        >
          &ldquo;Finding the soul-level root is only the first step. You still
          have to live — and transform — your everyday human life.&rdquo;
        </p>
        <p
          className='text-[11px] tracking-widest uppercase'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
        >
          — Sapna Lamba
        </p>
      </div>
    </section>
  )
}

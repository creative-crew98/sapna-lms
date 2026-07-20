'use client'

import Image from 'next/image'
import type { JSX, ReactNode } from 'react'

interface CoreValue {
  icon: string
  label: string
  text: string
}

const VALUES: CoreValue[] = [
  { icon: '🤍', label: 'Compassion', text: 'Unconditional & boundless' },
  { icon: '⚖️', label: 'Integrity', text: 'Unyielding & unwavering' },
  { icon: '🌿', label: 'Service', text: 'Selfless & sacred' },
  { icon: '✨', label: 'Kindness', text: 'Quiet & profound' },
]

const PARAGRAPHS: ReactNode[] = [
  <>
    Some people leave footprints on our lives so deep that even when they are no
    longer physically present, they continue to guide us every single day. For
    me, that person was, and always will be, my Papa.
  </>,
  <>
    He was so much more than just a father. He was my anchor in every storm, my
    loudest cheerleader, and the one person who understood my unspoken thoughts.
    Growing up, his presence meant absolute safety. No matter how chaotic the
    world felt, if Papa was there, I knew everything would be okay. He held my
    hand through every doubt, believed in my wildest dreams when I couldn&apos;t
    find the strength to believe in them myself. He wasn&apos;t just a part of
    my world — he was my home.
  </>,
  <>
    When Papa left his physical body after his brave, agonizing battle with
    cancer, my world didn&apos;t just change;{' '}
    <em className='italic' style={{ color: 'var(--pink-200)' }}>
      it shattered completely.
    </em>{' '}
    The silence he left behind was deafening. The grief was heavy, but beneath
    it was an ache — a desperate longing to hear his voice just one more time.
  </>,
  <>
    That desperate search for connection became the quiet beginning of my
    spiritual journey. It eventually led me to the gates of the{' '}
    <em className='italic' style={{ color: 'var(--pink-300)' }}>
      Akashic Records
    </em>{' '}
    — where I discovered that love does not have an expiration date, and it
    certainly does not end when the physical body does.
  </>,
  <>
    Through the Akashic Records, my raw grief slowly evolved into profound
    healing and clarity. I began to realize that our earthly struggles, our
    heartbreaks, and our recurring patterns are not random cruelties of fate.
    They are beautifully intricate soul stories, lessons, and contracts designed
    for our growth.
  </>,
  <>
    Today, I have turned my personal journey of healing into a sanctuary for
    others. Through Akashic Record Readings, Life Coaching, and Relationship
    Coaching, I step into the dark with people to help them find the same light
    I was once searching for. Together, we don&apos;t just look at the wounds;
    we transform them into wisdom.
  </>,
  <>
    Papa may no longer be here to hold my hand, but his spirit is woven into the
    very fabric of my purpose. His guidance continues to light my path, and
    through the healing of others, his beautiful legacy lives on forever.
  </>,
]

// ── Hero ─────────────────────────────────────────────────────────────────────

function DedicationHero(): JSX.Element {
  return (
    <section
      className='relative overflow-hidden min-h-[92vh] flex items-center'
      style={{ background: 'var(--ink-900)' }}
    >
      {/* Orbs */}
      <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
        <div
          className='absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 animate-[orbFloat_14s_ease-in-out_infinite]'
          style={{ background: 'var(--pink-400)' }}
        />
        <div
          className='absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 animate-[orbFloat_10s_ease-in-out_infinite_reverse]'
          style={{ background: 'var(--pink-300)' }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-10 animate-[orbFloat_12s_ease-in-out_3s_infinite]'
          style={{ background: 'var(--magenta-500)' }}
        />
      </div>

      {/* Top/bottom shimmer borders */}
      <div
        className='absolute top-0 inset-x-0 h-px animate-[borderShimmer_4s_linear_infinite]'
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--pink-400), transparent)',
        }}
      />
      <div
        className='absolute bottom-0 inset-x-0 h-px'
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--pink-300), transparent)',
          opacity: 0.4,
        }}
      />

      <div className='relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center'>
        {/* ── Left — text ── */}
        <div className='animate-[slideInLeft_0.7s_cubic-bezier(0.4,0,0.2,1)_forwards]'>
          {/* Eyebrow */}
          <div className='flex items-center gap-3 mb-8'>
            <div
              className='h-px w-10'
              style={{ background: 'rgba(196,56,138,0.6)' }}
            />
            <p
              className='text-[10px] font-semibold uppercase tracking-[0.32em]'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--pink-200)',
              }}
            >
              A Tribute
            </p>
            <div
              className='h-px w-10'
              style={{ background: 'rgba(196,56,138,0.6)' }}
            />
          </div>

          {/* Title */}
          <h1
            className='text-[2.2rem] sm:text-5xl lg:text-[3rem] leading-[1.1] mb-4'
            style={{ fontFamily: 'var(--font-serif)', color: '#ffffff' }}
          >
            My Papa,
            <br />
            <span className='italic' style={{ color: 'var(--pink-300)' }}>
              My Guiding Light
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className='italic text-sm mb-10 tracking-wide'
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            In Loving Memory of Shri Ramesh Chander Nandal
          </p>

          {/* Pull quote */}
          <blockquote
            className='pl-6 mb-10 transition-all duration-300 hover:pl-7'
            style={{ borderLeft: '2px solid rgba(196,56,138,0.6)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-400)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'rgba(196,56,138,0.6)'
            }}
          >
            <p
              className='italic text-lg leading-relaxed'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              &ldquo;He wasn&apos;t just a part of my world —<br />
              <span style={{ color: 'var(--pink-200)' }}>he was my home.</span>
              &rdquo;
            </p>
          </blockquote>

          {/* Values mini-grid */}
          <div className='grid grid-cols-2 gap-2.5'>
            {VALUES.map(({ icon, label, text }) => (
              <div
                key={label}
                className='flex items-center gap-3 px-4 py-3 rounded-xl cursor-default
                           transition-all duration-200 hover:-translate-y-0.5'
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(196,56,138,0.3)'
                  el.style.background = 'rgba(196,56,138,0.06)'
                  el.style.boxShadow = '0 4px 16px rgba(138,26,92,0.15)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.background = 'rgba(255,255,255,0.04)'
                  el.style.boxShadow = 'none'
                }}
              >
                <span className='text-base flex-shrink-0'>{icon}</span>
                <div>
                  <p
                    className='text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200'
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--pink-100)',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    className='text-[11px] italic'
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  >
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — photo ── */}
        <div className='flex justify-center lg:justify-end animate-[slideInRight_0.7s_cubic-bezier(0.4,0,0.2,1)_0.15s_forwards] opacity-0'>
          <div className='relative'>
            {/* Glow */}
            <div
              className='absolute -inset-6 rounded-2xl blur-2xl opacity-20'
              style={{ background: 'var(--pink-400)' }}
            />

            {/* Corner accents — pink */}
            {[
              '-top-2 -left-2 border-t-2 border-l-2 rounded-tl-lg',
              '-top-2 -right-2 border-t-2 border-r-2 rounded-tr-lg',
              '-bottom-2 -left-2 border-b-2 border-l-2 rounded-bl-lg',
              '-bottom-2 -right-2 border-b-2 border-r-2 rounded-br-lg',
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-6 h-6 ${cls}`}
                style={{ borderColor: 'var(--pink-400)', opacity: 0.7 }}
              />
            ))}

            {/* Photo */}
            <div
              className='relative w-[280px] sm:w-[320px] lg:w-[360px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]'
              style={{ border: '1px solid rgba(196,56,138,0.25)' }}
            >
              <Image
                src='/Dedication-papa.jpeg'
                alt='Shri Ramesh Chander Nandal'
                fill
                sizes='(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px'
                className='object-cover object-top'
                priority
              />
              {/* Bottom fade */}
              <div className='absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--ink-900)] to-transparent opacity-60' />
            </div>

            {/* Diya */}
            <div className='text-center mt-5 text-2xl animate-[float_3s_ease-in-out_infinite]'>
              🪔
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Body ─────────────────────────────────────────────────────────────────────

function DedicationBody(): JSX.Element {
  return (
    <section className='max-w-3xl mx-auto px-6 sm:px-8 py-20 sm:py-28'>
      {/* Divider */}
      <div className='flex items-center gap-4 mb-16'>
        <div
          className='h-px flex-1'
          style={{
            background:
              'linear-gradient(to right, transparent, var(--pink-200))',
          }}
        />
        <span style={{ color: 'var(--pink-300)', fontSize: '0.875rem' }}>
          ✦
        </span>
        <div
          className='h-px flex-1'
          style={{
            background:
              'linear-gradient(to left, transparent, var(--pink-200))',
          }}
        />
      </div>

      {/* Story paragraphs */}
      <div className='space-y-7 stagger-children'>
        {PARAGRAPHS.map((para, i) => (
          <p
            key={i}
            className='text-[15px] font-light leading-[1.95] transition-colors duration-200
                       hover:text-[var(--ink-700)]'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-500)' }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Closing */}
      <div
        className='mt-20 pt-12 text-center animate-[fadeUp_0.55s_ease_forwards]'
        style={{ borderTop: '1px solid var(--ink-100)' }}
      >
        <p
          className='italic font-light text-xl sm:text-2xl leading-relaxed mb-8'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-700)' }}
        >
          Forever my guiding light.
          <br />
          Forever my home. <span style={{ color: 'var(--pink-400)' }}>❤️</span>
        </p>
        <div className='flex items-center justify-center gap-4'>
          <span
            className='h-px flex-1 max-w-24'
            style={{
              background:
                'linear-gradient(to right, transparent, var(--pink-200))',
            }}
          />
          <span className='text-xl animate-[float_3s_ease-in-out_infinite]'>
            🪔
          </span>
          <span
            className='h-px flex-1 max-w-24'
            style={{
              background:
                'linear-gradient(to left, transparent, var(--pink-200))',
            }}
          />
        </div>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DedicationPage(): JSX.Element {
  return (
    <div style={{ background: 'var(--bg-base)' }} id='dedication'>
      <DedicationHero />
      <DedicationBody />
    </div>
  )
}

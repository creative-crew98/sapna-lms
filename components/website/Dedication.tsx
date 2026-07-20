'use client'

import Link from 'next/link'
import type { JSX } from 'react'
import { SparkleIcon } from '@/components/icons'

export default function DedicationTeaser(): JSX.Element {
  return (
    <section className='section-sm text-center'>
      <div
        className='relative rounded-2xl px-6 sm:px-12 py-12 sm:py-16 overflow-hidden
                   transition-shadow duration-500'
        style={{
          background: 'var(--ink-900)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 40px rgba(138, 26, 92, 0.15)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = '0 16px 56px rgba(138, 26, 92, 0.25)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = '0 8px 40px rgba(138, 26, 92, 0.15)'
        }}
      >
        {/* ── Ambient orbs ── */}
        <div
          className='pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[90px] opacity-20 animate-[orbFloat_12s_ease-in-out_infinite]'
          style={{ background: 'var(--pink-400)' }}
        />
        <div
          className='pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-[80px] opacity-15 animate-[orbFloat_10s_ease-in-out_infinite_reverse]'
          style={{ background: 'var(--pink-300)' }}
        />

        {/* Top border shimmer */}
        <div
          className='absolute top-0 inset-x-0 h-px animate-[borderShimmer_4s_linear_infinite]'
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--pink-400), transparent)',
          }}
        />

        {/* ── Content ── */}
        <div className='relative z-10 flex flex-col items-center stagger-children'>
          {/* Diya */}
          <div className='text-3xl mb-5 animate-[float_3s_ease-in-out_infinite]'>
            🪔
          </div>

          {/* Eyebrow */}
          <div className='flex items-center gap-3 mb-5'>
            <div
              className='h-px w-8'
              style={{ background: 'rgba(196, 56, 138, 0.5)' }}
            />
            <p
              className='text-[10px] font-semibold uppercase tracking-[0.3em]'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--pink-300)',
              }}
            >
              A Dedication
            </p>
            <div
              className='h-px w-8'
              style={{ background: 'rgba(196, 56, 138, 0.5)' }}
            />
          </div>

          {/* Headline */}
          <h2
            className='text-2xl sm:text-3xl leading-[1.2] mb-3'
            style={{ fontFamily: 'var(--font-serif)', color: '#ffffff' }}
          >
            My Papa.{' '}
            <span className='italic' style={{ color: 'var(--pink-200)' }}>
              My Guiding Light.
            </span>
          </h2>

          {/* Sub */}
          <p
            className='text-xs mb-6 tracking-wide'
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            In Loving Memory of Shri Ramesh Chander Nandal
          </p>

          {/* Pull quote */}
          <blockquote
            className='max-w-sm mx-auto mb-8 px-5 py-4 rounded-xl'
            style={{
              borderLeft: '2px solid var(--pink-400)',
              background: 'rgba(196, 56, 138, 0.06)',
            }}
          >
            <p
              className='text-sm italic leading-relaxed'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              &ldquo;He wasn&apos;t just a part of my world —{' '}
              <span style={{ color: 'var(--pink-200)' }}>he was my home.</span>
              &rdquo;
            </p>
          </blockquote>

          {/* Summary */}
          <p
            className='text-sm leading-relaxed max-w-md mx-auto mb-9 font-light'
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(255,255,255,0.42)',
            }}
          >
            This work was born from grief — and from love. Read the story of the
            person whose passing cracked open a journey of healing, purpose, and
            soul.
          </p>

          {/* CTA */}
          <Link href='/about#dedication'>
            <span
              className='inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full
                         transition-all duration-200
                         hover:-translate-y-0.5 hover:scale-[1.03]
                         active:scale-[0.97]'
              style={{
                fontFamily: 'var(--font-sans)',
                border: '1px solid rgba(196, 56, 138, 0.4)',
                color: 'var(--pink-200)',
                background: 'rgba(196, 56, 138, 0.08)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--pink-300)'
                el.style.background = 'rgba(196, 56, 138, 0.16)'
                el.style.color = 'var(--pink-100)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(196, 56, 138, 0.4)'
                el.style.background = 'rgba(196, 56, 138, 0.08)'
                el.style.color = 'var(--pink-200)'
              }}
            >
              <span
                className='animate-float'
                style={{ color: 'var(--pink-300)' }}
              >
                <SparkleIcon size={12} />
              </span>
              Read his story
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

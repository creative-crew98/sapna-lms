'use client'

import { SparkleIcon } from '@/components/icons'

export default function AboutHero(): React.JSX.Element {
  return (
    <section
      className='relative overflow-hidden w-full text-center pt-24 pb-14 px-5 sm:px-6'
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute inset-0 overflow-hidden'
        aria-hidden='true'
      >
        <div
          className='orb absolute -top-28 -left-24 h-72 w-72 rounded-full blur-[60px] opacity-25 animate-[orbFloat_10s_ease-in-out_infinite]'
          style={{
            background:
              'radial-gradient(circle, var(--pink-200) 0%, transparent 70%)',
          }}
        />
        <div
          className='orb absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-[60px] opacity-20 animate-[orbFloat_8s_ease-in-out_infinite_reverse]'
          style={{
            background:
              'radial-gradient(circle, var(--pink-300) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className='relative z-10 max-w-2xl mx-auto flex flex-col items-center stagger-children'>
        {/* Brand pill */}
        <div
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
                     transition-all duration-300 hover:scale-[1.03]'
          style={{
            background: 'var(--bg-surface)',
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
          <span className='animate-float' style={{ color: 'var(--pink-300)' }}>
            <SparkleIcon size={11} />
          </span>
          <span
            className='text-[10px] font-semibold uppercase tracking-[0.22em]'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
          >
            Meet Sapna
          </span>
        </div>

        {/* Name */}
        <h1
          className='leading-[1.15] text-[2.2rem] sm:text-5xl mb-2'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
        >
          Sapna Lamba
        </h1>

        {/* Designation */}
        <p
          className='text-sm font-medium mb-5 tracking-wide'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
        >
          Akashic Record Reader · Life &amp; Relationship Coach · Soul Healing
          Guide
        </p>

        {/* Subtext */}
        <p
          className='text-sm max-w-xl mx-auto leading-relaxed font-light'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
        >
          My journey into the world of Akashic Records did not begin as a
          profession. It began as a deeply personal search for answers, healing,
          and connection.
        </p>
      </div>
    </section>
  )
}

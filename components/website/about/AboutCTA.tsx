'use client'

import Link from 'next/link'
import { ChevronRightIcon } from '@/components/icons'
import { Divider } from '@/components/website/Shared'

export default function AboutCTA(): React.JSX.Element {
  return (
    <section className='section-sm text-center pb-20'>
      <Divider />

      <div className='mt-12 animate-[fadeUp_0.55s_ease_forwards]'>
        <h2
          className='text-2xl sm:text-3xl mb-4'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
        >
          Ready to work with Sapna?
        </h2>
        <p
          className='text-sm max-w-sm mx-auto mb-8 font-light leading-relaxed'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
        >
          You don&apos;t have to figure everything out alone. Choose your
          program and begin your transformation journey today.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
          {/* Primary */}
          <Link href='/courses' className='w-full sm:w-auto'>
            <span
              className='btn btn-lg btn-magnetic w-full sm:w-auto inline-flex
                         transition-all duration-200
                         hover:-translate-y-0.5 hover:scale-[1.02]
                         active:scale-[0.97]'
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'var(--magenta-700)',
                color: '#ffffff',
                borderRadius: '99px',
                boxShadow: '0 8px 24px rgba(138, 26, 92, 0.25)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--magenta-600)'
                el.style.boxShadow = 'var(--shadow-soft)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--magenta-700)'
                el.style.boxShadow = '0 8px 24px rgba(138, 26, 92, 0.25)'
              }}
            >
              View Programs
              <ChevronRightIcon size={16} />
            </span>
          </Link>

          {/* Ghost */}
          <Link href='/contact' className='w-full sm:w-auto'>
            <span
              className='btn btn-lg w-full sm:w-auto inline-flex
                         transition-all duration-200
                         hover:scale-[1.02] hover:-translate-y-0.5
                         active:scale-[0.97]'
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: 'var(--ink-500)',
                borderRadius: '99px',
                border: '1px solid var(--ink-100)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--bg-muted)'
                el.style.borderColor = 'var(--pink-200)'
                el.style.color = 'var(--ink-900)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'transparent'
                el.style.borderColor = 'var(--ink-100)'
                el.style.color = 'var(--ink-500)'
              }}
            >
              Get in touch
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

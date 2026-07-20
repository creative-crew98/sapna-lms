import Link from 'next/link'
import { SparkleIcon, ArrowLeftIcon } from '@/components/icons'

export default function NotFound() {
  return (
    <div
      className='min-h-screen flex items-center justify-center px-6'
      style={{ background: 'var(--bg-base)' }}
    >
      <div className='text-center max-w-md'>
        {/* Icon orb */}
        <div
          className='w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8
                     animate-[float_5s_ease-in-out_infinite]'
          style={{
            background: 'var(--pink-100)',
            border: '1px solid var(--pink-200)',
            boxShadow: '0 0 32px rgba(196, 56, 138, 0.15)',
          }}
        >
          <span style={{ color: 'var(--pink-400)' }}>
            <SparkleIcon size={32} />
          </span>
        </div>

        {/* 404 */}
        <p
          className='text-[80px] font-bold leading-none mb-4'
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--pink-100)',
          }}
        >
          404
        </p>

        {/* Headline */}
        <h1
          className='text-2xl mb-3 italic'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
        >
          This page doesn&apos;t exist
        </h1>

        {/* Body */}
        <p
          className='text-sm leading-relaxed mb-8'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
        >
          The page you&apos;re looking for may have been moved, deleted, or
          perhaps never existed. Let&apos;s get you back on your journey.
        </p>

        {/* CTAs */}
        <div className='flex items-center justify-center gap-3 flex-wrap'>
          <Link href='/'>
            <span
              className='btn btn-lg inline-flex items-center gap-2
                         transition-all duration-200
                         hover:-translate-y-0.5 hover:scale-[1.02]
                         active:scale-[0.97]'
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'var(--magenta-700)',
                color: '#ffffff',
                borderRadius: '99px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <ArrowLeftIcon size={15} />
              Back to home
            </span>
          </Link>
          <Link href='/dashboard'>
            <span
              className='btn btn-lg inline-flex
                         transition-all duration-200
                         hover:-translate-y-0.5
                         active:scale-[0.97]'
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: 'var(--ink-500)',
                borderRadius: '99px',
                border: '1px solid var(--ink-100)',
              }}
            >
              My dashboard
            </span>
          </Link>
        </div>

        {/* Decorative quote */}
        <p
          className='text-xs mt-12 italic'
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--ink-300)',
          }}
        >
          &ldquo;Not all who wander are lost — but this page is.&rdquo;
        </p>
      </div>
    </div>
  )
}

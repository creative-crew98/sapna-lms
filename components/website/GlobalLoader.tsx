'use client'

import Image from 'next/image'

/**
 * GlobalLoader
 * Full-screen loading overlay using the brand logo.
 * Usage: render conditionally while data/route is loading, e.g.
 *   {isLoading && <GlobalLoader />}
 * or wire into a loading.tsx file for route-level loading states.
 */
export default function GlobalLoader({
  label = 'Awakening your experience…',
}: {
  label?: string
}) {
  return (
    <div
      className='fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6'
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, var(--magenta-700, #7a1f52) 0%, var(--magenta-900, #3a0e28) 60%, #1a0611 100%)',
      }}
    >
      {/* Rotating glow ring behind logo */}
      <div className='relative flex items-center justify-center'>
        <div
          className='absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full animate-spin-slow'
          style={{
            background:
              'conic-gradient(from 0deg, transparent, var(--pink-300, #f2a8d8), transparent 60%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Logo, gently pulsing */}
        <div className='relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-2xl animate-pulse-slow'>
          <Image
            src='/logo.jpeg'
            alt='Soul Awakening With Sapna'
            fill
            sizes='128px'
            className='object-cover'
            priority
          />
        </div>
      </div>

      {/* Loading label */}
      <p className='text-xs sm:text-sm tracking-widest uppercase text-white/70 font-medium animate-pulse-slow'>
        {label}
      </p>

      {/* Local keyframes — scoped via styled-jsx so no global CSS edits needed */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(0.97);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

'use client'

import { SparkleIcon } from '@/components/icons'
import { SectionLabel } from '@/components/website/Shared'

const CREDENTIALS: string[] = [
  'Certified Akashic Reader',
  'Life Coach',
  'Relationship Coach',
  'Soul Healing Guide',
]

const SOUL_REALIZATIONS: string[] = [
  'Life does not end with the physical body.',
  'The soul continues its journey beyond this human form.',
]

export default function AboutStory(): React.JSX.Element {
  return (
    <section className='section'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start'>
        {/* ── Left — Avatar + credentials ── */}
        <div className='flex flex-col items-center md:sticky md:top-28 animate-[slideInLeft_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]'>
          <div className='relative'>
            {/* Pulse ring */}
            <span
              className='absolute inset-0 rounded-3xl border-2 animate-[pulseRing_3s_ease-out_infinite]'
              style={{ borderColor: 'var(--pink-300)' }}
            />

            {/* Avatar */}
            <div
              className='relative h-60 w-60 sm:h-72 sm:w-72 rounded-2xl overflow-hidden cursor-default
                         transition-all duration-300 hover:scale-[1.04]'
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
                src='/about.jpeg'
                alt='Sapna Lamba'
                className='w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.04]'
              />
            </div>

            {/* Name tag */}
            <div
              className='absolute -bottom-4 -right-4 rounded-xl px-4 py-3
                         animate-[fadeUp_0.45s_ease_0.3s_forwards] opacity-0'
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--pink-100)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <p
                className='text-xs font-semibold'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-900)',
                }}
              >
                Sapna Lamba
              </p>
              <p
                className='text-[10px] mt-0.5'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--pink-400)',
                }}
              >
                Soul Healing Guide
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className='flex flex-wrap gap-1.5 mt-10 justify-center'>
            {CREDENTIALS.map((c) => (
              <span
                key={c}
                className='badge badge-rose text-[10px] cursor-default
                           transition-all duration-150 hover:scale-105 hover:-translate-y-0.5'
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
        </div>

        {/* ── Right — Story ── */}
        <div className='space-y-5 animate-[slideInRight_0.6s_cubic-bezier(0.4,0,0.2,1)_0.1s_forwards] opacity-0'>
          <SectionLabel>Her Story</SectionLabel>

          <h2
            className='text-2xl sm:text-3xl leading-[1.2]'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            From logic to{' '}
            <span className='italic' style={{ color: 'var(--pink-400)' }}>
              soul
            </span>
          </h2>

          {[
            'Professionally, I come from a very different background. I am an engineer by qualification, I studied law, and I also explored teaching as a career. But somewhere deep within, nothing truly felt aligned. Despite trying different paths, I always felt that something was missing — as if life was trying to guide me towards something much deeper.',
            'A few years ago, my life changed completely when I lost my father to cancer. He was not just my father — he was my biggest emotional support, my strength, and the one person I could always rely on unconditionally throughout my life journey. Losing him was one of the most painful experiences of my life.',
            'To a very large extent, I could not accept that he was gone. Somewhere within me, I kept searching for him. I wanted to feel connected to him again. I wanted to understand:',
          ].map((para, i) => (
            <p
              key={i}
              className='text-sm leading-relaxed font-light'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-500)',
              }}
            >
              {para}
            </p>
          ))}

          {/* Blockquote 1 */}
          <blockquote
            className='pl-5 py-1 transition-all duration-300 hover:pl-6'
            style={{ borderLeft: '2px solid var(--pink-300)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-400)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-300)'
            }}
          >
            <p
              className='text-base italic leading-relaxed'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--ink-700)',
              }}
            >
              &ldquo;How can someone who was such a strong part of your life
              suddenly disappear?&rdquo;
            </p>
          </blockquote>

          {[
            'That search became the turning point of my life. During that emotional phase, I stumbled upon the concept of Akashic Records. Initially, I was simply curious. But slowly, as I started learning and experiencing this work, I realized that life is far deeper than what we perceive through the physical world.',
          ].map((para, i) => (
            <p
              key={i}
              className='text-sm leading-relaxed font-light'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-500)',
              }}
            >
              {para}
            </p>
          ))}

          <p
            className='text-sm font-medium'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-900)' }}
          >
            For the first time, I began understanding life from a soul
            perspective rather than only from a human perspective. I realized:
          </p>

          {/* Soul realizations */}
          <div className='space-y-2 pl-4'>
            {SOUL_REALIZATIONS.map((line, i) => (
              <div
                key={line}
                className='flex items-start gap-2 animate-[slideInLeft_0.4s_ease_forwards] opacity-0'
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span
                  className='mt-1 flex-shrink-0'
                  style={{ color: 'var(--pink-400)' }}
                >
                  <SparkleIcon size={12} />
                </span>
                <p
                  className='text-sm font-light'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--ink-500)',
                  }}
                >
                  {line}
                </p>
              </div>
            ))}
          </div>

          <p
            className='text-sm leading-relaxed font-light'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-500)' }}
          >
            As I started exploring Akashic Records more deeply through
            meditation, prayers, spiritual practices, and inner healing work, I
            experienced a profound emotional shift within myself.
          </p>

          {/* Blockquote 2 */}
          <blockquote
            className='pl-5 py-1 transition-all duration-300 hover:pl-6'
            style={{ borderLeft: '2px solid var(--pink-300)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-400)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderLeftColor = 'var(--pink-300)'
            }}
          >
            <p
              className='text-base italic leading-relaxed'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--ink-700)',
              }}
            >
              &ldquo;I felt connected to my father at a soul level. Even though
              he was no longer physically present, it felt as if his guidance,
              energy, love, and presence were still around me. That realization
              changed my understanding of life completely.&rdquo;
            </p>
            <p
              className='text-xs mt-2'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-300)',
              }}
            >
              — Sapna Lamba
            </p>
          </blockquote>

          {[
            "What initially started as a personal healing journey slowly became my soul's purpose. I continued studying Akashic Records deeply — understanding soul patterns, karmic cycles, emotional wounds, energetic healing, and spiritual guidance. Eventually, I became a certified Akashic Record Reader.",
            'But before helping others, I first helped myself. I understood my own emotional wounds, fears, patterns, and soul lessons. I experienced how awareness at the soul level can completely shift the way we see our struggles.',
          ].map((para, i) => (
            <p
              key={i}
              className='text-sm leading-relaxed font-light'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-500)',
              }}
            >
              {para}
            </p>
          ))}

          <p
            className='text-sm font-medium'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-900)' }}
          >
            And today, this is exactly what I wish to help others experience.
          </p>
        </div>
      </div>
    </section>
  )
}

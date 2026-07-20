'use client'

import { SectionHeading } from '@/components/website/Shared'

interface ProcessStep {
  step: string
  title: string
  desc: string
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Akashic Record Reading',
    desc: "We access your soul's records to uncover the root cause of your patterns — karmic contracts, past life wounds, energetic imbalances, subconscious fears, and limiting beliefs carried across lifetimes.",
  },
  {
    step: '02',
    title: 'Pattern Identification',
    desc: 'Together we map exactly where and why you keep getting stuck — in relationships, career, self-worth, abundance, or emotional wellbeing.',
  },
  {
    step: '03',
    title: 'Release & Clear',
    desc: 'Through guided meditations, forgiveness prayers, aroma oils, spiritual remedies, and energy healing, we release what no longer serves your highest good.',
  },
  {
    step: '04',
    title: 'Rewire & Rise',
    desc: 'We replace old patterns with a new identity using practical mindset work, affirmations, worksheets, reflection exercises, and clear daily action steps.',
  },
]

const TOOLS: string[] = [
  'Life Coaching',
  'Relationship Coaching',
  'Emotional Healing Techniques',
  'Guided Meditations',
  'Forgiveness Prayers',
  'Mindset Work',
  'Self-Awareness Practices',
  'Worksheets & Reflection Exercises',
  'Energy Healing Support',
  'Aroma Oils & Spiritual Remedies',
  'Practical Transformation Tools',
]

export default function AboutProcess(): React.JSX.Element {
  return (
    <section
      className='section rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl mt-16 mb-16 relative overflow-hidden'
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--pink-100)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* ── Ambient orb ── */}
      <div
        className='pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[70px] opacity-40 animate-[orbFloat_10s_ease-in-out_infinite]'
        style={{ background: 'var(--pink-100)' }}
        aria-hidden='true'
      />

      {/* ── Heading ── */}
      <div className='relative z-10 mb-12'>
        <SectionHeading
          eyebrow='The Two-Step Process'
          title={
            <>
              Finding the root cause is{' '}
              <span className='italic' style={{ color: 'var(--pink-400)' }}>
                only the first step
              </span>
            </>
          }
          description='Once we understand WHY a certain problem exists at the soul level, the next step is: how do we heal it and transform it in our everyday human life? That is where practical transformation work comes in, because most people struggle majorly in three core areas of life — Health, Wealth, and Relationships.'
        />
      </div>

      {/* ── Process steps ── */}
      <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 stagger-children'>
        {PROCESS_STEPS.map(({ step, title, desc }) => (
          <div
            key={step}
            className='flex gap-4 p-5 rounded-xl cursor-default
                       transition-all duration-200 hover:-translate-y-1'
            style={{
              background: 'var(--bg-muted)',
              border: '1px solid var(--pink-100)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-200)'
              el.style.boxShadow = 'var(--shadow-soft)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-100)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* Step number orb */}
            <div
              className='w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                         text-sm font-bold transition-all duration-200'
              style={{
                fontFamily: 'var(--font-serif)',
                background: 'var(--pink-100)',
                color: 'var(--pink-500)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-200)'
                el.style.color = 'var(--magenta-600)'
                el.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-100)'
                el.style.color = 'var(--pink-500)'
                el.style.transform = 'scale(1)'
              }}
            >
              {step}
            </div>

            <div>
              <p
                className='text-sm font-semibold mb-1'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-900)',
                }}
              >
                {title}
              </p>
              <p
                className='text-xs leading-relaxed'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-400)',
                }}
              >
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tools section ── */}
      <div
        className='relative z-10 pt-8'
        style={{ borderTop: '1px solid var(--pink-100)' }}
      >
        <p
          className='text-center text-[11px] font-semibold uppercase tracking-[0.22em] mb-4'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
        >
          That is why I combine Akashic Record Readings with
        </p>

        <div className='flex flex-wrap gap-2 justify-center stagger-children'>
          {TOOLS.map((tool) => (
            <span
              key={tool}
              className='badge badge-rose text-[11px] cursor-default
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
              {tool}
            </span>
          ))}
        </div>

        <p
          className='text-center text-sm mt-6 font-light italic'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
        >
          This combination helps clients not only understand their patterns but
          also actively work on changing them. Because awareness without action
          cannot create transformation.
        </p>
      </div>
    </section>
  )
}

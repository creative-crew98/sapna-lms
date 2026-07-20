import Link from 'next/link'
import { adminDb } from '@/lib/firebase-admin'

interface Program {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  weeks: number
  price: number
  originalPrice: number
  includes: string[]
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

async function getPrograms(): Promise<Program[]> {
  const snapshot = await adminDb.collection('programs').orderBy('weeks').get()
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Program)
}

export const metadata = {
  title: 'Our Programs',
  description:
    'Explore our transformation programs — Akashic Record Reading and Relationship Coaching.',
}

// ── Per-program theme — same brand tokens used on the detail pages ────────
// akashic = cosmic dark (magenta-900/700 + pink accents)
// relationship = soft aurora (bg-base/pink-50/pink-200)

const THEME_BY_SLUG: Record<
  string,
  {
    dark: boolean
    background: string
    border: string
    hoverBorder: string
    eyebrowColor: string
    titleColor: string
    descColor: string
    priceColor: string
    strikeColor: string
    arrowColor: string
  }
> = {
  akashic: {
    dark: true,
    background:
      'radial-gradient(ellipse at 60% 20%, var(--magenta-700) 0%, var(--magenta-900) 55%, #0e0309 100%)',
    border: 'rgba(238,150,216,0.18)',
    hoverBorder: 'rgba(238,150,216,0.4)',
    eyebrowColor: 'var(--pink-200)',
    titleColor: '#ffffff',
    descColor: 'rgba(255,255,255,0.65)',
    priceColor: 'var(--pink-200)',
    strikeColor: 'rgba(255,255,255,0.3)',
    arrowColor: 'var(--pink-200)',
  },
  relationship: {
    dark: false,
    background:
      'linear-gradient(135deg, var(--bg-surface) 0%, var(--pink-50) 100%)',
    border: 'var(--pink-100)',
    hoverBorder: 'var(--pink-200)',
    eyebrowColor: 'var(--pink-400)',
    titleColor: 'var(--ink-900)',
    descColor: 'var(--ink-500)',
    priceColor: 'var(--magenta-600)',
    strikeColor: 'var(--ink-300)',
    arrowColor: 'var(--pink-400)',
  },
}

const DEFAULT_THEME = THEME_BY_SLUG.relationship

export default async function CoursesPage() {
  const programs = await getPrograms()

  return (
    <>
      <style>{`
        .program-card {
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid var(--card-border);
        }
        .program-card:hover {
          border-color: var(--card-hover-border);
          box-shadow: var(--shadow-soft);
          transform: translateY(-6px);
        }
        .program-card:hover .card-arrow {
          transform: translateX(4px);
        }
        .card-arrow {
          transition: transform 0.15s ease;
        }
      `}</style>

      <main
        className='max-w-5xl mx-auto px-4 py-16 sm:py-20'
        style={{ background: 'var(--bg-base)' }}
      >
        {/* ── Header ── */}
        <div className='text-center mb-12'>
          <span
            className='text-xs font-semibold uppercase tracking-widest'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
          >
            Choose Your Path
          </span>
          <h1
            className='text-3xl sm:text-4xl mt-3 mb-4'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            Our Programs
          </h1>
          <p
            className='max-w-xl mx-auto text-sm'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
          >
            Each program is a world of its own — explore before you enroll.
          </p>
        </div>

        {/* ── Program cards ── */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7'>
          {programs.map((program) => {
            const theme = THEME_BY_SLUG[program.slug] ?? DEFAULT_THEME
            return (
              <Link
                key={program.id}
                href={`/courses/${program.slug}`}
                className='program-card group block rounded-2xl p-7 sm:p-8'
                style={
                  {
                    background: theme.background,
                    boxShadow: 'var(--shadow-card)',
                    '--card-border': theme.border,
                    '--card-hover-border': theme.hoverBorder,
                  } as React.CSSProperties
                }
              >
                <span
                  className='text-xs font-semibold uppercase tracking-widest'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: theme.eyebrowColor,
                  }}
                >
                  {program.subtitle}
                </span>
                <h2
                  className='text-2xl mt-2 mb-3'
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: theme.titleColor,
                  }}
                >
                  {program.title}
                </h2>
                <p
                  className='text-sm leading-relaxed mb-6'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: theme.descColor,
                  }}
                >
                  {program.description}
                </p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-baseline gap-2'>
                    <span
                      className='text-xl font-bold'
                      style={{
                        fontFamily: 'var(--font-serif)',
                        color: theme.priceColor,
                      }}
                    >
                      {formatPrice(program.price)}
                    </span>
                    <span
                      className='text-sm line-through'
                      style={{ color: theme.strikeColor }}
                    >
                      {formatPrice(program.originalPrice)}
                    </span>
                  </div>
                  <span
                    className='card-arrow text-xs font-semibold'
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: theme.arrowColor,
                    }}
                  >
                    View details →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── Empty state ── */}
        {programs.length === 0 && (
          <p
            className='text-center text-sm'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
          >
            Programs jald hi yahan dikhenge.
          </p>
        )}
      </main>
    </>
  )
}

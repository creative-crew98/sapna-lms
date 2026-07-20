import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebase-admin'
import { CheckItem } from '@/components/website/Shared'
import RazorpayButton from '@/components/RazorpayButton'
import CurriculumList from '@/components/website/CurriculumList'

interface Module {
  weekNum: number
  title: string
  description: string
  locked: boolean
}

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
  modules: Module[]
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

async function getProgramBySlug(slug: string): Promise<Program | null> {
  const snapshot = await adminDb
    .collection('programs')
    .where('slug', '==', slug)
    .limit(1)
    .get()

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Program
}

// ── Theme config — per-program backgrounds ──────────────────────────────
// 'cosmic' = Akashic: muted deep-space gradient with soft planet glows + faint stars.
// 'aurora' = Relationship: muted, elegant multi-tone color bloom (European/marble feel),
//            kept desaturated and soft so it reads as sophisticated, not playful.

type ThemeKind = 'cosmic' | 'aurora'

const THEME_BY_SLUG: Record<string, ThemeKind> = {
  akashic: 'cosmic',
  relationship: 'aurora',
}

function CosmicBackground() {
  // Deterministic "random" star positions so server/client render match.
  const stars = Array.from({ length: 60 }).map((_, i) => ({
    top: (i * 37) % 100,
    left: (i * 53) % 100,
    size: 1 + (i % 3) * 0.5,
    opacity: 0.15 + (i % 5) * 0.08,
  }))

  return (
    <div
      className='fixed inset-0 -z-10 overflow-hidden'
      style={{ background: 'var(--magenta-900)' }}
    >
      {/* base deep gradient — brand magenta, not generic purple */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, var(--magenta-700) 0%, var(--magenta-900) 50%, #0e0309 100%)',
        }}
      />

      {/* large soft planet, upper right — brand pink/magenta tones, muted not garish */}
      <div
        className='absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-70 blur-[2px]'
        style={{
          background:
            'radial-gradient(circle at 35% 30%, var(--pink-300) 0%, var(--magenta-500) 45%, var(--magenta-900) 80%)',
          boxShadow: '0 0 160px rgba(196, 56, 138, 0.22)',
        }}
      />
      {/* ring around it */}
      <div
        className='absolute -top-6 -right-6 w-[320px] h-[100px] rounded-full opacity-25'
        style={{
          border: '1px solid var(--pink-200)',
          transform: 'rotate(-18deg)',
        }}
      />

      {/* second, smaller, distant planet bottom-left */}
      <div
        className='absolute bottom-10 -left-16 w-[220px] h-[220px] rounded-full opacity-40 blur-[1px]'
        style={{
          background:
            'radial-gradient(circle at 40% 35%, var(--magenta-500) 0%, var(--magenta-700) 50%, var(--magenta-900) 85%)',
        }}
      />

      {/* faint nebula wash */}
      <div
        className='absolute inset-0 opacity-20'
        style={{
          background:
            'radial-gradient(ellipse at 20% 70%, rgba(224, 96, 192, 0.3) 0%, transparent 55%)',
        }}
      />

      {/* stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className='absolute rounded-full bg-white'
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}

      {/* gentle vignette so text stays readable */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_30%,rgba(0,0,0,0.45)_100%)]' />
    </div>
  )
}

function AuroraBackground() {
  return (
    <div
      className='fixed inset-0 -z-10 overflow-hidden'
      style={{ background: 'var(--bg-base)' }}
    >
      {/* base soft neutral, on-brand */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(135deg, var(--bg-base) 0%, var(--bg-muted) 50%, var(--pink-50) 100%)',
        }}
      />

      {/* blush bloom */}
      <div
        className='absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full opacity-60 blur-[80px]'
        style={{
          background:
            'radial-gradient(circle, var(--pink-200) 0%, transparent 70%)',
        }}
      />
      {/* deeper rose bloom */}
      <div
        className='absolute top-10 right-[-80px] w-[380px] h-[380px] rounded-full opacity-40 blur-[90px]'
        style={{
          background:
            'radial-gradient(circle, var(--pink-300) 0%, transparent 70%)',
        }}
      />
      {/* burgundy-tinted bloom for depth */}
      <div
        className='absolute bottom-[-100px] left-1/3 w-[460px] h-[460px] rounded-full opacity-25 blur-[100px]'
        style={{
          background:
            'radial-gradient(circle, var(--magenta-500) 0%, transparent 70%)',
        }}
      />
      {/* soft ink-toned accent for tonal variety */}
      <div
        className='absolute bottom-10 right-10 w-[260px] h-[260px] rounded-full opacity-20 blur-[80px]'
        style={{
          background:
            'radial-gradient(circle, var(--ink-200) 0%, transparent 70%)',
        }}
      />

      {/* fine marble-like linework, very subtle */}
      <div
        className='absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, var(--ink-500) 0px, transparent 1px, transparent 140px)',
        }}
      />

      {/* gentle vignette so text stays readable */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_40%,rgba(255,255,255,0.35)_100%)]' />
    </div>
  )
}

// Next.js 15+ (App Router): params is now a Promise and must be awaited
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return {}
  return {
    title: program.title,
    description: program.description,
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)

  if (!program) {
    notFound()
  }

  const theme = THEME_BY_SLUG[program.slug] ?? 'aurora'
  const isDark = theme === 'cosmic'

  return (
    <>
      {theme === 'cosmic' ? <CosmicBackground /> : <AuroraBackground />}

      <main className='max-w-3xl mx-auto px-4 py-16 sm:py-20'>
        {/* Header */}
        <div className='text-center mb-12'>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isDark ? 'text-[var(--pink-200)]' : 'text-rose-400'
            }`}
          >
            {program.subtitle}
          </span>
          <h1
            className={`font-serif text-3xl sm:text-4xl mt-3 mb-4 ${
              isDark ? 'text-white' : 'text-ink-900'
            }`}
          >
            {program.title}
          </h1>
          <p
            className={`leading-relaxed max-w-xl mx-auto ${
              isDark ? 'text-white/65' : 'text-ink-500'
            }`}
          >
            {program.description}
          </p>
        </div>

        {/* Curriculum */}
        <div className='mb-12'>
          <h2
            className={`font-serif text-xl mb-5 ${
              isDark ? 'text-white' : 'text-ink-900'
            }`}
          >
            What You&apos;ll Go Through
          </h2>
          <CurriculumList modules={program.modules} isDark={isDark} />
        </div>

        {/* Includes */}
        <div className='mb-12'>
          <h2
            className={`font-serif text-xl mb-5 ${
              isDark ? 'text-white' : 'text-ink-900'
            }`}
          >
            What&apos;s Included
          </h2>
          <ul className='space-y-2'>
            {program.includes.map((item, i) => (
              <CheckItem key={i} text={item} featured={isDark} />
            ))}
          </ul>
        </div>

        {/* Price + Enroll */}
        <div
          className={`rounded-2xl border p-7 sm:p-8 text-center backdrop-blur-sm ${
            isDark
              ? 'border-white/10 bg-white/[0.03]'
              : 'border-rose-100 bg-white/40'
          }`}
        >
          <div className='flex items-baseline justify-center gap-2 mb-1'>
            <span
              className={`font-serif text-3xl font-bold ${
                isDark ? 'text-[var(--pink-200)]' : 'text-magenta-600'
              }`}
            >
              {formatPrice(program.price)}
            </span>
            <span
              className={`text-sm line-through ${
                isDark ? 'text-white/30' : 'text-ink-300'
              }`}
            >
              {formatPrice(program.originalPrice)}
            </span>
          </div>
          <p
            className={`text-xs mb-6 ${isDark ? 'text-white/30' : 'text-ink-300'}`}
          >
            One-time investment · Limited seats
          </p>
          <RazorpayButton
            programId={program.id}
            label='Enroll Now'
            className={`w-full sm:w-auto px-10 py-3 rounded-full font-semibold text-sm
                       text-white shadow-card hover:shadow-soft transition-all duration-200 ${
                         isDark
                           ? 'bg-[var(--magenta-600)] hover:bg-[var(--magenta-500)]'
                           : 'bg-magenta-700 hover:bg-magenta-600'
                       }`}
          />
        </div>
      </main>
    </>
  )
}

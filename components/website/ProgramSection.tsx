'use client'

import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { Divider, SectionHeading } from '@/components/website/Shared'
import ProgramCard, {
  type ProgramTheme,
} from '@/components/website/ProgramCard'

// ── Types ────────────────────────────────────────────────────────────────

interface ProgramDoc {
  slug: string
  title: string
  subtitle: string
  description: string
  weeks: number
  price: number
  originalPrice: number
  includes: string[]
}

interface ProgramWithId extends ProgramDoc {
  id: string
}

// ── Static UI config — keyed by program SLUG (not Firestore doc id) ────────
// NOTE: seed.ts uses doc IDs '1-week' / '8-week', but each program document
// stores its own `slug` field ('akashic' / 'relationship'). Config is keyed
// by that slug since that's what we match on below.

const UI_CONFIG: Record<
  string,
  {
    cardBadge: string
    featured: boolean
    theme: ProgramTheme
  }
> = {
  akashic: {
    cardBadge: 'Akashic Record Reading',
    featured: false,
    theme: {
      dark: true,
      bgClassName:
        'bg-[radial-gradient(ellipse_at_60%_20%,#3B1F6E_0%,#0D0521_50%,#000308_100%)]',
      textColor: '#ffffff',
      mutedColor: 'rgba(255,255,255,0.65)',
      badgeBg: 'rgba(155,111,212,0.2)',
      badgeText: '#C9A8F0',
      priceColor: '#C9A8F0',
      priceStrikeColor: 'rgba(255,255,255,0.3)',
      borderColor: 'rgba(155,111,212,0.25)',
      dividerColor: 'rgba(255,255,255,0.1)',
      linkColor: '#C9A8F0',
      linkHoverColor: '#E0C8FA',
      buttonBg: '#6B3FA0',
      buttonHoverBg: '#7C4DB8',
      buttonShadow: '0 20px 50px rgba(75, 26, 140, 0.35)',
    },
  },
  relationship: {
    cardBadge: 'Relationship Coaching',
    featured: true,
    theme: {
      dark: false,
      bgClassName:
        'bg-gradient-to-br from-[#F5E6D3] via-[#E8D5F0] to-[#D3E8F5]',
      textColor: '#2D1A35',
      mutedColor: '#6B5570',
      badgeBg: 'rgba(196,92,138,0.15)',
      badgeText: '#8A4A6E',
      priceColor: '#C45C8A',
      priceStrikeColor: 'rgba(45,26,53,0.35)',
      borderColor: 'rgba(196,92,138,0.2)',
      dividerColor: 'rgba(45,26,53,0.1)',
      linkColor: '#C45C8A',
      linkHoverColor: '#B34A78',
      buttonBg: '#C45C8A',
      buttonHoverBg: '#B34A78',
      buttonShadow: '0 20px 50px rgba(196, 56, 138, 0.25)',
    },
  },
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

// ── Main section ─────────────────────────────────────────────────────────

export default function ProgramsSection(): JSX.Element {
  const [programs, setPrograms] = useState<ProgramWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const snapshot = await getDocs(collection(db, 'programs'))
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as ProgramWithId)
          .sort((a, b) => a.weeks - b.weeks)
        setPrograms(data)
      } catch (err) {
        console.error('Failed to fetch programs:', err)
        setError('Programs load nahi ho paaye. Please refresh karein.')
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  return (
    <section id='programs' className='section'>
      <Divider />

      <div className='mt-10 mb-11'>
        <SectionHeading
          eyebrow='Choose Your Path'
          title={
            <>
              Two journeys.{' '}
              <span className='italic' style={{ color: 'var(--pink-400)' }}>
                One destination.
              </span>
            </>
          }
          description='Each program is a world of its own — explore before you enroll.'
        />
      </div>

      {loading && (
        <p
          className='text-center text-sm'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
        >
          Loading programs...
        </p>
      )}

      {error && (
        <p
          className='text-center text-sm'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto'>
          {programs.map((program, index) => {
            const config = UI_CONFIG[program.slug]
            if (!config) return null
            return (
              <ProgramCard
                key={program.id}
                index={index}
                programId={program.id}
                courseHref={`/courses/${program.slug}`}
                badge={config.cardBadge}
                title={program.title}
                subtitle={program.subtitle}
                description={program.description}
                price={formatPrice(program.price)}
                originalPrice={formatPrice(program.originalPrice)}
                includes={program.includes}
                theme={config.theme}
                featured={config.featured}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

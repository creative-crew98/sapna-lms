'use client'

import { use, useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import RazorpayButton from '@/components/RazorpayButton'
import Link from 'next/link'
import {
  CheckIcon,
  ArrowLeftIcon,
  ShieldIcon,
  SparkleIcon,
} from '@/components/icons'

interface ProgramData {
  title: string
  subtitle: string
  price: string
  originalPrice: string
  discount: string
  includes: string[]
}

const PROGRAM_DATA: Record<string, ProgramData> = {
  '1-week': {
    title: 'Soul Blueprint Intensive',
    subtitle: '1-Week 1:1 Program',
    price: '₹5,000',
    originalPrice: '₹25,000',
    discount: '- ₹20,000',
    includes: [
      '1 Live 1:1 Deep-Dive Session (Akashic + Coaching)',
      'Akashic Record Reading — Your Soul Blueprint',
      'Tailored Worksheets & Reflection Exercises',
      'WhatsApp Support for Ongoing Integration',
      'Guided Healing Audios & Forgiveness Prayers',
      'Spiritual Remedies & Energy Healing Support',
      'Weekly Growth Tracker & Alignment Tools',
    ],
  },
  '8-week': {
    title: 'Soul Awakening: Empowered You',
    subtitle: '8-Week 1:1 Journey',
    price: '₹51,000',
    originalPrice: '₹56,100',
    discount: '- ₹5,100',
    includes: [
      '8 One-on-One Coaching Sessions',
      '1 Akashic Record Reading (₹5,100 value)',
      'Free Clarity Call before starting',
      'Gratitude + Affirmation Journals',
      'Emotional & Pattern Deep Work',
      'Safe, Non-Judgmental Healing Space',
      'WhatsApp Support throughout',
    ],
  },
}

const TRUST_SIGNALS = [
  '100% Secure Payment',
  'Razorpay Protected',
  'Instant Access',
]

export default function EnrollPage({
  params,
}: {
  params: Promise<{ programId: string }>
}): JSX.Element {
  const { programId } = use(params)
  const { user } = useAuth()
  const [alreadyEnrolled, setAlreadyEnrolled] = useState<boolean>(false)
  const [checking, setChecking] = useState<boolean>(true)

  const program = PROGRAM_DATA[programId]

  useEffect(() => {
    if (!user) return
    async function check(): Promise<void> {
      const snap = await getDocs(
        query(
          collection(db, 'enrollments'),
          where('userId', '==', user!.uid),
          where('programId', '==', programId),
        ),
      )
      setAlreadyEnrolled(!snap.empty)
      setChecking(false)
    }
    check()
  }, [user, programId])

  if (!program) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <p className='text-ink-400'>Program not found.</p>
        <Link href='/dashboard'>
          <button className='btn btn-ghost btn-sm'>← Back to dashboard</button>
        </Link>
      </div>
    )
  }

  if (checking) {
    return (
      <div className='space-y-4 animate-pulse max-w-2xl mx-auto'>
        <div className='skeleton h-6 w-32' />
        <div className='skeleton h-10 w-64' />
        <div className='skeleton h-96' />
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Back link */}
      <Link
        href='/dashboard'
        className='flex items-center gap-1.5 text-sm text-ink-400
                   hover:text-ink-900 transition-colors duration-150'
      >
        <ArrowLeftIcon size={15} />
        Back to dashboard
      </Link>

      {/* Header */}
      <div>
        <p className='page-eyebrow'>Enrollment</p>
        <h1 className='page-title font-serif'>{program.title}</h1>
        <p className='page-desc'>{program.subtitle}</p>
      </div>

      {alreadyEnrolled ? (
        /* Already enrolled */
        <div className='card text-center py-12 space-y-4'>
          <div
            className='w-14 h-14 rounded-full bg-success-50
                          flex items-center justify-center mx-auto'
          >
            <CheckIcon size={24} className='text-success-500' strokeWidth={2.5} />
          </div>
          <h2 className='font-serif italic text-lg text-ink-900'>
            You&apos;re already enrolled!
          </h2>
          <p className='text-sm text-ink-400'>
            You have already enrolled in this program.
          </p>
          <Link href='/dashboard/programs'>
            <button className='btn btn-primary'>Go to My Programs →</button>
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Program summary card */}
          <div className='card space-y-5'>
            {/* Title + price */}
            <div className='flex items-start justify-between'>
              <div>
                <span className='badge badge-rose text-[10px] mb-2 inline-block'>
                  {programId === '8-week' ? '8-Week' : '1-Week'} Program
                </span>
                <h2 className='font-serif text-xl text-ink-900'>
                  {program.title}
                </h2>
              </div>
              <div className='text-right'>
                <div className='font-serif text-2xl font-bold text-ink-900'>
                  {program.price}
                </div>
                <div className='text-sm text-ink-300 line-through'>
                  {program.originalPrice}
                </div>
              </div>
            </div>

            {/* Includes */}
            <div>
              <p
                className='text-[10px] font-semibold uppercase tracking-widest
                            text-ink-400 mb-3'
              >
                What&apos;s included
              </p>
              <ul className='space-y-2'>
                {program.includes.map((item, i) => (
                  <li key={i} className='flex items-start gap-2.5'>
                    <CheckIcon
                      size={14}
                      className='text-pink-400 mt-0.5 flex-shrink-0'
                    />
                    <span className='text-sm text-ink-500'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='divider' />

            {/* Order summary */}
            <div className='space-y-2'>
              <p
                className='text-[10px] font-semibold uppercase tracking-widest
                            text-ink-400 mb-3'
              >
                Order summary
              </p>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-ink-500'>{program.title}</span>
                <span className='font-medium text-ink-900'>
                  {program.price}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-ink-500'>Discount</span>
                <span className='font-medium text-success-600'>
                  {program.discount}
                </span>
              </div>
              <div className='flex items-center justify-between pt-3 border-t border-ink-100'>
                <span className='font-semibold text-ink-900'>Total</span>
                <span className='font-serif text-lg font-bold text-ink-900'>
                  {program.price}
                </span>
              </div>
            </div>

            {/* Enroll button */}
            <RazorpayButton
              programId={programId}
              label={`Pay ${program.price} & Enroll`}
              className='btn btn-primary w-full text-base py-4 rounded-full
                         flex items-center justify-center gap-2
                         hover:-translate-y-px hover:scale-[1.01]
                         active:scale-[0.98] transition-all duration-200'
            />

            {/* Trust signals */}
            <div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
              {TRUST_SIGNALS.map((t) => (
                <div
                  key={t}
                  className='flex items-center gap-1.5 text-xs text-ink-300'
                >
                  <ShieldIcon size={12} className='text-pink-400' />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div
            className='flex items-start gap-3 p-4 bg-bg-muted
                          border border-ink-100 rounded-xl'
          >
            <SparkleIcon
              size={16}
              className='text-pink-400 flex-shrink-0 mt-0.5'
            />
            <p className='text-xs text-ink-500 leading-relaxed'>
              After payment, Sapna will personally reach out within 24 hours to
              schedule your first session and send your welcome kit.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

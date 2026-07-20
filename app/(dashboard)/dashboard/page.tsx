'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import type { ComponentType, JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import {
  BookIcon,
  CalendarIcon,
  TrendingUpIcon,
  PenIcon,
  ChevronRightIcon,
  StarIcon,
} from '@/components/icons'
import type {
  Enrollment as EnrollmentBase,
  Session as SessionBase,
  JournalEntry as JournalEntryBase,
} from '@/types'

type Enrollment = Omit<EnrollmentBase, 'startDate'> & { startDate: Timestamp }
type Session = Omit<SessionBase, 'date'> & { date: Timestamp }
type JournalEntry = Omit<JournalEntryBase, 'date'> & { date: Timestamp }

const PROGRAM_NAMES: Record<string, string> = {
  '1-week': 'Soul Blueprint Intensive',
  '8-week': 'Soul Awakening: Empowered You',
}

const PROGRAM_TOTAL_WEEKS: Record<string, number> = {
  '1-week': 1,
  '8-week': 8,
}

interface StatCard {
  label: string
  value: string | number
  icon: ComponentType<{ size?: number; className?: string }>
  iconBg: string
  iconColor: string
  href: string
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function computeProgress(e: Enrollment): {
  done: number
  total: number
  pct: number
} {
  const done = Object.values(e.progress || {}).filter(Boolean).length
  const total = PROGRAM_TOTAL_WEEKS[e.programId] ?? 4
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return { done, total, pct }
}

export default function DashboardHome(): JSX.Element {
  const { user, profile } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [journalCount, setJournalCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!user) return

    async function fetchAll(): Promise<void> {
      try {
        const now = Timestamp.now()
        const [enrollSnap, sessionsSnap, journalSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, 'enrollments'),
              where('userId', '==', user!.uid),
            ),
          ),
          getDocs(
            query(
              collection(db, 'sessions'),
              where('userId', '==', user!.uid),
              where('date', '>=', now),
              where('status', '==', 'scheduled'),
              orderBy('date', 'asc'),
              limit(3),
            ),
          ),
          getDocs(
            query(
              collection(db, 'journalEntries'),
              where('userId', '==', user!.uid),
            ),
          ),
        ])

        setEnrollments(
          enrollSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Enrollment[],
        )
        setSessions(
          sessionsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Session[],
        )
        setJournalCount(journalSnap.size)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [user])

  const avgProgress: number =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + computeProgress(e).pct, 0) /
            enrollments.length,
        )
      : 0

  const stats: StatCard[] = [
    {
      label: 'Programs',
      value: enrollments.length,
      icon: BookIcon,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-400',
      href: '/dashboard/programs',
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: TrendingUpIcon,
      iconBg: 'bg-success-50',
      iconColor: 'text-success-500',
      href: '/dashboard/progress',
    },
    {
      label: 'Sessions',
      value: sessions.length,
      icon: CalendarIcon,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
      href: '/dashboard/sessions',
    },
    {
      label: 'Journal Entries',
      value: journalCount,
      icon: PenIcon,
      iconBg: 'bg-magenta-50',
      iconColor: 'text-magenta-400',
      href: '/dashboard/journal',
    },
  ]

  if (loading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='skeleton h-10 w-64' />
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='skeleton h-24' />
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='skeleton h-64' />
          <div className='skeleton h-64' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8 stagger-children'>
      {/* Greeting */}
      <div>
        <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-pink-500 mb-1'>
          Dashboard
        </p>
        <h1 className='font-serif text-ink-900 text-3xl'>
          {getGreeting()},{' '}
          <span className='italic text-pink-400'>
            {profile?.name?.split(' ')[0] ?? 'friend'}
          </span>{' '}
          ✦
        </h1>
        <p className='text-sm text-ink-400 mt-1'>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, href }) => (
          <Link key={label} href={href}>
            <div className='card-hover cursor-pointer'>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}
              >
                <Icon size={17} className={iconColor} />
              </div>
              <div className='stat-value'>{value}</div>
              <div className='stat-label mt-0.5'>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Active programs */}
        <div className='card'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='font-serif text-base font-semibold text-ink-900'>
              My Programs
            </h2>
            <Link
              href='/dashboard/programs'
              className='text-xs text-pink-500 hover:text-pink-600 hover:underline
                         flex items-center gap-1 transition-colors duration-150'
            >
              View all <ChevronRightIcon size={13} />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
              <div className='w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center'>
                <BookIcon size={20} className='text-pink-400' />
              </div>
              <p className='text-sm text-ink-300'>
                You are not enrolled in any program yet
              </p>
              <p className='text-xs text-ink-300'>
                Contact Sapna to get enrolled
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {enrollments.map((e) => {
                const { done, total, pct } = computeProgress(e)
                return (
                  <Link key={e.id} href={`/dashboard/programs/${e.programId}`}>
                    <div
                      className='p-4 bg-pink-50/60 border border-pink-100 rounded-xl
                                   hover:border-pink-300 hover:-translate-y-0.5
                                   transition-all duration-200 cursor-pointer'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <p className='text-sm font-semibold text-ink-900'>
                            {PROGRAM_NAMES[e.programId] ?? e.programId}
                          </p>
                          <p className='text-xs text-ink-400 mt-0.5'>
                            Week {e.currentWeek} of {total}
                          </p>
                        </div>
                        <span className='text-sm font-bold text-pink-400'>
                          {pct}%
                        </span>
                      </div>
                      <div className='progress-track'>
                        <div
                          className='progress-fill transition-[width] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]'
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className='text-xs text-ink-300 mt-2'>
                        {done} of {total} modules completed
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming sessions */}
        <div className='card'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='font-serif text-base font-semibold text-ink-900'>
              Upcoming Sessions
            </h2>
            <Link
              href='/dashboard/sessions'
              className='text-xs text-pink-500 hover:text-pink-600 hover:underline
                         flex items-center gap-1 transition-colors duration-150'
            >
              View all <ChevronRightIcon size={13} />
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 gap-3 text-center'>
              <div className='w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center'>
                <CalendarIcon size={20} className='text-pink-400' />
              </div>
              <p className='text-sm text-ink-300'>No upcoming sessions</p>
            </div>
          ) : (
            <ul className='space-y-3'>
              {sessions.map((s) => {
                const date = s.date?.toDate?.() as Date | undefined
                return (
                  <li
                    key={s.id}
                    className='flex items-center gap-3 p-3 rounded-xl
                               bg-pink-50/60 border border-pink-100
                               hover:border-pink-300 hover:-translate-y-0.5
                               transition-all duration-200'
                  >
                    <div
                      className='w-11 h-11 rounded-xl bg-bg-surface border border-pink-100
                                   flex flex-col items-center justify-center shrink-0'
                    >
                      <span className='text-[9px] font-bold text-pink-400 uppercase leading-none'>
                        {date?.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className='text-base font-bold text-ink-900 leading-tight'>
                        {date?.getDate()}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-ink-900 truncate'>
                        {s.title}
                      </p>
                      <p className='text-xs text-ink-400'>
                        {date?.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        · Week {s.weekNum}
                      </p>
                    </div>
                    {s.zoomLink && (
                      <a
                        href={s.zoomLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs font-semibold text-pink-500 hover:text-pink-600
                                   hover:underline shrink-0 transition-colors duration-150'
                      >
                        Join →
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Daily affirmation */}
      <div className='card bg-magenta-700 border-magenta-700 relative overflow-hidden'>
        <div
          className='pointer-events-none absolute -top-10 -right-10 w-40 h-40
                        rounded-full bg-pink-400 opacity-10 blur-[60px]'
        />
        <div className='relative z-10 flex items-start gap-4'>
          <div
            className='w-10 h-10 rounded-full bg-pink-400/15 flex items-center
                          justify-center shrink-0 animate-[pulseRing_2.5s_ease-in-out_infinite]'
          >
            <StarIcon size={18} className='text-pink-300' />
          </div>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-widest text-pink-300 mb-2'>
              Today&apos;s Affirmation
            </p>
            <p className='font-serif italic text-lg leading-relaxed text-white'>
              &ldquo;I am not my patterns. I am the awareness behind
              them.&rdquo;
            </p>
            <Link
              href='/dashboard/affirmations'
              className='text-xs text-pink-300 hover:text-pink-200 hover:underline
                         mt-3 inline-block transition-colors duration-150'
            >
              View all affirmations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

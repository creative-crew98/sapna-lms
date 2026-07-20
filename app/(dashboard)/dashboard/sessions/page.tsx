'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import { CalendarIcon, LinkIcon } from '@/components/icons'

interface Session {
  id: string
  title: string
  date: Timestamp
  weekNum: number
  programId: string
  status: 'scheduled' | 'completed' | 'cancelled'
  zoomLink: string
  notes: string
}

type Tab = 'upcoming' | 'past'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-pink-50 text-pink-600 border-pink-200',
  completed: 'bg-success-50 text-success-600 border-success-200',
  cancelled: 'bg-error-50 text-error-500 border-error-200',
}

const PROGRAM_NAMES: Record<string, string> = {
  '1-week': 'Soul Blueprint',
  '8-week': 'Empowered You',
}

export default function SessionsPage(): JSX.Element {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [tab, setTab] = useState<Tab>('upcoming')

  useEffect(() => {
    if (!user) return

    async function fetchSessions(): Promise<void> {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'sessions'),
            where('userId', '==', user!.uid),
            orderBy('date', 'desc'),
          ),
        )
        setSessions(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Session[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [user])

  const now = new Date()
  const upcoming = sessions.filter(
    (s) => s.date?.toDate?.() >= now && s.status !== 'cancelled',
  )
  const past = sessions.filter(
    (s) => s.date?.toDate?.() < now || s.status === 'completed',
  )
  const displayed = tab === 'upcoming' ? upcoming : past

  const TABS: { id: Tab; label: string }[] = [
    { id: 'upcoming', label: `Upcoming (${upcoming.length})` },
    { id: 'past', label: `Past (${past.length})` },
  ]

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='skeleton h-24' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Journey</p>
        <h1 className='page-title font-serif'>Sessions</h1>
        <p className='page-desc'>{sessions.length} total sessions</p>
      </div>

      {/* Tabs */}
      <div className='flex gap-2'>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold
                        border transition-all duration-150
                        ${
                          tab === t.id
                            ? 'bg-magenta-700 text-white border-magenta-700'
                            : 'bg-bg-surface text-ink-500 border-ink-100 hover:border-pink-400'
                        }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3'>
          <CalendarIcon size={36} className='text-ink-100' />
          <p className='text-sm text-ink-300'>No {tab} sessions</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {displayed.map((s) => {
            const date = s.date?.toDate?.() as Date | undefined

            return (
              <div
                key={s.id}
                className='card hover:-translate-y-0.5 transition-transform duration-200'
              >
                <div className='flex items-start gap-4'>
                  {/* Date block */}
                  <div
                    className='w-14 h-14 rounded-xl bg-pink-50 flex flex-col
                                  items-center justify-center shrink-0'
                  >
                    <span className='text-[10px] font-bold text-pink-400 uppercase leading-none'>
                      {date?.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className='text-xl font-bold text-ink-900 leading-tight'>
                      {date?.getDate()}
                    </span>
                    <span className='text-[9px] text-ink-400'>
                      {date?.getFullYear()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <p className='font-semibold text-ink-900'>{s.title}</p>
                        <p className='text-xs text-ink-400 mt-0.5'>
                          {date?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          · Week {s.weekNum} ·{' '}
                          {PROGRAM_NAMES[s.programId] ?? s.programId}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1
                                    rounded-full border shrink-0 capitalize
                                    ${STATUS_COLORS[s.status] ?? ''}`}
                      >
                        {s.status}
                      </span>
                    </div>

                    {s.notes && (
                      <p className='text-sm text-ink-500 mt-2 leading-relaxed'>
                        {s.notes}
                      </p>
                    )}

                    {s.zoomLink && s.status === 'scheduled' && (
                      <a
                        href={s.zoomLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1.5 mt-3
                                   text-xs font-semibold text-pink-500
                                   bg-pink-50 px-3 py-1.5 rounded-full
                                   hover:bg-pink-100 hover:text-pink-600
                                   transition-colors duration-150'
                      >
                        <LinkIcon size={12} />
                        Join Session
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

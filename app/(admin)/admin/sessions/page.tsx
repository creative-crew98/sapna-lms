'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CalendarIcon, PenIcon, TrashIcon, PlusIcon } from '@/components/icons'

interface Session {
  id: string
  title: string
  programId: string
  weekNum: number
  date: any
  status: string
  zoomLink: string
  userId: string
}

const PROGRAM_LABELS: Record<string, string> = {
  '1-week': '1-Week',
  '8-week': '8-Week',
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-info-50 text-info-600 border-info-200',
  completed: 'bg-success-50 text-success-600 border-success-200',
  cancelled: 'bg-error-50 text-error-500 border-error-200',
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions(): Promise<void> {
    try {
      const snap = await getDocs(
        query(collection(db, 'sessions'), orderBy('date', 'desc')),
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

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Delete this session?')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'sessions', id))
      setSessions((prev) => prev.filter((s) => s.id !== id))
      toast.success('Session deleted')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='skeleton h-8 w-40' />
        {[...Array(5)].map((_, i) => (
          <div key={i} className='skeleton h-16' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='page-header mb-0'>
          <p className='page-eyebrow'>Admin</p>
          <h1 className='page-title'>Sessions</h1>
          <p className='page-desc'>{sessions.length} total sessions</p>
        </div>
        <Link href='/admin/sessions/new'>
          <button className='btn btn-primary flex items-center gap-2'>
            <PlusIcon size={15} />
            New Session
          </button>
        </Link>
      </div>

      {/* Empty state */}
      {sessions.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3'>
          <CalendarIcon size={40} className='text-pink-100' />
          <p className='text-ink-300'>No sessions yet</p>
          <Link href='/admin/sessions/new'>
            <button className='btn btn-soft'>Create your first session</button>
          </Link>
        </div>
      ) : (
        <div className='card p-0 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-pink-100 bg-bg-muted'>
                  {['Title', 'Program', 'Date & Time', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className='text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400'
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className='divide-y divide-pink-100'>
                {sessions.map((s) => {
                  const date = s.date?.toDate?.() as Date | undefined
                  return (
                    <tr
                      key={s.id}
                      className='hover:bg-bg-muted transition-colors duration-100'
                    >
                      {/* Title + date mini-calendar */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 rounded-xl bg-pink-50 flex flex-col items-center justify-center flex-shrink-0'>
                            <span className='text-[9px] font-bold text-pink-400 uppercase'>
                              {date
                                ? date.toLocaleString('default', {
                                    month: 'short',
                                  })
                                : '—'}
                            </span>
                            <span className='text-sm font-bold text-ink-900'>
                              {date ? date.getDate() : '—'}
                            </span>
                          </div>
                          <div>
                            <p className='font-medium text-ink-900'>
                              {s.title}
                            </p>
                            <p className='text-xs text-ink-400'>
                              Week {s.weekNum}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Program */}
                      <td className='px-5 py-4'>
                        <span className='badge badge-rose'>
                          {PROGRAM_LABELS[s.programId] || s.programId}
                        </span>
                      </td>

                      {/* Date & time */}
                      <td className='px-5 py-4 text-ink-400'>
                        <p>
                          {date?.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }) || '—'}
                        </p>
                        <p className='text-xs text-ink-300'>
                          {date?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>

                      {/* Status */}
                      <td className='px-5 py-4'>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[s.status] || 'bg-ink-50 text-ink-500 border-ink-200'}`}
                        >
                          {s.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2'>
                          <Link href={`/admin/sessions/${s.id}/edit`}>
                            <button className='w-8 h-8 flex items-center justify-center rounded-lg border border-ink-100 text-ink-400 hover:border-pink-300 hover:text-pink-400 transition-all duration-150'>
                              <PenIcon size={13} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id)}
                            disabled={deleting === s.id}
                            className='w-8 h-8 flex items-center justify-center rounded-lg border border-ink-100 text-ink-400 hover:border-error-300 hover:text-error-500 transition-all duration-150 disabled:opacity-40'
                          >
                            {deleting === s.id ? (
                              <svg
                                className='animate-spin'
                                width='13'
                                height='13'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                aria-hidden='true'
                              >
                                <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                              </svg>
                            ) : (
                              <TrashIcon size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

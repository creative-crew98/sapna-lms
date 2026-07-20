'use client'

import { use, useEffect, useState } from 'react'
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  BookIcon,
  CalendarIcon,
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
} from '@/components/icons'
import type {
  UserDoc,
  Enrollment as EnrollmentBase,
  Session as SessionBase,
} from '@/types'

// ── Narrowed types (Firestore returns Timestamp at runtime) ──────────────────
type Student = Omit<UserDoc, 'createdAt'> & {
  id: string
  createdAt: Timestamp | null
  photo?: string
}
type Enrollment = Omit<EnrollmentBase, 'startDate'> & {
  startDate: Timestamp | null
}
type Session = Omit<SessionBase, 'date'> & { date: Timestamp | null }

// ── Constants ────────────────────────────────────────────────────────────────
interface ProgramOption {
  id: string
  label: string
  weeks: number
}

const PROGRAMS: ProgramOption[] = [
  { id: '1-week', label: 'Soul Blueprint Intensive (1-Week)', weeks: 1 },
  { id: '8-week', label: 'Soul Awakening: Empowered You (8-Week)', weeks: 8 },
]

const TOTAL_WEEKS: Record<string, number> = { '1-week': 1, '8-week': 8 }

function computeProgress(e: Enrollment): {
  done: number
  total: number
  pct: number
} {
  const done = Object.values(e.progress || {}).filter(Boolean).length
  const total = TOTAL_WEEKS[e.programId] ?? 4
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
}

// ── Page ─────────────────────────────────────────────────────────────────────
interface StudentDetailPageProps {
  params: Promise<{ id: string }>
}

export default function StudentDetailPage({
  params,
}: StudentDetailPageProps): JSX.Element {
  const { id } = use(params)
  const router = useRouter()

  const [student, setStudent] = useState<Student | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [enrolling, setEnrolling] = useState<boolean>(false)
  const [selectedProg, setSelectedProg] = useState<string>('1-week')
  const [showEnroll, setShowEnroll] = useState<boolean>(false)

  useEffect(() => {
    async function fetchAll(): Promise<void> {
      try {
        const [userSnap, enrollSnap, sessionsSnap] = await Promise.all([
          getDoc(doc(db, 'users', id)),
          getDocs(
            query(collection(db, 'enrollments'), where('userId', '==', id)),
          ),
          getDocs(query(collection(db, 'sessions'), where('userId', '==', id))),
        ])

        if (userSnap.exists()) {
          setStudent({ id: userSnap.id, ...userSnap.data() } as Student)
        }
        setEnrollments(
          enrollSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Enrollment[],
        )
        setSessions(
          (
            sessionsSnap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as Session[]
          ).sort(
            (a, b) => (b.date?.toMillis() ?? 0) - (a.date?.toMillis() ?? 0),
          ),
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  async function handleEnroll(): Promise<void> {
    if (enrollments.find((e) => e.programId === selectedProg)) {
      toast.error('Student is already enrolled in this program')
      return
    }
    if (!student) return
    setEnrolling(true)
    try {
      const prog = PROGRAMS.find((p) => p.id === selectedProg)!
      const enrollRef = await addDoc(collection(db, 'enrollments'), {
        userId: id,
        programId: selectedProg,
        startDate: serverTimestamp(),
        currentWeek: 1,
        progress: {},
        createdAt: serverTimestamp(),
      })
      const current = student.enrolledPrograms || []
      await updateDoc(doc(db, 'users', id), {
        enrolledPrograms: [...current, selectedProg],
        updatedAt: serverTimestamp(),
      })
      setEnrollments((prev) => [
        ...prev,
        {
          id: enrollRef.id,
          userId: id,
          programId: selectedProg,
          currentWeek: 1,
          progress: {},
          startDate: null,
        },
      ])
      setStudent((prev) =>
        prev
          ? {
              ...prev,
              enrolledPrograms: [
                ...(prev.enrolledPrograms || []),
                selectedProg,
              ],
            }
          : prev,
      )
      setShowEnroll(false)
      toast.success(`Enrolled in ${prog.label}`)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setEnrolling(false)
    }
  }

  const avgProgress: number =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + computeProgress(e).pct, 0) /
            enrollments.length,
        )
      : 0

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-48' />
        <div className='skeleton h-36' />
        <div className='grid grid-cols-2 gap-4'>
          <div className='skeleton h-48' />
          <div className='skeleton h-48' />
        </div>
      </div>
    )
  }

  if (!student) {
    return <p className='text-center text-ink-400 py-12'>Student not found.</p>
  }

  return (
    <div className='space-y-6 max-w-3xl animate-fade-up'>
      {/* Back */}
      <button
        type='button'
        onClick={() => router.back()}
        className='flex items-center gap-1.5 text-sm text-ink-400
                   hover:text-ink-900 transition-colors duration-150'
      >
        <ArrowLeftIcon size={15} />
        Back to students
      </button>

      {/* Profile card */}
      <div className='card'>
        <div className='flex items-start gap-4'>
          <div className='w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 overflow-hidden'>
            {student?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student?.photo}
                alt=''
                className='w-full h-full object-cover'
              />
            ) : (
              <span className='text-xl font-semibold text-pink-500'>
                {student.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-start justify-between'>
              <div>
                <h1 className='font-serif text-xl font-semibold text-ink-900'>
                  {student.name || 'Unnamed'}
                </h1>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5
                              rounded-full border mt-1 inline-block
                              ${
                                student.role === 'admin'
                                  ? 'bg-pink-50 text-pink-600 border-pink-200'
                                  : 'bg-pink-50 text-pink-500 border-pink-200'
                              }`}
                >
                  {student.role}
                </span>
              </div>
              <div className='text-right'>
                <div className='font-serif text-2xl font-bold text-pink-500'>
                  {avgProgress}%
                </div>
                <p className='text-xs text-ink-400'>avg progress</p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4'>
              {[
                { icon: MailIcon, value: student.email || '—', truncate: true },
                {
                  icon: PhoneIcon,
                  value: student.phone || '—',
                  truncate: false,
                },
                {
                  icon: CalendarIcon,
                  value: `Joined ${
                    student.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }) ?? '—'
                  }`,
                  truncate: false,
                },
              ].map(({ icon: Icon, value, truncate }) => (
                <div
                  key={value}
                  className='flex items-center gap-2 text-sm text-ink-500'
                >
                  <Icon size={14} className='text-ink-300 flex-shrink-0' />
                  <span className={truncate ? 'truncate' : ''}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Enrollments */}
        <div className='card space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-serif text-base font-semibold text-ink-900'>
              Enrollments
            </h2>
            <button
              type='button'
              onClick={() => setShowEnroll((v) => !v)}
              className='btn btn-soft btn-sm flex items-center gap-1.5'
            >
              <PlusIcon size={13} />
              Enroll
            </button>
          </div>

          {/* Enroll form */}
          {showEnroll && (
            <div className='p-3 bg-pink-50/60 border border-pink-100 rounded-sm space-y-3'>
              <select
                className='input text-sm'
                value={selectedProg}
                onChange={(e) => setSelectedProg(e.target.value)}
              >
                {PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className='btn btn-primary btn-sm flex items-center gap-1.5 flex-1'
                >
                  {enrolling ? (
                    <svg
                      className='animate-spin'
                      width='13'
                      height='13'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                    </svg>
                  ) : (
                    <CheckIcon size={13} />
                  )}
                  Confirm
                </button>
                <button
                  type='button'
                  onClick={() => setShowEnroll(false)}
                  className='btn btn-ghost btn-sm'
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {enrollments.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 gap-2'>
              <BookIcon size={28} className='text-ink-200' />
              <p className='text-sm text-ink-300'>Not enrolled yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {enrollments.map((e) => {
                const { done, total, pct } = computeProgress(e)
                const prog = PROGRAMS.find((p) => p.id === e.programId)
                return (
                  <div
                    key={e.id}
                    className='p-3 bg-pink-50/60 border border-pink-100 rounded-sm'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <p className='text-sm font-medium text-ink-900'>
                        {prog?.label || e.programId}
                      </p>
                      <span className='text-xs font-semibold text-pink-500'>
                        {pct}%
                      </span>
                    </div>
                    <div className='progress-track mb-1.5'>
                      <div
                        className='progress-fill'
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className='text-xs text-ink-400'>
                      Week {e.currentWeek} of {total} · {done} modules completed
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sessions */}
        <div className='card space-y-4'>
          <h2 className='font-serif text-base font-semibold text-ink-900'>
            Sessions ({sessions.length})
          </h2>
          {sessions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 gap-2'>
              <CalendarIcon size={28} className='text-ink-200' />
              <p className='text-sm text-ink-300'>No sessions yet</p>
            </div>
          ) : (
            <div className='space-y-2 max-h-80 overflow-y-auto scroll-smooth'>
              {sessions.map((s) => {
                const date = s.date?.toDate?.() as Date | undefined
                return (
                  <div
                    key={s.id}
                    className='flex items-center gap-3 p-2.5 rounded-sm
                               hover:bg-pink-50/40 transition-colors duration-150'
                  >
                    <div className='w-10 h-10 rounded-sm bg-pink-50 flex flex-col items-center justify-center flex-shrink-0'>
                      <span className='text-[9px] font-bold text-pink-400 uppercase'>
                        {date?.toLocaleString('default', { month: 'short' }) ??
                          '—'}
                      </span>
                      <span className='text-sm font-bold text-ink-900'>
                        {date?.getDate() ?? '—'}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-ink-900 truncate'>
                        {s.title}
                      </p>
                      <p className='text-xs text-ink-400'>
                        Week {s.weekNum} ·{' '}
                        {date?.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        }) ?? '—'}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                                  ${
                                    s.status === 'completed'
                                      ? 'bg-success-50 text-success-600'
                                      : s.status === 'cancelled'
                                        ? 'bg-error-50 text-error-500'
                                        : 'bg-info-50 text-info-600'
                                  }`}
                    >
                      {s.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

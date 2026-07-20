'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  UsersIcon,
  BookIcon,
  CalendarIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  SparkleIcon,
} from '@/components/icons'

// ── Types ──────────────────────────────────────────────
interface UserDoc {
  uid: string
  name: string
  email: string
  photo: string
  enrolledPrograms: string[]
  createdAt: Timestamp
  role: string
}

interface Enrollment {
  id: string
  userId: string
  programId: string
  currentWeek: number
  startDate: Timestamp
  progress: Record<string, boolean>
}

interface Session {
  id: string
  title: string
  date: Timestamp
  status: string
  programId: string
}

// ── Helpers ─────────────────────────────────────────────
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const PROGRAM_NAMES: Record<string, string> = {
  '1-week': 'Soul Blueprint (1-Week)',
  '8-week': 'Empowered You (8-Week)',
}

// Using design system colors (pink-400 / a complementary violet for the 2nd series)
const CHART_COLORS = {
  rose: '#c4388a',
  purple: '#9B7FD4',
}

function getMonthKey(ts: Timestamp | Date | null | undefined): string {
  if (!ts) return ''
  const d = ts instanceof Timestamp ? ts.toDate() : ts
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getLast6Months(): string[] {
  const result: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    )
  }
  return result
}

function formatMonth(key: string): string {
  const [year, month] = key.split('-')
  return `${MONTHS[parseInt(month) - 1]} '${year.slice(2)}`
}

// ── Custom Tooltip ──────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className='bg-bg-surface border border-pink-100 rounded-xl px-4 py-3 shadow-card text-sm'>
      <p className='font-semibold text-ink-900 mb-1'>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className='text-xs'>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Stat Card ───────────────────────────────────────────
interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconClass: string
  href: string
  trend?: number
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
  href,
  trend,
}: StatCardProps) {
  return (
    <Link href={href}>
      <div className='card-hover cursor-pointer'>
        <div className='flex items-start justify-between mb-4'>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
          >
            <Icon size={18} />
          </div>
          {trend !== undefined && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                trend >= 0
                  ? 'bg-success-50 text-success-600'
                  : 'bg-error-50 text-error-500'
              }`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className='stat-value'>{value}</div>
        <div className='stat-label mt-1'>{label}</div>
        {sub && <p className='text-xs text-ink-300 mt-0.5'>{sub}</p>}
      </div>
    </Link>
  )
}

// ── Main Page ───────────────────────────────────────────
export default function AdminOverviewPage() {
  const [students, setStudents] = useState<UserDoc[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersSnap, enrollSnap, sessionsSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, 'users'),
              where('role', '==', 'student'),
              orderBy('createdAt', 'desc'),
            ),
          ),
          getDocs(
            query(collection(db, 'enrollments'), orderBy('startDate', 'desc')),
          ),
          getDocs(query(collection(db, 'sessions'), orderBy('date', 'desc'))),
        ])
        setStudents(
          usersSnap.docs.map((d) => ({ uid: d.id, ...d.data() })) as UserDoc[],
        )
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
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Used for the "today's date" greeting text and a couple of JSX date
  // comparisons — cheap to compute directly, no need to memoize.
  const now = new Date()

  // ── Derived analytics ─────────────────────────────────
  // All of this is pure computation over `students`/`enrollments`/`sessions` —
  // memoizing it means re-renders triggered by unrelated state (sidebar
  // toggle, hover states, etc.) don't re-run these filters/loops every time.
  const {
    enrollmentTrend,
    programDist,
    weekCompletion,
    sessionStats,
    upcoming,
    recentStudents,
    avgProgress,
    thisMonth,
    thisMonthEnroll,
    enrollTrend,
  } = useMemo(() => {
    const now = new Date()
    const last6 = getLast6Months()

    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const lastMonth = (() => {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })()

    const enrollmentTrend = last6.map((month) => ({
      month: formatMonth(month),
      enrollments: enrollments.filter(
        (e) => e.startDate && getMonthKey(e.startDate) === month,
      ).length,
      students: students.filter(
        (s) => s.createdAt && getMonthKey(s.createdAt) === month,
      ).length,
    }))

    const programDist = [
      {
        name: 'Soul Blueprint 1-Week',
        value: enrollments.filter((e) => e.programId === '1-week').length,
        color: CHART_COLORS.rose,
      },
      {
        name: 'Empowered You 8-Week',
        value: enrollments.filter((e) => e.programId === '8-week').length,
        color: CHART_COLORS.purple,
      },
    ]

    const enrolled8 = enrollments.filter((e) => e.programId === '8-week')
    const weekCompletion = Array.from({ length: 8 }, (_, i) => {
      const weekKey = `week_${i + 1}`
      const completed = enrolled8.filter((e) => e.progress?.[weekKey]).length
      return {
        week: `W${i + 1}`,
        completed,
        total: enrolled8.length,
        rate:
          enrolled8.length > 0
            ? Math.round((completed / enrolled8.length) * 100)
            : 0,
      }
    })

    const sessionStats = {
      completed: sessions.filter((s) => s.status === 'completed').length,
      scheduled: sessions.filter((s) => s.status === 'scheduled').length,
      cancelled: sessions.filter((s) => s.status === 'cancelled').length,
    }

    const upcoming = sessions
      .filter((s) => s.date?.toDate?.() > now && s.status === 'scheduled')
      .slice(0, 5)

    const recentStudents = students.slice(0, 5)

    const avgProgress =
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((acc, e) => {
              const done = Object.values(e.progress || {}).filter(
                Boolean,
              ).length
              const total = e.programId === '8-week' ? 8 : 4
              return acc + (done / total) * 100
            }, 0) / enrollments.length,
          )
        : 0

    const thisMonthEnroll = enrollments.filter(
      (e) => e.startDate && getMonthKey(e.startDate) === thisMonth,
    ).length
    const lastMonthEnroll = enrollments.filter(
      (e) => e.startDate && getMonthKey(e.startDate) === lastMonth,
    ).length
    const enrollTrend =
      lastMonthEnroll > 0
        ? Math.round(
            ((thisMonthEnroll - lastMonthEnroll) / lastMonthEnroll) * 100,
          )
        : thisMonthEnroll > 0
          ? 100
          : 0

    return {
      enrollmentTrend,
      programDist,
      weekCompletion,
      sessionStats,
      upcoming,
      recentStudents,
      avgProgress,
      thisMonth,
      thisMonthEnroll,
      enrollTrend,
    }
  }, [students, enrollments, sessions])

  // ── Loading skeleton ──────────────────────────────────
  if (loading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='h-8 w-48 skeleton' />
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-28 skeleton' />
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 h-72 skeleton' />
          <div className='h-72 skeleton' />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-64 skeleton' />
          <div className='h-64 skeleton' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='page-header mb-0'>
          <p className='page-eyebrow'>Admin</p>
          <h1 className='page-title'>Analytics & Overview</h1>
          <p className='page-desc'>
            {now.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className='hidden md:flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100'>
          <SparkleIcon size={13} className='text-pink-400' />
          <span className='text-xs font-semibold text-pink-500'>Live data</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          label='Total Students'
          value={students.length}
          sub={`+${students.filter((s) => s.createdAt && getMonthKey(s.createdAt) === thisMonth).length} this month`}
          icon={UsersIcon}
          iconClass='bg-pink-50 text-pink-400'
          href='/admin/students'
          trend={enrollTrend}
        />
        <StatCard
          label='Total Enrollments'
          value={enrollments.length}
          sub={`${thisMonthEnroll} new this month`}
          icon={TrendingUpIcon}
          iconClass='bg-pink-50 text-pink-500'
          href='/admin/students'
          trend={enrollTrend}
        />
        <StatCard
          label='Avg. Completion'
          value={`${avgProgress}%`}
          sub='Across all programs'
          icon={BookIcon}
          iconClass='bg-success-50 text-success-500'
          href='/admin/programs'
        />
        <StatCard
          label='Sessions Done'
          value={sessionStats.completed}
          sub={`${sessionStats.scheduled} upcoming`}
          icon={CalendarIcon}
          iconClass='bg-info-50 text-info-500'
          href='/admin/sessions'
        />
      </div>

      {/* Enrollment trend + Program pie */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Area chart */}
        <div className='card lg:col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-base font-semibold text-ink-900 font-serif'>
                Enrollment Trend
              </h2>
              <p className='text-xs text-ink-400 mt-0.5'>Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width='100%' height={220}>
            <AreaChart
              data={enrollmentTrend}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id='enrollGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor={CHART_COLORS.rose}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset='95%'
                    stopColor={CHART_COLORS.rose}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id='studGrad' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor={CHART_COLORS.purple}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset='95%'
                    stopColor={CHART_COLORS.purple}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f9d8f2'
                vertical={false}
              />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 11, fill: '#8b5a80' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#8b5a80' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#8b5a80' }} />
              <Area
                type='monotone'
                dataKey='enrollments'
                name='Enrollments'
                stroke={CHART_COLORS.rose}
                strokeWidth={2}
                fill='url(#enrollGrad)'
                dot={{ fill: CHART_COLORS.rose, r: 3 }}
              />
              <Area
                type='monotone'
                dataKey='students'
                name='New Students'
                stroke={CHART_COLORS.purple}
                strokeWidth={2}
                fill='url(#studGrad)'
                dot={{ fill: CHART_COLORS.purple, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className='card'>
          <h2 className='text-base font-semibold text-ink-900 font-serif mb-1'>
            Program Split
          </h2>
          <p className='text-xs text-ink-400 mb-4'>
            {enrollments.length} total enrollments
          </p>
          {enrollments.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-48 gap-2'>
              <BookIcon size={32} className='text-pink-100' />
              <p className='text-xs text-ink-300'>No enrollments yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width='100%' height={160}>
                <PieChart>
                  <Pie
                    data={programDist}
                    cx='50%'
                    cy='50%'
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey='value'
                  >
                    {programDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className='space-y-2 mt-2'>
                {programDist.map((p, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-2.5 h-2.5 rounded-full flex-shrink-0'
                        style={{ background: p.color }}
                      />
                      <span className='text-xs text-ink-400'>{p.name}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-semibold text-ink-900'>
                        {p.value}
                      </span>
                      <span className='text-[10px] text-ink-300'>
                        (
                        {enrollments.length > 0
                          ? Math.round((p.value / enrollments.length) * 100)
                          : 0}
                        %)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Week completion + Session stats */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Bar chart */}
        <div className='card'>
          <div className='mb-6'>
            <h2 className='text-base font-semibold text-ink-900 font-serif'>
              8-Week Program Progress
            </h2>
            <p className='text-xs text-ink-400 mt-0.5'>
              Completion rate per week
            </p>
          </div>
          {enrollments.filter((e) => e.programId === '8-week').length === 0 ? (
            <div className='flex flex-col items-center justify-center h-40 gap-2'>
              <TrendingUpIcon size={32} className='text-pink-100' />
              <p className='text-xs text-ink-300'>No 8-week enrollments yet</p>
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={200}>
              <BarChart
                data={weekCompletion}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f9d8f2'
                  vertical={false}
                />
                <XAxis
                  dataKey='week'
                  tick={{ fontSize: 11, fill: '#8b5a80' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8b5a80' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  unit='%'
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey='rate'
                  name='Completion %'
                  fill={CHART_COLORS.rose}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Session overview */}
        <div className='card'>
          <div className='mb-5'>
            <h2 className='text-base font-semibold text-ink-900 font-serif'>
              Session Overview
            </h2>
            <p className='text-xs text-ink-400 mt-0.5'>
              {sessions.length} total sessions
            </p>
          </div>

          <div className='grid grid-cols-3 gap-3 mb-6'>
            {[
              {
                label: 'Completed',
                val: sessionStats.completed,
                cls: 'bg-success-50 text-success-600',
              },
              {
                label: 'Upcoming',
                val: sessionStats.scheduled,
                cls: 'bg-info-50 text-info-600',
              },
              {
                label: 'Cancelled',
                val: sessionStats.cancelled,
                cls: 'bg-error-50 text-error-500',
              },
            ].map(({ label, val, cls }) => (
              <div
                key={label}
                className='flex flex-col items-center justify-center p-3 rounded-xl border border-pink-100'
              >
                <span
                  className={`text-xl font-bold font-serif mb-1 ${cls.split(' ')[1]}`}
                >
                  {val}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <h3 className='text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3'>
            Next Sessions
          </h3>
          {upcoming.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-6 gap-2'>
              <CalendarIcon size={28} className='text-pink-100' />
              <p className='text-xs text-ink-300'>No upcoming sessions</p>
              <Link
                href='/admin/sessions/new'
                className='text-xs text-pink-400 hover:text-magenta-600 hover:underline transition-colors'
              >
                Schedule one →
              </Link>
            </div>
          ) : (
            <ul className='space-y-2'>
              {upcoming.map((s) => {
                const d = s.date?.toDate?.() as Date
                return (
                  <li
                    key={s.id}
                    className='flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-muted transition-colors'
                  >
                    <div className='w-10 h-10 rounded-xl bg-pink-50 flex flex-col items-center justify-center flex-shrink-0'>
                      <span className='text-[9px] font-bold text-pink-400 uppercase'>
                        {d
                          ? d.toLocaleString('default', { month: 'short' })
                          : '—'}
                      </span>
                      <span className='text-sm font-bold text-ink-900'>
                        {d ? d.getDate() : '—'}
                      </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-ink-900 truncate'>
                        {s.title}
                      </p>
                      <p className='text-xs text-ink-400'>
                        {d
                          ? d.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}{' '}
                        · {PROGRAM_NAMES[s.programId] || s.programId}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recent students + Quick actions */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Recent students */}
        <div className='card lg:col-span-2'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-base font-semibold text-ink-900 font-serif'>
              Recent Students
            </h2>
            <Link
              href='/admin/students'
              className='text-xs text-pink-400 hover:text-magenta-600 hover:underline flex items-center gap-1 transition-colors'
            >
              View all <ChevronRightIcon size={13} />
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 gap-2'>
              <UsersIcon size={32} className='text-pink-100' />
              <p className='text-sm text-ink-300'>No students yet</p>
            </div>
          ) : (
            <ul className='divide-y divide-pink-100'>
              {recentStudents.map((s) => {
                const enrolled = enrollments.filter((e) => e.userId === s.uid)
                const avgProg =
                  enrolled.length > 0
                    ? Math.round(
                        enrolled.reduce((acc, e) => {
                          const done = Object.values(e.progress || {}).filter(
                            Boolean,
                          ).length
                          const total = e.programId === '8-week' ? 8 : 4
                          return acc + (done / total) * 100
                        }, 0) / enrolled.length,
                      )
                    : 0

                return (
                  <li
                    key={s.uid}
                    className='flex items-center gap-3 py-3 px-2 hover:bg-bg-muted rounded-xl -mx-2 transition-colors'
                  >
                    <div className='w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center flex-shrink-0 overflow-hidden'>
                      {s.photo ? (
                        <img
                          src={s.photo}
                          alt=''
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span className='text-xs font-semibold text-pink-600'>
                          {s.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-ink-900 truncate'>
                          {s.name || 'Unnamed'}
                        </p>
                        <span className='text-xs font-semibold text-pink-400 ml-2 flex-shrink-0'>
                          {avgProg}%
                        </span>
                      </div>
                      <p className='text-xs text-ink-400 truncate mb-1.5'>
                        {s.email}
                      </p>
                      <div className='progress-track'>
                        <div
                          className='progress-fill'
                          style={{ width: `${avgProg}%` }}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className='card'>
          <h2 className='text-base font-semibold text-ink-900 font-serif mb-4'>
            Quick Actions
          </h2>
          <div className='space-y-2'>
            {[
              {
                label: 'Add Student',
                href: '/admin/students/new',
                icon: UsersIcon,
                cls: 'bg-pink-50 text-pink-400',
              },
              {
                label: 'New Session',
                href: '/admin/sessions/new',
                icon: CalendarIcon,
                cls: 'bg-info-50 text-info-500',
              },
              {
                label: 'Add Resource',
                href: '/admin/resources/new',
                icon: BookIcon,
                cls: 'bg-pink-50 text-pink-500',
              },
              {
                label: 'Edit Programs',
                href: '/admin/programs',
                icon: TrendingUpIcon,
                cls: 'bg-success-50 text-success-500',
              },
            ].map(({ label, href, icon: Icon, cls }) => (
              <Link key={label} href={href}>
                <div className='flex items-center gap-3 p-3 rounded-xl border border-pink-100 hover:border-pink-300 hover:bg-bg-muted transition-all group cursor-pointer'>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cls}`}
                  >
                    <Icon size={15} />
                  </div>
                  <span className='text-sm font-medium text-ink-400 group-hover:text-ink-900 transition-colors'>
                    {label}
                  </span>
                  <ChevronRightIcon
                    size={14}
                    className='ml-auto text-ink-300 group-hover:text-pink-400 transition-colors'
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* This month mini stats */}
          <div className='mt-5 pt-5 border-t border-pink-100 space-y-3'>
            <p className='text-[10px] font-semibold uppercase tracking-widest text-ink-400'>
              This month
            </p>
            {[
              {
                label: 'New signups',
                val: students.filter(
                  (s) => s.createdAt && getMonthKey(s.createdAt) === thisMonth,
                ).length,
              },
              { label: 'New enrollments', val: thisMonthEnroll },
              {
                label: 'Sessions held',
                val: sessions.filter(
                  (s) =>
                    s.status === 'completed' &&
                    s.date?.toDate?.() >
                      new Date(now.getFullYear(), now.getMonth(), 1),
                ).length,
              },
            ].map(({ label, val }) => (
              <div key={label} className='flex items-center justify-between'>
                <span className='text-xs text-ink-400'>{label}</span>
                <span className='text-sm font-bold text-ink-900 font-serif'>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

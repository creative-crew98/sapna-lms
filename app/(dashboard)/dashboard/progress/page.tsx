'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUpIcon, CheckIcon } from '@/components/icons'

interface Enrollment {
  id: string
  programId: string
  currentWeek: number
  progress: Record<string, boolean>
  startDate: Timestamp | null
}

interface StatItem {
  label: string
  value: string
  sub: string
}

interface ChartDataPoint {
  week: string
  completed: number
}

const PROGRAM_NAMES: Record<string, string> = {
  '1-week': 'Soul Blueprint (1-Week)',
  '8-week': 'Empowered You (8-Week)',
}

const TOTAL_WEEKS: Record<string, number> = {
  '1-week': 1,
  '8-week': 8,
}

export default function ProgressPage(): JSX.Element {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!user) return

    async function fetchEnrollments(): Promise<void> {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'enrollments'),
            where('userId', '==', user!.uid),
          ),
        )
        setEnrollments(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Enrollment[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [user])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        <div className='grid grid-cols-3 gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='skeleton h-24' />
          ))}
        </div>
        <div className='skeleton h-64' />
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Journey</p>
        <h1 className='page-title font-serif'>My Progress</h1>
      </div>

      {enrollments.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3'>
          <TrendingUpIcon size={36} className='text-ink-100' />
          <p className='text-sm text-ink-300'>
            Enroll in a program to track progress
          </p>
        </div>
      ) : (
        enrollments.map((e) => {
          const total: number = TOTAL_WEEKS[e.programId] ?? 4
          const done: number = Object.values(e.progress ?? {}).filter(
            Boolean,
          ).length
          const pct: number = total > 0 ? Math.round((done / total) * 100) : 0

          const chartData: ChartDataPoint[] = Array.from(
            { length: total },
            (_, i) => ({
              week: `W${i + 1}`,
              completed: e.progress?.[`week_${i + 1}`] ? 100 : 0,
            }),
          )

          const stats: StatItem[] = [
            { label: 'Completed', value: `${done}/${total}`, sub: 'modules' },
            { label: 'Progress', value: `${pct}%`, sub: 'overall' },
            {
              label: 'Current',
              value: `Wk ${e.currentWeek}`,
              sub: `of ${total}`,
            },
          ]

          return (
            <div key={e.id} className='space-y-6'>
              {/* Stats row */}
              <div className='grid grid-cols-3 gap-4'>
                {stats.map(({ label, value, sub }) => (
                  <div
                    key={label}
                    className='stat-card text-center items-center'
                  >
                    <div className='stat-value'>{value}</div>
                    <div className='stat-label'>{label}</div>
                    <div className='text-xs text-ink-300'>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar + chart */}
              <div className='card'>
                <div className='flex items-center justify-between mb-2'>
                  <p className='font-serif text-sm font-semibold text-ink-900'>
                    {PROGRAM_NAMES[e.programId] ?? e.programId}
                  </p>
                  <span className='text-sm font-bold text-pink-400'>
                    {pct}%
                  </span>
                </div>

                <div className='progress-track h-2.5 mb-4'>
                  <div
                    className='progress-fill transition-[width] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]'
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Recharts area chart — inline styles required by recharts API */}
                <ResponsiveContainer width='100%' height={160}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id='progGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#c4388a'
                          stopOpacity={0.2}
                        />
                        <stop
                          offset='95%'
                          stopColor='#c4388a'
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
                    <Tooltip
                      formatter={(value) => {
                        const normalized = Array.isArray(value)
                          ? value[0]
                          : value
                        const amount =
                          typeof normalized === 'number'
                            ? normalized
                            : Number(normalized ?? 0)
                        return [`${amount}%`, 'Completed'] as [string, string]
                      }}
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid #f9d8f2',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='completed'
                      stroke='#c4388a'
                      strokeWidth={2}
                      fill='url(#progGrad)'
                      dot={{ fill: '#c4388a', r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Week checklist */}
              <div className='card space-y-2'>
                <p className='text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3'>
                  Week by week
                </p>
                {Array.from({ length: total }, (_, i) => {
                  const weekKey = `week_${i + 1}`
                  const isDone = e.progress?.[weekKey] ?? false
                  const isActive = i + 1 === e.currentWeek
                  const isLocked = i + 1 > e.currentWeek

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border
                        ${
                          isDone
                            ? 'bg-success-50 border-success-200'
                            : isActive
                              ? 'bg-pink-50 border-pink-100'
                              : 'bg-bg-muted border-ink-100 opacity-50'
                        }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center
                                    shrink-0 text-xs font-semibold
                          ${
                            isDone
                              ? 'bg-success-500 text-white'
                              : isActive
                                ? 'bg-magenta-700 text-white'
                                : 'bg-ink-100 text-ink-300'
                          }`}
                      >
                        {isDone ? <CheckIcon size={13} /> : i + 1}
                      </div>

                      <p
                        className={`text-sm font-medium
                        ${
                          isDone
                            ? 'text-success-700'
                            : isActive
                              ? 'text-ink-900'
                              : 'text-ink-400'
                        }`}
                      >
                        Week {i + 1}
                        {isDone
                          ? ' — Completed ✓'
                          : isActive
                            ? ' — In Progress'
                            : ' — Upcoming'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

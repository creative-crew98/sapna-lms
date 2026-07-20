'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { BookIcon, CheckIcon } from '@/components/icons'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

interface Enrollment {
  id: string
  programId: string
  currentWeek: number
  progress: Record<string, boolean>
}

interface ModuleItem {
  weekNum: number
  title: string
  description: string
  locked: boolean
}

interface Program {
  id: string
  title: string
  subtitle: string
  weeks: number
  includes: string[]
  modules: ModuleItem[]
  introVideoUrl?: string
}

const TOTAL_WEEKS: Record<string, number> = {
  '1-week': 1,
  '8-week': 8,
}

export default function ProgramsPage(): JSX.Element {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!user) return

    async function fetchAll(): Promise<void> {
      try {
        const enrollSnap = await getDocs(
          query(
            collection(db, 'enrollments'),
            where('userId', '==', user!.uid),
          ),
        )
        const enrolls = enrollSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Enrollment[]
        setEnrollments(enrolls)

        const progDocs = await Promise.all(
          enrolls.map((e) => getDoc(doc(db, 'programs', e.programId))),
        )
        setPrograms(
          progDocs
            .filter((d) => d.exists())
            .map((d) => ({ id: d.id, ...d.data() })) as Program[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [user])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        <div className='skeleton h-64' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Journey</p>
        <h1 className='page-title font-serif'>My Programs</h1>
      </div>

      {enrollments.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3 text-center'>
          <div className='w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center'>
            <BookIcon size={24} className='text-pink-400' />
          </div>
          <h2 className='font-serif italic text-lg text-ink-900'>
            No programs yet
          </h2>
          <p className='text-sm text-ink-300 max-w-xs'>
            You are not enrolled in any program yet. Reach out to Sapna to get
            started.
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {enrollments.map((enrollment) => {
            const program = programs.find((p) => p.id === enrollment.programId)
            const total = TOTAL_WEEKS[enrollment.programId] ?? 4
            const done = Object.values(enrollment.progress ?? {}).filter(
              Boolean,
            ).length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            const modules: ModuleItem[] =
              program?.modules ??
              Array.from({ length: total }, (_, i) => ({
                weekNum: i + 1,
                title: `Week ${i + 1}`,
                description: '',
                locked: i >= enrollment.currentWeek,
              }))

            return (
              <div key={enrollment.id} className='card space-y-5'>
                {/* Header */}
                <div className='flex items-start justify-between'>
                  <div>
                    <span className='badge badge-rose text-[10px] mb-2 inline-block'>
                      {total}-Week Program
                    </span>
                    <h2 className='font-serif text-xl text-ink-900'>
                      {program?.title ?? enrollment.programId}
                    </h2>
                    {program?.subtitle && (
                      <p className='text-sm text-ink-400 mt-0.5'>
                        {program.subtitle}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <div className='font-serif text-2xl font-bold text-pink-400'>
                      {pct}%
                    </div>
                    <p className='text-xs text-ink-400'>complete</p>
                  </div>
                </div>

                {/* Course video */}
                {(() => {
                  const embedUrl = getYouTubeEmbedUrl(program?.introVideoUrl)
                  if (!embedUrl) return null
                  return (
                    <div
                      className='w-full rounded-xl overflow-hidden aspect-video'
                    >
                      <iframe
                        src={embedUrl}
                        title={`${program?.title ?? 'Course'} video`}
                        className='w-full h-full'
                        loading='lazy'
                        allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
                        referrerPolicy='strict-origin-when-cross-origin'
                        sandbox='allow-scripts allow-same-origin allow-popups allow-presentation'
                        allowFullScreen
                      />
                    </div>
                  )
                })()}

                {/* Progress bar */}
                <div>
                  <div className='progress-track mb-1.5'>
                    <div
                      className='progress-fill transition-[width] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]'
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className='text-xs text-ink-400'>
                    {done} of {total} modules completed · Week{' '}
                    {enrollment.currentWeek} of {total}
                  </p>
                </div>

                {/* Modules list */}
                <div className='space-y-2'>
                  <p className='text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3'>
                    Modules
                  </p>
                  {modules.map((mod) => {
                    const weekKey = `week_${mod.weekNum}`
                    const isDone = enrollment.progress?.[weekKey] ?? false
                    const isActive = mod.weekNum === enrollment.currentWeek
                    const isLocked = mod.weekNum > enrollment.currentWeek

                    return (
                      <Link
                        key={mod.weekNum}
                        href={
                          isLocked
                            ? '#'
                            : `/dashboard/programs/${enrollment.programId}/week/${mod.weekNum}`
                        }
                        aria-disabled={isLocked}
                        className={isLocked ? 'pointer-events-none' : ''}
                      >
                        <div
                          className={`module-row ${isLocked ? 'opacity-50' : ''}`}
                        >
                          <div
                            className={`module-dot
                              ${isDone ? 'module-dot-done' : ''}
                              ${isActive && !isDone ? 'module-dot-active' : ''}
                              ${isLocked ? 'module-dot-locked' : ''}
                            `}
                          >
                            {isDone ? (
                              <CheckIcon size={12} />
                            ) : isLocked ? (
                              '🔒'
                            ) : (
                              mod.weekNum
                            )}
                          </div>

                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-ink-900'>
                              Week {mod.weekNum}
                              {mod.title ? ` — ${mod.title}` : ''}
                            </p>
                            {mod.description && (
                              <p className='text-xs text-ink-400 truncate'>
                                {mod.description}
                              </p>
                            )}
                          </div>

                          {isDone && (
                            <span className='text-xs text-success-500 font-medium shrink-0'>
                              Done
                            </span>
                          )}
                          {isActive && !isDone && (
                            <span className='text-xs text-pink-500 font-semibold shrink-0'>
                              Continue →
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import type { ComponentType } from 'react'
import { getYouTubeEmbedUrl } from '@/lib/youtube'
import {
  FileIcon,
  AudioIcon,
  VideoIcon,
  GlobeIcon,
  FolderIcon,
  DownloadIcon,
} from '@/components/icons'

interface Resource {
  id: string
  title: string
  type: string
  programId: string
  weekNum: number
  url: string
  locked: boolean
  notes: string
}

interface Enrollment {
  programId: string
  currentWeek: number
}

interface TypeConfig {
  icon: ComponentType<{ size?: number }>
  color: string
  label: string
}

const TYPE_CONFIG: Record<string, TypeConfig> = {
  pdf: { icon: FileIcon, color: 'bg-error-50 text-error-500', label: 'PDF' },
  audio: {
    icon: AudioIcon,
    color: 'bg-magenta-50 text-magenta-400',
    label: 'Audio',
  },
  video: { icon: VideoIcon, color: 'bg-pink-50 text-pink-500', label: 'Video' },
  link: { icon: GlobeIcon, color: 'bg-success-50 text-success-600', label: 'Link' },
}

const FILTERS = ['all', 'pdf', 'audio', 'video', 'link'] as const
type Filter = (typeof FILTERS)[number]

function getActionLabel(type: string): string {
  if (type === 'audio') return 'Listen'
  if (type === 'video') return 'Watch'
  if (type === 'link') return 'Open'
  return 'Download'
}

export default function ResourcesPage(): JSX.Element {
  const { user } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    if (!user) return

    async function fetchAll(): Promise<void> {
      try {
        const [enrollSnap, resSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, 'enrollments'),
              where('userId', '==', user!.uid),
            ),
          ),
          getDocs(
            query(collection(db, 'resources'), orderBy('weekNum', 'asc')),
          ),
        ])
        setEnrollments(enrollSnap.docs.map((d) => d.data()) as Enrollment[])
        setResources(
          resSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Resource[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [user])

  const enrolledProgramIds = enrollments.map((e) => e.programId)

  function isUnlocked(resource: Resource): boolean {
    if (!resource.locked) return true
    const enrollment = enrollments.find(
      (e) =>
        e.programId === resource.programId || resource.programId === 'both',
    )
    if (!enrollment) return false
    return resource.weekNum <= enrollment.currentWeek
  }

  const visible = resources.filter(
    (r) => enrolledProgramIds.includes(r.programId) || r.programId === 'both',
  )
  const filtered =
    filter === 'all' ? visible : visible.filter((r) => r.type === filter)

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='skeleton h-24' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Journey</p>
        <h1 className='page-title font-serif'>Resources</h1>
        <p className='page-desc'>{visible.length} resources available</p>
      </div>

      {/* Filter pills */}
      <div className='flex gap-2 flex-wrap'>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold
                        border transition-all duration-150 capitalize
                        ${
                          filter === f
                            ? 'bg-magenta-700 text-white border-magenta-700'
                            : 'bg-bg-surface text-ink-500 border-ink-100 hover:border-pink-400'
                        }`}
          >
            {f === 'all' ? `All (${visible.length})` : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3'>
          <FolderIcon size={36} className='text-ink-100' />
          <p className='text-sm text-ink-300'>No resources yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {filtered.map((r) => {
            const unlocked = isUnlocked(r)
            const typeConfig = TYPE_CONFIG[r.type] ?? TYPE_CONFIG.link
            const Icon = typeConfig.icon

            return (
              <div
                key={r.id}
                className={`card transition-all duration-200
                  ${unlocked ? 'card-hover' : 'opacity-50'}`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center
                                   justify-center shrink-0 ${typeConfig.color}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <p className='text-sm font-semibold text-ink-900'>
                        {r.title}
                      </p>
                      {!unlocked && (
                        <span
                          className='text-[10px] bg-warning-50 text-warning-600
                                         border border-warning-200 px-2 py-0.5
                                         rounded-full font-semibold shrink-0'
                        >
                          🔒 Week {r.weekNum}
                        </span>
                      )}
                    </div>

                    <p className='text-xs text-ink-400 mt-0.5'>
                      {typeConfig.label} · Week {r.weekNum}
                    </p>

                    {r.notes && (
                      <p className='text-xs text-ink-300 mt-1 truncate'>
                        {r.notes}
                      </p>
                    )}

                    {unlocked && r.type === 'video' && getYouTubeEmbedUrl(r.url) && (
                      <div className='mt-3 aspect-video w-full overflow-hidden rounded-xl border border-pink-100'>
                        <iframe
                          src={getYouTubeEmbedUrl(r.url)!}
                          title={r.title}
                          className='w-full h-full'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </div>
                    )}

                    {unlocked &&
                      !(r.type === 'video' && getYouTubeEmbedUrl(r.url)) && (
                        <a
                          href={r.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1.5 mt-3
                                   text-xs font-semibold text-pink-500
                                   hover:text-pink-600 hover:underline
                                   transition-colors duration-150'
                        >
                          <DownloadIcon size={12} />
                          {getActionLabel(r.type)}
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

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
import {
  FileIcon,
  AudioIcon,
  VideoIcon,
  GlobeIcon,
  PenIcon,
  TrashIcon,
  PlusIcon,
  FolderIcon,
} from '@/components/icons'

interface Resource {
  id: string
  title: string
  programId: string
  weekNum: number
  type: string
  url: string
  locked: boolean
  notes: string
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> =
  {
    pdf: { icon: FileIcon, color: 'bg-error-50 text-error-500', label: 'PDF' },
    audio: {
      icon: AudioIcon,
      color: 'bg-pink-50 text-pink-500',
      label: 'Audio',
    },
    video: {
      icon: VideoIcon,
      color: 'bg-info-50 text-info-500',
      label: 'Video',
    },
    link: {
      icon: GlobeIcon,
      color: 'bg-success-50 text-success-600',
      label: 'Link',
    },
  }

const PROGRAM_LABELS: Record<string, string> = {
  '1-week': '1-Week',
  '8-week': '8-Week',
  both: 'Both',
}

const ACTION_BTN =
  'w-8 h-8 flex items-center justify-center rounded-lg border border-ink-100 text-ink-400 transition-all duration-150'

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchResources()
  }, [])

  async function fetchResources(): Promise<void> {
    try {
      const snap = await getDocs(
        query(collection(db, 'resources'), orderBy('weekNum', 'asc')),
      )
      setResources(
        snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Resource[],
      )
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Delete this resource?')) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'resources', id))
      setResources((prev) => prev.filter((r) => r.id !== id))
      toast.success('Resource deleted')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const filtered =
    filter === 'all'
      ? resources
      : resources.filter((r) => r.programId === filter)

  const tabs = [
    { id: 'all', label: `All (${resources.length})` },
    {
      id: '1-week',
      label: `1-Week (${resources.filter((r) => r.programId === '1-week').length})`,
    },
    {
      id: '8-week',
      label: `8-Week (${resources.filter((r) => r.programId === '8-week').length})`,
    },
    {
      id: 'both',
      label: `Both (${resources.filter((r) => r.programId === 'both').length})`,
    },
  ]

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='skeleton h-8 w-40' />
        <div className='skeleton h-12 w-64' />
        {[...Array(6)].map((_, i) => (
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
          <h1 className='page-title'>Resources</h1>
          <p className='page-desc'>{resources.length} total resources</p>
        </div>
        <Link href='/admin/resources/new'>
          <button className='btn btn-primary flex items-center gap-2'>
            <PlusIcon size={15} />
            Add Resource
          </button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className='flex gap-2 flex-wrap'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={[
              'px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 border',
              filter === tab.id
                ? 'bg-ink-900 text-bg-base border-ink-900'
                : 'bg-bg-surface text-ink-400 border-ink-100 hover:border-pink-300',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3'>
          <FolderIcon size={40} className='text-pink-100' />
          <p className='text-ink-300'>No resources found</p>
          <Link href='/admin/resources/new'>
            <button className='btn btn-soft'>Add your first resource</button>
          </Link>
        </div>
      ) : (
        <div className='card p-0 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-pink-100 bg-bg-muted'>
                  {[
                    'Resource',
                    'Type',
                    'Program',
                    'Week',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className='text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400'
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-pink-100'>
                {filtered.map((r) => {
                  const typeConfig = TYPE_CONFIG[r.type] || TYPE_CONFIG.link
                  const Icon = typeConfig.icon
                  return (
                    <tr
                      key={r.id}
                      className='hover:bg-bg-muted transition-colors duration-150'
                    >
                      {/* Resource title */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig.color}`}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className='font-medium text-ink-900 max-w-[200px] truncate'>
                              {r.title}
                            </p>
                            {r.notes && (
                              <p className='text-xs text-ink-400 truncate max-w-[200px]'>
                                {r.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type badge */}
                      <td className='px-5 py-4'>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeConfig.color}`}
                        >
                          {typeConfig.label}
                        </span>
                      </td>

                      {/* Program */}
                      <td className='px-5 py-4'>
                        <span className='badge badge-rose'>
                          {PROGRAM_LABELS[r.programId] || r.programId}
                        </span>
                      </td>

                      {/* Week */}
                      <td className='px-5 py-4 text-ink-400'>
                        Week {r.weekNum}
                      </td>

                      {/* Status */}
                      <td className='px-5 py-4'>
                        <span
                          className={[
                            'text-[11px] font-semibold px-2.5 py-1 rounded-full border',
                            r.locked
                              ? 'bg-warning-50 text-warning-600 border-warning-200'
                              : 'bg-success-50 text-success-600 border-success-200',
                          ].join(' ')}
                        >
                          {r.locked ? '🔒 Locked' : '✓ Unlocked'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2'>
                          <a
                            href={r.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`${ACTION_BTN} hover:border-info-300 hover:text-info-500`}
                          >
                            <GlobeIcon size={13} />
                          </a>
                          <Link href={`/admin/resources/${r.id}/edit`}>
                            <button
                              className={`${ACTION_BTN} hover:border-pink-300 hover:text-pink-400`}
                            >
                              <PenIcon size={13} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deleting === r.id}
                            className={`${ACTION_BTN} hover:border-error-300 hover:text-error-500 disabled:opacity-40`}
                          >
                            {deleting === r.id ? (
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

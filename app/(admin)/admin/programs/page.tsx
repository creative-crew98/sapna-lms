'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Link from 'next/link'
import { BookIcon, PenIcon, PlusIcon, CheckIcon } from '@/components/icons'

interface Program {
  id: string
  title: string
  subtitle: string
  weeks: number
  price: number
  originalPrice: number
  includes: string[]
  modules: any[]
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const snap = await getDocs(collection(db, 'programs'))
        setPrograms(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Program[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='skeleton h-8 w-40' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='skeleton h-72' />
          <div className='skeleton h-72' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='page-header mb-0'>
          <p className='page-eyebrow'>Admin</p>
          <h1 className='page-title'>Programs</h1>
          <p className='page-desc'>{programs.length} programs</p>
        </div>
        <Link href='/admin/programs/new'>
          <button className='btn btn-primary flex items-center gap-2'>
            <PlusIcon size={15} />
            New Program
          </button>
        </Link>
      </div>

      {/* Empty state */}
      {programs.length === 0 ? (
        <div className='card flex flex-col items-center justify-center py-16 gap-3'>
          <BookIcon size={40} className='text-pink-100' />
          <p className='text-ink-300'>No programs yet</p>
          <Link href='/admin/programs/new'>
            <button className='btn btn-soft'>Create your first program</button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {programs.map((p) => (
            <div key={p.id} className='card-hover relative'>
              {/* Edit button */}
              <Link
                href={`/admin/programs/${p.id}/edit`}
                className='absolute top-4 right-4'
              >
                <button className='w-8 h-8 flex items-center justify-center rounded-lg border border-ink-100 text-ink-400 hover:border-pink-300 hover:text-pink-400 transition-all duration-150 bg-bg-surface'>
                  <PenIcon size={13} />
                </button>
              </Link>

              {/* Badge + title */}
              <div className='mb-4'>
                <span className='badge badge-rose text-[10px] mb-3 inline-flex'>
                  {p.weeks}-Week Program
                </span>
                <h2 className='text-xl text-ink-900 font-serif mb-1'>
                  {p.title}
                </h2>
                <p className='text-sm text-ink-400'>{p.subtitle}</p>
              </div>

              {/* Price */}
              <div className='flex items-baseline gap-2 mb-4'>
                <span className='text-2xl font-bold text-ink-900 font-serif'>
                  ₹{p.price?.toLocaleString('en-IN')}
                </span>
                {p.originalPrice > p.price && (
                  <span className='text-sm text-ink-300 line-through'>
                    ₹{p.originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Includes */}
              {p.includes?.length > 0 && (
                <ul className='space-y-1.5 mb-4'>
                  {p.includes.slice(0, 4).map((item, i) => (
                    <li
                      key={i}
                      className='flex items-start gap-2 text-xs text-ink-400'
                    >
                      <CheckIcon
                        size={13}
                        className='text-pink-400 mt-0.5 flex-shrink-0'
                      />
                      {item}
                    </li>
                  ))}
                  {p.includes.length > 4 && (
                    <li className='text-xs text-ink-300'>
                      +{p.includes.length - 4} more
                    </li>
                  )}
                </ul>
              )}

              {/* Module count */}
              <div className='flex items-center gap-2 pt-3 border-t border-pink-100'>
                <BookIcon size={14} className='text-ink-300' />
                <span className='text-xs text-ink-400'>
                  {p.modules?.length || 0} modules configured
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

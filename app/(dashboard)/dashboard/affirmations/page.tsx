'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { StarIcon, PlusIcon, XIcon, SparkleIcon } from '@/components/icons'
import type { Affirmation } from '@/types'

const DEFAULT_AFFIRMATIONS: string[] = [
  'I am not my patterns. I am the awareness behind them.',
  'I release what no longer serves my highest good.',
  'I am worthy of deep love and I attract what I deserve.',
  'My boundaries are an act of love — for myself and others.',
  "I trust my soul's wisdom to guide me home.",
  'Every day I choose myself — gently and without apology.',
  'I am healing, growing, and becoming.',
  'I deserve peace, joy, and abundance.',
]

interface DisplayAffirmation {
  id: string
  text: string
  isCustom: boolean
}

function getDayOfYear(): number {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0).getTime()
  return Math.floor((Date.now() - startOfYear) / 86_400_000)
}

export default function AffirmationsPage(): JSX.Element {
  const { user } = useAuth()
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [newText, setNewText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [todayIndex, setTodayIndex] = useState<number>(0)

  useEffect(() => {
    if (!user) return

    async function fetchAffirmations(): Promise<void> {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'affirmations'),
            where('userId', '==', user!.uid),
          ),
        )
        setAffirmations(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Affirmation[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAffirmations()
    setTodayIndex(getDayOfYear() % DEFAULT_AFFIRMATIONS.length)
  }, [user])

  async function handleAdd(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    const trimmed = newText.trim()
    if (!trimmed || !user) return
    setSaving(true)
    try {
      const ref = await addDoc(collection(db, 'affirmations'), {
        userId: user.uid,
        text: trimmed,
        createdAt: serverTimestamp(),
      })
      setAffirmations((prev) => [
        ...prev,
        { id: ref.id, userId: user.uid, text: trimmed, createdAt: null },
      ])
      setNewText('')
      toast.success('Affirmation added ✦')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'affirmations', id))
      setAffirmations((prev) => prev.filter((a) => a.id !== id))
      toast.success('Removed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function addDefault(text: string): Promise<void> {
    if (!user) return
    setSaving(true)
    try {
      const ref = await addDoc(collection(db, 'affirmations'), {
        userId: user.uid,
        text,
        createdAt: serverTimestamp(),
      })
      setAffirmations((prev) => [
        ...prev,
        { id: ref.id, userId: user.uid, text, createdAt: null },
      ])
      toast.success('Added to your affirmations ✦')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const allDisplay: DisplayAffirmation[] = [
    ...affirmations.map((a) => ({ id: a.id, text: a.text, isCustom: true })),
    ...DEFAULT_AFFIRMATIONS.filter(
      (d) => !affirmations.find((a) => a.text === d),
    ).map((text, i) => ({ id: `default-${i}`, text, isCustom: false })),
  ]

  const todaysText: string =
    affirmations[0]?.text ?? DEFAULT_AFFIRMATIONS[todayIndex]

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        <div className='skeleton h-36' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='skeleton h-28' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 stagger-children'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Journey</p>
        <h1 className='page-title font-serif'>Affirmations</h1>
        <p className='page-desc'>Words that rewire your soul</p>
      </div>

      {/* Today's affirmation */}
      <div className='card bg-magenta-700 border-magenta-700 relative overflow-hidden'>
        <div
          className='pointer-events-none absolute -top-10 -right-10 w-40 h-40
                        rounded-full bg-pink-400 opacity-10 blur-[60px]'
        />
        <div className='relative z-10 flex items-center gap-2 mb-3'>
          <span className='text-pink-300 animate-[float_2.5s_ease-in-out_infinite]'>
            <SparkleIcon size={14} />
          </span>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-pink-300'>
            Today&apos;s affirmation
          </p>
        </div>
        <p className='relative z-10 font-serif italic text-xl leading-relaxed text-white'>
          &ldquo;{todaysText}&rdquo;
        </p>
      </div>

      {/* Add new */}
      <form onSubmit={handleAdd} className='card'>
        <p className='text-xs font-semibold uppercase tracking-widest text-ink-300 mb-3'>
          Add your own
        </p>
        <div className='flex gap-2'>
          <input
            className='input flex-1'
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder='Write your affirmation…'
          />
          <button
            type='submit'
            disabled={saving || !newText.trim()}
            className='btn btn-primary btn-sm flex items-center gap-1.5 shrink-0
                       hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150'
          >
            <PlusIcon size={14} />
            Add
          </button>
        </div>
      </form>

      {/* All affirmations grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {allDisplay.map((a) => (
          <div
            key={a.id}
            className='relative p-5 border rounded-2xl transition-all duration-200 group
                       bg-bg-surface border-pink-100
                       hover:border-pink-300 hover:-translate-y-0.5
                       hover:shadow-[0_6px_20px_rgba(107,45,62,0.08)]'
          >
            <div className='flex items-start gap-3'>
              <StarIcon size={14} className='text-pink-400 shrink-0 mt-1' />
              <p className='font-serif italic text-sm text-ink-700 leading-relaxed flex-1'>
                &ldquo;{a.text}&rdquo;
              </p>
            </div>

            {a.isCustom ? (
              <button
                type='button'
                onClick={() => handleDelete(a.id)}
                aria-label='Remove affirmation'
                className='absolute top-3 right-3 w-6 h-6 rounded-full
                           bg-pink-50 text-pink-400 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150
                           hover:bg-error-100 hover:text-error-400'
              >
                <XIcon size={11} />
              </button>
            ) : (
              <button
                type='button'
                onClick={() => addDefault(a.text)}
                aria-label='Save to my affirmations'
                title='Save to my affirmations'
                className='absolute top-3 right-3 w-6 h-6 rounded-full
                           bg-pink-50 text-pink-400 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150
                           hover:bg-pink-200'
              >
                <PlusIcon size={11} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

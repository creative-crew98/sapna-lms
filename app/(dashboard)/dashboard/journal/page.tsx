'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { PenIcon, SparkleIcon } from '@/components/icons'

interface JournalEntry {
  id: string
  content: string
  date: Timestamp
  createdAt: Timestamp
}

const PROMPTS: string[] = [
  'What am I grateful for today?',
  'What pattern did I notice in myself today?',
  'What did I let go of today?',
  'How did I honour myself today?',
  'What does my soul want me to know right now?',
  "What shifted in me after today's session?",
]

export default function JournalPage(): JSX.Element {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [prompt, setPrompt] = useState<string>(PROMPTS[0])

  useEffect(() => {
    if (!user) return

    async function fetchEntries(): Promise<void> {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'journalEntries'),
            where('userId', '==', user!.uid),
            orderBy('createdAt', 'desc'),
          ),
        )
        setEntries(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as JournalEntry[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }, [user])

  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!content.trim() || !user) return
    setSaving(true)
    try {
      const ref = await addDoc(collection(db, 'journalEntries'), {
        userId: user.uid,
        content: content.trim(),
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
      const newEntry: JournalEntry = {
        id: ref.id,
        content: content.trim(),
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
      }
      setEntries((prev) => [newEntry, ...prev])
      setContent('')
      setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
      toast.success('Entry saved ✦')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        <div className='skeleton h-48' />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='skeleton h-24' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-2xl'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Journey</p>
        <h1 className='page-title font-serif'>Gratitude Journal</h1>
        <p className='page-desc'>{entries.length} entries written</p>
      </div>

      {/* New entry */}
      <form onSubmit={handleSave} className='card space-y-4'>
        <div className='flex items-center gap-2 mb-1'>
          <SparkleIcon size={16} className='text-pink-400' />
          <p className='text-xs font-semibold uppercase tracking-widest text-pink-400'>
            Today&apos;s Entry
          </p>
        </div>

        {/* Prompt */}
        <div className='p-3 bg-bg-muted border border-ink-100 rounded-xl'>
          <p className='text-xs text-ink-400 mb-1'>Today&apos;s prompt</p>
          <p className='font-serif text-sm italic text-ink-500'>
            &ldquo;{prompt}&rdquo;
          </p>
        </div>

        <textarea
          className='input min-h-[140px] resize-none'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write your thoughts here…'
        />

        <div className='flex items-center justify-between'>
          <p className='text-xs text-ink-300'>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <button
            type='submit'
            disabled={saving || !content.trim()}
            className='btn btn-primary btn-sm flex items-center gap-2
                       hover:-translate-y-px hover:scale-[1.02]
                       active:scale-[0.97] transition-all duration-150'
          >
            {saving ? (
              <svg
                className='animate-spin'
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M21 12a9 9 0 1 1-6.219-8.56' />
              </svg>
            ) : (
              <PenIcon size={14} />
            )}
            Save Entry
          </button>
        </div>
      </form>

      {/* Past entries */}
      {entries.length > 0 && (
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
            Past entries
          </p>
          {entries.map((entry) => (
            <div key={entry.id} className='card-muted'>
              <p className='text-xs text-pink-400 font-semibold mb-2'>
                {entry.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }) ?? '—'}
              </p>
              <p className='text-sm text-ink-700 leading-relaxed whitespace-pre-wrap'>
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

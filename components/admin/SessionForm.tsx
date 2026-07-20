'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import toast from 'react-hot-toast'
import {
  CalendarIcon,
  UserIcon,
  BookIcon,
  CheckIcon,
  ArrowLeftIcon,
  LinkIcon,
} from '@/components/icons'

import { Timestamp as FirestoreTimestamp } from 'firebase/firestore'
import type { Session } from '@/types'

interface SessionFormProps {
  initial?: Partial<Session>
  sessionId?: string
}

// Updated to match Firestore IDs
const PROGRAMS = [
  { id: 'akashic', label: 'Akashic Record Reading Program' },
  { id: 'relationship', label: 'Life & Relationship Coaching Program' },
]

const STATUS_OPTIONS = ['scheduled', 'completed', 'cancelled']

const inputBase = 'input pl-11'

const inputBasePlain = 'input cursor-pointer'

function FieldIcon({
  icon: Icon,
}: {
  icon: React.ComponentType<{ size?: number }>
}) {
  return (
    <div className='pointer-events-none absolute left-0 top-0 h-full w-10 flex items-center justify-center text-ink-300'>
      <Icon size={16} />
    </div>
  )
}

export default function SessionForm({ initial, sessionId }: SessionFormProps) {
  const router = useRouter()
  const isEdit = !!sessionId

  const [form, setForm] = useState({
    title: initial?.title || '',
    programId: initial?.programId || 'akashic',
    weekNum: initial?.weekNum || 1,
    userId: initial?.userId || '',
    date:
      initial?.date instanceof Timestamp
        ? initial.date.toDate().toISOString().slice(0, 16)
        : '',
    zoomLink: initial?.zoomLink || '',
    status: initial?.status || 'scheduled',
    notes: initial?.notes || '',
  })

  const [loading, setLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!form.title || !form.date) {
      toast.error('Title and date are required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        programId: form.programId,
        weekNum: Number(form.weekNum),
        userId: form.userId.trim(),
        date: Timestamp.fromDate(new Date(form.date)),
        zoomLink: form.zoomLink.trim(),
        status: form.status,
        notes: form.notes.trim(),
        updatedAt: serverTimestamp(),
      }

      if (isEdit) {
        await updateDoc(doc(db, 'sessions', sessionId), payload)
        toast.success('Session updated')
      } else {
        await addDoc(collection(db, 'sessions'), {
          ...payload,
          createdAt: serverTimestamp(),
        })
        toast.success('Session created')
      }
      router.push('/admin/sessions')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-2xl'>
      {/* Back */}
      <button
        type='button'
        onClick={() => router.back()}
        className='flex items-center gap-1.5 text-sm font-sans text-ink-400 transition-colors duration-150 hover:text-ink-900'
      >
        <ArrowLeftIcon size={15} />
        Back to sessions
      </button>

      {/* Card */}
      <div className='card space-y-5'>
        {/* Title */}
        <div>
          <label className='input-label'>Session title *</label>
          <div className='relative'>
            <FieldIcon icon={CalendarIcon} />
            <input
              name='title'
              className={inputBase}
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. Week 1 — Responsibility Deep Dive'
              required
            />
          </div>
        </div>

        {/* Program + Week */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='input-label'>Program *</label>
            <div className='relative'>
              <FieldIcon icon={BookIcon} />
              <select
                name='programId'
                className={`${inputBase} cursor-pointer`}
                value={form.programId}
                onChange={handleChange}
              >
                {PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className='input-label'>Week number *</label>
            <select
              name='weekNum'
              className={inputBasePlain}
              value={form.weekNum}
              onChange={handleChange}
            >
              {Array.from(
                { length: form.programId === 'relationship' ? 8 : 1 },
                (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Week {i + 1}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* Date + Status */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='input-label'>Date & time *</label>
            <input
              name='date'
              type='datetime-local'
              className={inputBasePlain}
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className='input-label'>Status</label>
            <select
              name='status'
              className={inputBasePlain}
              value={form.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student UID */}
        <div>
          <label className='input-label'>Student UID</label>
          <div className='relative'>
            <FieldIcon icon={UserIcon} />
            <input
              name='userId'
              className={inputBase}
              value={form.userId}
              onChange={handleChange}
              placeholder='Firebase user UID (optional for group sessions)'
            />
          </div>
          <p className='text-[11px] mt-1 font-sans text-ink-300'>
            Leave blank for group/open sessions
          </p>
        </div>

        {/* Zoom link */}
        <div>
          <label className='input-label'>Zoom / Meet link</label>
          <div className='relative'>
            <FieldIcon icon={LinkIcon} />
            <input
              name='zoomLink'
              className={inputBase}
              value={form.zoomLink}
              onChange={handleChange}
              placeholder='https://zoom.us/j/...'
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className='input-label'>Notes (internal)</label>
          <textarea
            name='notes'
            className='input w-full min-h-[100px] resize-none'
            value={form.notes}
            onChange={handleChange}
            placeholder='Any notes about this session…'
          />
        </div>
      </div>

      {/* Submit */}
      <div className='flex items-center gap-3'>
        <button
          type='submit'
          disabled={loading}
          className='btn btn-primary inline-flex items-center gap-2 disabled:opacity-40'
        >
          {loading ? (
            <>
              <svg
                className='animate-spin'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                aria-hidden='true'
              >
                <path d='M21 12a9 9 0 1 1-6.219-8.56' />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <CheckIcon size={15} />
              {isEdit ? 'Update Session' : 'Create Session'}
            </>
          )}
        </button>

        <button
          type='button'
          onClick={() => router.back()}
          className='btn btn-ghost inline-flex'
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

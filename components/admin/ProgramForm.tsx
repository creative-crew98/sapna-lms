'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ArrowLeftIcon,
} from '@/components/icons'
import type { Program, Module } from '@/types'
import { extractYouTubeId } from '@/lib/youtube'

interface ProgramFormState {
  title: string
  subtitle: string
  description: string
  weeks: number
  price: string
  originalPrice: string
  includes: string[]
  introVideoUrl: string
}

type ModuleFormState = Pick<
  Module,
  'weekNum' | 'title' | 'description' | 'locked'
>

interface ProgramFormProps {
  initial?: Partial<Program>
  programId?: string
}

function buildDefaultModules(
  weeks: number,
  existing?: Module[],
): ModuleFormState[] {
  return Array.from({ length: weeks }, (_, i) => ({
    weekNum: i + 1,
    title: existing?.[i]?.title ?? '',
    description: existing?.[i]?.description ?? '',
    locked: existing?.[i]?.locked ?? i > 0,
  }))
}

// ── Toggle ────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean
  onChange: () => void
  label: string
}

function Toggle({ checked, onChange, label }: ToggleProps): JSX.Element {
  return (
    <label className='flex items-center gap-2 cursor-pointer select-none'>
      <span className='text-xs font-sans text-ink-400'>{label}</span>
      <button
        type='button'
        role='switch'
        aria-checked={checked}
        onClick={onChange}
        className='w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5'
        style={{ background: checked ? 'var(--pink-400)' : 'var(--ink-100)' }}
      >
        <div
          className='w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200'
          style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
        />
      </button>
    </label>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner(): JSX.Element {
  return (
    <svg
      className='animate-spin'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProgramForm({
  initial,
  programId,
}: ProgramFormProps): JSX.Element {
  const router = useRouter()
  const isEdit = !!programId

  const [form, setForm] = useState<ProgramFormState>({
    title: initial?.title ?? '',
    subtitle: initial?.subtitle ?? '',
    description: initial?.description ?? '',
    weeks: initial?.weeks ?? 1,
    price: initial?.price?.toString() ?? '',
    originalPrice: initial?.originalPrice?.toString() ?? '',
    includes: initial?.includes?.length ? initial.includes : [''],
    introVideoUrl: initial?.introVideoUrl ?? '',
  })

  const [modules, setModules] = useState<ModuleFormState[]>(
    buildDefaultModules(initial?.weeks ?? 1, initial?.modules),
  )
  const [loading, setLoading] = useState<boolean>(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void {
    const { name, value } = e.target
    if (name === 'weeks') {
      const w = Number(value)
      setForm((prev) => ({ ...prev, weeks: w }))
      setModules(buildDefaultModules(w, modules as Module[]))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  function handleIncludeChange(i: number, val: string): void {
    setForm((prev) => {
      const next = [...prev.includes]
      next[i] = val
      return { ...prev, includes: next }
    })
  }

  function addInclude(): void {
    setForm((prev) => ({ ...prev, includes: [...prev.includes, ''] }))
  }

  function removeInclude(i: number): void {
    setForm((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, idx) => idx !== i),
    }))
  }

  function handleModuleChange(
    i: number,
    field: keyof ModuleFormState,
    value: string | boolean,
  ): void {
    setModules((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Program title is required')
      return
    }
    const trimmedVideoUrl = form.introVideoUrl.trim()
    if (trimmedVideoUrl && !extractYouTubeId(trimmedVideoUrl)) {
      toast.error('Intro video must be a valid YouTube URL')
      return
    }
    setLoading(true)
    try {
      // ID is now akashic or relationship based on weeks
      const id = programId ?? (form.weeks === 1 ? 'akashic' : 'relationship')
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        weeks: Number(form.weeks),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        includes: form.includes.filter((item) => item.trim()),
        modules,
        introVideoUrl: trimmedVideoUrl,
        updatedAt: serverTimestamp(),
      }

      if (isEdit) {
        await updateDoc(doc(db, 'programs', id), payload)
        toast.success('Program updated')
      } else {
        await setDoc(doc(db, 'programs', id), {
          ...payload,
          createdAt: serverTimestamp(),
        })
        toast.success('Program created')
      }
      router.push('/admin/programs')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-2xl animate-fade-up'
    >
      {/* Back */}
      <button
        type='button'
        onClick={() => router.back()}
        className='flex items-center gap-1.5 text-sm font-sans text-ink-400
                   transition-colors duration-150 hover:text-ink-900'
      >
        <ArrowLeftIcon size={15} />
        Back to programs
      </button>

      {/* ── Basic Info ── */}
      <div className='card space-y-5'>
        <h2 className='text-base font-semibold font-serif text-ink-900'>
          Basic Info
        </h2>

        {[
          {
            name: 'title',
            label: 'Program title *',
            placeholder: 'e.g. Soul Blueprint Intensive',
            required: true,
          },
          {
            name: 'subtitle',
            label: 'Subtitle',
            placeholder: 'e.g. 1-Week 1:1 Program',
            required: false,
          },
        ].map(({ name, label, placeholder, required }) => (
          <div key={name}>
            <label className='input-label'>{label}</label>
            <input
              name={name}
              className='input w-full'
              value={form[name as keyof ProgramFormState] as string}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
            />
          </div>
        ))}

        <div>
          <label className='input-label'>Description</label>
          <textarea
            name='description'
            className='input w-full min-h-[100px]'
            value={form.description}
            onChange={handleChange}
            placeholder='Describe what this program offers…'
          />
        </div>

        <div>
          <label className='input-label'>Course video (YouTube URL)</label>
          <input
            name='introVideoUrl'
            className='input w-full'
            value={form.introVideoUrl}
            onChange={handleChange}
            placeholder='https://www.youtube.com/watch?v=…'
          />
          <p className='text-xs mt-1 text-ink-400'>
            Shown to enrolled students on their dashboard for this program.
          </p>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='input-label'>Duration (weeks)</label>
            <select
              name='weeks'
              className='input w-full cursor-pointer'
              value={form.weeks}
              onChange={handleChange}
            >
              <option value={1}>1 week</option>
              <option value={8}>8 weeks</option>
            </select>
          </div>
          <div>
            <label className='input-label'>Price (₹)</label>
            <input
              name='price'
              type='number'
              className='input w-full'
              value={form.price}
              onChange={handleChange}
              placeholder='5000'
            />
          </div>
          <div>
            <label className='input-label'>Original price (₹)</label>
            <input
              name='originalPrice'
              type='number'
              className='input w-full'
              value={form.originalPrice}
              onChange={handleChange}
              placeholder='25000'
            />
          </div>
        </div>
      </div>

      {/* ── What's Included ── */}
      <div className='card space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-base font-semibold font-serif text-ink-900'>
            What&apos;s Included
          </h2>
          <button
            type='button'
            onClick={addInclude}
            className='btn btn-soft btn-sm inline-flex items-center gap-1.5'
          >
            <PlusIcon size={13} />
            Add item
          </button>
        </div>
        <div className='space-y-2'>
          {form.includes.map((item, i) => (
            <div key={i} className='flex items-center gap-2'>
              <input
                className='input flex-1'
                value={item}
                onChange={(e) => handleIncludeChange(i, e.target.value)}
                placeholder={`Included item ${i + 1}`}
              />
              <button
                type='button'
                onClick={() => removeInclude(i)}
                className='w-9 h-9 flex items-center justify-center rounded-xl
                           border border-ink-100 text-ink-300 shrink-0
                           transition-all duration-150
                           hover:border-error-300 hover:text-error-500'
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Weekly Modules ── */}
      <div className='card space-y-4'>
        <h2 className='text-base font-semibold font-serif text-ink-900'>
          Weekly Modules
        </h2>
        <div className='space-y-4'>
          {modules.map((mod, i) => (
            <div
              key={mod.weekNum}
              className='rounded-xl p-4 space-y-3 border border-ink-100 bg-pink-50'
            >
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold uppercase tracking-wider font-sans text-pink-400'>
                  Week {mod.weekNum}
                </span>
                <Toggle
                  label='Locked'
                  checked={mod.locked}
                  onChange={() => handleModuleChange(i, 'locked', !mod.locked)}
                />
              </div>
              <input
                className='input w-full'
                value={mod.title}
                onChange={(e) => handleModuleChange(i, 'title', e.target.value)}
                placeholder={`Week ${mod.weekNum} title`}
              />
              <textarea
                className='input w-full min-h-[72px]'
                value={mod.description}
                onChange={(e) =>
                  handleModuleChange(i, 'description', e.target.value)
                }
                placeholder='What will students learn this week?'
              />
            </div>
          ))}
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
              <Spinner /> Saving…
            </>
          ) : (
            <>
              <CheckIcon size={15} />{' '}
              {isEdit ? 'Update Program' : 'Create Program'}
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

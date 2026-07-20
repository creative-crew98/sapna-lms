'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase/config'
import toast from 'react-hot-toast'
import {
  FileIcon,
  BookIcon,
  ArrowLeftIcon,
  CheckIcon,
  UploadIcon,
} from '@/components/icons'

import { extractYouTubeId, fetchYouTubeOEmbed } from '@/lib/youtube'
import type { Resource } from '@/types'

interface ResourceFormProps {
  initial?: Partial<Resource>
  resourceId?: string
}

const PROGRAMS = [
  { id: 'akashic', label: 'Akashic Record Reading Program' },
  { id: 'relationship', label: 'Life & Relationship Coaching Program' },
  { id: 'both', label: 'Both Programs' },
]

const TYPES = [
  { id: 'pdf', label: 'PDF / Worksheet' },
  { id: 'audio', label: 'Audio / Meditation' },
  { id: 'video', label: 'Video' },
  { id: 'link', label: 'External Link' },
]

const inputBase = 'input pl-11'
const inputPlain = 'input'

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

function youtubeThumbFor(url: string): string | null {
  const id = extractYouTubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export default function ResourceForm({
  initial,
  resourceId,
}: ResourceFormProps) {
  const router = useRouter()
  const isEdit = !!resourceId

  const [form, setForm] = useState({
    title: initial?.title || '',
    programId: initial?.programId || 'akashic',
    weekNum: initial?.weekNum || 1,
    type: initial?.type || 'pdf',
    url: initial?.url || '',
    locked: initial?.locked ?? true,
    notes: initial?.notes || '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Recorded course videos live as *unlisted* YouTube videos — we fetch
  // title/thumbnail via oEmbed (works for unlisted links, no API key
  // needed) rather than uploading raw video files.
  const [ytThumbnail, setYtThumbnail] = useState<string | null>(
    form.type === 'video' ? youtubeThumbFor(form.url) : null,
  )
  const [ytFetching, setYtFetching] = useState(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleFetchYouTube(): Promise<void> {
    if (!form.url.trim()) {
      toast.error('Paste the YouTube link first')
      return
    }
    setYtFetching(true)
    try {
      const result = await fetchYouTubeOEmbed(form.url)
      if (!result) {
        toast.error(
          "Couldn't fetch that video. Check the link is a valid YouTube URL.",
        )
        setYtThumbnail(null)
        return
      }
      setYtThumbnail(result.thumbnailUrl)
      setForm((prev) => ({
        ...prev,
        title: prev.title.trim() ? prev.title : result.title,
      }))
      toast.success('Video details fetched')
    } finally {
      setYtFetching(false)
    }
  }

  async function uploadFile(f: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const path = `resources/${Date.now()}_${f.name}`
      const storageRef = ref(storage, path)
      const task = uploadBytesResumable(storageRef, f)
      task.on(
        'state_changed',
        (snap) =>
          setUploadProgress(
            Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
          ),
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        },
      )
    })
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!form.title) {
      toast.error('Title is required')
      return
    }
    if (form.type === 'video' && !extractYouTubeId(form.url)) {
      toast.error(
        'Please paste a valid YouTube URL for video resources (unlisted links work fine).',
      )
      return
    }
    setLoading(true)
    try {
      let url = form.url
      if (file) {
        setUploading(true)
        url = await uploadFile(file)
        setUploading(false)
      }
      if (!url) {
        toast.error('Please provide a file or URL')
        setLoading(false)
        return
      }

      const payload = {
        title: form.title.trim(),
        programId: form.programId,
        weekNum: Number(form.weekNum),
        type: form.type,
        url,
        locked: form.locked,
        notes: form.notes.trim(),
        updatedAt: serverTimestamp(),
      }

      if (isEdit) {
        await updateDoc(doc(db, 'resources', resourceId), payload)
        toast.success('Resource updated')
      } else {
        await addDoc(collection(db, 'resources'), {
          ...payload,
          createdAt: serverTimestamp(),
        })
        toast.success('Resource created')
      }
      router.push('/admin/resources')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
      setUploading(false)
    } finally {
      setLoading(false)
    }
  }

  const weeks = form.programId === 'relationship' ? 8 : 1

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-2xl'>
      {/* Back */}
      <button
        type='button'
        onClick={() => router.back()}
        className='flex items-center gap-1.5 text-sm transition-colors duration-150 font-sans text-ink-400 hover:text-ink-900'
      >
        <ArrowLeftIcon size={15} />
        Back to resources
      </button>

      {/* Card */}
      <div className='card space-y-5'>
        {/* Title */}
        <div>
          <label className='input-label'>Resource title *</label>
          <div className='relative'>
            <FieldIcon icon={FileIcon} />
            <input
              name='title'
              className={inputBase}
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. Week 1 — Responsibility Worksheet'
              required
            />
          </div>
        </div>

        {/* Program + Week + Type */}
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='input-label'>Program</label>
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
            <label className='input-label'>Week</label>
            <select
              name='weekNum'
              className={`${inputPlain} cursor-pointer`}
              value={form.weekNum}
              onChange={handleChange}
            >
              {Array.from({ length: weeks }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='input-label'>Type</label>
            <select
              name='type'
              className={`${inputPlain} cursor-pointer`}
              value={form.type}
              onChange={handleChange}
            >
              {TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video (YouTube) OR File upload OR URL */}
        {form.type === 'video' ? (
          <div>
            <label className='input-label'>Unlisted YouTube URL *</label>
            <div className='flex gap-2'>
              <input
                name='url'
                className={`${inputPlain} flex-1`}
                value={form.url}
                onChange={(e) => {
                  handleChange(e)
                  setYtThumbnail(youtubeThumbFor(e.target.value))
                }}
                placeholder='https://youtu.be/…'
              />
              <button
                type='button'
                onClick={handleFetchYouTube}
                disabled={ytFetching}
                className='btn btn-ghost shrink-0 disabled:opacity-40'
              >
                {ytFetching ? 'Fetching…' : 'Fetch details'}
              </button>
            </div>
            <p className='text-xs mt-1.5 text-ink-300 font-sans'>
              Paste the unlisted YouTube link for this recording. Students never
              see the raw URL — it&apos;s embedded privately in their dashboard.
            </p>

            {ytThumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ytThumbnail}
                alt='Video thumbnail preview'
                className='mt-3 w-full max-w-xs rounded-xl border border-pink-100'
              />
            )}
          </div>
        ) : form.type !== 'link' ? (
          <div>
            <label className='input-label'>Upload file</label>
            <label
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
                file
                  ? 'border-pink-400 bg-bg-muted'
                  : 'border-pink-100 hover:border-pink-300 hover:bg-bg-muted'
              }`}
            >
              <input
                type='file'
                className='hidden'
                accept={
                  form.type === 'pdf'
                    ? '.pdf'
                    : form.type === 'audio'
                      ? '.mp3,.wav,.m4a'
                      : '*'
                }
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <span className={file ? 'text-pink-400' : 'text-ink-300'}>
                <UploadIcon size={24} />
              </span>
              {file ? (
                <div className='text-center'>
                  <p className='text-sm font-medium text-ink-900 font-sans'>
                    {file.name}
                  </p>
                  <p className='text-xs mt-0.5 text-ink-400 font-sans'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className='text-center'>
                  <p className='text-sm font-medium text-ink-400 font-sans'>
                    Click to upload
                  </p>
                  <p className='text-xs mt-0.5 text-ink-300 font-sans'>
                    {form.type === 'pdf'
                      ? 'PDF files up to 20MB'
                      : 'MP3, WAV, M4A up to 50MB'}
                  </p>
                </div>
              )}
            </label>

            {/* Upload progress */}
            {uploading && (
              <div className='mt-3'>
                <div className='flex justify-between text-xs mb-1 text-ink-400 font-sans'>
                  <span>Uploading…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className='progress-track'>
                  <div
                    className='progress-fill'
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Or paste URL */}
            <div className='mt-3'>
              <p className='text-xs mb-1.5 text-ink-300 font-sans'>
                Or paste a direct URL instead
              </p>
              <input
                name='url'
                className={inputPlain}
                value={form.url}
                onChange={handleChange}
                placeholder='https://…'
              />
            </div>
          </div>
        ) : (
          <div>
            <label className='input-label'>External URL *</label>
            <input
              name='url'
              className={inputPlain}
              value={form.url}
              onChange={handleChange}
              placeholder='https://…'
            />
          </div>
        )}

        {/* Locked toggle */}
        <div className='flex items-center justify-between p-4 rounded-xl bg-bg-muted border border-pink-100'>
          <div>
            <p className='text-sm font-medium font-sans text-ink-900'>
              Lock resource
            </p>
            <p className='text-xs mt-0.5 font-sans text-ink-400'>
              Locked resources are hidden until the relevant week is reached
            </p>
          </div>
          <div
            onClick={() =>
              setForm((prev) => ({ ...prev, locked: !prev.locked }))
            }
            className='w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer flex items-center px-0.5 flex-shrink-0'
            style={{
              background: form.locked ? 'var(--pink-400)' : 'var(--ink-100)',
            }}
            role='switch'
            aria-checked={form.locked}
          >
            <div
              className='w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200'
              style={{
                transform: form.locked ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className='input-label'>Notes (internal)</label>
          <textarea
            name='notes'
            className={`${inputPlain} min-h-[80px] resize-none`}
            value={form.notes}
            onChange={handleChange}
            placeholder='Internal notes about this resource…'
          />
        </div>
      </div>

      {/* Submit */}
      <div className='flex items-center gap-3'>
        <button
          type='submit'
          disabled={loading || uploading}
          className='btn btn-primary inline-flex items-center gap-2 disabled:opacity-40'
        >
          {loading || uploading ? (
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
              {uploading ? `Uploading ${uploadProgress}%…` : 'Saving…'}
            </>
          ) : (
            <>
              <CheckIcon size={15} />
              {isEdit ? 'Update Resource' : 'Create Resource'}
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

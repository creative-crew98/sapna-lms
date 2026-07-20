'use client'

import { useState, useRef } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import type { JSX } from 'react'
import { db, storage } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import {
  UserIcon,
  PhoneIcon,
  CameraIcon,
  SaveIcon,
  MailIcon,
} from '@/components/icons'

interface ProfileForm {
  name: string
  phone: string
}

export default function ProfilePage(): JSX.Element {
  const { profile, user, refreshProfile } = useAuth()

  const [form, setForm] = useState<ProfileForm>({
    name: profile?.name ?? '',
    phone: profile?.phone ?? '',
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function uploadPhoto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `avatars/${user!.uid}`)
      const task = uploadBytesResumable(storageRef, file)
      task.on(
        'state_changed',
        (snap) =>
          setUploadProgress(
            Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
          ),
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref)),
      )
    })
  }

  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      let photo = profile?.photo ?? ''
      if (photoFile) photo = await uploadPhoto(photoFile)

      await updateDoc(doc(db, 'users', user.uid), {
        name: form.name.trim(),
        phone: form.phone.trim(),
        photo,
        updatedAt: serverTimestamp(),
      })
      await refreshProfile()
      toast.success('Profile updated')
      setPhotoFile(null)
      setUploadProgress(0)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const photoSrc = photoPreview ?? profile?.photo ?? null

  return (
    <div className='space-y-6 max-w-lg'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>My Account</p>
        <h1 className='page-title font-serif'>My Profile</h1>
      </div>

      <form onSubmit={handleSave} className='card space-y-6'>
        {/* Avatar */}
        <div className='flex items-center gap-5'>
          <div className='relative shrink-0'>
            <div
              className='w-20 h-20 rounded-full bg-pink-200 overflow-hidden
                            flex items-center justify-center'
            >
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={profile?.name ?? 'Avatar'}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-2xl font-semibold text-pink-600'>
                  {profile?.name?.charAt(0)?.toUpperCase() ?? 'S'}
                </span>
              )}
            </div>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='absolute -bottom-1 -right-1 w-7 h-7 rounded-full
                         bg-magenta-700 text-white flex items-center justify-center
                         hover:bg-magenta-600 active:scale-95
                         transition-all duration-150 shadow-md'
            >
              <CameraIcon size={13} />
            </button>
            <input
              ref={fileRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handlePhotoSelect}
            />
          </div>

          <div>
            <p className='font-semibold text-ink-900'>
              {profile?.name ?? 'Student'}
            </p>
            <p className='text-xs text-ink-400 mt-0.5'>{profile?.email}</p>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='text-xs text-pink-500 hover:text-pink-600
                         hover:underline mt-1 transition-colors duration-150'
            >
              Change photo
            </button>
          </div>
        </div>

        {/* Upload progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div>
            <div className='flex justify-between text-xs text-ink-400 mb-1'>
              <span>Uploading…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className='progress-track'>
              <div
                className='progress-fill transition-[width] duration-300 ease-out'
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Fields */}
        <div className='space-y-4'>
          <div>
            <label className='input-label'>Full name</label>
            <div className='relative'>
              <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300'>
                <UserIcon size={16} />
              </div>
              <input
                name='name'
                className='input pl-10'
                value={form.name}
                onChange={handleChange}
                placeholder='Your name'
              />
            </div>
          </div>

          <div>
            <label className='input-label'>Email</label>
            <div className='relative'>
              <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300'>
                <MailIcon size={16} />
              </div>
              <input
                className='input pl-10 opacity-60 cursor-not-allowed'
                value={profile?.email ?? ''}
                disabled
              />
            </div>
          </div>

          <div>
            <label className='input-label'>Phone</label>
            <div className='relative'>
              <div className='absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300'>
                <PhoneIcon size={16} />
              </div>
              <input
                name='phone'
                className='input pl-10'
                value={form.phone}
                onChange={handleChange}
                placeholder='+91 99999 99999'
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={saving}
          className='btn btn-primary flex items-center gap-2
                     hover:-translate-y-px hover:scale-[1.01]
                     active:scale-[0.98] transition-all duration-150'
        >
          {saving ? (
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
          ) : (
            <SaveIcon size={15} />
          )}
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

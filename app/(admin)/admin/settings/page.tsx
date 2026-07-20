'use client'

import { useState, useRef } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import type { JSX, ComponentType } from 'react'
import { db, storage, auth } from '@/lib/firebase/config'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CameraIcon,
  SaveIcon,
  LockIcon,
  AlertIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/components/icons'

interface ProfileForm {
  name: string
  email: string
  phone: string
}

interface PasswordForm {
  current: string
  next: string
  confirm: string
}

interface PasswordField {
  name: keyof PasswordForm
  label: string
  placeholder: string
}

const PASSWORD_FIELDS: PasswordField[] = [
  { name: 'current', label: 'Current password', placeholder: '••••••••' },
  { name: 'next', label: 'New password', placeholder: 'Min. 8 characters' },
  { name: 'confirm', label: 'Confirm new password', placeholder: '••••••••' },
]

interface FieldIconProps {
  icon: ComponentType<{ size?: number }>
}

/** Fixed-width centered icon slot — prevents icon from overlapping input text. */
function FieldIcon({ icon: Icon }: FieldIconProps): JSX.Element {
  return (
    <div className='pointer-events-none absolute left-0 top-0 h-full w-10 flex items-center justify-center text-ink-300'>
      <Icon size={16} />
    </div>
  )
}

function SpinnerSvg(): JSX.Element {
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

export default function SettingsPage(): JSX.Element {
  const { profile, user, refreshProfile } = useAuth()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current: '',
    next: '',
    confirm: '',
  })

  const [showPass, setShowPass] = useState<boolean>(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState<boolean>(false)
  const [savingPass, setSavingPass] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name as keyof PasswordForm]: value,
    }))
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

  async function handleSaveProfile(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (!user) return
    setSavingProfile(true)
    try {
      let photo = profile?.photo || ''
      if (photoFile) photo = await uploadPhoto(photoFile)
      await updateDoc(doc(db, 'users', user.uid), {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        photo,
        updatedAt: serverTimestamp(),
      })
      await refreshProfile()
      toast.success('Profile updated')
      setPhotoFile(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setSavingProfile(false)
      setUploadProgress(0)
    }
  }

  async function handleChangePassword(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.next.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (!user?.email) return
    setSavingPass(true)
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForm.current,
      )
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, passwordForm.next)
      setPasswordForm({ current: '', next: '', confirm: '' })
      toast.success('Password changed successfully')
    } catch (err) {
      if (
        err instanceof Error &&
        'code' in err &&
        (err as { code: string }).code === 'auth/wrong-password'
      ) {
        toast.error('Current password is incorrect')
      } else {
        const message =
          err instanceof Error ? err.message : 'Something went wrong'
        toast.error(message)
      }
    } finally {
      setSavingPass(false)
    }
  }

  const photoSrc: string | null = photoPreview || profile?.photo || null

  return (
    <div className='space-y-8 max-w-2xl animate-fade-up'>
      <div className='page-header'>
        <p className='page-eyebrow'>Admin</p>
        <h1 className='page-title'>Settings</h1>
        <p className='page-desc'>Manage your profile and account</p>
      </div>

      {/* ── Profile form ── */}
      <form
        onSubmit={handleSaveProfile}
        className='card space-y-6'
      >
        <h2 className='font-serif text-base font-semibold text-ink-900'>
          Profile
        </h2>

        {/* Avatar */}
        <div className='flex items-center gap-5'>
          <div className='relative flex-shrink-0'>
            <div className='w-20 h-20 rounded-full bg-pink-100 overflow-hidden flex items-center justify-center'>
              {photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt=''
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-2xl font-semibold text-pink-500'>
                  {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              )}
            </div>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='absolute -bottom-1 -right-1 w-7 h-7 rounded-full
                         bg-ink-900 text-white flex items-center justify-center
                         hover:bg-magenta-700 transition-colors duration-150 shadow-md'
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
            <p className='text-sm font-medium text-ink-900'>
              {profile?.name || 'Admin'}
            </p>
            <p className='text-xs text-ink-400 mt-0.5'>{profile?.email}</p>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='text-xs text-pink-500 hover:underline mt-1'
            >
              Change photo
            </button>
          </div>
        </div>

        {/* Upload progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div>
            <div className='flex justify-between text-xs text-ink-400 mb-1'>
              <span>Uploading photo…</span>
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

        {/* Fields */}
        <div className='space-y-4'>
          <div>
            <label htmlFor='name' className='input-label'>
              Full name
            </label>
            <div className='relative'>
              <FieldIcon icon={UserIcon} />
              <input
                id='name'
                name='name'
                className='input pl-11'
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder='Your name'
              />
            </div>
          </div>

          <div>
            <label htmlFor='email' className='input-label'>
              Email
            </label>
            <div className='relative'>
              <FieldIcon icon={MailIcon} />
              <input
                id='email'
                name='email'
                className='input opacity-60 cursor-not-allowed pl-11'
                value={profileForm.email}
                disabled
              />
            </div>
            <p className='text-[11px] text-ink-300 mt-1'>
              Email cannot be changed here
            </p>
          </div>

          <div>
            <label htmlFor='phone' className='input-label'>
              Phone
            </label>
            <div className='relative'>
              <FieldIcon icon={PhoneIcon} />
              <input
                id='phone'
                name='phone'
                className='input pl-11'
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder='+91 99999 99999'
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={savingProfile}
          className='btn btn-primary flex items-center gap-2'
        >
          {savingProfile ? (
            <>
              <SpinnerSvg /> Saving…
            </>
          ) : (
            <>
              <SaveIcon size={15} /> Save Profile
            </>
          )}
        </button>
      </form>

      {/* ── Change password ── */}
      <form
        onSubmit={handleChangePassword}
        className='card space-y-5'
      >
        <div className='flex items-center gap-2'>
          <LockIcon size={18} className='text-pink-500' />
          <h2 className='font-serif text-base font-semibold text-ink-900'>
            Change Password
          </h2>
        </div>

        <div className='p-3 bg-warning-50 border border-warning-200 rounded-sm flex items-start gap-2'>
          <AlertIcon
            size={15}
            className='text-warning-500 mt-0.5 flex-shrink-0'
          />
          <p className='text-xs text-warning-700'>
            Only available if you signed up with email and password. Google
            sign-in users cannot change password here.
          </p>
        </div>

        {PASSWORD_FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className='input-label'>
              {field.label}
            </label>
            <div className='relative'>
              <FieldIcon icon={LockIcon} />
              <input
                id={field.name}
                name={field.name}
                type={showPass ? 'text' : 'password'}
                className={`input pl-11 ${field.name === 'confirm' ? 'pr-11' : ''}`}
                value={passwordForm[field.name]}
                onChange={handlePasswordChange}
                placeholder={field.placeholder}
              />
              {field.name === 'confirm' && (
                <button
                  type='button'
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass((v) => !v)}
                  className='absolute right-0 top-0 h-full w-10 flex items-center justify-center
                             text-ink-300 hover:text-ink-600 transition-colors duration-150'
                >
                  {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type='submit'
          disabled={savingPass}
          className='btn btn-primary flex items-center gap-2'
        >
          {savingPass ? (
            <>
              <SpinnerSvg /> Updating…
            </>
          ) : (
            <>
              <LockIcon size={15} /> Update Password
            </>
          )}
        </button>
      </form>

      {/* ── Danger zone ── */}
      <div className='card border-error-200 space-y-4'>
        <div className='flex items-center gap-2'>
          <AlertIcon size={18} className='text-error-400' />
          <h2 className='font-serif text-base font-semibold text-error-500'>
            Danger Zone
          </h2>
        </div>
        <p className='text-sm text-ink-400'>
          Destructive actions — these cannot be undone.
        </p>
        <div className='flex items-center justify-between p-4 bg-error-50 border border-error-200 rounded-sm'>
          <div>
            <p className='text-sm font-medium text-error-600'>
              Sign out of all devices
            </p>
            <p className='text-xs text-error-400 mt-0.5'>
              Revokes all active sessions
            </p>
          </div>
          <button
            type='button'
            onClick={async () => {
              const { logout } = await import('@/lib/firebase/auth')
              await logout()
              window.location.href = '/login'
            }}
            className='px-4 py-2 rounded-full text-sm font-semibold
                       border border-error-300 text-error-500
                       hover:bg-error-500 hover:text-white
                       transition-all duration-200'
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

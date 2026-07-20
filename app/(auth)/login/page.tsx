'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import type { ComponentType, JSX } from 'react'
import { auth } from '@/lib/firebase/config'
import { ensureUserDoc } from '@/lib/firebase/auth'
import {
  GoogleIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  SparkleIcon,
} from '@/components/icons'

interface FieldIconProps {
  icon: ComponentType<{ size?: number }>
}

function FieldIcon({ icon: Icon }: FieldIconProps): JSX.Element {
  return (
    <div
      className='pointer-events-none absolute left-3 top-0 h-full flex items-center justify-center'
      style={{ color: 'var(--ink-300)' }}
    >
      <Icon size={16} />
    </div>
  )
}

const inputBase =
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-[var(--ink-300)] outline-none transition-all duration-200'

const inputStyle = {
  border: '1px solid var(--ink-100)',
  background: 'var(--bg-surface)',
  color: 'var(--ink-900)',
  fontFamily: 'var(--font-sans)',
}

export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  function focusInput(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = 'var(--pink-300)'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196, 56, 138, 0.12)'
  }
  function blurInput(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = 'var(--ink-100)'
    e.currentTarget.style.boxShadow = 'none'
  }

  async function sendOtp(otpEmail: string, otpName?: string): Promise<void> {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: otpEmail, name: otpName }),
    })
    if (!res.ok) throw new Error('Failed to send OTP')
  }

  async function handleEmailSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await ensureUserDoc(cred.user, name)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      await sendOtp(email, name)
      sessionStorage.setItem('otp_email', email)
      sessionStorage.setItem('otp_name', name)
      router.push('/verify')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.replace('Firebase: ', '')
          : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle(): Promise<void> {
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      await ensureUserDoc(cred.user)
      const userEmail = cred.user.email ?? ''
      const userName = cred.user.displayName || ''
      await sendOtp(userEmail, userName)
      sessionStorage.setItem('otp_email', userEmail)
      sessionStorage.setItem('otp_name', userName)
      router.push('/verify')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.replace('Firebase: ', '')
          : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function handleToggleMode(): void {
    setIsSignUp((v) => !v)
    setError('')
    setName('')
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── Ambient orbs ── */}
      <div
        className='pointer-events-none absolute inset-0 overflow-hidden'
        aria-hidden='true'
      >
        <div
          className='absolute -top-28 -left-24 h-72 w-72 rounded-full blur-[60px] opacity-25 animate-[orbFloat_10s_ease-in-out_infinite]'
          style={{
            background:
              'radial-gradient(circle, var(--pink-200) 0%, transparent 70%)',
          }}
        />
        <div
          className='absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-[60px] opacity-20 animate-[orbFloat_8s_ease-in-out_infinite_reverse]'
          style={{
            background:
              'radial-gradient(circle, var(--pink-300) 0%, transparent 70%)',
          }}
        />
        <div
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full blur-[80px] opacity-15 animate-[orbFloat_12s_ease-in-out_3s_infinite]'
          style={{
            background:
              'radial-gradient(circle, var(--magenta-300) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className='relative z-10 w-full max-w-md animate-[fadeUp_0.5s_ease_forwards]'>
        {/* ── Header ── */}
        <div className='text-center mb-8'>
          <div
            className='inline-flex items-center justify-center w-12 h-12 rounded-full mb-4
                       animate-float transition-all duration-300 hover:scale-110'
            style={{
              background: 'var(--pink-100)',
              border: '1px solid var(--pink-200)',
              boxShadow: '0 0 24px rgba(196, 56, 138, 0.15)',
            }}
          >
            <span style={{ color: 'var(--pink-400)' }}>
              <SparkleIcon size={22} />
            </span>
          </div>
          <p className='label-eyebrow mb-1'>Soul Awakening Academy</p>
          <h1
            className='text-[32px] leading-tight'
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--magenta-700)',
            }}
          >
            {isSignUp ? 'Begin your journey' : 'Welcome back'}
          </h1>
          <p
            className='text-sm mt-1 font-light'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
          >
            {isSignUp
              ? 'Create your account to get started'
              : 'Sign in to continue your journey'}
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className='rounded-2xl p-8'
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--pink-100)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            type='button'
            className='w-full flex items-center justify-center gap-3
                       rounded-full py-3 px-4 text-sm font-medium
                       transition-all duration-200 disabled:opacity-40 mb-6
                       hover:-translate-y-0.5 active:scale-[0.98]'
            style={{
              fontFamily: 'var(--font-sans)',
              border: '1px solid var(--ink-100)',
              color: 'var(--ink-900)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--bg-muted)'
              el.style.borderColor = 'var(--pink-200)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.borderColor = 'var(--ink-100)'
            }}
          >
            <GoogleIcon size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className='flex items-center gap-3 mb-6'>
            <div
              className='flex-1 h-px'
              style={{ background: 'var(--ink-100)' }}
            />
            <span
              className='text-xs font-medium'
              style={{
                color: 'var(--ink-300)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              or
            </span>
            <div
              className='flex-1 h-px'
              style={{ background: 'var(--ink-100)' }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className='space-y-4'>
            {/* Name — sign-up only */}
            <div
              className={[
                'overflow-hidden transition-all duration-300 ease-in-out',
                isSignUp ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0',
              ].join(' ')}
            >
              <div className='pb-1'>
                <label htmlFor='name' className='input-label'>
                  Full name
                </label>
                <div className='relative'>
                  <FieldIcon icon={UserIcon} />
                  <input
                    id='name'
                    className={inputBase}
                    style={inputStyle}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Your full name'
                    required={isSignUp}
                    tabIndex={isSignUp ? 0 : -1}
                    autoComplete='name'
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className='input-label'>
                Email address
              </label>
              <div className='relative'>
                <FieldIcon icon={MailIcon} />
                <input
                  id='email'
                  className={inputBase}
                  style={inputStyle}
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  required
                  autoComplete='email'
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label htmlFor='password' className='input-label'>
                  Password
                </label>
                {!isSignUp && (
                  <a
                    href='/forgot-password'
                    className='text-[11px] font-medium transition-colors duration-150'
                    style={{
                      color: 'var(--pink-400)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        'var(--magenta-600)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        'var(--pink-400)')
                    }
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className='relative'>
                <FieldIcon icon={LockIcon} />
                <input
                  id='password'
                  className={`${inputBase} pr-10`}
                  style={inputStyle}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className='absolute right-0 top-0 h-full w-10 flex items-center justify-center
                             transition-colors duration-150'
                  style={{ color: 'var(--ink-300)' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      'var(--ink-600)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      'var(--ink-300)')
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            <div
              className={[
                'overflow-hidden transition-all duration-200 ease-in-out',
                error ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0',
              ].join(' ')}
            >
              <div
                className='flex items-start gap-2 rounded-xl px-3 py-2.5'
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
              >
                <p
                  className='text-xs leading-relaxed'
                  style={{ color: '#b91c1c' }}
                >
                  {error}
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className='btn btn-lg btn-magnetic w-full mt-2 flex items-center justify-center gap-2
                         disabled:opacity-40 disabled:transform-none
                         transition-all duration-200'
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'var(--magenta-700)',
                color: '#ffffff',
                borderRadius: '99px',
                boxShadow: 'var(--shadow-card)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--magenta-600)'
                  el.style.boxShadow = 'var(--shadow-soft)'
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--magenta-700)'
                el.style.boxShadow = 'var(--shadow-card)'
              }}
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
                  Please wait…
                </>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Toggle */}
          <p
            className='text-center text-sm mt-6'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
          >
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type='button'
              onClick={handleToggleMode}
              className='font-medium transition-colors duration-150'
              style={{ color: 'var(--pink-400)' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--magenta-600)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--pink-400)')
              }
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* Footer note */}
        <p
          className='text-center text-[11px] mt-6 font-light'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-300)' }}
        >
          By continuing, you agree to our{' '}
          <a
            href='/terms'
            className='transition-colors duration-150'
            style={{ color: 'var(--ink-300)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--pink-400)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--ink-300)')
            }
          >
            Terms
          </a>{' '}
          and{' '}
          <a
            href='/privacy'
            className='transition-colors duration-150'
            style={{ color: 'var(--ink-300)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--pink-400)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--ink-300)')
            }
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

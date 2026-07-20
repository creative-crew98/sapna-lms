'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { JSX } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  MailIcon,
  ArrowLeftIcon,
  RefreshIcon,
  ShieldIcon,
} from '@/components/icons'

const OTP_LENGTH = 6
const RESEND_SECONDS = 60

export default function VerifyPage(): JSX.Element {
  const router = useRouter()
  const { role } = useAuth()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [resending, setResending] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(RESEND_SECONDS)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const email: string =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('otp_email') || ''
      : ''
  const name: string =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('otp_name') || ''
      : ''

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function handleChange(i: number, val: string): void {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent): void {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent): void {
    e.preventDefault()
    const text = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH)
    if (text.length === OTP_LENGTH) {
      setOtp(text.split(''))
      inputs.current[OTP_LENGTH - 1]?.focus()
    }
  }

  async function handleVerify(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < OTP_LENGTH) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = (await res.json()) as { success: boolean; error?: string }

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid or expired code. Please try again.')
        setOtp(Array(OTP_LENGTH).fill(''))
        inputs.current[0]?.focus()
        return
      }

      document.cookie = `firebase-token=true; path=/; max-age=86400`
      sessionStorage.removeItem('otp_email')
      sessionStorage.removeItem('otp_name')
      router.push(role === 'admin' ? '/admin' : '/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend(): Promise<void> {
    if (countdown > 0 || resending) return
    setResending(true)
    setError('')
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      setCountdown(RESEND_SECONDS)
      setOtp(Array(OTP_LENGTH).fill(''))
      inputs.current[0]?.focus()
    } catch {
      setError('Failed to resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const isComplete: boolean = otp.join('').length === OTP_LENGTH

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── Ambient orbs ── */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div
          className='absolute -top-28 -left-24 h-72 w-72 rounded-full blur-[90px] opacity-30
                     animate-[orbFloat_13s_ease-in-out_infinite]'
          style={{ background: 'var(--pink-200)' }}
        />
        <div
          className='absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-[100px] opacity-20
                     animate-[orbFloat_11s_ease-in-out_1.5s_infinite_reverse]'
          style={{ background: 'var(--pink-300)' }}
        />
      </div>

      <div className='relative z-10 w-full max-w-md stagger-children'>
        {/* ── Logo ── */}
        <div className='text-center mb-8'>
          <div
            className='inline-flex items-center justify-center w-14 h-14 rounded-full mb-4
                       animate-[pulseRing_2.5s_ease-in-out_infinite]'
            style={{
              background: 'var(--pink-100)',
              color: 'var(--pink-400)',
            }}
          >
            <ShieldIcon size={26} />
          </div>
          <p
            className='text-[11px] font-semibold uppercase tracking-[0.22em] mb-1'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
          >
            Verification
          </p>
          <h1
            className='text-[32px]'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
          >
            Check your email
          </h1>
        </div>

        {/* ── Card ── */}
        <div
          className='rounded-2xl p-8'
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--pink-100)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Email display */}
          <div
            className='flex items-center gap-3 rounded-xl px-4 py-3 mb-8'
            style={{
              background: 'var(--pink-50)',
              border: '1px solid var(--pink-100)',
            }}
          >
            <span
              className='flex-shrink-0'
              style={{ color: 'var(--pink-400)' }}
            >
              <MailIcon size={18} />
            </span>
            <div>
              <p
                className='text-xs'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-400)',
                }}
              >
                Code sent to
              </p>
              <p
                className='text-sm font-medium'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-900)',
                }}
              >
                {email}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify}>
            {/* OTP inputs */}
            <div className='flex justify-between gap-2 mb-6'>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el
                  }}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className='w-12 h-14 text-center text-xl font-semibold rounded-xl
                             transition-all duration-150 outline-none
                             focus:scale-[1.04]'
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--ink-900)',
                    background: digit ? 'var(--pink-100)' : 'var(--pink-50)',
                    border: `1px solid ${digit ? 'var(--pink-400)' : 'var(--pink-100)'}`,
                    boxShadow: digit
                      ? '0 0 0 3px rgba(196, 56, 138, 0.12)'
                      : 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--pink-300)'
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(196, 56, 138, 0.15)'
                  }}
                  onBlur={(e) => {
                    const d = otp[i]
                    e.currentTarget.style.borderColor = d
                      ? 'var(--pink-400)'
                      : 'var(--pink-100)'
                    e.currentTarget.style.boxShadow = d
                      ? '0 0 0 3px rgba(196, 56, 138, 0.12)'
                      : 'none'
                  }}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div
                className='rounded-xl px-3 py-2.5 mb-4 animate-[fadeUp_0.25s_ease_both]'
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
              >
                <p className='text-xs' style={{ color: '#b91c1c' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type='submit'
              disabled={loading || !isComplete}
              className='btn btn-lg w-full mb-4 flex items-center justify-center gap-2
                         transition-all duration-200
                         hover:-translate-y-px hover:scale-[1.015]
                         active:scale-[0.97]
                         disabled:opacity-40 disabled:transform-none'
              style={{
                fontFamily: 'var(--font-sans)',
                background: 'var(--magenta-700)',
                color: '#ffffff',
                borderRadius: '99px',
                boxShadow: 'var(--shadow-card)',
              }}
              onMouseEnter={(e) => {
                if (!loading && isComplete) {
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
                  >
                    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                  </svg>
                  Verifying…
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>

          {/* Resend */}
          <div className='text-center'>
            <p
              className='text-sm mb-1'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-400)',
              }}
            >
              Didn&apos;t receive the code?
            </p>
            <button
              type='button'
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className='inline-flex items-center gap-1.5 text-sm font-medium
                         transition-colors duration-150
                         disabled:cursor-default'
              style={{
                fontFamily: 'var(--font-sans)',
                color:
                  countdown > 0 || resending
                    ? 'var(--ink-300)'
                    : 'var(--pink-400)',
              }}
              onMouseEnter={(e) => {
                if (countdown === 0 && !resending)
                  (e.currentTarget as HTMLElement).style.color =
                    'var(--magenta-600)'
              }}
              onMouseLeave={(e) => {
                if (countdown === 0 && !resending)
                  (e.currentTarget as HTMLElement).style.color =
                    'var(--pink-400)'
              }}
            >
              <span className={resending ? 'animate-spin' : ''}>
                <RefreshIcon size={14} />
              </span>
              {countdown > 0
                ? `Resend in ${countdown}s`
                : resending
                  ? 'Sending…'
                  : 'Resend code'}
            </button>
          </div>

          {/* Back */}
          <button
            type='button'
            onClick={() => router.push('/login')}
            className='flex items-center gap-1.5 text-sm mx-auto mt-6
                       transition-colors duration-150'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-300)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--ink-600)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = 'var(--ink-300)')
            }
          >
            <ArrowLeftIcon size={14} />
            Back to login
          </button>
        </div>
      </div>
    </div>
  )
}

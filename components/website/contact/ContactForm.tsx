'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { ComponentType } from 'react'
import {
  MailIcon,
  PhoneIcon,
  UserIcon,
  BookIcon,
  CheckIcon,
} from '@/components/icons'
import { SectionLabel } from '@/components/website/Shared'

interface ContactFormData {
  name: string
  email: string
  phone: string
  program: string
  message: string
}

interface ProgramOption {
  id: string
  label: string
}

const PROGRAMS: ProgramOption[] = [
  { id: '', label: 'Not sure yet — help me choose' },
  { id: 'akashic', label: 'Akashic Record Reading Program' },
  { id: 'relationship', label: 'Life & Relationship Coaching Program' },
]

const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  program: '',
  message: '',
}

// input base — pink focus ring
const inputBase =
  'w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-[var(--ink-300)] outline-none transition-all duration-200'

function FieldIcon({
  icon: Icon,
}: {
  icon: ComponentType<{ size?: number }>
}): React.JSX.Element {
  return (
    <div
      className='pointer-events-none absolute left-3 top-0 h-full flex items-center justify-center'
      style={{ color: 'var(--ink-300)' }}
    >
      <Icon size={16} />
    </div>
  )
}

export default function ContactForm(): React.JSX.Element {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      toast.success('Message sent!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    border: '1px solid var(--ink-100)',
    background: 'var(--bg-surface)',
    color: 'var(--ink-900)',
    fontFamily: 'var(--font-sans)',
  }

  return (
    <div className='lg:sticky lg:top-28'>
      {/* ── Success state ── */}
      {submitted ? (
        <div
          className='card text-center py-12 space-y-5 animate-[scaleInKf_0.35s_cubic-bezier(0.4,0,0.2,1)_forwards]'
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--pink-100)',
          }}
        >
          <div
            className='w-16 h-16 rounded-full flex items-center justify-center mx-auto
                       animate-[scaleInKf_0.4s_cubic-bezier(0.34,1.56,0.64,1)_0.1s_forwards] opacity-0'
            style={{ background: 'var(--pink-50)', color: 'var(--pink-400)' }}
          >
            <CheckIcon size={28} />
          </div>
          <div>
            <h2
              className='italic text-xl mb-2'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--ink-900)',
              }}
            >
              Message sent ✦
            </h2>
            <p
              className='text-sm leading-relaxed max-w-xs mx-auto'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-400)',
              }}
            >
              Thank you for reaching out. Sapna will get back to you within
              24–48 hours. Check your inbox for a confirmation email.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm(EMPTY_FORM)
            }}
            className='btn btn-ghost btn-sm mx-auto
                       hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150'
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='space-y-5 animate-[fadeUp_0.4s_ease_forwards] rounded-2xl p-6'
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--pink-100)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div>
            <SectionLabel>Send a message</SectionLabel>
            <h2
              className='text-lg'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--ink-900)',
              }}
            >
              I&apos;d love to hear from you
            </h2>
          </div>

          {/* Name */}
          <div>
            <label htmlFor='name' className='input-label'>
              Full name *
            </label>
            <div className='relative'>
              <FieldIcon icon={UserIcon} />
              <input
                id='name'
                name='name'
                className={inputBase}
                style={inputStyle}
                value={form.name}
                onChange={handleChange}
                placeholder='Your name'
                required
                autoComplete='name'
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--pink-300)'
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(196, 56, 138, 0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-100)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='input-label'>
              Email *
            </label>
            <div className='relative'>
              <FieldIcon icon={MailIcon} />
              <input
                id='email'
                name='email'
                type='email'
                className={inputBase}
                style={inputStyle}
                value={form.email}
                onChange={handleChange}
                placeholder='you@example.com'
                required
                autoComplete='email'
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--pink-300)'
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(196, 56, 138, 0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-100)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor='phone' className='input-label'>
              Phone / WhatsApp
            </label>
            <div className='relative'>
              <FieldIcon icon={PhoneIcon} />
              <input
                id='phone'
                name='phone'
                className={inputBase}
                style={inputStyle}
                value={form.phone}
                onChange={handleChange}
                placeholder='+91 99999 99999'
                autoComplete='tel'
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--pink-300)'
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(196, 56, 138, 0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-100)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Program */}
          <div>
            <label htmlFor='program' className='input-label'>
              Program interest
            </label>
            <div className='relative'>
              <FieldIcon icon={BookIcon} />
              <select
                id='program'
                name='program'
                className={`${inputBase} cursor-pointer`}
                style={inputStyle}
                value={form.program}
                onChange={handleChange}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--pink-300)'
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(196, 56, 138, 0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-100)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor='message' className='input-label'>
              Message *
            </label>
            <textarea
              id='message'
              name='message'
              className='w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-[var(--ink-300)] outline-none transition-all duration-200 min-h-[130px] resize-none'
              style={inputStyle}
              value={form.message}
              onChange={handleChange}
              placeholder='Tell Sapna a little about what you are going through and what you are hoping to heal or transform…'
              required
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--pink-300)'
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(196, 56, 138, 0.12)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink-100)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary w-full flex items-center justify-center gap-2
                       hover:scale-[1.015] active:scale-[0.97]
                       transition-all duration-150 disabled:opacity-40 disabled:transform-none'
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
                Sending…
              </>
            ) : (
              <>
                <MailIcon size={15} />
                Send Message
              </>
            )}
          </button>

          <p
            className='text-xs text-center'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-300)' }}
          >
            You&apos;ll receive a confirmation email immediately. Sapna responds
            within 24–48 hours.
          </p>
        </form>
      )}
    </div>
  )
}

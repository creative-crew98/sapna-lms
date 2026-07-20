'use client'

import Link from 'next/link'
import type { ComponentType } from 'react'
import {
  SparkleIcon,
  MailIcon,
  PhoneIcon,
  BookIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@/components/icons'
import { SectionLabel } from '@/components/website/Shared'

interface ContactMethod {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
  href: string
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: MailIcon,
    label: 'Email',
    value: 'soulawakeningwithsapna@gmail.com',
    href: 'mailto:soulawakeningwithsapna@gmail.com',
  },
  {
    icon: PhoneIcon,
    label: 'WhatsApp',
    value: 'Message on WhatsApp',
    href: 'https://wa.me/919999999999',
  },
]

const EXPECTATIONS: string[] = [
  'Sapna reads every message personally',
  'Response within 24–48 hours',
  'Auto-confirmation sent to your email',
  'Safe, non-judgmental space — always',
]

interface ProgramLink {
  title: string
  subtitle: string
  href: string
}

const PROGRAM_LINKS: ProgramLink[] = [
  {
    title: 'Akashic Record Reading Program',
    subtitle: 'Soul-level root cause discovery',
    href: '/#programs',
  },
  {
    title: 'Life & Relationship Coaching',
    subtitle: 'Practical human transformation',
    href: '/#programs',
  },
]

export default function ContactInfo(): React.JSX.Element {
  return (
    <div className='space-y-8 animate-[slideInLeft_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]'>
      {/* ── Header ── */}
      <div>
        <SectionLabel>Get in touch</SectionLabel>
        <h1
          className='text-3xl sm:text-4xl leading-[1.15] mb-4'
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
        >
          Begin the{' '}
          <span className='italic' style={{ color: 'var(--pink-400)' }}>
            conversation
          </span>
        </h1>
        <p
          className='text-sm leading-relaxed font-light'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-500)' }}
        >
          Have a question about the programs, want to know if this is the right
          fit for you, or simply ready to take the first step? Reach out — Sapna
          reads every message personally.
        </p>
      </div>

      {/* ── Contact methods ── */}
      <div className='space-y-3 stagger-children'>
        {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-4 p-4 rounded-xl
                       transition-all duration-200 group hover:-translate-y-0.5'
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--pink-100)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-300)'
              el.style.boxShadow = 'var(--shadow-soft)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--pink-100)'
              el.style.boxShadow = 'none'
            }}
          >
            <div
              className='w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                         transition-all duration-200 group-hover:scale-110'
              style={{
                background: 'var(--pink-50)',
                color: 'var(--pink-400)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-100)'
                el.style.color = 'var(--pink-500)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--pink-50)'
                el.style.color = 'var(--pink-400)'
              }}
            >
              <Icon size={18} />
            </div>
            <div>
              <p
                className='text-[10px] font-semibold uppercase tracking-wider'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-400)',
                }}
              >
                {label}
              </p>
              <p
                className='text-sm font-medium'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink-900)',
                }}
              >
                {value}
              </p>
            </div>
            <span
              className='ml-auto transition-all duration-200 group-hover:translate-x-1'
              style={{ color: 'var(--ink-300)' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--pink-400)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--ink-300)')
              }
            >
              <ChevronRightIcon size={15} />
            </span>
          </a>
        ))}
      </div>

      {/* ── What to expect ── */}
      <div
        className='p-5 rounded-xl relative overflow-hidden animate-[fadeUp_0.5s_ease_forwards]'
        style={{ background: 'var(--ink-900)' }}
      >
        {/* Orb */}
        <div
          className='pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 animate-[orbFloat_8s_ease-in-out_infinite]'
          style={{ background: 'var(--pink-400)' }}
          aria-hidden='true'
        />

        <div className='relative z-10 flex items-center gap-2 mb-3'>
          <span className='animate-float' style={{ color: 'var(--pink-300)' }}>
            <SparkleIcon size={14} />
          </span>
          <p
            className='text-xs font-semibold uppercase tracking-wider'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-300)' }}
          >
            What to expect
          </p>
        </div>

        <div className='relative z-10 space-y-2.5'>
          {EXPECTATIONS.map((item) => (
            <div key={item} className='flex items-center gap-2.5'>
              <span
                className='flex-shrink-0'
                style={{ color: 'var(--pink-300)' }}
              >
                <CheckIcon size={13} />
              </span>
              <p
                className='text-xs'
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Program quick links ── */}
      <div className='space-y-3'>
        <p
          className='text-xs font-semibold uppercase tracking-widest'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
        >
          Explore programs
        </p>
        {PROGRAM_LINKS.map(({ title, subtitle, href }, i) => (
          <Link key={title} href={href}>
            <div
              className='flex items-center gap-3 p-3.5 rounded-xl mb-3
                         transition-all duration-200 group hover:-translate-y-0.5
                         animate-[fadeUp_0.4s_ease_forwards] opacity-0'
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--pink-100)',
                animationDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--pink-300)'
                el.style.boxShadow = 'var(--shadow-soft)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--pink-100)'
                el.style.boxShadow = 'none'
              }}
            >
              <div
                className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                           transition-all duration-200 group-hover:scale-110'
                style={{
                  background: 'var(--pink-50)',
                  color: 'var(--pink-400)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--pink-100)'
                  el.style.color = 'var(--pink-500)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--pink-50)'
                  el.style.color = 'var(--pink-400)'
                }}
              >
                <BookIcon size={14} />
              </div>
              <div className='flex-1'>
                <p
                  className='text-sm font-medium'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--ink-900)',
                  }}
                >
                  {title}
                </p>
                <p
                  className='text-xs'
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--ink-400)',
                  }}
                >
                  {subtitle}
                </p>
              </div>
              <span
                className='transition-all duration-200 group-hover:translate-x-1'
                style={{ color: 'var(--ink-300)' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'var(--pink-400)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'var(--ink-300)')
                }
              >
                <ChevronRightIcon size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

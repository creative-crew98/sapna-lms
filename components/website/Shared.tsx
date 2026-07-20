'use client'

import type { ReactNode, ComponentType, JSX } from 'react'
import { SparkleIcon, CheckIcon } from '@/components/icons'

// ─────────────────────────────────────────
// Divider
// ─────────────────────────────────────────
export function Divider({ light = false }: { light?: boolean }): JSX.Element {
  return (
    <div className='flex items-center justify-center gap-3 py-1'>
      <div
        className='h-px w-10 sm:w-16 animate-[fadeIn_0.7s_ease_both]'
        style={{
          background: light
            ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))'
            : `linear-gradient(to right, transparent, var(--pink-200))`,
        }}
      />
      <span
        className='animate-[slow-spin_10s_linear_infinite]'
        style={{ color: light ? 'var(--pink-200)' : 'var(--pink-300)' }}
      >
        <SparkleIcon size={12} />
      </span>
      <div
        className='h-px w-10 sm:w-16 animate-[fadeIn_0.7s_ease_both]'
        style={{
          background: light
            ? 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))'
            : `linear-gradient(to left, transparent, var(--pink-200))`,
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────
// SectionLabel
// ─────────────────────────────────────────
export function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode
  light?: boolean
}): JSX.Element {
  return (
    <div
      className='inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full
                 text-[10px] font-semibold uppercase tracking-[0.2em]
                 animate-[fadeUp_0.45s_ease_both]'
      style={{
        fontFamily: 'var(--font-sans)',
        border: light
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid var(--pink-200)',
        background: light ? 'rgba(255,255,255,0.05)' : 'var(--pink-50)',
        color: light ? 'var(--pink-100)' : 'var(--pink-500)',
      }}
    >
      <span
        className='animate-float'
        style={{ color: light ? 'var(--pink-200)' : 'var(--pink-300)' }}
      >
        <SparkleIcon size={10} />
      </span>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────
// SectionHeading
// ─────────────────────────────────────────
interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: string
  light?: boolean
  align?: 'center' | 'left'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = 'center',
}: SectionHeadingProps): JSX.Element {
  return (
    <div
      className={`stagger-children ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <div className={align === 'center' ? 'flex justify-center' : 'flex'}>
        <SectionLabel light={light}>{eyebrow}</SectionLabel>
      </div>

      <h2
        className='text-3xl sm:text-4xl leading-[1.15] mt-1'
        style={{
          fontFamily: 'var(--font-serif)',
          color: light ? '#ffffff' : 'var(--ink-900)',
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`text-sm sm:text-[15px] mt-3 font-light leading-relaxed max-w-md
            ${align === 'center' ? 'mx-auto' : ''}`}
          style={{
            fontFamily: 'var(--font-sans)',
            color: light ? 'rgba(255,255,255,0.45)' : 'var(--ink-400)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// PainCard
// ─────────────────────────────────────────
export function PainCard({
  text,
  index,
}: {
  text: string
  index: number
}): JSX.Element {
  return (
    <div
      className='group flex items-start gap-3 p-4 sm:p-5 cursor-default rounded-xl
                 transition-all duration-200
                 hover:-translate-y-1
                 animate-[fadeUp_0.45s_ease_both] opacity-0'
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--pink-100)',
        animationDelay: `${index * 0.06}s`,
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
      <span
        className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5
                   transition-all duration-200
                   group-hover:scale-110 group-hover:rotate-[15deg]'
        style={{
          background: 'var(--pink-50)',
          border: '1px solid var(--pink-100)',
          color: 'var(--pink-400)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--pink-100)'
          el.style.borderColor = 'var(--pink-300)'
          el.style.color = 'var(--pink-500)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--pink-50)'
          el.style.borderColor = 'var(--pink-100)'
          el.style.color = 'var(--pink-400)'
        }}
      >
        <SparkleIcon size={11} />
      </span>
      <p
        className='text-sm leading-relaxed transition-colors duration-200
                   group-hover:text-[var(--ink-700)]'
        style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-500)' }}
      >
        {text}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
// CheckItem
// ─────────────────────────────────────────
export function CheckItem({
  text,
  featured = false,
}: {
  text: string
  featured?: boolean
}): JSX.Element {
  return (
    <li className='flex items-start gap-2.5 group'>
      <span
        className='mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full
                   transition-all duration-150 group-hover:scale-110'
        style={{
          background: featured ? 'rgba(196, 56, 138, 0.2)' : 'var(--pink-50)',
          color: featured ? 'var(--pink-200)' : 'var(--pink-500)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = featured
            ? 'rgba(196, 56, 138, 0.35)'
            : 'var(--pink-100)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = featured
            ? 'rgba(196, 56, 138, 0.2)'
            : 'var(--pink-50)'
        }}
      >
        <CheckIcon size={10} />
      </span>
      <span
        className='text-sm leading-relaxed'
        style={{
          fontFamily: 'var(--font-sans)',
          color: featured ? 'rgba(255,255,255,0.75)' : 'var(--ink-500)',
        }}
      >
        {text}
      </span>
    </li>
  )
}

// ─────────────────────────────────────────
// FeatureCard
// ─────────────────────────────────────────
interface FeatureCardProps {
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  index: number
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps): JSX.Element {
  return (
    <div
      className='group relative flex flex-col items-center text-center p-5 sm:p-6
                 cursor-default rounded-2xl overflow-hidden
                 transition-all duration-250
                 hover:-translate-y-1.5
                 animate-[fadeUp_0.5s_ease_both] opacity-0'
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--pink-100)',
        animationDelay: `${index * 0.08}s`,
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
      {/* Shimmer bg on hover */}
      <div
        className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   pointer-events-none rounded-2xl'
        style={{
          background:
            'linear-gradient(135deg, rgba(249,216,242,0.5) 0%, transparent 50%, rgba(255,240,251,0.35) 100%)',
        }}
      />

      {/* Icon orb */}
      <span
        className='relative flex h-12 w-12 items-center justify-center rounded-full mb-4
                   transition-all duration-200
                   group-hover:scale-110 group-hover:rotate-[-4deg]'
        style={{
          background: 'var(--pink-50)',
          border: '1px solid var(--pink-100)',
          color: 'var(--pink-400)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--pink-100)'
          el.style.borderColor = 'var(--pink-200)'
          el.style.color = 'var(--pink-500)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'var(--pink-50)'
          el.style.borderColor = 'var(--pink-100)'
          el.style.color = 'var(--pink-400)'
        }}
      >
        {/* Pulse ring */}
        <span
          className='absolute inset-0 rounded-full opacity-0
                     group-hover:opacity-100 animate-[pulseRing_1.6s_ease-out_infinite]'
          style={{ border: '1px solid var(--pink-300)' }}
        />
        <Icon size={18} />
      </span>

      <p
        className='relative text-base mb-1.5 transition-colors duration-200
                   group-hover:text-[var(--magenta-600)]'
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-900)' }}
      >
        {title}
      </p>
      <p
        className='relative text-sm leading-relaxed font-light'
        style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-400)' }}
      >
        {description}
      </p>
    </div>
  )
}

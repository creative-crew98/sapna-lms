'use client'

import Link from 'next/link'
import { CheckItem } from '@/components/website/Shared'
import RazorpayButton from '@/components/RazorpayButton'

export interface ProgramTheme {
  dark: boolean
  bgClassName: string
  textColor: string
  mutedColor: string
  badgeBg: string
  badgeText: string
  priceColor: string
  priceStrikeColor: string
  borderColor: string
  dividerColor: string
  linkColor: string
  linkHoverColor: string
  buttonBg: string
  buttonHoverBg: string
  buttonShadow: string
}

interface ProgramCardProps {
  programId: string
  badge: string
  title: string
  subtitle: string
  description: string
  price: string
  originalPrice: string
  includes: string[]
  theme: ProgramTheme
  featured?: boolean
  courseHref: string
  index?: number
}

export default function ProgramCard({
  programId,
  badge,
  title,
  subtitle,
  description,
  price,
  originalPrice,
  includes,
  theme,
  featured = false,
  courseHref,
  index = 0,
}: ProgramCardProps): React.JSX.Element {
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-7 flex flex-col h-full
                 animate-[fadeUp_0.55s_cubic-bezier(0.4,0,0.2,1)_forwards] opacity-0
                 transition-all duration-200 hover:-translate-y-1.5 ${theme.bgClassName}`}
      style={{
        animationDelay: `${index * 0.12}s`,
        border: `1px solid ${theme.borderColor}`,
        boxShadow: theme.buttonShadow,
      }}
    >
      {/* Most Popular badge */}
      {featured && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2 z-10'>
          <span
            className='inline-block text-[10px] font-semibold px-4 py-1 rounded-full uppercase tracking-widest animate-[goldPulse_2.5s_ease-in-out_infinite]'
            style={{
              fontFamily: 'var(--font-sans)',
              background: theme.priceColor,
              color: theme.dark ? '#1A0A3E' : '#ffffff',
            }}
          >
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className='mb-5'>
        <span
          className='text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block'
          style={{
            fontFamily: 'var(--font-sans)',
            background: theme.badgeBg,
            color: theme.badgeText,
          }}
        >
          {badge}
        </span>
        <h3
          className='text-xl sm:text-2xl leading-tight mb-1'
          style={{
            fontFamily: 'var(--font-serif)',
            color: theme.textColor,
          }}
        >
          {title}
        </h3>
        <p
          className='text-sm'
          style={{
            fontFamily: 'var(--font-sans)',
            color: theme.mutedColor,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Description */}
      <p
        className='text-sm leading-relaxed mb-5 font-light'
        style={{
          fontFamily: 'var(--font-sans)',
          color: theme.mutedColor,
        }}
      >
        {description}
      </p>

      {/* Includes */}
      <ul className='space-y-2 mb-7 flex-1'>
        {includes.map((item, i) => (
          <CheckItem key={i} text={item} featured={theme.dark} />
        ))}
      </ul>

      {/* Price */}
      <div
        className='mb-4 pb-4'
        style={{ borderBottom: `1px solid ${theme.dividerColor}` }}
      >
        <div className='flex items-baseline gap-2'>
          <span
            className='text-3xl font-bold'
            style={{
              fontFamily: 'var(--font-serif)',
              color: theme.priceColor,
            }}
          >
            {price}
          </span>
          <span
            className='text-sm line-through'
            style={{ color: theme.priceStrikeColor }}
          >
            {originalPrice}
          </span>
        </div>
        <p
          className='text-xs mt-0.5'
          style={{
            fontFamily: 'var(--font-sans)',
            color: theme.priceStrikeColor,
          }}
        >
          One-time investment · Limited seats
        </p>
      </div>

      {/* Course link */}
      <Link
        href={courseHref}
        className='text-xs font-medium mb-3.5 inline-flex items-center gap-1
                   transition-all duration-150 hover:gap-2'
        style={{ fontFamily: 'var(--font-sans)', color: theme.linkColor }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = theme.linkHoverColor)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = theme.linkColor)
        }
      >
        View full program details →
      </Link>

      {/* Enroll button wrapper — handles hover bg/shadow */}
      <div
        className='rounded-full hover:scale-[1.015] active:scale-[0.97] transition-all duration-150'
        style={{ background: theme.buttonBg, boxShadow: theme.buttonShadow }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.background =
            theme.buttonHoverBg
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = theme.buttonBg
        }}
      >
        <RazorpayButton
          programId={programId}
          label='Enroll Now'
          className='w-full py-3 rounded-full font-semibold text-sm text-white transition-colors duration-200'
          style={{ fontFamily: 'var(--font-sans)', background: 'transparent' }}
        />
      </div>
    </div>
  )
}

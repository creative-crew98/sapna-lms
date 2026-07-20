'use client'

import type { JSX } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const CONTACT = {
  email: 'soulawakeningwithsapna@gmail.com',
  whatsapp: '+91 9999915305', // ← replace
  instagram: '@soulawakeningwithsapna', // ← replace
  instagramUrl: 'https://instagram.com/soulawakeningwithsapna', // ← replace
}

function EmailIcon(): JSX.Element {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='2' y='4' width='20' height='16' rx='3' />
      <path d='m2 7 10 7 10-7' />
    </svg>
  )
}

function WhatsAppIcon(): JSX.Element {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z' />
    </svg>
  )
}

function InstagramIcon(): JSX.Element {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='2' y='2' width='20' height='20' rx='5' />
      <circle cx='12' cy='12' r='4' />
      <circle cx='17.5' cy='6.5' r='0.8' fill='currentColor' stroke='none' />
    </svg>
  )
}

export default function Footer(): JSX.Element {
  return (
    <footer
      style={{
        background: 'var(--magenta-700)',
        borderTop: '1px solid var(--magenta-600)',
      }}
    >
      <div className='max-w-5xl mx-auto px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8'>
        {/* ── Col 1 — Brand ── */}
        <div className='flex flex-col items-center sm:items-start gap-4'>
          <Link
            href='/'
            className='flex items-center gap-2.5 group outline-none'
          >
            <span
              className='flex-shrink-0 w-8 h-8 rounded-full overflow-hidden transition-all duration-200'
              style={{ border: '1px solid var(--pink-500)' }}
            >
              <Image
                src='/logo.jpeg'
                alt='Logo'
                width={32}
                height={32}
                className='object-contain rounded-full'
              />
            </span>
            <span
              className='text-sm font-semibold transition-colors duration-200'
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--pink-100)',
              }}
            >
              Soul Awakening With Sapna
            </span>
          </Link>

          <p
            className='text-xs italic leading-relaxed text-center sm:text-left'
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--pink-200)',
            }}
          >
            &ldquo;Healing should feel supported, safe, and
            compassionate.&rdquo;
          </p>

          <p
            className='text-xs'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
          >
            © {new Date().getFullYear()} Sapna Lamba · All rights reserved
          </p>
        </div>

        {/* ── Col 2 — Page Links ── */}
        <div className='flex flex-col items-center sm:items-start gap-3'>
          <p
            className='text-[11px] font-semibold tracking-[0.22em] uppercase mb-1'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-300)' }}
          >
            Pages
          </p>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className='text-sm transition-colors duration-150'
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--pink-200)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--pink-100)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--pink-200)')
              }
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Col 3 — Contact ── */}
        <div className='flex flex-col items-center sm:items-start gap-3'>
          <p
            className='text-[11px] font-semibold tracking-[0.22em] uppercase mb-1'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-300)' }}
          >
            Contact
          </p>

          {/* Email */}
          <a
            href={`mailto:${CONTACT.email}`}
            className='flex items-center gap-2 text-sm transition-colors duration-150'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-200)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--pink-100)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--pink-200)')
            }
          >
            <span style={{ color: 'var(--pink-300)' }}>
              <EmailIcon />
            </span>
            {CONTACT.email}
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-sm transition-colors duration-150'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-200)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--pink-100)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--pink-200)')
            }
          >
            <span style={{ color: 'var(--pink-300)' }}>
              <WhatsAppIcon />
            </span>
            {CONTACT.whatsapp}
          </a>

          {/* Instagram */}
          <a
            href={CONTACT.instagramUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-sm transition-colors duration-150'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-200)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--pink-100)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--pink-200)')
            }
          >
            <span style={{ color: 'var(--pink-300)' }}>
              <InstagramIcon />
            </span>
            {CONTACT.instagram}
          </a>
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div
        className='py-3 px-6 flex items-center justify-center gap-3'
        style={{ borderTop: '1px solid var(--magenta-600)' }}
      >
        <span
          className='text-xs animate-[goldPulse_2.5s_ease-in-out_infinite]'
          style={{ color: 'var(--pink-400)' }}
        >
          ✦
        </span>
        <span
          className='text-[10px] tracking-[0.2em] uppercase'
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--pink-400)' }}
        >
          Soul Awakening · Heal · Transform · Rise
        </span>
        <span
          className='text-xs animate-[goldPulse_2.5s_ease-in-out_infinite]'
          style={{ color: 'var(--pink-400)' }}
        >
          ✦
        </span>
      </div>
    </footer>
  )
}

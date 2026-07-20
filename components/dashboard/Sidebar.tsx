'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { ComponentType, JSX } from 'react'
import {
  HomeIcon,
  BookIcon,
  CalendarIcon,
  FolderIcon,
  PenIcon,
  StarIcon,
  TrendingUpIcon,
  LogOutIcon,
  SparkleIcon,
  UserIcon,
} from '@/components/icons'

interface NavItem {
  label: string
  href: string
  icon: ComponentType<{ size?: number }>
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: HomeIcon },
  { label: 'My Programs', href: '/dashboard/programs', icon: BookIcon },
  { label: 'Sessions', href: '/dashboard/sessions', icon: CalendarIcon },
  { label: 'Resources', href: '/dashboard/resources', icon: FolderIcon },
  { label: 'Journal', href: '/dashboard/journal', icon: PenIcon },
  { label: 'Affirmations', href: '/dashboard/affirmations', icon: StarIcon },
  { label: 'Progress', href: '/dashboard/progress', icon: TrendingUpIcon },
]

interface SidebarProfile {
  name?: string
  email?: string
  photo?: string
}

interface SidebarProps {
  open: boolean
  onClose: () => void
  role: 'admin' | 'student' | null
  profile: SidebarProfile | null
  onLogout: () => void | Promise<void>
}

export default function Sidebar({
  open,
  onClose,
  role,
  profile,
  onLogout,
}: SidebarProps): JSX.Element {
  const pathname = usePathname()

  function isActive(href: string): boolean {
    return href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 backdrop-blur-sm z-20 lg:hidden
                    bg-[rgba(42,10,32,0.3)]
                    transition-opacity duration-300
                    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-full w-64 flex flex-col z-30
                    bg-bg-surface border-r border-ink-100
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0`}
      >
        {/* ── Logo ── */}
        <div
          className='px-6 py-5 border-b border-ink-100'
        >
          <div className='flex items-center gap-2.5'>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center shrink-0
                         animate-[spin_10s_linear_infinite] bg-pink-50 text-pink-400'
            >
              <SparkleIcon size={15} />
            </div>
            <div>
              <p
                className='text-xs font-semibold leading-tight font-serif text-ink-900'
              >
                Soul Academy
              </p>
              <p
                className='text-[10px] font-medium uppercase tracking-wider font-sans text-pink-400'
              >
                My Journey
              </p>
            </div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className='flex-1 px-3 py-4 overflow-y-auto scroll-smooth'>
          <p
            className='px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest font-sans text-ink-300'
          >
            Navigation
          </p>
          <ul className='space-y-0.5'>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`sidebar-item ${isActive(href) ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {role === 'admin' && (
            <>
              <p
                className='px-3 mt-6 mb-2 text-[10px] font-semibold uppercase tracking-widest font-sans text-ink-300'
              >
                Admin
              </p>
              <Link
                href='/admin'
                className='sidebar-item text-magenta-500 hover:bg-pink-50 hover:text-magenta-600'
              >
                <SparkleIcon size={18} />
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* ── Profile + logout ── */}
        <div
          className='px-3 py-4 border-t border-ink-100'
        >
          <Link href='/dashboard/profile'>
            <div
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 cursor-pointer
                         transition-all duration-200 bg-pink-50 hover:bg-pink-100'
            >
              {/* Avatar */}
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-pink-200'
              >
                {profile?.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photo}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <span
                    className='text-xs font-semibold text-magenta-600 font-sans'
                  >
                    {profile?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <p
                  className='text-sm font-medium truncate font-sans text-ink-900'
                >
                  {profile?.name || 'Student'}
                </p>
                <p
                  className='text-[11px] truncate font-sans text-ink-400'
                >
                  {profile?.email}
                </p>
              </div>
              <span className='text-ink-300'>
                <UserIcon size={14} />
              </span>
            </div>
          </Link>

          {/* Sign out */}
          <button
            type='button'
            onClick={onLogout}
            className='sidebar-item w-full transition-all duration-200 text-ink-400 hover:bg-error-50 hover:text-error-700'
          >
            <LogOutIcon size={17} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { logout } from '@/lib/firebase/auth'
import {
  HomeIcon,
  UsersIcon,
  BookIcon,
  CalendarIcon,
  FolderIcon,
  SettingsIcon,
  LogOutIcon,
  SparkleIcon,
  MenuIcon,
  XIcon,
  MailIcon,
} from '@/components/icons'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: HomeIcon },
  { label: 'Students', href: '/admin/students', icon: UsersIcon },
  { label: 'Messages', href: '/admin/messages', icon: MailIcon },
  { label: 'Programs', href: '/admin/programs', icon: BookIcon },
  { label: 'Sessions', href: '/admin/sessions', icon: CalendarIcon },
  { label: 'Resources', href: '/admin/resources', icon: FolderIcon },
  { label: 'Settings', href: '/admin/settings', icon: SettingsIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, role, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.replace('/dashboard')
    }
  }, [user, role, loading, router])

  async function handleLogout(): Promise<void> {
    await logout()
    router.push('/login')
  }

  // Loading state — mirror the real shell (sidebar + topbar + content) so
  // there's no layout jump once auth resolves and the real UI mounts.
  if (loading || role !== 'admin') {
    return (
      <div className='min-h-screen flex bg-bg-base'>
        {/* Sidebar skeleton */}
        <aside className='hidden lg:flex flex-col w-64 min-h-screen bg-bg-surface border-r border-ink-100 p-4 gap-6'>
          <div className='flex items-center gap-2.5 px-2 py-1'>
            <div className='skeleton w-8 h-8 rounded-full shrink-0' />
            <div className='space-y-1.5 flex-1'>
              <div className='skeleton h-3 w-24' />
              <div className='skeleton h-2.5 w-16' />
            </div>
          </div>
          <div className='space-y-2'>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className='skeleton h-9 w-full' />
            ))}
          </div>
        </aside>

        {/* Main column skeleton */}
        <div className='flex-1 flex flex-col min-w-0'>
          <div className='sticky top-0 z-10 px-6 py-4 flex items-center justify-between lg:hidden bg-bg-surface border-b border-ink-100'>
            <div className='skeleton h-5 w-24' />
            <div className='skeleton h-9 w-9 rounded-full' />
          </div>
          <main className='flex-1 p-6 lg:p-8 space-y-6 animate-pulse'>
            <div className='skeleton h-8 w-48' />
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='skeleton h-24' />
              ))}
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='skeleton h-64' />
              <div className='skeleton h-64' />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex bg-bg-base'>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-20 lg:hidden animate-[fadeIn_0.2s_ease_both] bg-[rgba(42,10,32,0.2)]'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 min-h-screen w-64 flex flex-col z-30
                    bg-bg-surface border-r border-ink-100
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0 lg:flex`}
      >
        {/* Logo */}
        <div
          className='px-6 py-5 border-b border-ink-100'
        >
          <div className='flex items-center gap-2.5'>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-pink-100 text-pink-400'
            >
              <SparkleIcon size={15} />
            </div>
            <div>
              <p
                className='text-xs font-semibold leading-tight font-sans text-ink-900'
              >
                Soul Academy
              </p>
              <p
                className='text-[10px] font-medium uppercase tracking-wider font-sans text-pink-400'
              >
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 overflow-y-auto scroll-smooth'>
          <p
            className='px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest font-sans text-ink-400'
          >
            Management
          </p>
          <ul className='space-y-0.5'>
            {navItems.map(({ label, href, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== '/admin' && pathname.startsWith(href))
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-item ${active ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Profile + logout */}
        <div
          className='px-3 py-4 border-t border-ink-100'
        >
          {/* Profile card */}
          <div
            className='flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 bg-bg-muted'
          >
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-pink-200'
            >
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span
                  className='text-xs font-semibold text-magenta-600 font-sans'
                >
                  {profile?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </span>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <p
                className='text-sm font-medium truncate font-sans text-ink-900'
              >
                {profile?.name ?? 'Admin'}
              </p>
              <p
                className='text-[11px] truncate font-sans text-ink-400'
              >
                {profile?.email}
              </p>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleLogout}
            className='sidebar-item w-full transition-all duration-200 text-ink-400 hover:bg-error-50 hover:text-error-700'
          >
            <LogOutIcon size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Topbar — mobile only */}
        <header
          className='sticky top-0 z-10 px-6 py-4 flex items-center justify-between lg:hidden bg-bg-surface border-b border-ink-100'
        >
          <div className='flex items-center gap-2'>
            <span className='text-pink-400'>
              <SparkleIcon size={16} />
            </span>
            <span
              className='text-sm font-semibold font-sans text-ink-900'
            >
              Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className='w-9 h-9 flex items-center justify-center rounded-full
                       border border-ink-100 text-ink-500
                       active:scale-95 transition-all duration-150
                       hover:bg-pink-50 hover:border-pink-200'
          >
            {sidebarOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </header>

        {/* Page content */}
        <main className='flex-1 p-6 lg:p-8 overflow-y-auto scroll-smooth'>{children}</main>
      </div>
    </div>
  )
}

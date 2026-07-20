'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { JSX, ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { logout } from '@/lib/firebase/auth'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  const { user, profile, role, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  async function handleLogout(): Promise<void> {
    await logout()
    router.push('/login')
  }

  if (loading || !user) {
    return (
      <div className='min-h-screen bg-bg-base flex'>
        {/* Sidebar skeleton */}
        <aside className='hidden lg:flex flex-col w-64 min-h-screen bg-bg-surface border-r border-ink-100 p-4 gap-6'>
          <div className='flex items-center gap-2.5 px-2 py-1'>
            <div className='skeleton w-8 h-8 rounded-full shrink-0' />
            <div className='space-y-1.5 flex-1'>
              <div className='skeleton h-3 w-24' />
            </div>
          </div>
          <div className='space-y-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='skeleton h-9 w-full' />
            ))}
          </div>
        </aside>

        <div className='flex-1 flex flex-col min-w-0'>
          {/* Topbar skeleton */}
          <div className='sticky top-0 z-10 px-5 py-3.5 flex items-center justify-between lg:hidden bg-bg-surface border-b border-ink-100'>
            <div className='skeleton h-5 w-24' />
            <div className='skeleton h-9 w-9 rounded-full' />
          </div>

          <main className='flex-1 p-6 lg:p-8 space-y-6 animate-pulse'>
            <div className='skeleton h-10 w-64' />
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
    <div className='min-h-screen bg-bg-base flex'>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
        profile={profile}
        onLogout={handleLogout}
      />

      <div className='flex-1 flex flex-col min-w-0'>
        <Topbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        <main className='flex-1 p-6 lg:p-8 overflow-y-auto scroll-smooth'>{children}</main>
      </div>
    </div>
  )
}

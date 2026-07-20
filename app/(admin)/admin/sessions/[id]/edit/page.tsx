'use client'

import { use, useEffect, useState } from 'react'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import type { JSX } from 'react'
import { db } from '@/lib/firebase/config'
import SessionForm from '@/components/admin/SessionForm'
import { CalendarIcon } from '@/components/icons'
import type { Session as SessionBase } from '@/types'

/** Narrow the loose `date: any` from the shared type to Timestamp,
 *  which is what Firestore actually returns at runtime. */
type Session = Omit<SessionBase, 'date'> & { date: Timestamp }

interface EditSessionPageProps {
  params: Promise<{ id: string }>
}

export default function EditSessionPage({
  params,
}: EditSessionPageProps): JSX.Element {
  const { id } = use(params)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchSession(): Promise<void> {
      try {
        const snap = await getDoc(doc(db, 'sessions', id))
        if (snap.exists()) {
          setSession({ id: snap.id, ...snap.data() } as Session)
        }
      } catch (err) {
        console.error('Failed to fetch session:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [id])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-2xl'>
        <div className='skeleton h-8 w-48' />
        <div className='skeleton h-96' />
      </div>
    )
  }

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <CalendarIcon size={40} className='text-ink-200' />
        <p className='text-ink-400'>Session not found</p>
      </div>
    )
  }

  return (
    <div className='space-y-6 animate-fade-up'>
      <div className='page-header'>
        <p className='page-eyebrow'>Admin · Sessions</p>
        <h1 className='page-title'>Edit Session</h1>
      </div>
      <SessionForm initial={session} sessionId={session.id} />
    </div>
  )
}

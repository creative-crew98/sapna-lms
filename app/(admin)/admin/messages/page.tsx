'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { MailOpenIcon, MailIcon } from '@/components/icons'

interface Message {
  id: string
  name: string
  email: string
  phone: string
  program: string
  message: string
  read: boolean
  createdAt: any
}

const PROGRAM_LABELS: Record<string, string> = {
  '1-week': '1-Week',
  '8-week': '8-Week',
  '': 'Not specified',
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'contactMessages'),
            orderBy('createdAt', 'desc'),
          ),
        )
        setMessages(
          snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[],
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  async function markRead(msg: Message): Promise<void> {
    setSelected(msg)
    if (!msg.read) {
      await updateDoc(doc(db, 'contactMessages', msg.id), { read: true })
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
      )
    }
  }

  const unread = messages.filter((m) => !m.read).length

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        {[...Array(5)].map((_, i) => (
          <div key={i} className='skeleton h-16' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='page-header'>
        <p className='page-eyebrow'>Admin</p>
        <h1 className='page-title'>Messages</h1>
        <p className='page-desc'>
          {messages.length} total ·{' '}
          {unread > 0 ? (
            <span className='text-pink-400 font-medium'>{unread} unread</span>
          ) : (
            'all read'
          )}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Message list */}
        <div className='lg:col-span-1 space-y-2'>
          {messages.length === 0 ? (
            <div className='card flex flex-col items-center justify-center py-12 gap-3'>
              <MailIcon size={32} className='text-pink-100' />
              <p className='text-sm text-ink-300'>No messages yet</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markRead(msg)}
                className={[
                  'p-4 rounded-xl border cursor-pointer transition-all duration-150',
                  selected?.id === msg.id
                    ? 'border-pink-400 bg-bg-muted'
                    : 'border-ink-100 bg-bg-surface hover:border-pink-300 hover:bg-bg-muted',
                ].join(' ')}
              >
                <div className='flex items-start gap-3'>
                  {/* Unread dot */}
                  <div
                    className={[
                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                      msg.read ? 'bg-ink-100' : 'bg-pink-400',
                    ].join(' ')}
                  />

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between'>
                      <p
                        className={[
                          'text-sm truncate',
                          msg.read
                            ? 'font-medium text-ink-400'
                            : 'font-semibold text-ink-900',
                        ].join(' ')}
                      >
                        {msg.name}
                      </p>
                      <span className='text-[10px] text-ink-300 flex-shrink-0 ml-2'>
                        {msg.createdAt
                          ?.toDate?.()
                          ?.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          }) || '—'}
                      </span>
                    </div>
                    <p className='text-xs text-ink-400 truncate mt-0.5'>
                      {msg.email}
                    </p>
                    <p className='text-xs text-ink-300 truncate mt-1'>
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message detail */}
        <div className='lg:col-span-2'>
          {!selected ? (
            <div className='card flex flex-col items-center justify-center py-20 gap-3'>
              <MailOpenIcon size={36} className='text-pink-100' />
              <p className='text-sm text-ink-300'>Select a message to read</p>
            </div>
          ) : (
            <div className='card space-y-6'>
              {/* Header */}
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-lg text-ink-900 font-serif'>
                    {selected.name}
                  </h2>
                  <p className='text-sm text-ink-400 mt-0.5'>
                    {selected.createdAt
                      ?.toDate?.()
                      ?.toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }) || '—'}
                  </p>
                </div>
                {selected.program && (
                  <span className='badge badge-rose'>
                    {PROGRAM_LABELS[selected.program] || selected.program}
                  </span>
                )}
              </div>

              {/* Contact info */}
              <div className='grid grid-cols-2 gap-4'>
                {[
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone || '—' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className='p-3 bg-bg-muted border border-pink-100 rounded-xl'
                  >
                    <p className='text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-1'>
                      {label}
                    </p>
                    <p className='text-sm font-medium text-ink-900'>{value}</p>
                  </div>
                ))}
              </div>

              {/* Message body */}
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-wider text-ink-400 mb-3'>
                  Message
                </p>
                <p className='text-sm text-ink-700 leading-relaxed whitespace-pre-wrap bg-bg-muted border border-pink-100 rounded-xl p-4'>
                  {selected.message}
                </p>
              </div>

              {/* Reply */}
              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry — Soul Awakening Academy`}
              >
                <button className='btn btn-primary flex items-center gap-2'>
                  <MailIcon size={15} />
                  Reply via Email
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { use, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import ProgramForm from '@/components/admin/ProgramForm'

export default function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgram() {
      const snap = await getDoc(doc(db, 'programs', id))
      if (snap.exists()) setProgram({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    fetchProgram()
  }, [id])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-2xl'>
        <div className='skeleton h-8 w-48' />
        <div className='skeleton h-[600px] rounded-2xl' />
      </div>
    )
  }

  if (!program) {
    return <p className='text-center text-ink-400 py-12'>Program not found.</p>
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='page-eyebrow'>Admin · Programs</p>
        <h1 className='page-title'>Edit Program</h1>
      </div>
      <ProgramForm initial={program} programId={program.id} />
    </div>
  )
}

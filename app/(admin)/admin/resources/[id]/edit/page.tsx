'use client'

import { use, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import ResourceForm from '@/components/admin/ResourceForm'

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResource() {
      const snap = await getDoc(doc(db, 'resources', id))
      if (snap.exists()) setResource({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    fetchResource()
  }, [id])

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse max-w-2xl'>
        <div className='skeleton h-8 w-48' />
        <div className='skeleton h-[500px] rounded-2xl' />
      </div>
    )
  }

  if (!resource) {
    return <p className='text-center text-ink-400 py-12'>Resource not found.</p>
  }

  return (
    <div className='space-y-6'>
      <div>
        <p className='page-eyebrow'>Admin · Resources</p>
        <h1 className='page-title'>Edit Resource</h1>
      </div>
      <ResourceForm initial={resource} resourceId={resource.id} />
    </div>
  )
}

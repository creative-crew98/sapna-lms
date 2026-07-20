import SessionForm from '@/components/admin/SessionForm'

export default function NewSessionPage() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='page-eyebrow'>Admin · Sessions</p>
        <h1 className='page-title'>New Session</h1>
      </div>
      <SessionForm />
    </div>
  )
}

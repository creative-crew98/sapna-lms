import ProgramForm from '@/components/admin/ProgramForm'

export default function NewProgramPage() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='page-eyebrow'>Admin · Programs</p>
        <h1 className='page-title'>New Program</h1>
      </div>
      <ProgramForm />
    </div>
  )
}

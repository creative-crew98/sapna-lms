import ResourceForm from '@/components/admin/ResourceForm'

export default function NewResourcePage() {
  return (
    <div className='space-y-6'>
      <div>
        <p className='page-eyebrow'>Admin · Resources</p>
        <h1 className='page-title'>Add Resource</h1>
      </div>
      <ResourceForm />
    </div>
  )
}

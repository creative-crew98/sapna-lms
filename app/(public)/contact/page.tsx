import ContactInfo from '@/components/website/contact/ContactInfo'
import ContactForm from '@/components/website/contact/ContactForm'

export default function ContactPage(): React.JSX.Element {
  return (
    <div className='bg-bg-base'>
      <div className='section'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start'>
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

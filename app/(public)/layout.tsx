// app/(public)/layout.tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/website/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

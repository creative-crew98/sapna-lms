'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface RazorpayButtonProps {
  programId: string
  label?: string
  className?: string
  style?: React.CSSProperties
  onSuccess?: () => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function RazorpayButton({
  programId,
  label = 'Enroll Now',
  className = '',
  onSuccess,
  style,
}: RazorpayButtonProps) {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePayment() {
    if (!user || !profile) {
      toast('Please sign in to enroll', { icon: '🔐' })
      router.push(`/login?from=/dashboard/enroll/${programId}`)
      return
    }

    setLoading(true)

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Failed to load payment gateway. Please try again.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          userId: user.uid,
          userEmail: profile.email,
          userName: profile.name,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create order')
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Soul Awakening Academy',
        description: data.program.description,
        order_id: data.orderId,
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone || '',
        },
        theme: { color: '#c4388a' }, // --pink-400
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast('Payment cancelled', { icon: '❌' })
          },
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.uid,
                programId,
                userEmail: profile.email,
                userName: profile.name,
              }),
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) {
              toast.error(verifyData.error || 'Payment verification failed')
              return
            }

            toast.success('Payment successful! Welcome to your journey ✦')
            onSuccess?.()
            router.push(
              `/thank-you?payment_id=${encodeURIComponent(response.razorpay_payment_id)}`,
            )
          } catch {
            toast.error('Verification failed. Please contact support.')
          } finally {
            setLoading(false)
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={className || 'btn-primary'}
      style={style}
    >
      {loading ? (
        <span className='flex items-center justify-center gap-2'>
          <svg
            className='animate-spin'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M21 12a9 9 0 1 1-6.219-8.56' />
          </svg>
          Processing…
        </span>
      ) : (
        label
      )}
    </button>
  )
}

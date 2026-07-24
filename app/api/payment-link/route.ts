import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'

// ── Set the real charge amount in `.env.local` — never hardcode it here. ──
// LANDING_PAGE_AMOUNT is in paise (e.g. 500000 = ₹5,000, 5100000 = ₹51,000).
export async function POST() {
  try {
    const amount = Number(process.env.LANDING_PAGE_AMOUNT)

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'LANDING_PAGE_AMOUNT is not configured in .env.local' },
        { status: 500 },
      )
    }

    const link = await razorpay.paymentLink.create({
      amount,
      currency: 'INR',
      // Redirects the customer here after a successful payment.
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`,
      callback_method: 'get',
      notify: { sms: false, email: false },
    })

    return NextResponse.json({ shortUrl: link.short_url })
  } catch (err: any) {
    console.error('payment-link create error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create payment link' },
      { status: 500 },
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/otp'
import { isRateLimited, getClientIp } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 },
      )
    }

    // A 6-digit OTP has only 1M combinations — without a limit here, an
    // attacker could brute-force it well within the 10-minute expiry window.
    const ip = getClientIp(req)
    if (
      isRateLimited(`verify-otp:ip:${ip}`, 20, 10 * 60 * 1000) ||
      isRateLimited(`verify-otp:email:${String(email).toLowerCase()}`, 10, 10 * 60 * 1000)
    ) {
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 429 },
      )
    }

    const isValid = await verifyOtp(email, code)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('verify-otp error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

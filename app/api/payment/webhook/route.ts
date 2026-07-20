import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'

// ── Razorpay webhook ──────────────────────────────────────────────────────────
// Configure this URL in the Razorpay Dashboard → Settings → Webhooks, subscribe
// to the "payment.captured" event, and set RAZORPAY_WEBHOOK_SECRET in env.
//
// This exists as a *reliability net* alongside /api/payment/verify: the client
// (checkout popup) calls /verify right after payment, but if the browser tab is
// closed, crashes, or loses network before that call completes, Razorpay has
// still captured the money while our DB never records the enrollment. The
// webhook guarantees the enrollment eventually gets created either way.
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!secret) {
    // Fail closed: without a configured secret we cannot verify authenticity.
    console.error('RAZORPAY_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  // Constant-time comparison to avoid timing attacks.
  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)
  const isValid =
    sigBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(sigBuf, expectedBuf)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  try {
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      const orderId: string | undefined = payment?.order_id
      const paymentId: string | undefined = payment?.id
      const notes = payment?.notes || {}
      const userId: string | undefined = notes.userId
      const programId: string | undefined = notes.programId

      if (orderId && paymentId && userId && programId) {
        // Idempotency: skip if this order was already enrolled (e.g. the
        // client-side /verify call already handled it).
        const existingEnroll = await adminDb
          .collection('enrollments')
          .where('userId', '==', userId)
          .where('programId', '==', programId)
          .get()

        if (existingEnroll.empty) {
          const batch = adminDb.batch()

          const paymentSnap = await adminDb
            .collection('payments')
            .where('orderId', '==', orderId)
            .get()

          if (!paymentSnap.empty) {
            batch.update(paymentSnap.docs[0].ref, {
              status: 'paid',
              paymentId,
              paidAt: new Date(),
              source: 'webhook',
            })
          }

          const enrollRef = adminDb.collection('enrollments').doc()
          batch.set(enrollRef, {
            userId,
            programId,
            startDate: new Date(),
            currentWeek: 1,
            progress: {},
            createdAt: new Date(),
            source: 'webhook',
          })

          const userRef = adminDb.collection('users').doc(userId)
          batch.update(userRef, {
            enrolledPrograms: FieldValue.arrayUnion(programId),
            updatedAt: new Date(),
          })

          await batch.commit()
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('webhook error:', err)
    // Still return 200 isn't right here — Razorpay will retry on non-2xx,
    // which is what we want if something failed transiently.
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

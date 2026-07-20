import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { PROGRAMS } from '@/lib/razorpay'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Blossom Pink palette — hex (email clients don't support CSS vars)
const C = {
  bgDark: '#3a0a2a',
  bgCard: '#fdf5fc',
  bgLight: '#fff0fb',
  border: '#f9d8f2',
  accent: '#c4388a',
  accentSoft: '#e060c0',
  textDark: '#2a0a20',
  textMid: '#5c3050',
  textMuted: '#8b5a80',
  white: '#ffffff',
}

function formatPrice(amount: number): string {
  return `₹${(amount / 100).toLocaleString('en-IN')}`
}

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      programId,
      userEmail,
      userName,
    } = await req.json()

    // ── Validate required fields ──────────────────────────────────────────────
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !programId
    ) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 },
      )
    }

    // ── Validate program ──────────────────────────────────────────────────────
    const program = PROGRAMS[programId]
    if (!program) {
      return NextResponse.json({ error: 'Invalid program' }, { status: 400 })
    }

    // ── Verify Razorpay signature ─────────────────────────────────────────────
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 },
      )
    }

    // ── Double-check not already enrolled ─────────────────────────────────────
    const existingEnroll = await adminDb
      .collection('enrollments')
      .where('userId', '==', userId)
      .where('programId', '==', programId)
      .get()

    if (!existingEnroll.empty) {
      return NextResponse.json(
        { error: 'Already enrolled in this program' },
        { status: 400 },
      )
    }

    // ── Batch write ───────────────────────────────────────────────────────────
    const batch = adminDb.batch()

    const paymentSnap = await adminDb
      .collection('payments')
      .where('orderId', '==', razorpay_order_id)
      .get()

    if (!paymentSnap.empty) {
      batch.update(paymentSnap.docs[0].ref, {
        status: 'paid',
        paymentId: razorpay_payment_id,
        paidAt: new Date(),
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
    })

    const userRef = adminDb.collection('users').doc(userId)
    batch.update(userRef, {
      enrolledPrograms: FieldValue.arrayUnion(programId),
      updatedAt: new Date(),
    })

    await batch.commit()

    const programName = program.name
    const programAmount = formatPrice(program.amount)

    // ── Send confirmation email to student ────────────────────────────────────
    await transporter.sendMail({
      from: `"Soul Awakening Academy" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: 'Payment confirmed — Welcome to Soul Awakening Academy ✦',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;
                    margin:0 auto;padding:40px 20px;background:${C.bgLight};">

          <!-- Header -->
          <div style="background:${C.bgDark};border-radius:16px;padding:28px;
                      text-align:center;margin-bottom:24px;">
            <p style="color:${C.accentSoft};font-size:11px;letter-spacing:0.2em;
                      text-transform:uppercase;margin:0 0 8px;
                      font-family:system-ui,sans-serif;">
              Soul Awakening Academy
            </p>
            <h1 style="color:${C.white};font-size:22px;margin:0;
                       font-weight:400;font-style:italic;font-family:Georgia,serif;">
              Your journey begins ✦
            </h1>
          </div>

          <!-- Body card -->
          <div style="background:${C.bgCard};border:1px solid ${C.border};
                      border-radius:12px;padding:28px;margin-bottom:20px;">
            <p style="color:${C.textMid};font-size:15px;margin:0 0 16px;
                      font-family:system-ui,sans-serif;">
              Dear ${userName},
            </p>
            <p style="color:${C.textMid};font-size:14px;line-height:1.8;
                      margin:0 0 20px;font-family:system-ui,sans-serif;">
              Your payment has been confirmed and you are now enrolled in:
            </p>

            <!-- Program box -->
            <div style="background:${C.white};border:1px solid ${C.border};
                        border-radius:10px;padding:16px;margin-bottom:20px;">
              <p style="color:${C.accentSoft};font-size:11px;letter-spacing:0.15em;
                        text-transform:uppercase;margin:0 0 6px;
                        font-family:system-ui,sans-serif;">
                Program
              </p>
              <p style="color:${C.textDark};font-size:16px;font-weight:600;
                        margin:0 0 4px;font-family:system-ui,sans-serif;">
                ${programName}
              </p>
              <p style="color:${C.textMuted};font-size:13px;margin:0;
                        font-family:system-ui,sans-serif;">
                Amount paid: ${programAmount}
              </p>
            </div>

            <!-- Payment details table -->
            <table style="width:100%;">
              ${[
                ['Payment ID', razorpay_payment_id],
                ['Order ID', razorpay_order_id],
                ['Status', 'Confirmed ✓'],
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid ${C.border};
                             font-size:12px;color:${C.textMuted};width:120px;
                             font-family:system-ui,sans-serif;">
                    ${label}
                  </td>
                  <td style="padding:8px 0;border-bottom:1px solid ${C.border};
                             font-size:13px;color:${C.textDark};font-weight:500;
                             font-family:system-ui,sans-serif;">
                    ${value}
                  </td>
                </tr>`,
                )
                .join('')}
            </table>
          </div>

          <!-- CTA -->
          <div style="background:${C.bgDark};border-radius:12px;padding:20px;
                      text-align:center;">
            <p style="color:${C.border};font-size:13px;margin:0 0 14px;
                      font-family:system-ui,sans-serif;">
              Sapna will reach out to you within 24 hours to schedule
              your first session.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
               style="display:inline-block;background:${C.accent};color:${C.white};
                      padding:12px 28px;border-radius:99px;font-size:13px;
                      font-weight:600;text-decoration:none;
                      font-family:system-ui,sans-serif;">
              Go to My Dashboard →
            </a>
          </div>

          <!-- Signature -->
          <p style="text-align:center;font-size:12px;color:${C.textMuted};
                    margin-top:24px;font-style:italic;font-family:Georgia,serif;">
            "Healing should feel supported, safe, and compassionate."
            <br/>— Sapna Lamba
          </p>
        </div>
      `,
    })

    // ── Notify Sapna ──────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Soul Awakening Academy" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `💰 New enrollment — ${userName} — ${programName}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;
                    padding:32px;background:${C.bgLight};">
          <h2 style="color:${C.textDark};font-family:Georgia,serif;
                     font-weight:400;margin:0 0 16px;">
            New enrollment received
          </h2>
          <table style="width:100%;">
            ${[
              ['Student', userName],
              ['Email', userEmail],
              ['Program', programName],
              ['Amount', programAmount],
              ['Payment ID', razorpay_payment_id],
              ['Order ID', razorpay_order_id],
            ]
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid ${C.border};
                           font-size:13px;color:${C.textMuted};width:120px;
                           font-family:system-ui,sans-serif;">
                  ${label}
                </td>
                <td style="padding:8px 0;border-bottom:1px solid ${C.border};
                           font-size:14px;color:${C.textDark};font-weight:600;
                           font-family:system-ui,sans-serif;">
                  ${value}
                </td>
              </tr>`,
              )
              .join('')}
          </table>

          <!-- Quick action -->
          <div style="margin-top:20px;padding:16px;background:${C.bgCard};
                      border-radius:10px;border:1px solid ${C.border};">
            <p style="font-size:12px;color:${C.textMuted};margin:0 0 6px;
                      font-family:system-ui,sans-serif;">
              Quick action
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/students"
               style="font-size:13px;color:${C.accent};font-weight:600;
                      text-decoration:none;font-family:system-ui,sans-serif;">
              View in Admin Panel →
            </a>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('verify error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    )
  }
}

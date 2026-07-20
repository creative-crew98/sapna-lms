import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { escapeHtml, isRateLimited, getClientIp } from '@/lib/security'

// Blossom Pink palette — hex (email clients don't support CSS vars)
const C = {
  bgDark: '#3a0a2a', // --magenta-700
  bgLight: '#fff0fb', // --pink-50
  bgCard: '#fdf5fc', // --bg-muted
  border: '#f9d8f2', // --pink-100
  accent: '#c4388a', // --pink-400
  accentSoft: '#e060c0', // --pink-300
  textDark: '#2a0a20', // --ink-900
  textMid: '#5c3050', // --ink-500
  textMuted: '#8b5a80', // --ink-400
  textLight: '#f9d8f2', // --pink-100
  white: '#ffffff',
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const { name, email, phone, program, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 },
      )
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !emailPattern.test(email) ||
      name.trim().length > 100 ||
      email.trim().length > 200 ||
      (phone && String(phone).length > 30) ||
      message.trim().length > 3000
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // HTML-escaped versions for safe interpolation into email templates below.
    const safeName = escapeHtml(name.trim())
    const safeEmail = escapeHtml(email.trim())
    const safePhone = escapeHtml(phone?.trim() || '')
    const safeProgram = escapeHtml(program || '')
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br/>')

    // Save to Firestore
    await addDoc(collection(db, 'contactMessages'), {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      program: program || '',
      message: message.trim(),
      read: false,
      createdAt: serverTimestamp(),
    })

    // ── Notify Sapna ──────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Soul Awakening Academy" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New inquiry from ${safeName}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;
                    margin:0 auto;padding:32px 20px;background:${C.bgLight};">

          <!-- Header -->
          <div style="background:${C.bgDark};border-radius:12px;
                      padding:20px 24px;margin-bottom:24px;">
            <p style="color:${C.accentSoft};font-size:11px;letter-spacing:0.2em;
                      text-transform:uppercase;margin:0 0 6px;font-family:system-ui,sans-serif;">
              Soul Awakening Academy
            </p>
            <h2 style="color:${C.white};margin:0;font-size:18px;font-weight:400;
                       font-family:Georgia,serif;">
              New contact inquiry
            </h2>
          </div>

          <!-- Fields table -->
          <table style="width:100%;border-collapse:collapse;">
            ${[
              ['Name', safeName],
              ['Email', safeEmail],
              ['Phone', safePhone || '—'],
              ['Program', safeProgram || 'Not specified'],
            ]
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid ${C.border};
                           font-size:12px;color:${C.textMuted};width:100px;
                           font-family:system-ui,sans-serif;">
                  ${label}
                </td>
                <td style="padding:10px 0;border-bottom:1px solid ${C.border};
                           font-size:13px;color:${C.textDark};font-weight:500;
                           font-family:system-ui,sans-serif;">
                  ${value}
                </td>
              </tr>
            `,
              )
              .join('')}
          </table>

          <!-- Message box -->
          <div style="background:${C.bgCard};border:1px solid ${C.border};
                      border-radius:10px;padding:16px;margin-top:20px;">
            <p style="font-size:11px;color:${C.textMuted};text-transform:uppercase;
                      letter-spacing:0.15em;margin:0 0 8px;font-family:system-ui,sans-serif;">
              Message
            </p>
            <p style="font-size:14px;color:${C.textDark};line-height:1.7;margin:0;
                      font-family:system-ui,sans-serif;">
              ${safeMessage}
            </p>
          </div>

          <!-- Footer -->
          <p style="font-size:12px;color:${C.textMuted};margin-top:20px;
                    font-family:system-ui,sans-serif;">
            Reply directly to this email to respond to ${safeName}.
          </p>
        </div>
      `,
      replyTo: email,
    })

    // ── Auto-reply to user ────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Sapna Lamba" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for reaching out ✦',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;
                    margin:0 auto;padding:40px 20px;background:${C.bgLight};">

          <!-- Header -->
          <div style="background:${C.bgDark};border-radius:12px;padding:24px;
                      text-align:center;margin-bottom:24px;">
            <p style="color:${C.accentSoft};font-size:11px;letter-spacing:0.2em;
                      text-transform:uppercase;margin:0 0 8px;
                      font-family:system-ui,sans-serif;">
              Soul Awakening Academy
            </p>
            <h1 style="color:${C.white};font-size:20px;margin:0;
                       font-weight:400;font-style:italic;font-family:Georgia,serif;">
              Thank you, ${safeName} ✦
            </h1>
          </div>

          <!-- Body card -->
          <div style="background:${C.bgCard};border:1px solid ${C.border};
                      border-radius:12px;padding:28px;">
            <p style="color:${C.textMid};font-size:14px;line-height:1.8;
                      margin:0 0 16px;font-family:system-ui,sans-serif;">
              I have received your message and will get back to you
              within 24–48 hours.
            </p>
            <p style="color:${C.textMid};font-size:14px;line-height:1.8;
                      margin:0;font-family:system-ui,sans-serif;">
              In the meantime, know that reaching out is already a
              beautiful step toward your healing journey.
            </p>
          </div>

          <!-- Accent line -->
          <div style="text-align:center;margin-top:20px;">
            <span style="color:${C.accent};font-size:14px;">✦</span>
          </div>

          <!-- Signature -->
          <p style="text-align:center;font-size:13px;color:${C.textMuted};
                    margin-top:12px;font-style:italic;font-family:Georgia,serif;">
            — Sapna Lamba, Soul Awakening Academy
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('contact error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

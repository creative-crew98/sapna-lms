import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { generateOtp, saveOtp } from '@/lib/otp'
import { escapeHtml, isRateLimited, getClientIp } from '@/lib/security'

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
  bgLight: '#fff0fb',
  bgCard: '#fdf5fc',
  bgOtp: '#f9d8f2',
  border: '#f9d8f2',
  accent: '#c4388a',
  accentSoft: '#e060c0',
  textDark: '#2a0a20',
  textMid: '#5c3050',
  textMuted: '#8b5a80',
  textLight: '#f9d8f2',
  white: '#ffffff',
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    if (isRateLimited(`send-otp:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const { email, name } = await req.json()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailPattern.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    // Also rate-limit per-email so one IP can't spam OTPs to many different inboxes
    // and one attacker can't hammer a single victim's inbox from rotating IPs.
    if (isRateLimited(`send-otp:email:${email.toLowerCase()}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const safeName = escapeHtml(
      typeof name === 'string' ? name.slice(0, 100) : '',
    )

    const otp = generateOtp()
    await saveOtp(email, otp)

    await transporter.sendMail({
      from: `"Soul Awakening Academy" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your verification code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:${C.bgLight};font-family:system-ui,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bgLight};padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                  style="background:${C.white};border-radius:16px;border:1px solid ${C.border};overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="background:${C.bgDark};padding:28px 40px;text-align:center;">
                      <p style="margin:0;color:${C.accentSoft};font-size:11px;letter-spacing:0.2em;
                                text-transform:uppercase;font-weight:600;font-family:system-ui,sans-serif;">
                        Soul Awakening Academy
                      </p>
                      <h1 style="margin:8px 0 0;color:${C.white};font-size:22px;font-weight:400;
                                 font-style:italic;font-family:Georgia,serif;">
                        Verify your identity
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 8px;color:${C.textMid};font-size:15px;
                                font-weight:300;font-family:system-ui,sans-serif;">
                        Hi ${safeName || 'there'},
                      </p>
                      <p style="margin:0 0 32px;color:${C.textMid};font-size:15px;
                                font-weight:300;line-height:1.6;font-family:system-ui,sans-serif;">
                        Use the code below to complete your sign-in.
                        This code expires in
                        <strong style="color:${C.textDark};">10 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:${C.bgOtp};border:1px solid ${C.border};
                                  border-radius:12px;padding:28px;text-align:center;
                                  margin-bottom:32px;">
                        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;
                                  text-transform:uppercase;color:${C.textMuted};font-weight:600;
                                  font-family:system-ui,sans-serif;">
                          Your verification code
                        </p>
                        <p style="margin:0;font-size:42px;font-weight:700;letter-spacing:0.18em;
                                  color:${C.bgDark};font-family:Georgia,serif;">
                          ${otp}
                        </p>
                      </div>

                      <p style="margin:0;font-size:13px;color:${C.textMuted};
                                line-height:1.6;font-family:system-ui,sans-serif;">
                        If you didn't request this, you can safely ignore this email.
                        Never share this code with anyone.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid ${C.border};text-align:center;">
                      <p style="margin:0;font-size:12px;color:${C.textMuted};
                                font-family:system-ui,sans-serif;">
                        © ${new Date().getFullYear()} Soul Awakening Academy · Sapna Lamba
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

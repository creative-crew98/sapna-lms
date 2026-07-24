'use client'

import { useEffect, useState } from 'react'
import { Sparkle, Check } from 'lucide-react'

/* ── Confetti piece ── */
const COLORS = [
  '#c4388a',
  '#e060c0',
  '#f9d8f2',
  '#ee96d8',
  '#8a1a5c',
  '#fce8f7',
]

function Confetti() {
  const pieces = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    circle: Math.random() > 0.5,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 1.5,
  }))
  return (
    <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.circle ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Animated CTA ── */
function CTAButton({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <>
      <style>{`
        @keyframes ctaPulse{0%,100%{box-shadow:0 4px 24px rgba(196,56,138,0.5),0 0 0 0 rgba(196,56,138,0.4)}50%{box-shadow:0 6px 40px rgba(196,56,138,0.85),0 0 0 10px rgba(196,56,138,0)}}
        @keyframes ctaBlink{0%,100%{border-color:rgba(255,255,255,0.15)}50%{border-color:rgba(255,255,255,0.85)}}
        @keyframes ctaShimmer{0%{transform:translateX(-200%) skewX(-20deg)}100%{transform:translateX(300%) skewX(-20deg)}}
        @keyframes ctaSpark{0%,80%,100%{opacity:0;transform:scale(0)}40%{opacity:1;transform:scale(1)}}
        @keyframes confettiFall{0%{transform:translateY(-40px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes checkDraw{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}
        @keyframes floatUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes ringPop{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.5);opacity:0}}
        .ty-cta{
          position:relative;overflow:hidden;
          background:linear-gradient(135deg,#c4388a,#8a1a5c);
          color:#fff;border:2px solid transparent;border-radius:9999px;
          padding:15px 36px;font-family:'Inter',sans-serif;font-weight:600;font-size:15px;
          letter-spacing:0.03em;cursor:pointer;width:100%;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          text-decoration:none;
          animation:ctaPulse 2.4s ease-in-out infinite,ctaBlink 2.4s ease-in-out infinite;
          transition:transform 0.2s,filter 0.2s;
        }
        .ty-cta:hover{transform:scale(1.04) translateY(-2px);filter:brightness(1.12)}
        .ty-shimmer{position:absolute;inset:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);animation:ctaShimmer 2.2s ease-in-out infinite;pointer-events:none}
        .ty-spark{position:absolute;border-radius:50%;background:#fff;opacity:0;pointer-events:none;animation:ctaSpark 2.2s ease-in-out infinite}
        .check-draw{stroke-dasharray:60;stroke-dashoffset:60;animation:checkDraw 0.6s ease-out 0.7s forwards}
        .check-ring::after{content:'';position:absolute;inset:-8px;border-radius:50%;border:2px solid rgba(196,56,138,0.35);animation:ringPop 2s ease-out 0.5s infinite}
        .ty-card{animation:floatUp 0.8s cubic-bezier(0.4,0,0.2,1) forwards}
        .ty-icon{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both}
      `}</style>
      <a href={href} target='_blank' rel='noreferrer' className='ty-cta'>
        <span className='ty-shimmer' />
        <span
          className='ty-spark'
          style={{ width: 5, height: 5, top: 5, right: 14 }}
        />
        <span
          className='ty-spark'
          style={{
            width: 4,
            height: 4,
            top: 10,
            right: 28,
            animationDelay: '0.45s',
          }}
        />
        <span
          className='ty-spark'
          style={{
            width: 6,
            height: 6,
            top: 4,
            right: 6,
            animationDelay: '0.9s',
          }}
        />
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </a>
    </>
  )
}

const STEPS = [
  {
    num: '1',
    title: 'Check your WhatsApp & Email',
    desc: 'Your onboarding details and session link will arrive there.',
  },
  {
    num: '2',
    title: "Save Sapna's number",
    desc: "So her message doesn't get lost in unknown contacts.",
  },
  {
    num: '3',
    title: 'Come as you are',
    desc: 'No preparation needed. Just bring your open heart and willingness to heal.',
  },
]

export default function ThankYouPage() {
  const [paymentId, setPaymentId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPaymentId(params.get('payment_id'))
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex items-center justify-center relative overflow-hidden p-6'>
      {/* Orbs */}
      <div
        className='fixed w-[420px] h-[420px] rounded-full pointer-events-none'
        style={{
          background:
            'radial-gradient(circle,rgba(196,56,138,0.18) 0%,transparent 70%)',
          filter: 'blur(70px)',
          top: -100,
          right: -80,
        }}
      />
      <div
        className='fixed w-[340px] h-[340px] rounded-full pointer-events-none'
        style={{
          background:
            'radial-gradient(circle,rgba(224,96,192,0.14) 0%,transparent 70%)',
          filter: 'blur(70px)',
          bottom: -80,
          left: -60,
        }}
      />

      <Confetti />

      {/* Card */}
      <div className='ty-card relative z-10 bg-white/75 backdrop-blur-2xl border border-white/90 rounded-[32px] p-12 max-w-lg w-full text-center shadow-[0_32px_80px_rgba(196,56,138,0.18)]'>
        {/* Check icon */}
        <div
          className='ty-icon check-ring relative w-20 h-20 rounded-full mx-auto mb-7 flex items-center justify-center shadow-[0_8px_32px_rgba(196,56,138,0.45)]'
          style={{ background: 'linear-gradient(135deg,#c4388a,#8a1a5c)' }}
        >
          <svg width='40' height='40' viewBox='0 0 40 40' fill='none'>
            <polyline
              className='check-draw'
              points='8,21 17,30 33,12'
              stroke='white'
              strokeWidth='3.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>

        {/* Eyebrow */}
        <p className='label-eyebrow flex items-center justify-center gap-3 mb-4'>
          <Sparkle className='w-3 h-3 text-rose' fill='currentColor' />
          Your Journey Begins Now
          <Sparkle className='w-3 h-3 text-rose' fill='currentColor' />
        </p>

        {/* Headline */}
        <h1
          className='text-serif text-magenta-700'
          style={{ fontSize: 'clamp(1.8rem,4vw,2.3rem)', lineHeight: 1.2 }}
        >
          Thank You,
          <br />
          <span className='text-gradient-shimmer italic'>
            Beautiful Soul! 🌸
          </span>
        </h1>
        <p className='text-serif italic text-burgundy mt-2 text-base'>
          Your spot has been reserved successfully.
        </p>

        <div className='divider-rose my-5' />

        <p className='page-desc mb-6'>
          You've just taken the most powerful step toward breaking free from old
          patterns and stepping into the life you truly deserve. Sapna can't
          wait to walk this journey with you.
        </p>

        {/* WhatsApp note */}
        <div
          className='rounded-2xl p-5 mb-6 text-left'
          style={{
            background: 'rgba(196,56,138,0.07)',
            border: '1px solid rgba(196,56,138,0.18)',
          }}
        >
          <p className='text-sm text-ink-900 font-normal leading-relaxed'>
            📱 <strong>Check your WhatsApp & Email</strong> — Sapna will reach
            out within <strong>24 hours</strong> to schedule your first session
            and share everything you need to get started.
          </p>
          {paymentId && (
            <p className='text-xs text-muted mt-2'>Payment ID: {paymentId}</p>
          )}
        </div>

        {/* Steps */}
        <div className='flex flex-col gap-4 mb-8 text-left'>
          {STEPS.map((s) => (
            <div key={s.num} className='flex gap-4 items-start'>
              <div
                className='w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold'
                style={{
                  background: 'linear-gradient(135deg,#c4388a,#8a1a5c)',
                }}
              >
                {s.num}
              </div>
              <p className='text-sm text-ink-mid font-light leading-relaxed pt-0.5'>
                <strong className='text-ink-900 font-semibold'>
                  {s.title}
                </strong>{' '}
                — {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <CTAButton href='https://wa.me/91999915305'>
          💬 Message Sapna on WhatsApp
        </CTAButton>

        <p className='text-xs text-muted mt-5'>
          Questions? Write to{' '}
          <a
            href='mailto:soulawakeingwithsapna@gmail.com'
            className='text-rose font-medium'
          >
            soulawakeingwithsapna@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import RazorpayButton from '@/components/RazorpayButton'
import {
  CheckIcon,
  SparkleIcon,
  StarIcon,
  ShieldIcon,
} from '@/components/icons'

// ── European decorative SVG background ───────────────────────────────────────
function EuropeanBackground() {
  return (
    <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
      {/* Base gradient */}
      <div
        className='absolute inset-0'
        style={{
          background: `
            linear-gradient(135deg,
              #FDF0E8 0%,
              #F5E6F5 20%,
              #E6F0F5 40%,
              #F0F5E6 60%,
              #F5EEE6 80%,
              #EEE6F5 100%
            )
          `,
        }}
      />

      {/* Large decorative arches — Venetian architecture */}
      <svg
        className='absolute top-0 left-0 w-full h-full opacity-8'
        viewBox='0 0 1440 900'
        preserveAspectRatio='xMidYMid slice'
      >
        {[0, 280, 560, 840, 1120].map((x, i) => (
          <g key={i}>
            <path
              d={`M${x + 40} 200 Q${x + 140} 0 ${x + 240} 200 L${x + 240} 400 L${x + 40} 400 Z`}
              fill='none'
              stroke={
                ['#C45C8A', '#5C8AC4', '#8AC45C', '#C4A85C', '#8C5CC4'][i % 5]
              }
              strokeWidth='2'
              opacity='0.4'
            />
          </g>
        ))}
      </svg>

      {/* Colorful circles — stained glass feel */}
      {[
        { cx: '8%', cy: '15%', r: 120, color: '#E8A0C4', opacity: 0.25 },
        { cx: '92%', cy: '10%', r: 90, color: '#A0C4E8', opacity: 0.25 },
        { cx: '15%', cy: '70%', r: 80, color: '#C4E8A0', opacity: 0.2 },
        { cx: '85%', cy: '75%', r: 110, color: '#E8C4A0', opacity: 0.22 },
        { cx: '50%', cy: '5%', r: 60, color: '#C4A0E8', opacity: 0.2 },
        { cx: '30%', cy: '45%', r: 40, color: '#E8A0A0', opacity: 0.15 },
        { cx: '70%', cy: '40%', r: 50, color: '#A0E8C4', opacity: 0.15 },
      ].map((c, i) => (
        <div
          key={i}
          className='absolute rounded-full'
          style={{
            left: c.cx,
            top: c.cy,
            width: c.r * 2,
            height: c.r * 2,
            background: `radial-gradient(circle at 40% 40%, ${c.color}, transparent)`,
            opacity: c.opacity,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(20px)',
          }}
        />
      ))}

      {/* Mosaic tile pattern */}
      <div
        className='absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage: `
            linear-gradient(45deg, #8A4A6E 25%, transparent 25%),
            linear-gradient(-45deg, #4A6E8A 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #6E8A4A 75%),
            linear-gradient(-45deg, transparent 75%, #8A6E4A 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      />

      {/* Floral ornaments */}
      <svg
        className='absolute top-0 left-0 w-full h-full opacity-[0.06]'
        viewBox='0 0 1440 900'
      >
        {[
          { x: 100, y: 100 },
          { x: 700, y: 50 },
          { x: 1300, y: 100 },
          { x: 200, y: 800 },
          { x: 800, y: 850 },
          { x: 1200, y: 780 },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y})`}>
            <circle cx='0' cy='-20' r='6' fill='#C45C8A' />
            <circle cx='14' cy='-14' r='6' fill='#5C8AC4' />
            <circle cx='20' cy='0' r='6' fill='#8AC45C' />
            <circle cx='14' cy='14' r='6' fill='#C4A85C' />
            <circle cx='0' cy='20' r='6' fill='#8C5CC4' />
            <circle cx='-14' cy='14' r='6' fill='#C45C5C' />
            <circle cx='-20' cy='0' r='6' fill='#5CC4C4' />
            <circle cx='-14' cy='-14' r='6' fill='#C4C45C' />
            <circle cx='0' cy='0' r='4' fill='#fff' />
          </g>
        ))}
      </svg>
    </div>
  )
}

// ── Stained glass section divider ─────────────────────────────────────────────
function GlassDivider() {
  return (
    <div className='flex items-center justify-center gap-3 py-4'>
      {['#C45C8A', '#5C8AC4', '#8AC45C', '#C4A85C', '#8C5CC4'].map((c, i) => (
        <div
          key={i}
          className='w-6 h-6 rounded-full opacity-70'
          style={{ background: c, boxShadow: `0 0 8px ${c}` }}
        />
      ))}
    </div>
  )
}

// ── European card ─────────────────────────────────────────────────────────────
function EuropeanCard({
  children,
  accent,
}: {
  children: React.ReactNode
  accent?: string
}) {
  return (
    <div
      className='relative rounded-2xl p-6 overflow-hidden'
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${accent || 'rgba(196,92,138,0.2)'}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      }}
    >
      {/* Corner accent */}
      <div
        className='absolute top-0 left-0 w-12 h-12 opacity-20'
        style={{
          background: `linear-gradient(135deg, ${accent || '#C45C8A'}, transparent)`,
          borderRadius: '0 0 100% 0',
        }}
      />
      {children}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RelationshipCoachingPage() {
  const ACCENTS = [
    '#C45C8A',
    '#5C8AC4',
    '#8AC45C',
    '#C4A85C',
    '#8C5CC4',
    '#C45C5C',
    '#5CC4C4',
    '#C4C45C',
  ]

  return (
    <div className='relative min-h-screen overflow-x-hidden'>
      <EuropeanBackground />

      {/* ── HERO ── */}
      <section
        className='relative z-10 text-center px-6 pt-24 pb-20
                          max-w-3xl mx-auto'
      >
        {/* Badge */}
        <div
          className='inline-flex items-center gap-2 px-5 py-2 rounded-full
                        mb-8 border'
          style={{
            background: 'rgba(196,92,138,0.1)',
            borderColor: 'rgba(196,92,138,0.3)',
          }}
        >
          <span
            className='text-xs font-semibold text-[#C45C8A]
                           uppercase tracking-wider'
          >
            8-Week Relationship Coaching Journey
          </span>
        </div>

        <h1
          className='text-[#2D1A35] mb-6 leading-tight'
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          }}
        >
          Transform your{' '}
          <span className='italic' style={{ color: '#C45C8A' }}>
            relationships
          </span>
          <br />
          from the inside out
        </h1>

        <p
          className='text-[#6B4A5E] text-base leading-relaxed mb-4
                      max-w-xl mx-auto font-light'
        >
          Break the invisible patterns that keep pulling you into the same
          painful relationships. Heal the wounds. Set the boundaries. Step into
          love — for yourself and others — like never before.
        </p>

        <p
          className='text-[#9B7A8A] text-sm mb-10 italic'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          "Every relationship in your life is a mirror of your relationship with
          yourself." — Sapna Lamba
        </p>

        <div
          className='flex flex-col sm:flex-row items-center
                        justify-center gap-4'
        >
          <RazorpayButton
            programId='8-week'
            label='Begin Your Journey — ₹51,000'
            className='px-8 py-4 rounded-full font-semibold text-white
                       text-sm transition-all hover:opacity-90 hover:scale-105'
            style={
              {
                background:
                  'linear-gradient(135deg, #C45C8A, #8C5CC4, #5C8AC4)',
                boxShadow: '0 8px 32px rgba(196,92,138,0.4)',
              } as any
            }
          />
          <a
            href='#journey'
            className='text-sm text-[#9B7A8A] hover:text-[#C45C8A]
                       transition-colors'
          >
            Explore the journey ↓
          </a>
        </div>

        {/* Colorful trust pills */}
        <div className='flex flex-wrap items-center justify-center gap-3 mt-10'>
          {[
            { label: '8 Live Sessions', color: '#C45C8A' },
            { label: 'Akashic Reading', color: '#5C8AC4' },
            { label: 'WhatsApp Support', color: '#8AC45C' },
            { label: '2 Free Journals', color: '#C4A85C' },
          ].map(({ label, color }) => (
            <div
              key={label}
              className='flex items-center gap-1.5 px-3 py-1.5
                         rounded-full text-xs font-medium text-white'
              style={{ background: color, opacity: 0.85 }}
            >
              <div className='w-1.5 h-1.5 rounded-full bg-white' />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className='relative z-10 max-w-5xl mx-auto px-6 py-16'>
        <GlassDivider />
        <div className='mt-12 mb-12 text-center'>
          <h2
            className='text-[#2D1A35]'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Is this{' '}
            <span className='italic' style={{ color: '#C45C8A' }}>
              for you?
            </span>
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[
            {
              text: 'You keep attracting emotionally unavailable partners',
              accent: '#C45C8A',
            },
            {
              text: 'You struggle with people-pleasing and saying no',
              accent: '#5C8AC4',
            },
            {
              text: 'You fear abandonment or repeat heartbreak patterns',
              accent: '#8AC45C',
            },
            {
              text: 'You feel unworthy of deep, lasting love',
              accent: '#C4A85C',
            },
            {
              text: 'Your relationships drain rather than nourish you',
              accent: '#8C5CC4',
            },
            {
              text: 'You want to break free from family relationship patterns',
              accent: '#C45C5C',
            },
          ].map(({ text, accent }, i) => (
            <EuropeanCard key={i} accent={accent}>
              <div className='flex items-start gap-3'>
                <div
                  className='w-6 h-6 rounded-full flex items-center
                                justify-center flex-shrink-0 mt-0.5'
                  style={{ background: accent, opacity: 0.9 }}
                >
                  <CheckIcon size={11} className='text-white' />
                </div>
                <p className='text-sm text-[#4A2A3E] leading-relaxed'>{text}</p>
              </div>
            </EuropeanCard>
          ))}
        </div>
      </section>

      {/* ── 8-WEEK JOURNEY ── */}
      <section
        id='journey'
        className='relative z-10 max-w-5xl mx-auto px-6 py-16'
      >
        <div className='text-center mb-12'>
          <h2
            className='text-[#2D1A35]'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The{' '}
            <span className='italic' style={{ color: '#C45C8A' }}>
              8-Week
            </span>{' '}
            transformation
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[
            {
              title: 'Your Life, Your Responsibility',
              desc: 'Shift from blame to ownership. Move from "Why me?" to "What can I change?" — the foundation of all transformation.',
            },
            {
              title: 'Understanding Your True Why',
              desc: 'Identify what truly matters in relationships — not what others expect — and connect with your core desires.',
            },
            {
              title: 'Breaking Limiting Beliefs',
              desc: 'Uncover hidden beliefs about love, worth, and relationships and replace them with empowering truths.',
            },
            {
              title: 'Turning Dreams into Clear Goals',
              desc: 'What does your ideal relationship life look like? Make it concrete, aligned, and actionable.',
            },
            {
              title: 'Understanding Inner Resistances',
              desc: 'Recognize the fears driving your patterns — fear of abandonment, rejection, intimacy — and learn to move through them.',
            },
            {
              title: 'Affirmations — Rewire Your Words',
              desc: 'Rebuild your inner dialogue about love, boundaries, and self-worth from the ground up.',
            },
            {
              title: 'Visualization — Your Love Blueprint',
              desc: 'Emotionally connect with the loving, fulfilling relationships you deserve and make them feel real.',
            },
            {
              title: 'Taking Action — Live It Now',
              desc: 'Build daily practices and boundaries that create and sustain the relationships your soul desires.',
            },
          ].map((item, i) => (
            <EuropeanCard key={i} accent={ACCENTS[i % ACCENTS.length]}>
              <div className='flex gap-3'>
                <div
                  className='w-9 h-9 rounded-full flex items-center
                                justify-center flex-shrink-0 text-sm
                                font-bold text-white'
                  style={{ background: ACCENTS[i % ACCENTS.length] }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <p className='text-sm font-semibold text-[#2D1A35] mb-1'>
                    {item.title}
                  </p>
                  <p className='text-xs text-[#6B4A5E] leading-relaxed'>
                    {item.desc}
                  </p>
                </div>
              </div>
            </EuropeanCard>
          ))}
        </div>
      </section>

      {/* ── INCLUDES ── */}
      <section className='relative z-10 max-w-4xl mx-auto px-6 py-16'>
        <GlassDivider />
        <div className='mt-12 mb-12 text-center'>
          <h2
            className='text-[#2D1A35]'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Everything you{' '}
            <span className='italic' style={{ color: '#C45C8A' }}>
              receive
            </span>
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {[
            { item: '8 One-on-One Coaching Sessions', color: '#C45C8A' },
            {
              item: '1 Akashic Record Reading (₹5,100 value)',
              color: '#5C8AC4',
            },
            { item: 'Free Clarity Call before starting', color: '#8AC45C' },
            { item: 'Gratitude Journal — Free Gift', color: '#C4A85C' },
            { item: 'Affirmation Journal — Free Gift', color: '#8C5CC4' },
            { item: 'Emotional & Relationship Pattern Work', color: '#C45C5C' },
            { item: 'Safe, Non-Judgmental Healing Space', color: '#5CC4C4' },
            { item: 'WhatsApp Support throughout 8 weeks', color: '#C4C45C' },
          ].map(({ item, color }, i) => (
            <div
              key={i}
              className='flex items-start gap-3 p-4 rounded-xl border'
              style={{
                background: 'rgba(255,255,255,0.6)',
                borderColor: `${color}40`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className='w-5 h-5 rounded-full flex items-center
                              justify-center flex-shrink-0 mt-0.5'
                style={{ background: color }}
              >
                <CheckIcon size={11} className='text-white' />
              </div>
              <span className='text-sm text-[#4A2A3E] font-light'>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className='relative z-10 max-w-lg mx-auto px-6 py-16 text-center'>
        <div
          className='rounded-3xl p-10 border overflow-hidden relative'
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(196,92,138,0.3)',
            boxShadow: '0 20px 60px rgba(196,92,138,0.15)',
          }}
        >
          {/* Colorful corner decorations */}
          {[
            { top: 0, left: 0, color: '#C45C8A' },
            { top: 0, right: 0, color: '#5C8AC4' },
            { bottom: 0, left: 0, color: '#8AC45C' },
            { bottom: 0, right: 0, color: '#C4A85C' },
          ].map((corner, i) => (
            <div
              key={i}
              className='absolute w-16 h-16 opacity-20 rounded-full'
              style={{
                ...(corner as any),
                background: corner.color,
                filter: 'blur(10px)',
                transform: 'translate(-30%, -30%)',
              }}
            />
          ))}

          <div className='relative z-10'>
            <p
              className='text-[11px] font-semibold uppercase tracking-[0.2em]
                          text-[#C45C8A] mb-4'
            >
              Your Investment
            </p>
            <div className='flex items-baseline justify-center gap-3 mb-2'>
              <span
                className='text-5xl font-bold text-[#2D1A35]'
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                ₹51,000
              </span>
              <span className='text-xl text-[#B8AE98] line-through'>
                ₹56,100
              </span>
            </div>
            <p className='text-sm text-[#9B7A8A] mb-8 font-light'>
              One-time · 8 weeks · Limited seats available
            </p>

            <RazorpayButton
              programId='8-week'
              label='Begin My Journey ✦'
              className='w-full py-4 rounded-full font-semibold text-white
                         text-base transition-all hover:opacity-90'
              style={
                {
                  background:
                    'linear-gradient(135deg, #C45C8A, #8C5CC4, #5C8AC4)',
                  boxShadow: '0 8px 32px rgba(196,92,138,0.4)',
                } as any
              }
            />

            <div className='flex items-center justify-center gap-2 mt-4'>
              <ShieldIcon size={13} className='text-[#C45C8A]' />
              <span className='text-xs text-[#9B7A8A]'>
                Secured by Razorpay · 100% safe
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className='relative z-10 border-t py-8 px-6 text-center'
        style={{ borderColor: 'rgba(196,92,138,0.2)' }}
      >
        <p className='text-xs text-[#9B7A8A]'>
          © {new Date().getFullYear()} Soul Awakening Academy · Sapna Lamba
        </p>
        <p
          className='text-xs text-[#B8AE98] mt-1 italic'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          "The most important relationship you'll ever have is the one with
          yourself."
        </p>
      </footer>
    </div>
  )
}

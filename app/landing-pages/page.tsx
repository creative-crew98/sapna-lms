'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import {
  Users,
  HeartCrack,
  CloudFog,
  IndianRupee,
  UserRound,
  BatteryLow,
  Flower2,
  Gift,
  Check,
  Sparkle,
} from 'lucide-react'
import Image from 'next/image'

/* ── Razorpay Config ── */
const RAZORPAY_PAYMENT_LINK = 'https://rzp.io/l/YOUR_PAYMENT_LINK'

/* ── Scroll Reveal ── */
function useScrollReveal() {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = root.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return rootRef
}

/* ── Single Unified CTA Button ── */
function CTAButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <>
      <style>{`
        @keyframes ctaShimmer{0%{transform:translateX(-200%) skewX(-20deg)}100%{transform:translateX(300%) skewX(-20deg)}}
        @keyframes ctaPulse{
          0%,100%{box-shadow:0 4px 24px rgba(196,56,138,0.5),0 0 0 0 rgba(196,56,138,0.4)}
          50%{box-shadow:0 6px 40px rgba(196,56,138,0.85),0 0 0 10px rgba(196,56,138,0)}
        }
        @keyframes ctaBlink{0%,100%{border-color:rgba(255,255,255,0.15)}50%{border-color:rgba(255,255,255,0.85)}}
        @keyframes ctaSpark{0%,80%,100%{opacity:0;transform:scale(0)}40%{opacity:1;transform:scale(1)}}
        .sapna-cta{
          position:relative;overflow:hidden;
          background:linear-gradient(135deg,#c4388a,#8a1a5c);
          color:#fff;border:2px solid transparent;border-radius:9999px;
          padding:15px 36px;font-family:'Inter',sans-serif;font-weight:600;font-size:16px;
          letter-spacing:0.03em;cursor:pointer;
          transition:transform 0.2s ease,filter 0.2s ease;
          animation:ctaPulse 2.4s ease-in-out infinite,ctaBlink 2.4s ease-in-out infinite;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          text-decoration:none;
        }
        .sapna-cta:hover{transform:scale(1.05) translateY(-3px);filter:brightness(1.15)}
        .sapna-cta:active{transform:scale(0.97)}
        .sapna-cta-shimmer{position:absolute;inset:0;width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);animation:ctaShimmer 2.2s ease-in-out infinite;pointer-events:none}
        .sapna-cta-spark{position:absolute;border-radius:50%;background:#fff;opacity:0;pointer-events:none;animation:ctaSpark 2.2s ease-in-out infinite}
        .sapna-cta-spark:nth-child(2){width:5px;height:5px;top:5px;right:14px;animation-delay:0s}
        .sapna-cta-spark:nth-child(3){width:4px;height:4px;top:10px;right:28px;animation-delay:0.45s}
        .sapna-cta-spark:nth-child(4){width:6px;height:6px;top:4px;right:6px;animation-delay:0.9s}
      `}</style>
      <button className={`sapna-cta ${className}`} onClick={onClick}>
        <span className='sapna-cta-shimmer' />
        <span className='sapna-cta-spark' />
        <span className='sapna-cta-spark' />
        <span className='sapna-cta-spark' />
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </button>
    </>
  )
}

/* ── Section Eyebrow ── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className='label-eyebrow text-center flex items-center text-2xl! md:text-4xl! tracking-tight! font-sans! justify-center gap-3'>
      <div className='flex-1 h-px bg-gradient-to-r from-transparent to-rose-300 max-w-[100px]' />
      <span className='text-rose-300 text-xl select-none'>❧</span>
      <span className='text-gradient-shimmer'>{children}</span>
      <span className='text-rose-300 text-xl select-none'>❧</span>
      <div className='flex-1 h-px bg-gradient-to-l from-transparent to-rose-300 max-w-[100px]' />
    </p>
  )
}

/* ── Data ── */
const familiarPoints = [
  {
    icon: Users,
    emoji: '👥',
    title: 'People Pleasing',
    desc: 'You say yes when every part of you wants to say no—constantly shrinking yourself to keep peace.',
  },
  {
    icon: HeartCrack,
    emoji: '💔',
    title: 'Heartbreak Repeats',
    desc: 'You keep attracting the same painful patterns—unavailable partners, fear of abandonment.',
  },
  {
    icon: CloudFog,
    emoji: '🌫️',
    title: 'Overthinking & Anxiety',
    desc: "You replay what you said or didn't say, trapped in self-doubt and emotional overwhelm.",
  },
  {
    icon: IndianRupee,
    emoji: '₹',
    title: 'Money Never Stays',
    desc: 'Repeated failures or financial struggles despite working incredibly hard.',
  },
  {
    icon: UserRound,
    emoji: '🪞',
    title: 'Still Feel Empty',
    desc: "You've achieved things, but still feel disconnected, anxious or incomplete.",
  },
  {
    icon: BatteryLow,
    emoji: '🔋',
    title: 'Emotionally Drained',
    desc: "You feel tired, heavy, and like you're carrying emotions that aren't even yours.",
  },
]

const timeline = [
  { emoji: '🎓', title: 'Engineer', desc: 'I qualified as an engineer.' },
  { emoji: '⚖️', title: 'Law', desc: 'I studied law seeking direction.' },
  {
    emoji: '🤍',
    title: "Father's Loss",
    desc: 'Lost my father to cancer. My world shattered.',
  },
  {
    emoji: '🌸',
    title: 'Spiritual Awakening',
    desc: 'Discovered Akashic Records and began healing.',
  },
  {
    emoji: '📖',
    title: 'Deep Learning',
    desc: 'Studied, meditated and experienced soul-level truth.',
  },
  {
    emoji: '⭐',
    title: 'Certified Coach',
    desc: 'Mastered Life & Relationship Coaching.',
  },
  {
    emoji: '🤝',
    title: 'Helping Others',
    desc: 'Now I help people break patterns and transform lives.',
  },
]

const journeySteps = [
  {
    num: '01',
    emoji: '👁️',
    title: 'Awareness',
    desc: 'Pinpoint exactly where your patterns broke down. We explore your Akashic Records to uncover karmic patterns, past life experiences, or limiting beliefs that have kept you stuck.',
  },
  {
    num: '02',
    emoji: '🦋',
    title: 'Release',
    desc: 'Let go of heavy conditioning, fears, emotional wounds and old relationship contracts that no longer serve your highest good.',
  },
  {
    num: '03',
    emoji: '🌳',
    title: 'Rewire',
    desc: 'Replace repetitive, painful patterns with a new identity using mindset work, self-awareness practices and customized reflection exercises.',
  },
  {
    num: '04',
    emoji: '🌅',
    title: 'Rise',
    desc: 'Step fully into your power. Set boundaries, break people-pleasing habits and show up as the aligned, peaceful and empowered you.',
  },
]

const included = [
  '4 Live 1:1 Deep-Dive Sessions (Akashic Readings & Coaching)',
  'Tailored Worksheets & Reflection Exercises',
  'Continuous WhatsApp Support',
  'Guided Healing Audios & Forgiveness Prayers',
  'Spiritual Remedies & Energy Healing Support',
]

const testimonials = [
  {
    name: 'Anjali R.',
    city: 'Delhi',
    quote:
      "Sapna helped me heal wounds I didn't even know were affecting my every day life.",
  },
  {
    name: 'Priya M.',
    city: 'Mumbai',
    quote:
      'The Akashic Reading was so powerful and the coaching helped me take real action.',
  },
  {
    name: 'Neha K.',
    city: 'Pune',
    quote:
      "I finally feel free from old patterns and I'm attracting beautiful relationships.",
  },
]

const GLASS =
  'bg-white/20 backdrop-blur-2xl backdrop-saturate-150 border border-white/55 ring-1 ring-inset ring-white/30'

/* ── Main Page ── */
export default function AkashicLandingPage() {
  const rootRef = useScrollReveal()
  const scrollToOffer = () =>
    document
      .getElementById('offer-section')
      ?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div
      ref={rootRef}
      className='bg-base text-ink min-h-screen overflow-x-hidden'
    >
      <section
        className='relative overflow-hidden bg-linear-to-br from-pink-50 via-white to-pink-100 min-h-screen flex items-center bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(background.png)` }}
      >
        {/* Overlay for text readability */}
        <div className='absolute inset-0 bg-white/20 backdrop-blur-[2px] z-0' />

        <div className='orb orb-rose w-100 h-100 -top-35 -right-25' />
        <div className='orb orb-gold w-95 h-95 -bottom-30 -left-20' />
        <div className='section relative z-10 grid md:grid-cols-2 gap-12 items-center py-24!'>
          <div className='reveal-left'>
            <>
              <style>{`
    @keyframes eyebrowFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .eyebrow-float {
      animation: eyebrowFloat 3s ease-in-out infinite;
    }
  `}</style>
              <p className='eyebrow-float flex items-center gap-3 mb-6 text-sm md:text-base font-semibold tracking-wide text-magenta-700'>
                <Sparkle className='w-4 h-4 text-rose' fill='currentColor' />
                Akashic Readings Meet Life Coaching
                <Sparkle className='w-4 h-4 text-rose' fill='currentColor' />
              </p>
            </>
            <h1 className='text-sans text-ink-900 leading-none font-semibold! text-3xl! md:text-5xl!'>
              You've tried
              <br />
              everything. Yet the
              <br />
              <span className='text-gradient-shimmer italic'>same pain</span>
              <br />
              keeps finding you.
            </h1>
            <div className='divider-rose ml-0! mt-5' />
            <p className='text-serif italic text-lg md:text-xl text-burgundy mt-4'>
              Maybe the problem isn't your life.
              <br />
              Maybe it's the{' '}
              <span className='text-gold font-semibold'>pattern.</span>
            </p>
            <p className='max-w-md mt-4 text-base md:text-lg leading-relaxed text-ink-800'>
              You are not unlucky. You are not broken. You are not cursed. You
              are carrying patterns—old, deep, invisible ones—that keep pulling
              you back into the same place.
            </p>
            <p className='max-w-md mt-3 text-base md:text-lg leading-relaxed text-ink-800'>
              Through{' '}
              <strong className='text-ink-900'>Akashic Record Reading</strong>{' '}
              combined with{' '}
              <strong className='text-ink-900'>
                Life and Relationship Coaching
              </strong>
              , I help you find the root of those patterns—and finally break
              them.
            </p>
            <div className='mt-8'>
              <CTAButton onClick={scrollToOffer}>
                I want to understand why →
              </CTAButton>
            </div>
            <div className='flex flex-wrap gap-4 mt-6'>
              {[
                '1:1 with Sapna',
                'Soul-level reading + practical coaching',
                'Limited spots',
              ].map((t) => (
                <span
                  key={t}
                  className='sparkle-dot text-sm md:text-base font-medium text-ink-800'
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className='reveal-right flex justify-center'>
            <div className='relative'>
              <div className='float-slow relative w-[300px] h-[400px] sm:w-[360px] sm:h-[460px] rounded-[180px_180px_24px_24px] overflow-hidden shadow-[0_24px_64px_rgba(196,56,138,0.3)] border-[3px] border-white/60 pulse-ring'>
                <Image
                  src='/sapna-photo.jpg'
                  alt='Sapna Lamba'
                  fill
                  sizes='(max-width: 640px) 300px, 360px'
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className='absolute inset-0 bg-linear-to-br from-pink-100 via-pink-200 to-pink-400 -z-10' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAMILIAR ── */}
      <section className='relative overflow-hidden bg-linear-to-br from-pink-100 via-pink-50 to-pink-100 py-8'>
        <div className='orb orb-gold w-90 h-90 -top-20 left-[10%] opacity-60' />
        <div className='section-sm max-w-7xl! mx-auto reveal'>
          <Eyebrow>Does This Sound Familiar?</Eyebrow>

          <div className='grid grid-cols-2 lg:grid-cols-6 gap-5 mt-10'>
            {familiarPoints.map((p, i) => (
              <div
                key={p.title}
                className={`reveal d${i + 1} text-center rounded-sm p-7 transition-transform! duration-300! hover:-translate-y-2 shadow-[0_4px_20px_rgba(196,56,138,0.08)] ${GLASS}`}
              >
                <div className='w-14 h-14 mx-auto rounded-full bg-linear-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-5 text-2xl border border-pink-200/60'>
                  {p.emoji}
                </div>
                <h3 className='text-sans text-base! font-semibold! text-magenta-700 mb-2'>
                  {p.title}
                </h3>
                <p className='text-sm md:text-base text-ink-700 font-normal leading-relaxed'>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
          <div className='text-center mt-12'>
            <CTAButton onClick={scrollToOffer}>
              Yes… this is exactly me
            </CTAButton>
            <p className='mt-5 max-w-xl mx-auto text-center text-base md:text-lg leading-relaxed text-ink-800'>
              If even one of these hit—your soul is trying to guide you toward
              something much deeper.
              <br />
              <strong className='text-rose'>
                This program was made for you.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className='relative overflow-hidden bg-linear-to-b from-white to-pink-50'>
        <div className='orb orb-gold w-[300px] h-[300px] top-1/3 right-[-100px] opacity-50' />
        <div className='section grid lg:grid-cols-[40%_60%] gap-14! items-center relative z-10'>
          <div className='reveal-left'>
            <div className='aspect-3/4 rounded-sm overflow-hidden relative shadow-[0_20px_60px_rgba(196,56,138,0.25)]'>
              <Image
                src='/sapna-photo.jpg'
                alt='Sapna Lamba'
                fill
                sizes='(max-width: 1024px) 100vw, 40vw'
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <div className='absolute inset-0 bg-gradient-to-br from-pink-100 via-pink-200 to-pink-400 -z-10' />
            </div>
          </div>
          <div className='reveal-right'>
            <p className='text-serif italic text-xl md:text-2xl text-rose'>
              Hi, I'm Sapna
            </p>
            <h2 className='text-sans font-semibold! text-magenta-700 mt-1 text-2xl! md:text-3xl!'>
              My Journey From Pain To Purpose
            </h2>
            <div className='divider-rose mt-4' />
            <div className='relative mt-10'>
              <div className='absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-pink-200 via-pink-300 to-pink-200' />
              <div className='space-y-7'>
                {timeline.map((t, i) => (
                  <div
                    key={t.title}
                    className={`reveal delay-${((i % 5) + 1) * 100} flex gap-5 items-start`}
                  >
                    <div className='w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-white shadow-[0_4px_16px_rgba(196,56,138,0.2)] flex items-center justify-center text-xl z-10 relative pulse-ring'>
                      {t.emoji}
                    </div>
                    <div className='pt-2'>
                      <h4 className='text-sans text-base! font-semibold! text-magenta-700'>
                        {t.title}
                      </h4>
                      <p className='text-sm md:text-base text-ink-700 mt-1 leading-relaxed'>
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <blockquote
              className={`mt-10 !border-l-0 rounded-2xl p-8 ${GLASS}`}
            >
              <p className='text-lg not-italic text-ink-900 font-normal leading-relaxed'>
                "Finding the soul-level root cause is only the first step. You
                still have to live and transform your everyday human life."
              </p>
              <p className='text-base not-italic text-ink-700 font-normal mt-3 leading-relaxed'>
                I blend the deep spiritual wisdom of the Akashic Records with
                highly practical, human-level transformation tools to help you
                break free from your patterns and step into your power.
              </p>
            </blockquote>
            <p className='text-serif italic text-burgundy mt-5 text-base md:text-lg'>
              — Sapna Lamba
              <span className='block text-sans not-italic text-sm md:text-base text-ink-700 mt-1'>
                Certified Akashic Record Reader · Life & Relationship Coach ·
                Soul Healing Guide
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 4-WEEK JOURNEY ── */}
      <section className='relative overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100'>
        <div className='orb orb-burgundy w-[380px] h-[380px] top-10 right-[-100px]' />
        <div className='orb orb-rose w-[280px] h-[280px] bottom-[-80px] left-[-60px] opacity-70' />
        <div className='section relative z-10'>
          <Eyebrow>The 4-Week Transformation Journey</Eyebrow>
          <p className='text-center max-w-xl mx-auto mt-3 text-base md:text-lg leading-relaxed text-ink-800'>
            We don't just look at the surface-level problem. We bridge the gap
            between soul-level and practical, daily human action across your
            Health, Wealth & Relationships.
          </p>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12'>
            {journeySteps.map((s, i) => (
              <div
                key={s.num}
                className={`reveal d${i + 1} relative text-center pt-10 rounded-sm p-7 ${GLASS} transition-transform! hover:-translate-y-2`}
              >
                <span className='absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-magenta-700 text-white flex items-center justify-center text-sm font-bold font-sans shadow-[0_4px_16px_rgba(58,10,42,0.4)]'>
                  {s.num}
                </span>
                <div className='text-3xl mb-3'>{s.emoji}</div>
                <h3 className='text-sans text-lg! font-semibold! text-magenta-700 mb-2'>
                  {s.title}
                </h3>
                <p className='text-sm md:text-base text-ink-700 font-normal leading-relaxed'>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div
            className={`reveal mt-14 grid md:grid-cols-2 gap-10 items-center p-10 rounded-sm ${GLASS}`}
          >
            <div>
              <Eyebrow>What's Included</Eyebrow>
              <ul className='space-y-4 mt-6'>
                {included.map((item) => (
                  <li
                    key={item}
                    className='flex gap-3 text-base md:text-lg text-ink-900 font-normal leading-relaxed'
                  >
                    <span className='w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-300 flex items-center justify-center flex-shrink-0 text-white text-[11px] mt-0.5'>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className='relative w-full h-full min-h-[280px] flex items-center justify-end pr-6 opacity-30 select-none'>
              <div className='relative w-40 h-40 md:w-56 md:h-56'>
                <Image
                  src='/flower.png'
                  alt='Decorative flower'
                  fill
                  sizes='224px'
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'right center',
                  }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSFORMATION ── */}
      <section className='bg-gradient-to-b from-[#fff0fb] to-[#fce8f7] py-20'>
        <div className='max-w-[1200px] mx-auto px-6'>
          {/* Heading */}
          <div className='mb-10'>
            <Eyebrow>The Transformation</Eyebrow>
          </div>

          {/* Grid: card | photo | photo | card */}
          <div className='reveal grid grid-cols-1 lg:grid-cols-[25%_auto_25%] gap-5'>
            {/* ── BEFORE card ── */}
            <div
              className={`rounded-sm p-7 text-left flex flex-col ${GLASS} shadow-[0_8px_32px_rgba(196,56,138,0.12)]`}
            >
              <span className='inline-flex self-start items-center bg-rose-500/90 text-white text-xs font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-7 shadow-[0_4px_12px_rgba(220,50,50,0.3)]'>
                BEFORE
              </span>
              <ul className='flex-1'>
                {[
                  { icon: '🌀', label: 'Anxiety & Overthinking' },
                  { icon: '💔', label: 'Repeat Heartbreaks' },
                  { icon: '👤', label: 'Low Self-Worth' },
                  { icon: '🔒', label: 'Fear & Insecurity' },
                  { icon: '🚫', label: 'No Boundaries' },
                  { icon: '🪫', label: 'Emotionally Drained' },
                ].map((item, i, arr) => (
                  <li key={item.label}>
                    <div className='flex items-center! gap-4'>
                      <span className='w-11 h-11 shrink-0 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-lg shadow-sm'>
                        {item.icon}
                      </span>
                      <span className='text-base font-medium text-ink-900'>
                        {item.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className='h-px bg-white/40 mt-5' />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Before + After PHOTOS (paired, spans 2 cols) ── */}
            <div className='relative grid grid-cols-2 rounded-sm overflow-hidden gap-2'>
              {/* Before photo */}
              <div className='relative aspect-3/4 lg:aspect-auto lg:h-full min-h-105 bg-gray-200'>
                <Image
                  src='/before.png'
                  alt='Before transformation'
                  fill
                  sizes='(max-width: 1024px) 50vw, 25vw'
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                {/* fallback placeholder shown until you add the real image */}
                <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-400 -z-10'>
                  <span className='text-sm text-gray-600 font-medium'>
                    Before photo
                  </span>
                </div>
              </div>

              {/* After photo */}
              <div className='relative aspect-[3/4] lg:aspect-auto lg:h-full min-h-[420px] bg-gray-200'>
                <Image
                  src='/after.png'
                  alt='After transformation'
                  fill
                  sizes='(max-width: 1024px) 50vw, 25vw'
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                {/* fallback placeholder shown until you add the real image */}
                <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-200 to-pink-300 -z-10'>
                  <span className='text-sm text-white font-medium'>
                    After photo
                  </span>
                </div>
              </div>

              {/* Arrow badge — centered on the seam between the two photos */}
              <div
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-[0_4px_20px_rgba(196,56,138,0.6),0_0_0_5px_rgba(255,255,255,0.9)]'
                style={{ background: '#c4388a' }}
              >
                →
              </div>
            </div>
            {/* ── AFTER card ── */}
            <div
              className={`rounded-sm p-7 text-left flex flex-col ${GLASS} shadow-[0_8px_32px_rgba(76,175,125,0.14)]`}
            >
              <span className='inline-flex self-start items-center bg-emerald-600/90 text-white text-xs font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-7 shadow-[0_4px_12px_rgba(76,175,125,0.35)]'>
                AFTER
              </span>
              <ul className='flex-1'>
                {[
                  { icon: '🪷', label: 'Inner Peace & Clarity' },
                  { icon: '💚', label: 'Healthy Relationships' },
                  { icon: '🛡️', label: 'Unshakable Confidence' },
                  { icon: '📈', label: 'Financial Flow' },
                  { icon: '🧍', label: 'Strong Boundaries' },
                  { icon: '🌿', label: 'Emotionally Free' },
                ].map((item, i, arr) => (
                  <li key={item.label}>
                    <div className='flex items-center gap-4'>
                      <span className='w-11 h-11 shrink-0 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-lg shadow-sm'>
                        {item.icon}
                      </span>
                      <span className='text-base font-medium text-ink-900'>
                        {item.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className='h-px bg-white/40 mt-5' />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className='relative overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 py-8'>
        <div className='orb orb-rose w-[340px] h-[340px] top-[-80px] right-[10%] opacity-50' />
        <div className='section-sm max-w-5xl! mx-auto reveal'>
          <Eyebrow>Loved By Souls Worldwide</Eyebrow>
          <h3 className='text-serif text-magenta-700 text-center mt-3 mb-10 text-2xl md:text-3xl'>
            Real Transformations, Real People
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`reveal d${i + 1} p-7 rounded-sm ${GLASS} shadow-[0_4px_24px_rgba(196,56,138,0.08)]`}
              >
                <div className='flex gap-0.5 text-yellow-400 mb-4'>
                  {'★★★★★'.split('').map((s, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
                <p className='text-base text-ink-800 font-normal leading-relaxed italic mb-5'>
                  "{t.quote}"
                </p>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-pink-300' />
                  <div>
                    <div className='text-base font-semibold text-magenta-700'>
                      {t.name}
                    </div>
                    <div className='text-sm text-ink-700'>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFER ── */}
      <section
        id='offer-section'
        className='bg-magenta-700 relative overflow-hidden'
      >
        <div className='orb orb-rose w-105 h-105 -top-30 -left-20 opacity-50' />
        <div className='section relative z-10 flex flex-col justify-center gap-10 items-center py-20!'>
          <div className='reveal-left text-center'>
            <h2 className='text-serif text-white text-center! mb-4 text-3xl md:text-4xl'>
              The Offer
            </h2>
            <p className='text-base md:text-lg text-white font-normal leading-relaxed'>
              Healing should feel supported, safe and compassionate. <br></br>{' '}
              You don't have to figure everything out alone.
            </p>
          </div>
          <div className='reveal-right text-center'>
            <CTAButton
              className='w-full'
              onClick={() => window.open(RAZORPAY_PAYMENT_LINK, '_blank')}
            >
              Reserve My Spot Now →
            </CTAButton>
            <ul className='text-left mt-6 space-y-2.5 grid! grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mx-auto'>
              {[
                '100% Confidential & Safe',
                'Personalized For You',
                'Lifetime Tools & Practices',
                'Money Back Guarantee',
              ].map((g) => (
                <li
                  key={g}
                  className='flex gap-2 text-sm md:text-base text-white font-medium'
                >
                  <Check
                    className='w-4 h-4 mt-0.5 flex-shrink-0 text-pink-100'
                    strokeWidth={3}
                  />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

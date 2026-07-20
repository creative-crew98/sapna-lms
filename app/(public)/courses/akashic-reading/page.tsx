'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RazorpayButton from '@/components/RazorpayButton'
import {
  CheckIcon,
  SparkleIcon,
  ChevronRightIcon,
  StarIcon,
  ShieldIcon,
} from '@/components/icons'

// ── Star canvas background ────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
    }))

    let animId: number

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((s) => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
        s.y += s.speed
        if (s.y > canvas.height) {
          s.y = 0
          s.x = Math.random() * canvas.width
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className='fixed inset-0 pointer-events-none z-0' />
  )
}

// ── Planet component ──────────────────────────────────────────────────────────
function Planet({
  size,
  top,
  left,
  right,
  colors,
  glow,
  rings = false,
  moons = 0,
}: {
  size: number
  top?: string
  left?: string
  right?: string
  colors: string
  glow: string
  rings?: boolean
  moons?: number
}) {
  return (
    <div
      className='absolute'
      style={{ top, left, right, width: size, height: size }}
    >
      {/* Planet */}
      <div
        className='absolute inset-0 rounded-full'
        style={{
          background: colors,
          boxShadow: `0 0 ${size * 0.6}px ${glow},
                        inset -${size * 0.15}px -${size * 0.15}px ${size * 0.3}px rgba(0,0,0,0.6)`,
        }}
      />
      {/* Ring */}
      {rings && (
        <div
          className='absolute'
          style={{
            top: '40%',
            left: '-30%',
            width: '160%',
            height: '20%',
            border: `2px solid rgba(200,180,255,0.3)`,
            borderRadius: '50%',
            transform: 'rotateX(70deg)',
          }}
        />
      )}
      {/* Moons */}
      {Array.from({ length: moons }, (_, i) => (
        <div
          key={i}
          className='absolute rounded-full'
          style={{
            width: size * 0.18,
            height: size * 0.18,
            top: `${20 + i * 40}%`,
            left: `${110 + i * 15}%`,
            background: 'radial-gradient(circle at 35% 35%, #D4C4E8, #8A7AB8)',
            boxShadow: `0 0 ${size * 0.1}px rgba(212,196,232,0.4)`,
          }}
        />
      ))}
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function CosmicLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className='text-[11px] font-semibold uppercase tracking-[0.25em]
                  text-[#C4A0E8] text-center mb-3'
    >
      ✦ {children} ✦
    </p>
  )
}

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({
  num,
  title,
  desc,
}: {
  num: number
  title: string
  desc: string
}) {
  return (
    <div
      className='flex gap-4 p-5 rounded-2xl border border-white/10
                    bg-white/5 backdrop-blur-sm hover:border-[#9B6FD4]/40
                    hover:bg-white/8 transition-all'
    >
      <div
        className='w-10 h-10 rounded-full flex items-center justify-center
                      flex-shrink-0 text-sm font-bold text-[#C4A0E8]'
        style={{
          background:
            'radial-gradient(circle, rgba(155,111,212,0.3), rgba(74,26,140,0.2))',
          border: '1px solid rgba(196,160,232,0.3)',
        }}
      >
        {String(num).padStart(2, '0')}
      </div>
      <div>
        <p className='text-sm font-semibold text-white mb-1'>{title}</p>
        <p className='text-xs text-[#8B7BA8] leading-relaxed'>{desc}</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AkashicReadingPage() {
  const [activeWeek, setActiveWeek] = useState<number | null>(null)

  return (
    <div
      className='relative min-h-screen overflow-x-hidden'
      style={{
        background:
          'linear-gradient(180deg, #000308 0%, #0D0521 30%, #1A0A3E 60%, #0D0521 100%)',
      }}
    >
      {/* Animated stars */}
      <StarField />

      {/* Nebula layers */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        <div
          className='absolute top-0 left-0 w-full h-full opacity-20'
          style={{
            background:
              'radial-gradient(ellipse at 10% 30%, rgba(138,43,226,0.4) 0%, transparent 50%)',
          }}
        />
        <div
          className='absolute top-0 right-0 w-full h-full opacity-15'
          style={{
            background:
              'radial-gradient(ellipse at 90% 60%, rgba(75,0,130,0.5) 0%, transparent 50%)',
          }}
        />
        <div
          className='absolute bottom-0 left-1/2 w-full h-full opacity-10'
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(0,100,200,0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Planets */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        <Planet
          size={160}
          top='5%'
          right='5%'
          colors='radial-gradient(circle at 35% 35%, #9B6FD4, #4A1A8C, #1A0A3E)'
          glow='rgba(155,111,212,0.5)'
          rings
          moons={2}
        />
        <Planet
          size={80}
          top='40%'
          left='2%'
          colors='radial-gradient(circle at 40% 30%, #6FA8D4, #1A4A8C, #0A1A3E)'
          glow='rgba(111,168,212,0.4)'
        />
        <Planet
          size={50}
          top='70%'
          right='8%'
          colors='radial-gradient(circle at 35% 35%, #D46F9B, #8C1A4A, #3E0A1A)'
          glow='rgba(212,111,155,0.4)'
        />
        <Planet
          size={30}
          top='20%'
          left='15%'
          colors='radial-gradient(circle at 40% 40%, #D4C46F, #8C7A1A, #3E360A)'
          glow='rgba(212,196,111,0.3)'
        />
      </div>

      {/* ── HERO ── */}
      <section
        className='relative z-10 text-center px-6 pt-24 pb-20
                          max-w-3xl mx-auto'
      >
        <div
          className='inline-flex items-center gap-2 px-4 py-2 rounded-full
                        mb-8 border border-[#9B6FD4]/40'
          style={{ background: 'rgba(155,111,212,0.15)' }}
        >
          <StarIcon size={12} className='text-[#C4A0E8]' />
          <span className='text-xs font-semibold text-[#C4A0E8] uppercase tracking-wider'>
            1-Week Soul Blueprint Intensive
          </span>
        </div>

        <h1
          className='text-white mb-6 leading-tight'
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          }}
        >
          Journey beyond
          <br />
          <span className='italic' style={{ color: '#C4A0E8' }}>
            the physical world
          </span>
        </h1>

        <p
          className='text-[#8B7BA8] text-base leading-relaxed mb-4
                      max-w-xl mx-auto font-light'
        >
          Access your Akashic Records — the cosmic library of your soul's
          journey across lifetimes. Uncover the karmic patterns, past-life
          wounds, and invisible contracts keeping you stuck.
        </p>

        <p
          className='text-[#6B5A7E] text-sm mb-10 italic'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          "I began understanding life from a soul perspective, not just a human
          one." — Sapna Lamba
        </p>

        <div
          className='flex flex-col sm:flex-row items-center
                        justify-center gap-4'
        >
          <RazorpayButton
            programId='1-week'
            label='Begin Your Cosmic Journey — ₹5,000'
            className='px-8 py-4 rounded-full font-semibold text-white
                       text-sm transition-all hover:opacity-90 hover:scale-105'
            style={
              {
                background:
                  'linear-gradient(135deg, #4A1A8C, #9B6FD4, #C4A0E8)',
                boxShadow: '0 8px 32px rgba(155,111,212,0.5)',
              } as any
            }
          />
          <a
            href='#modules'
            className='text-sm text-[#8B7BA8] hover:text-[#C4A0E8]
                       transition-colors'
          >
            Explore the journey ↓
          </a>
        </div>

        {/* Trust */}
        <div className='flex flex-wrap items-center justify-center gap-6 mt-10'>
          {[
            '4 Live 1:1 Sessions',
            'Akashic Record Reading',
            'WhatsApp Support',
          ].map((t) => (
            <div
              key={t}
              className='flex items-center gap-2 text-xs text-[#6B5A7E]'
            >
              <div className='w-1.5 h-1.5 rounded-full bg-[#9B6FD4]' />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT IS AKASHIC ── */}
      <section className='relative z-10 max-w-5xl mx-auto px-6 py-16'>
        <CosmicLabel>What are Akashic Records?</CosmicLabel>
        <h2
          className='text-white text-center mb-12'
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
          The cosmic library of your soul
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              icon: '🌌',
              title: "Your soul's history",
              desc: 'Every experience, choice, and lesson your soul has carried across all lifetimes — recorded in the Akashic field.',
            },
            {
              icon: '🔮',
              title: 'Root cause clarity',
              desc: 'Why you keep attracting the same patterns, relationships, and blocks — revealed at the soul level, not surface level.',
            },
            {
              icon: '✨',
              title: 'Path to freedom',
              desc: 'Once we see the root — karmic contracts, ancestral wounds, limiting soul agreements — we can clear and transform them.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className='text-center p-6 rounded-2xl border border-white/10
                         bg-white/5 backdrop-blur-sm'
            >
              <div className='text-4xl mb-4'>{icon}</div>
              <p
                className='text-base font-semibold text-white mb-2'
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {title}
              </p>
              <p className='text-sm text-[#8B7BA8] leading-relaxed font-light'>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES ── */}
      <section
        id='modules'
        className='relative z-10 max-w-5xl mx-auto px-6 py-16'
      >
        <CosmicLabel>Your Soul Blueprint Journey</CosmicLabel>
        <h2
          className='text-white text-center mb-12'
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
          Step by step, <span style={{ color: '#C4A0E8' }}>star by star</span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[
            {
              num: 1,
              title: 'Awareness — Enter the Records',
              desc: 'We access your Akashic Records to uncover karmic patterns, past life experiences, and limiting beliefs carried across lifetimes.',
            },
            {
              num: 2,
              title: 'Release — Clear the Contracts',
              desc: 'Let go of heavy conditioning, subconscious fears, unresolved emotional wounds, and old soul contracts that no longer serve you.',
            },
            {
              num: 3,
              title: 'Rewire — Anchor the New',
              desc: 'Replace repetitive painful patterns with a new soul identity using practical mindset work and customized reflection exercises.',
            },
            {
              num: 4,
              title: 'Rise — Step into Your Power',
              desc: 'Set clear boundaries, break the cycle of people-pleasing, and show up as the aligned, empowered version of yourself.',
            },
          ].map((m) => (
            <ModuleCard key={m.num} {...m} />
          ))}
        </div>
      </section>

      {/* ── INCLUDES ── */}
      <section className='relative z-10 max-w-4xl mx-auto px-6 py-16'>
        <CosmicLabel>What's Included</CosmicLabel>
        <h2
          className='text-white text-center mb-12'
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
          Everything in your{' '}
          <span style={{ color: '#C4A0E8' }}>cosmic toolkit</span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {[
            '4 Live 1:1 Deep-Dive Sessions (Akashic + Coaching)',
            'Akashic Record Reading — Your Personal Soul Blueprint',
            'Tailored Worksheets & Reflection Exercises',
            'WhatsApp Support for Ongoing Integration',
            'Guided Healing Audios & Forgiveness Prayers',
            'Spiritual Remedies & Energy Healing Support',
            'Weekly Growth Tracker & Alignment Tools',
          ].map((item, i) => (
            <div
              key={i}
              className='flex items-start gap-3 p-4 rounded-xl
                         border border-white/10 bg-white/5'
            >
              <CheckIcon
                size={14}
                className='text-[#C4A0E8] mt-0.5 flex-shrink-0'
              />
              <span className='text-sm text-[#C4C0D8] font-light'>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        className='relative z-10 max-w-lg mx-auto px-6 py-16
                          text-center'
      >
        <div
          className='rounded-3xl p-10 border border-[#9B6FD4]/30'
          style={{
            background:
              'linear-gradient(135deg, rgba(74,26,140,0.4), rgba(155,111,212,0.2))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px rgba(155,111,212,0.2)',
          }}
        >
          <CosmicLabel>Investment</CosmicLabel>
          <div className='flex items-baseline justify-center gap-3 my-4'>
            <span
              className='text-5xl font-bold text-white'
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              ₹5,000
            </span>
            <span className='text-xl text-[#6B5A7E] line-through'>₹25,000</span>
          </div>
          <p className='text-sm text-[#8B7BA8] mb-8 font-light'>
            One-time · Lifetime access · Limited seats
          </p>
          <RazorpayButton
            programId='1-week'
            label='Begin My Cosmic Journey ✦'
            className='w-full py-4 rounded-full font-semibold text-white
                       text-base transition-all hover:opacity-90'
            style={
              {
                background: 'linear-gradient(135deg, #4A1A8C, #9B6FD4)',
                boxShadow: '0 8px 32px rgba(155,111,212,0.5)',
              } as any
            }
          />
          <div className='flex items-center justify-center gap-2 mt-4'>
            <ShieldIcon size={13} className='text-[#9B6FD4]' />
            <span className='text-xs text-[#6B5A7E]'>
              Secured by Razorpay · 100% safe
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className='relative z-10 border-t border-white/10 py-8 px-6
                         text-center'
      >
        <p className='text-xs text-[#6B5A7E]'>
          © {new Date().getFullYear()} Soul Awakening Academy · Sapna Lamba
        </p>
        <p
          className='text-xs text-[#4A3A5E] mt-1 italic'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          "The answers you seek are written in the stars of your soul."
        </p>
      </footer>
    </div>
  )
}

'use client'

import { Divider, SectionLabel } from '@/components/website/Shared'

const NOTE_PARA_1 =
  'I believe healing should feel supported, safe, and compassionate. That is why I create a very safe emotional space for people — a space where they do not feel judged, alone, or misunderstood.'
const NOTE_PARA_2 =
  'Many people silently carry emotional pain for years because they feel nobody truly understands them. Through my sessions and coaching work, I try to provide hand-holding and guidance in a way where clients feel supported throughout their healing journey.'
const NOTE_PARA_3 =
  'For me, this work is deeply personal. Because the same journey that once helped me reconnect with myself, heal emotionally, and feel connected to my father beyond the physical world… is now helping me guide others towards their own healing and answers.'

export default function AboutPersonalNote(): React.JSX.Element {
  return (
    <section className='section-sm'>
      <Divider />
      <div className='mt-10 max-w-2xl mx-auto text-center space-y-4 animate-[fadeUp_0.55s_ease_forwards]'>
        <SectionLabel>A Personal Note</SectionLabel>

        {[NOTE_PARA_1, NOTE_PARA_2, NOTE_PARA_3].map((para, i) => (
          <p
            key={i}
            className='text-sm leading-relaxed font-light'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-500)' }}
          >
            {para}
          </p>
        ))}

        {/* Blockquote */}
        <blockquote
          className='rounded-xl px-8 py-6 mt-6 text-left
                     transition-all duration-300
                     hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5'
          style={{
            border: '1px solid var(--pink-100)',
            background: 'var(--bg-muted)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--pink-200)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--pink-100)'
          }}
        >
          {/* Pink left accent */}
          <div
            className='w-8 h-0.5 mb-4 rounded-full'
            style={{
              background:
                'linear-gradient(90deg, var(--pink-300), transparent)',
            }}
          />
          <p
            className='text-base italic leading-relaxed'
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink-700)' }}
          >
            &ldquo;Whether someone is struggling with relationships, emotional
            pain, fear, self-worth, confusion, or repeating life patterns — my
            intention is to help them move towards clarity, healing, emotional
            freedom, and empowerment.&rdquo;
          </p>
          <p
            className='text-xs mt-3'
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink-300)' }}
          >
            — Sapna Lamba
          </p>
        </blockquote>
      </div>
    </section>
  )
}

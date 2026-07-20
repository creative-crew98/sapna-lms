import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

// ── Programs ─────────────────────────────────────────────────────────────────

const programs = [
  {
    id: '1-week',
    data: {
      slug: 'akashic',
      title: 'Akashic',
      subtitle: '1-Week 1:1 Program',
      description:
        'A concentrated deep-dive combining Akashic Record Reading with tactical coaching. Move from awareness to release to rewiring — in one focused week.',
      weeks: 1,
      price: 5000,
      originalPrice: 25000,
      includes: [
        '1 Live 1:1 Deep-Dive Session (Akashic + Coaching)',
        'Akashic Record Reading — Your Soul Blueprint',
        'Tailored Worksheets & Reflection Exercises',
        'WhatsApp Support for Ongoing Integration',
        'Guided Healing Audios & Forgiveness Prayers',
        'Spiritual Remedies & Energy Healing Support',
        'Weekly Growth Tracker & Alignment Tools',
      ],
      modules: [
        {
          weekNum: 1,
          title: 'Awareness',
          description:
            'Pinpoint exactly where your patterns broke down. We go into your Akashic Records to uncover karmic patterns, past life experiences, or limiting beliefs carried across lifetimes.',
          locked: false,
        },
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  },
  {
    id: '8-week',
    data: {
      slug: 'relationship',
      title: 'Relationship',
      subtitle: '8-Week 1:1 Journey',
      description:
        'The full transformation experience — from personal responsibility to visualization to sustained action. A complete system for lasting change in health, wealth, and relationships.',
      weeks: 8,
      price: 51000,
      originalPrice: 56100,
      includes: [
        '8 One-on-One Coaching Sessions',
        '1 Akashic Record Reading (₹5,100 value)',
        'Free Clarity Call before starting',
        'Gratitude Journal — Free',
        'Affirmation Journal — Free',
        'Emotional & Pattern Deep Work',
        'Safe, Non-Judgmental Healing Space',
        'WhatsApp Support throughout',
      ],
      modules: [
        {
          weekNum: 1,
          title: 'Your Life, Your Responsibility',
          description:
            'Shift from blame to ownership. Move from "Why me?" to "What can I change?" — the foundational mindset for all transformation.',
          locked: false,
        },
        {
          weekNum: 2,
          title: 'Understanding Your True Why',
          description:
            'Identify what truly matters to you — not what others expect — and connect with your deeper purpose and core desires.',
          locked: true,
        },
        {
          weekNum: 3,
          title: 'Breaking Limiting Beliefs',
          description:
            'Uncover hidden beliefs like "I am not enough" and replace them with empowering thoughts that align with your soul\'s truth.',
          locked: true,
        },
        {
          weekNum: 4,
          title: 'Turning Dreams into Clear Goals',
          description:
            'Convert vague desires into clear, actionable goals aligned with your values and priorities.',
          locked: true,
        },
        {
          weekNum: 5,
          title: 'Understanding Inner Resistances & Blocks',
          description:
            'Recognize fear, self-doubt, and procrastination — and learn to move through them, not around them.',
          locked: true,
        },
        {
          weekNum: 6,
          title: 'Affirmations — The Power of Your Words',
          description:
            'Create personalized affirmations. Use language consciously to rebuild confidence and self-worth from the inside out.',
          locked: true,
        },
        {
          weekNum: 7,
          title: 'Visualization — Dream it, See it, Become it',
          description:
            'Mentally align with the life you want. Connect emotionally with your desired future and make it feel real.',
          locked: true,
        },
        {
          weekNum: 8,
          title: 'Taking Action — From Knowing to Doing',
          description:
            'Build simple habits and an action plan for continued growth long after the program ends.',
          locked: true,
        },
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  },
]

// ── Affirmations (global defaults) ───────────────────────────────────────────

const defaultAffirmations = [
  'I am not my patterns. I am the awareness behind them.',
  'I release what no longer serves my highest good.',
  'I am worthy of deep love and I attract what I deserve.',
  'My boundaries are an act of love — for myself and others.',
  "I trust my soul's wisdom to guide me home.",
  'Every day I choose myself — gently and without apology.',
  'I am healing, growing, and becoming.',
  'I deserve peace, joy, and abundance.',
  'I am safe to be seen, heard, and valued.',
  'My past does not define me — my presence does.',
  'I open myself to receive all that is meant for me.',
  'I am enough, exactly as I am, right now.',
]

// ── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting seed...\n')

  // Seed programs
  console.log('📚 Seeding programs...')
  for (const program of programs) {
    await db.collection('programs').doc(program.id).set(program.data)
    console.log(
      `  ✅ Program: ${program.data.title} (slug: ${program.data.slug})`,
    )
  }

  // Seed global affirmations
  console.log('\n✦ Seeding default affirmations...')
  const batch = db.batch()
  for (const text of defaultAffirmations) {
    const ref = db.collection('globalAffirmations').doc()
    batch.set(ref, {
      text,
      createdAt: Timestamp.now(),
    })
  }
  await batch.commit()
  console.log(`  ✅ ${defaultAffirmations.length} affirmations seeded`)

  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
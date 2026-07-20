import Razorpay from 'razorpay'

function getRazorpay(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured')
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// Lazily creates the Razorpay client only when it's actually used at
// request time, instead of at module load time (which happens during
// `next build` and was crashing the build when keys weren't set yet).
export const razorpay = new Proxy({} as Razorpay, {
  get(_target, prop) {
    const client = getRazorpay()
    // @ts-ignore
    return client[prop]
  },
})

export const PROGRAMS: Record<
  string,
  {
    name: string
    amount: number // in paise
    originalAmount: number
    description: string
  }
> = {
  '1-week': {
    name: 'Akashic Record Reading',
    amount: 500000, // ₹5,000
    originalAmount: 2500000, // ₹25,000
    description: '1:1 Akashic + Coaching Program',
  },
  '8-week': {
    name: 'Life & Relationship Coaching',
    amount: 5100000, // ₹51,000
    originalAmount: 5610000, // ₹56,100
    description: '8-Week Complete Transformation Journey',
  },
}

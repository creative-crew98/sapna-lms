import { adminDb } from '@/lib/firebase-admin'

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function saveOtp(email: string, otp: string) {
  const docRef = adminDb.collection('otps').doc(email)

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min

  await docRef.set({
    otp,
    email,
    createdAt: new Date(),
    expiresAt,
    verified: false,
  })
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const docRef = adminDb.collection('otps').doc(email)
  const snap = await docRef.get()

  if (!snap.exists) return false

  const data = snap.data() as {
    otp?: string
    verified?: boolean
    expiresAt?: Date
  }

  if (data.verified) return false
  if (data.otp !== code) return false
  if (!data.expiresAt) return false

  // Firebase Admin SDK returns Firestore `Timestamp` objects for date
  // fields, NOT native JS `Date` instances — so `instanceof Date` was
  // always false here, making expiresAtMs always NaN and every OTP look
  // expired/invalid, no matter what. Handle both shapes safely.
  const raw: any = data.expiresAt
  const expiresAtMs =
    raw instanceof Date
      ? raw.getTime()
      : typeof raw?.toMillis === 'function'
        ? raw.toMillis()
        : NaN
  if (Number.isNaN(expiresAtMs)) return false

  if (expiresAtMs < Date.now()) return false

  // Mark as verified and clean up
  await docRef.delete()
  return true
}

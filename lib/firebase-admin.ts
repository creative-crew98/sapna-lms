import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

function getPrivateKey(): string {
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim()

  if (base64Key) {
    const decoded = Buffer.from(base64Key, 'base64')
      .toString('utf8')
      .replace(/\\n/g, '\n') // <-- safety net for literal \n sequences
      .trim()

    if (!decoded.startsWith('-----BEGIN PRIVATE KEY-----')) {
      throw new Error(
        `FIREBASE_ADMIN_PRIVATE_KEY_BASE64 decoded incorrectly. Length: ${decoded.length}, starts with: "${decoded.slice(0, 30)}"`,
      )
    }
    return decoded
  }

  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim()
  if (rawKey) return rawKey.replace(/\\n/g, '\n')

  throw new Error('No Firebase private key found in env.')
}

function initAdminApp() {
  if (getApps().length > 0) return getApp()

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

const adminApp = initAdminApp()
export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
export const adminStorage = getStorage(adminApp)

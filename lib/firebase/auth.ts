import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  await ensureUserDoc(result.user)
  return result.user
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await ensureUserDoc(result.user, name)
  return result.user
}

export async function logout() {
  await signOut(auth)
}

export async function ensureUserDoc(user: User, name?: string) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: name || user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      photo: user.photoURL || '',
      role: 'student',
      enrolledPrograms: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export async function getUserDoc(uid: string) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

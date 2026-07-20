import type { Timestamp } from 'firebase/firestore'

/** Firestore date fields come back as a Timestamp once read, but are written
 * as a plain Date or serverTimestamp() sentinel — this union covers both. */
export type FirestoreDate = Timestamp | Date | null

export interface UserDoc {
  uid: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'student'
  enrolledPrograms: string[]
  createdAt: FirestoreDate
}

export interface Program {
  id: string
  title: string
  subtitle: string
  weeks: number
  price: number
  originalPrice: number
  description: string
  includes: string[]
  modules: Module[]
  introVideoUrl?: string
}

export interface Module {
  id: string
  programId: string
  weekNum: number
  title: string
  description: string
  locked: boolean
  content?: string
}

export interface Session {
  id: string
  userId: string
  programId: string
  weekNum: number
  title: string
  date: FirestoreDate
  zoomLink: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export interface Enrollment {
  id: string
  userId: string
  programId: string
  startDate: FirestoreDate
  progress: Record<string, boolean>
  currentWeek: number
}

export interface JournalEntry {
  id: string
  userId: string
  content: string
  date: FirestoreDate
}

export interface Resource {
  id: string
  programId: string
  weekNum: number
  title: string
  // 'link' was used throughout ResourceForm/the dashboard resources page but
  // was missing here, so TypeScript couldn't catch mismatches for it.
  type: 'pdf' | 'audio' | 'video' | 'link'
  url: string
  locked: boolean
  notes?: string
}

export interface Affirmation {
  id: string
  userId: string
  text: string
  createdAt: FirestoreDate
}

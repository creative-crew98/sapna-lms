'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'

interface UserProfile {
  uid: string
  name: string
  email: string
  phone: string
  photo: string
  role: 'admin' | 'student'
  enrolledPrograms: string[]
  createdAt: any
  updatedAt: any
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: 'admin' | 'student' | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<'admin' | 'student' | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (firebaseUser: User) => {
    try {
      const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (snap.exists()) {
        const data = snap.data() as UserProfile
        setProfile(data)
        setRole(data.role)
        // sync cookie for middleware
        document.cookie = `firebase-token=true; path=/; max-age=86400`
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user)
  }, [user, fetchProfile])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await fetchProfile(firebaseUser)
      } else {
        setProfile(null)
        setRole(null)
        // clear cookie
        document.cookie = 'firebase-token=; path=/; max-age=0'
      }
      setLoading(false)
    })
    return unsub
  }, [fetchProfile])

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

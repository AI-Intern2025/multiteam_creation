'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('dream11-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock authentication - replace with real auth
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0]
      }
      
      setUser(mockUser)
      localStorage.setItem('dream11-user', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('dream11-user')
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Mock registration - replace with real auth
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name
      }
      
      setUser(newUser)
      localStorage.setItem('dream11-user', JSON.stringify(newUser))
    } catch (error) {
      throw new Error('Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

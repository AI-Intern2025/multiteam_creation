'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  isAdmin: () => boolean
  getRedirectPath: () => string
}

// Dummy user data
const DUMMY_USERS = [
  {
    id: '1',
    email: 'admin@dream11.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const
  },
  {
    id: '2',
    email: 'user@dream11.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user' as const
  },
  {
    id: '3',
    email: 'john@example.com',
    password: 'john123',
    name: 'John Doe',
    role: 'user' as const
  },
  {
    id: '4',
    email: 'sarah@example.com',
    password: 'sarah123',
    name: 'Sarah Johnson',
    role: 'user' as const
  }
]

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
      // Check dummy users
      const foundUser = DUMMY_USERS.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        throw new Error('Invalid credentials')
      }
      
      const mockUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
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
        name,
        role: 'user'
      }
      
      setUser(newUser)
      localStorage.setItem('dream11-user', JSON.stringify(newUser))
    } catch (error) {
      throw new Error('Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const getRedirectPath = () => {
    if (user?.role === 'admin') {
      return '/admin'
    }
    return '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, isAdmin, getRedirectPath }}>
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

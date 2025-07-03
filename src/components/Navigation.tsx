'use client'

import { useAuth } from '@/providers/AuthProvider'
import { LogOut, User, Settings, Upload, Trophy, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const { user, signOut, isAdmin } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-dream11-primary to-dream11-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">D11</span>
              </div>
              <span className="text-xl font-bold text-dream11-dark">Dream11 Multi Team</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/teams"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-dream11-primary transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Teams</span>
            </Link>

            <Link
              href="/strategy"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-dream11-primary transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Strategy</span>
            </Link>

            {isAdmin() && (
              <>
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <Link
                  href="/admin/upload"
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>
              </>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-dream11-primary to-dream11-accent rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-500 capitalize">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

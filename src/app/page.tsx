'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import MatchCard from '@/components/MatchCard'
import LoginForm from '@/components/LoginForm'
import Navigation from '@/components/Navigation'
import { Match } from '@/types'

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // If user is admin, redirect to admin dashboard
      if (isAdmin()) {
        router.push('/admin')
        return
      }
      loadMatches()
    } else {
      setLoading(false)
    }
  }, [user, isAdmin, router])

  // Show login form if user is not authenticated
  if (!user && !loading) {
    return <LoginForm />
  }

  const loadMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      if (!response.ok) {
        throw new Error('Failed to fetch matches')
      }
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Failed to load matches:', error)
      // Fallback to mock data if API fails
      const mockMatches: Match[] = [
        {
          id: 1,
          team1: 'WI',
          team2: 'AUS',
          format: 'T20',
          venue: 'Kensington Oval, Barbados',
          matchDate: '2025-07-04T14:30:00Z',
          startTime: '2025-07-04T12:00:00Z',
          endTime: '2025-07-04T14:30:00Z',
          isActive: true,
          isUpcoming: true,
          status: 'scheduled'
        },
        {
          id: 2,
          team1: 'IND',
          team2: 'ENG',
          format: 'ODI',
          venue: 'Lord\'s, London',
          matchDate: '2025-07-05T10:30:00Z',
          startTime: '2025-07-05T08:00:00Z',
          endTime: '2025-07-05T10:30:00Z',
          isActive: true,
          isUpcoming: true,
          status: 'scheduled'
        },
        {
          id: 3,
          team1: 'PAK',
          team2: 'SA',
          format: 'T20',
          venue: 'Gaddafi Stadium, Lahore',
          matchDate: '2025-07-06T19:00:00Z',
          startTime: '2025-07-06T16:30:00Z',
          endTime: '2025-07-06T19:00:00Z',
          isActive: true,
          isUpcoming: true,
          status: 'scheduled'
        },
        {
          id: 4,
          team1: 'NZ',
          team2: 'SL',
          format: 'ODI',
          venue: 'Eden Park, Auckland',
          matchDate: '2025-07-07T02:30:00Z',
          startTime: '2025-07-07T00:00:00Z',
          endTime: '2025-07-07T02:30:00Z',
          isActive: true,
          isUpcoming: true,
          status: 'scheduled'
        },
        {
          id: 5,
          team1: 'BAN',
          team2: 'AFG',
          format: 'T20',
          venue: 'Shere Bangla National Stadium, Dhaka',
          matchDate: '2025-07-08T08:00:00Z',
          startTime: '2025-07-08T05:30:00Z',
          endTime: '2025-07-08T08:00:00Z',
          isActive: true,
          isUpcoming: true,
          status: 'scheduled'
        }
      ]
      setMatches(mockMatches)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeams = (matchId: number) => {
    router.push(`/select/${matchId}`)
  }

  const getMatchStatus = (match: Match) => {
    if (!match.startTime || !match.endTime) return 'scheduled'
    
    const now = new Date()
    const startTime = new Date(match.startTime)
    const endTime = new Date(match.endTime)
    
    if (now < startTime) return 'opens-soon'
    if (now >= startTime && now <= endTime) return 'open'
    if (now > endTime) return 'closed'
    
    return 'scheduled'
  }

  const categorizeMatches = () => {
    const now = new Date()
    
    const openMatches = matches.filter(match => {
      const status = getMatchStatus(match)
      return match.isActive && (status === 'open' || status === 'scheduled')
    })
    
    const upcomingMatches = matches.filter(match => {
      const status = getMatchStatus(match)
      return match.isActive && status === 'opens-soon'
    })
    
    const closedMatches = matches.filter(match => {
      const status = getMatchStatus(match)
      return status === 'closed' || !match.isActive
    })
    
    return { openMatches, upcomingMatches, closedMatches }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading matches...</div>
      </div>
    )
  }

  // Admin users should not see this page, they get redirected to admin dashboard
  if (isAdmin()) {
    return null
  }

  const { openMatches, upcomingMatches, closedMatches } = categorizeMatches()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="navbar-dream11 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            <Trophy className="w-10 h-10 text-dream11-primary" />
            <div>
              <h1 className="heading-primary text-white">DREAM11 MULTI TEAM CREATOR</h1>
              <p className="text-gray-300 mt-1 font-semibold">Create multiple winning teams for your fantasy cricket matches</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-dream11 py-20 relative">
        <div className="hero-grid"></div>
        <div className="hero-content max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="hero-title">
              DOMINATE YOUR <span className="text-dream11-primary">FANTASY LEAGUE</span>
            </h2>
            <p className="hero-subtitle">
              Advanced multi-team creation system with intelligent player selection and strategic team building
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="section-sport">
        <div className="max-w-7xl mx-auto">
          {/* Open for Team Creation */}
          {openMatches.length > 0 && (
            <div className="mb-16">
              <div className="mb-12 text-center">
                <h2 className="heading-secondary mb-4">OPEN FOR TEAM CREATION</h2>
                <p className="text-gray-600 text-lg font-medium">Create teams for these matches now</p>
              </div>
              <div className="grid-sport grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {openMatches.map((match, index) => (
                  <div key={match.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <MatchCard
                      match={match}
                      onCreateTeams={handleCreateTeams}
                      isAdmin={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          {upcomingMatches.length > 0 && (
            <div className="mb-16">
              <div className="mb-12 text-center">
                <h2 className="heading-secondary mb-4">UPCOMING MATCHES</h2>
                <p className="text-gray-600 text-lg font-medium">Team creation opens soon</p>
              </div>
              <div className="grid-sport grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches.map((match, index) => (
                  <div key={match.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <MatchCard
                      match={match}
                      onCreateTeams={handleCreateTeams}
                      isAdmin={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Closed Matches */}
          {closedMatches.length > 0 && (
            <div className="mb-16">
              <div className="mb-12 text-center">
                <h2 className="heading-secondary mb-4">RECENT MATCHES</h2>
                <p className="text-gray-600 text-lg font-medium">Team creation closed</p>
              </div>
              <div className="grid-sport grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {closedMatches.map((match, index) => (
                  <div key={match.id} className="animate-scale-in opacity-60" style={{ animationDelay: `${index * 0.1}s` }}>
                    <MatchCard
                      match={match}
                      onCreateTeams={handleCreateTeams}
                      isAdmin={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matches.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-600 mb-4 text-lg font-semibold">No matches available</div>
              <p className="text-gray-500 font-medium">Check back later for upcoming matches</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

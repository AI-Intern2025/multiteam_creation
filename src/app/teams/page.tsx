'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import TeamGenerator from '@/components/TeamGenerator'
import TeamManager from '@/components/TeamManager'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Player, Strategy, Team } from '@/types'

export default function TeamsPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showTeamGenerator, setShowTeamGenerator] = useState(true)

  useEffect(() => {
    // Load selected players and strategy from localStorage
    const selectedPlayersData = localStorage.getItem('selectedPlayers')
    const selectedStrategyData = localStorage.getItem('selectedStrategy')
    
    if (selectedPlayersData && selectedStrategyData) {
      try {
        const selectedPlayers = JSON.parse(selectedPlayersData)
        const selectedStrategy = JSON.parse(selectedStrategyData)
        setPlayers(selectedPlayers)
        setStrategy(selectedStrategy)
      } catch (error) {
        console.error('Failed to load data:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
    setLoading(false)
  }, [router])

  const handleTeamsGenerated = (generatedTeams: Team[]) => {
    setTeams(generatedTeams)
    setShowTeamGenerator(false)
  }

  const handleGenerateNewTeams = () => {
    setTeams([])
    setShowTeamGenerator(true)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-dream11-dark text-xl font-bold">Loading team generation...</div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!players.length || !strategy) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-dream11-primary text-xl mb-4 font-bold">Missing data</div>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="bg-white">
          {/* Header */}
          <header className="navbar-dream11 py-6">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.back()}
                    className="text-white hover:text-dream11-primary transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="heading-secondary text-white">
                      {showTeamGenerator ? 'GENERATE TEAMS' : 'YOUR TEAMS'}
                    </h1>
                    <p className="text-gray-300 font-semibold">
                      {showTeamGenerator 
                        ? 'Generate multiple winning teams'
                        : `${teams.length} teams generated with ${strategy.name}`
                      }
                    </p>
                  </div>
                </div>
                
                {!showTeamGenerator && (
                  <button
                    onClick={handleGenerateNewTeams}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Generate New Teams</span>
                  </button>
                )}
              </div>
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {showTeamGenerator ? (
            <TeamGenerator
              players={players}
              strategy={strategy}
              onTeamsGenerated={handleTeamsGenerated}
            />
          ) : (
            <TeamManager
              teams={teams}
              players={players}
              onTeamsUpdate={setTeams}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

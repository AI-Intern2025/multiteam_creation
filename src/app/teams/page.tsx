'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import TeamGenerator from '@/components/TeamGenerator'
import TeamManager from '@/components/TeamManager'
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
        return
      }
    } else {
      // No data, redirect to home
      router.push('/')
      return
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-dream11-dark text-xl font-bold">Loading team generation...</div>
      </div>
    )
  }

  if (!players.length || !strategy) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-dream11-primary text-xl mb-4 font-bold">Missing data</div>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleGenerateNewTeams}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>GENERATE NEW</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Strategy Summary */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Strategy</h3>
              <p className="text-lg font-black text-dream11-dark">{strategy.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Players</h3>
              <p className="text-lg font-black text-dream11-dark">{players.length} Selected</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Credits</h3>
              <p className="text-lg font-black text-dream11-dark">
                {players.reduce((sum, p) => sum + p.credits, 0).toFixed(1)}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
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
  )
}

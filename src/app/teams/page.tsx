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
  const [allPlayers, setAllPlayers] = useState<Player[]>([]) // Add state for all players
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showTeamGenerator, setShowTeamGenerator] = useState(true)

  useEffect(() => {
    // Load selected players and strategy from localStorage
    const selectedPlayersData = localStorage.getItem('selectedPlayers')
    const selectedStrategyData = localStorage.getItem('selectedStrategy')
    const matchIdData = localStorage.getItem('currentMatchId')
    
    if (selectedPlayersData && selectedStrategyData) {
      try {
        const selectedPlayers = JSON.parse(selectedPlayersData)
        const selectedStrategy = JSON.parse(selectedStrategyData)
        setPlayers(selectedPlayers)
        setStrategy(selectedStrategy)
        
        // Fetch all players for bulk edit
        fetchAllPlayers(matchIdData)
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

  const fetchAllPlayers = async (matchId: string | null) => {
    try {
      // Try to get all players from the API
      const response = await fetch('/api/players')
      if (response.ok) {
        const data = await response.json()
        if (data.players && data.players.length > 0) {
          console.log('📊 Fetched all players for bulk edit:', data.players.length)
          setAllPlayers(data.players)
          return
        }
      }
    } catch (error) {
      console.error('Error fetching all players:', error)
    }
    
    // Fallback: use selected players (but this will be set later)
    console.log('⚠️ Will use selected players as fallback for bulk edit')
  }

  // Set fallback when players are loaded
  useEffect(() => {
    if (players.length > 0 && allPlayers.length === 0) {
      setAllPlayers(players)
    }
  }, [players, allPlayers])

  // Helper to map team1/team2 to real codes
  async function mapTeamsToRealCodes(generatedTeams: Team[]): Promise<Team[]> {
    const matchIdData = localStorage.getItem('currentMatchId');
    if (!matchIdData) {
      console.log('⚠️ No match ID found, skipping team mapping');
      return generatedTeams;
    }
    
    let matchInfo: { team1: string; team2: string } | null = null;
    try {
      const res = await fetch('/api/matches');
      if (res.ok) {
        const { matches } = await res.json();
        matchInfo = matches.find((m: any) => m.id === parseInt(matchIdData));
        console.log('🎯 Found match info for mapping:', matchInfo);
      }
    } catch (e) {
      console.error('Error fetching match info:', e);
    }
    
    if (!matchInfo) {
      console.log('⚠️ No match info found, skipping team mapping');
      return generatedTeams;
    }
    
    const { team1, team2 } = matchInfo;
    console.log(`🔄 Mapping team1 -> ${team1}, team2 -> ${team2}`);
    
    // Map all players in all teams
    const mappedTeams = generatedTeams.map((team: Team) => ({
      ...team,
      players: team.players.map((player: Player) => ({
        ...player,
        team: player.team === 'team1' ? team1 : player.team === 'team2' ? team2 : player.team
      }))
    }));
    
    console.log('✅ Team mapping completed');
    return mappedTeams;
  }

  const handleTeamsGenerated = async (generatedTeams: Team[]) => {
    const mappedTeams = await mapTeamsToRealCodes(generatedTeams);
    setTeams(mappedTeams);
    setShowTeamGenerator(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-dream11-primary/5">
      {/* Header */}
      <header className="navbar-dream11 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-white hover:text-dream11-primary transition-colors transform hover:scale-110"
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
                  className="btn-secondary flex items-center space-x-2 transform hover:scale-105"
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
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Strategy</h3>
              <p className="text-lg font-black text-dream11-dark">{strategy.name}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Players</h3>
              <p className="text-lg font-black text-dream11-dark">{players.length} Selected</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
              <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Credits</h3>
              <p className="text-lg font-black text-dream11-dark">
                {players.reduce((sum, p) => sum + p.credits, 0).toFixed(1)}/100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200">
          {showTeamGenerator ? (
            <TeamGenerator
              players={players}
              strategy={strategy}
              onTeamsGenerated={handleTeamsGenerated}
            />
          ) : (
            <TeamManager
              teams={teams}
              players={allPlayers.length > 0 ? allPlayers : players}
              onTeamsUpdate={setTeams}
            />
          )}
        </div>
      </main>
    </div>
  )
}

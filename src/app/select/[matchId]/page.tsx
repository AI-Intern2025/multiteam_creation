'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, DollarSign } from 'lucide-react'

interface Player {
  id: string
  name: string
  fullName?: string
  team: string
  role: 'WK' | 'BAT' | 'AR' | 'BOWL'
  credits: number
  points?: number
  selectionPercentage?: number
  country?: string
  isActive?: boolean
  isPlayingToday?: boolean
}

interface SelectedPlayer extends Player {
  isSelected: boolean
  isCaptain: boolean
  isViceCaptain: boolean
  isPlayingToday?: boolean
}

export default function PlayerSelectionPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.matchId as string
  
  const [players, setPlayers] = useState<SelectedPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([])
  const [totalCredits, setTotalCredits] = useState(0)
  const [matchInfo, setMatchInfo] = useState({ team1: '', team2: '', format: '' })

  useEffect(() => {
    loadPlayersForMatch()
  }, [matchId])

  useEffect(() => {
    // Calculate total credits when selected players change
    const total = selectedPlayers.reduce((sum, player) => sum + player.credits, 0)
    setTotalCredits(total)
  }, [selectedPlayers])

  const loadPlayersForMatch = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // First get the match details
      const matchResponse = await fetch('/api/matches')
      if (!matchResponse.ok) {
        throw new Error('Failed to load matches')
      }
      
      const { matches } = await matchResponse.json()
      const match = matches.find((m: any) => m.id === parseInt(matchId))
      
      if (!match) {
        throw new Error('Match not found')
      }
      
      setMatchInfo({ team1: match.team1, team2: match.team2, format: match.format })
      
      // Now load players for the specific teams
      const response = await fetch('/api/players')
      if (!response.ok) {
        throw new Error('Failed to load players')
      }
      
      const { players: dbPlayers } = await response.json()
      
      // Filter players for the specific match teams
      const matchPlayers = dbPlayers.filter((player: Player) => 
        player.team === match.team1 || player.team === match.team2
      )
      
      // Convert to our format and add selection state
      const playersWithSelection: SelectedPlayer[] = matchPlayers.map((player: Player) => ({
        id: player.id.toString(),
        name: player.name,
        fullName: player.fullName,
        team: player.team,
        role: player.role,
        credits: player.credits,
        points: player.points,
        selectionPercentage: player.selectionPercentage,
        country: player.country,
        isActive: player.isPlayingToday || false,
        isPlayingToday: player.isPlayingToday || false,
        isSelected: false,
        isCaptain: false,
        isViceCaptain: false
      }))
      
      setPlayers(playersWithSelection)
      
    } catch (err) {
      setError('Failed to load players. Please try again.')
      console.error('Error loading players:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerToggle = (playerId: string) => {
    const player = players.find(p => p.id === playerId)
    if (!player) return
    
    const isCurrentlySelected = selectedPlayers.some(p => p.id === playerId)
    
    if (isCurrentlySelected) {
      // Remove player
      setSelectedPlayers(prev => prev.filter(p => p.id !== playerId))
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { ...p, isSelected: false } : p
      ))
    } else {
      // Add player (if under limit)
      if (selectedPlayers.length >= 11) {
        alert('Maximum 11 players can be selected')
        return
      }
      
      // Check team limit (max 7 from one team)
      const teamCount = selectedPlayers.filter(p => p.team === player.team).length
      if (teamCount >= 7) {
        alert(`Maximum 7 players can be selected from ${player.team}`)
        return
      }
      
      // Check role limit
      const roleCount = selectedPlayers.filter(p => p.role === player.role).length
      let maxRoleLimit = 4 // Default for WK and AR
      
      if (player.role === 'BAT' || player.role === 'BOWL') {
        maxRoleLimit = 5
      }
      
      if (roleCount >= maxRoleLimit) {
        const roleNames = {
          'WK': 'Wicket Keeper',
          'BAT': 'Batsman',
          'AR': 'All Rounder',
          'BOWL': 'Bowler'
        }
        alert(`Maximum ${maxRoleLimit} ${roleNames[player.role]} players can be selected`)
        return
      }
      
      // Check credits limit
      if (totalCredits + player.credits > 100) {
        alert('Total credits cannot exceed 100')
        return
      }
      
      setSelectedPlayers(prev => [...prev, { ...player, isSelected: true }])
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { ...p, isSelected: true } : p
      ))
    }
  }

  const handleContinueToStrategy = () => {
    if (selectedPlayers.length !== 11) {
      alert('Please select exactly 11 players')
      return
    }
    
    // Store selected players in localStorage or state management
    localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers))
    
    // Navigate to strategy page
    router.push('/strategy')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'WK': return '🧤'
      case 'BAT': return '🏏'
      case 'AR': return '⚡'
      case 'BOWL': return '🎯'
      default: return '👤'
    }
  }

  const getSelectedStats = () => {
    const roleCount = selectedPlayers.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const teamCount = selectedPlayers.reduce((acc, player) => {
      acc[player.team] = (acc[player.team] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return { roleCount, teamCount }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-dream11-dark text-xl font-bold">Loading players...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-dream11-primary text-xl mb-4 font-bold">{error}</div>
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

  const { roleCount, teamCount } = getSelectedStats()
  
  // Split players by team dynamically
  const team1Players = players.filter(p => p.team === matchInfo.team1)
  const team2Players = players.filter(p => p.team === matchInfo.team2)

  // Separate active and inactive players for display
  const activeTeam1Players = team1Players.filter(p => p.isPlayingToday)
  const inactiveTeam1Players = team1Players.filter(p => !p.isPlayingToday)
  const activeTeam2Players = team2Players.filter(p => p.isPlayingToday)
  const inactiveTeam2Players = team2Players.filter(p => !p.isPlayingToday)

  // Combine for display (active first, then inactive)
  const displayTeam1Players = [...activeTeam1Players, ...inactiveTeam1Players]
  const displayTeam2Players = [...activeTeam2Players, ...inactiveTeam2Players]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="navbar-dream11 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-white hover:text-dream11-primary transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="heading-secondary text-white">SELECT YOUR TEAM</h1>
                <p className="text-gray-300 font-semibold">{matchInfo.team1} vs {matchInfo.team2} • {matchInfo.format}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-white">{selectedPlayers.length}/11 PLAYERS</div>
              <div className="text-sm text-gray-300 font-semibold">{totalCredits.toFixed(1)}/100 CREDITS</div>
            </div>
          </div>
        </div>
      </header>

      {/* Selection Stats */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div className="stat-card bg-white border border-gray-200">
              <div className="stat-label text-gray-600">WK</div>
              <div className="stat-value text-dream11-dark">{roleCount.WK || 0}/4</div>
            </div>
            <div className="stat-card bg-white border border-gray-200">
              <div className="stat-label text-gray-600">BAT</div>
              <div className="stat-value text-dream11-dark">{roleCount.BAT || 0}/5</div>
            </div>
            <div className="stat-card bg-white border border-gray-200">
              <div className="stat-label text-gray-600">AR</div>
              <div className="stat-value text-dream11-dark">{roleCount.AR || 0}/4</div>
            </div>
            <div className="stat-card bg-white border border-gray-200">
              <div className="stat-label text-gray-600">BOWL</div>
              <div className="stat-value text-dream11-dark">{roleCount.BOWL || 0}/5</div>
            </div>
            <div className="stat-card bg-white border border-gray-200">
              <div className="stat-label text-gray-600">{matchInfo.team1}</div>
              <div className="stat-value text-dream11-dark">{teamCount[matchInfo.team1] || 0}/7</div>
            </div>
            <div className="stat-card bg-white border border-gray-200">
              <div className="stat-label text-gray-600">{matchInfo.team2}</div>
              <div className="stat-value text-dream11-dark">{teamCount[matchInfo.team2] || 0}/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Match Summary */}
        <div className="card-sport mb-8">
          <h3 className="heading-accent mb-4">SQUAD OVERVIEW</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-black text-dream11-primary uppercase tracking-wide">{matchInfo.team1}</h4>
              <p className="text-sm text-gray-600 font-semibold">
                {activeTeam1Players.length} Active • {inactiveTeam1Players.length} Inactive
              </p>
            </div>
            <div>
              <h4 className="font-black text-dream11-primary uppercase tracking-wide">{matchInfo.team2}</h4>
              <p className="text-sm text-gray-600 font-semibold">
                {activeTeam2Players.length} Active • {inactiveTeam2Players.length} Inactive
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 font-medium">
            Only active players can be selected for your team
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team 1 Players */}
          <div>
            <h2 className="heading-secondary mb-6 flex items-center">
              <div className="w-6 h-6 bg-dream11-primary rounded-full mr-3"></div>
              {matchInfo.team1} ({displayTeam1Players.length})
            </h2>
            <div className="space-y-3">
              {displayTeam1Players.map((player: SelectedPlayer) => (
                <div
                  key={player.id}
                  onClick={() => player.isPlayingToday ? handlePlayerToggle(player.id) : null}
                  className={`player-card p-4 ${
                    !player.isPlayingToday
                      ? 'player-card-inactive'
                      : player.isSelected
                      ? 'player-card-selected'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getRoleIcon(player.role)}</div>
                      <div>
                        <div className="font-black text-dream11-dark flex items-center space-x-2">
                          <span>{player.name}</span>
                          {player.isPlayingToday ? (
                            <span className="badge-active">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="badge-inactive">
                              INACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 font-bold uppercase tracking-wide">{player.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-dream11-dark">{player.credits}</div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Credits</div>
                    </div>
                  </div>
                  {player.selectionPercentage && (
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      {player.selectionPercentage}% selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team 2 Players */}
          <div>
            <h2 className="heading-secondary mb-6 flex items-center">
              <div className="w-6 h-6 bg-dream11-accent rounded-full mr-3"></div>
              {matchInfo.team2} ({displayTeam2Players.length})
            </h2>
            <div className="space-y-3">
              {displayTeam2Players.map((player: SelectedPlayer) => (
                <div
                  key={player.id}
                  onClick={() => player.isPlayingToday ? handlePlayerToggle(player.id) : null}
                  className={`player-card p-4 ${
                    !player.isPlayingToday
                      ? 'player-card-inactive'
                      : player.isSelected
                      ? 'player-card-selected'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getRoleIcon(player.role)}</div>
                      <div>
                        <div className="font-black text-dream11-dark flex items-center space-x-2">
                          <span>{player.name}</span>
                          {player.isPlayingToday ? (
                            <span className="badge-active">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="badge-inactive">
                              INACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 font-bold uppercase tracking-wide">{player.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-dream11-dark">{player.credits}</div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Credits</div>
                    </div>
                  </div>
                  {player.selectionPercentage && (
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      {player.selectionPercentage}% selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-white font-bold">{selectedPlayers.length}/11</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-white font-bold">{totalCredits.toFixed(1)}/100</span>
            </div>
          </div>
          <button
            onClick={handleContinueToStrategy}
            disabled={selectedPlayers.length !== 11}
            className={`px-8 py-3 rounded-lg font-bold transition-colors uppercase tracking-wide ${
              selectedPlayers.length === 11
                ? 'bg-dream11-primary hover:bg-red-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Strategy
          </button>
        </div>
      </div>
    </div>
  )
}

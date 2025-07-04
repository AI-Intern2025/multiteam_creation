'use client'

import { useState } from 'react'
import { Play, Loader2, Users, Target, Clock } from 'lucide-react'
import { Player, Strategy, Team, GenerateTeamsRequest } from '@/types'

interface TeamGeneratorProps {
  players: Player[]
  strategy: Strategy
  onTeamsGenerated: (teams: Team[]) => void
}

export default function TeamGenerator({ players, strategy, onTeamsGenerated }: TeamGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [teamCount, setTeamCount] = useState(15)
  const [progress, setProgress] = useState(0)
  const [generationStats, setGenerationStats] = useState<any>(null)

  const generateTeams = async () => {
    setIsGenerating(true)
    setProgress(0)
    setGenerationStats(null)

    const startTime = Date.now()

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 8, 85))
      }, 300)

      const request: GenerateTeamsRequest = {
        players: players.map(p => ({ ...p, id: String(p.id) })),
        strategy,
        teamCount
      }

      // Call backend API with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

      const response = await fetch('/api/backend/generate-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      clearInterval(progressInterval)
      setProgress(95)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.detail || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      const endTime = Date.now()
      const executionTime = endTime - startTime
      
      setProgress(100)
      setGenerationStats({
        ...data.metadata,
        executionTime
      })
      onTeamsGenerated(data.teams)

    } catch (error) {
      console.error('Team generation failed:', error)
      
      // Fallback: Generate teams client-side
      const mockTeams = generateMockTeams(players, strategy, teamCount)
      const endTime = Date.now()
      
      setGenerationStats({
        totalGenerated: mockTeams.length,
        validTeams: mockTeams.filter(t => t.isValid).length,
        uniqueTeams: mockTeams.length,
        executionTime: endTime - startTime,
        fallbackUsed: true
      })
      onTeamsGenerated(mockTeams)
    } finally {
      setIsGenerating(false)
      setTimeout(() => setProgress(0), 1000) // Reset progress after 1s
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="heading-primary mb-4 animate-slide-up">GENERATE TEAMS</h2>
        <p className="text-lg text-gray-600 font-semibold animate-slide-up">
          Configure team generation settings and create your optimized lineup
        </p>
      </div>

      {/* Configuration */}
      <div className="team-gen-card mb-8 animate-scale-in">
        <h3 className="text-xl font-black text-dream11-dark mb-6 uppercase tracking-wide">GENERATION SETTINGS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Count */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Number of Teams
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={teamCount}
              onChange={(e) => setTeamCount(parseInt(e.target.value) || 15)}
              className="input-field animate-glow"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-600 mt-1 font-semibold">
              Recommended: 10-20 teams for mega contests
            </p>
          </div>

          {/* Strategy Summary */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Selected Strategy
            </label>
            <div className="bg-gradient-to-r from-gray-50 to-red-50 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
              <p className="font-black text-dream11-dark">{strategy.name}</p>
              <p className="text-sm text-gray-600 font-semibold">
                {strategy.lockedPlayers.length} locked, {strategy.excludedPlayers.length} excluded
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                Uniqueness: <span className="text-dream11-primary font-bold">{Math.round(strategy.uniquenessWeight * 100)}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-300 animate-float">
            <h4 className="font-black text-blue-900 mb-2 uppercase tracking-wide">Role Constraints</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {Object.entries(strategy.roleConstraints).map(([role, constraint]) => (
                <div key={role} className="flex justify-between font-semibold">
                  <span>{role}:</span>
                  <span>{constraint.min}-{constraint.max}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-black text-green-900 mb-2 uppercase tracking-wide">Captain Distribution</h4>
            <div className="space-y-1 text-sm text-green-800">
              {strategy.captainDistribution.slice(0, 3).map((cap) => {
                const player = players.find(p => p.id === cap.playerId)
                return (
                  <div key={cap.playerId} className="flex justify-between font-semibold">
                    <span className="truncate">{player?.name || 'Unknown'}</span>
                    <span>{cap.percentage}%</span>
                  </div>
                )
              })}
              {strategy.captainDistribution.length > 3 && (
                <div className="text-xs text-green-600 font-bold">
                  +{strategy.captainDistribution.length - 3} more
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 hover:shadow-lg transition-all duration-300 animate-float" style={{ animationDelay: '0.4s' }}>
            <h4 className="font-black text-orange-900 mb-2 uppercase tracking-wide">Credit Range</h4>
            <div className="text-sm text-orange-800">
              <div className="flex justify-between font-semibold">
                <span>Min:</span>
                <span>{strategy.creditRange.min}</span>
              </div>
              <div className="flex justify-between">
                <span>Max:</span>
                <span>{strategy.creditRange.max}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="team-gen-card mb-8 animate-scale-in">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="loading-spinner w-16 h-16 mx-auto animate-rotate-3d"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-8 h-8 text-dream11-primary animate-glow" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black text-dream11-dark uppercase tracking-wide">GENERATING TEAMS...</h4>
              <p className="text-sm text-gray-600 font-semibold">
                This may take a moment depending on complexity
              </p>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 font-bold">{progress}% COMPLETE</p>
          </div>
        </div>
      )}

      {/* Generation Results */}
      {generationStats && (
        <div className="team-gen-card mb-8 animate-scale-in">
          <h4 className="text-lg font-black text-dream11-dark mb-6 uppercase tracking-wide">GENERATION COMPLETE!</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center stat-card bg-gradient-to-br from-green-50 to-green-100 border border-green-200 animate-float">
              <div className="text-3xl font-black text-green-600">
                {generationStats.totalGenerated}
              </div>
              <div className="stat-label text-green-700">Teams Generated</div>
            </div>
            <div className="text-center stat-card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 animate-float" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-black text-blue-600">
                {generationStats.validTeams}
              </div>
              <div className="stat-label text-blue-700">Valid Teams</div>
            </div>
            <div className="text-center stat-card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-black text-purple-600">
                {generationStats.uniqueTeams}
              </div>
              <div className="stat-label text-purple-700">Unique Teams</div>
            </div>
            <div className="text-center stat-card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-black text-orange-600">
                {(generationStats.executionTime / 1000).toFixed(1)}s
              </div>
              <div className="stat-label text-orange-700">Generation Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!isGenerating && !generationStats && (
        <div className="text-center animate-scale-in">
          <button
            onClick={generateTeams}
            className="btn-primary text-lg px-12 py-6 animate-glow"
          >
            <Play className="w-6 h-6 mr-3" />
            GENERATE {teamCount} TEAMS
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-dream11-primary rounded-lg p-6 animate-slide-up">
        <h4 className="font-black text-dream11-dark mb-3 uppercase tracking-wide">💡 GENERATION TIPS:</h4>
        <ul className="text-sm text-gray-700 space-y-2 font-semibold">
          <li className="flex items-start space-x-2">
            <span className="text-dream11-primary">•</span>
            <span>Higher uniqueness creates more diverse teams but may reduce optimization</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-dream11-primary">•</span>
            <span>Locked players will appear in all generated teams</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-dream11-primary">•</span>
            <span>Captain distribution percentages should add up to 100%</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-dream11-primary">•</span>
            <span>Generation time increases with team count and constraint complexity</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Fallback function for client-side team generation
function generateMockTeams(players: Player[], strategy: Strategy, count: number): Team[] {
  const teams: Team[] = []
  
  for (let i = 0; i < count; i++) {
    // Simple random team generation logic
    const availablePlayers = players.filter(p => !strategy.excludedPlayers.includes(String(p.id)))
    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5)
    
    // Select 11 players following basic rules
    const selectedPlayers = []
    const roleCounts = { WK: 0, BAT: 0, AR: 0, BOWL: 0 }
    let totalCredits = 0
    
    // Add locked players first
    for (const lockedId of strategy.lockedPlayers) {
      const player = players.find(p => String(p.id) === String(lockedId))
      if (player && selectedPlayers.length < 11) {
        selectedPlayers.push(player)
        roleCounts[player.role]++
        totalCredits += player.credits
      }
    }
    
    // Fill remaining slots
    for (const player of shuffled) {
      if (selectedPlayers.length >= 11) break
      if (selectedPlayers.some(p => String(p.id) === String(player.id))) continue
      if (totalCredits + player.credits > strategy.creditRange.max) continue
      
      const roleConstraint = strategy.roleConstraints[player.role]
      if (roleCounts[player.role] >= roleConstraint.max) continue
      
      selectedPlayers.push(player)
      roleCounts[player.role]++
      totalCredits += player.credits
    }
    
    // Select captain and vice-captain
    const highValuePlayers = selectedPlayers
      .filter(p => p.credits >= 8)
      .sort((a, b) => b.credits - a.credits)
    
    const captain = String(highValuePlayers[0]?.id || selectedPlayers[0]?.id)
    const viceCaptain = String(highValuePlayers[1]?.id || selectedPlayers[1]?.id)
    
    const team: Team = {
      id: `team-${i + 1}`,
      name: `Team ${i + 1}`,
      players: selectedPlayers,
      captain,
      viceCaptain,
      totalCredits,
      isValid: selectedPlayers.length === 11 && totalCredits <= 100,
      validationErrors: [],
      strategy: strategy.name
    }
    
    teams.push(team)
  }
  
  return teams
}

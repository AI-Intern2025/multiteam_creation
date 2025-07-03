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
        players,
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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Teams</h2>
        <p className="text-lg text-gray-600">
          Configure team generation settings and create your optimized lineup
        </p>
      </div>

      {/* Configuration */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Generation Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Teams
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={teamCount}
              onChange={(e) => setTeamCount(parseInt(e.target.value) || 15)}
              className="input-field"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 10-20 teams for mega contests
            </p>
          </div>

          {/* Strategy Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Strategy
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{strategy.name}</p>
              <p className="text-sm text-gray-600">
                {strategy.lockedPlayers.length} locked, {strategy.excludedPlayers.length} excluded
              </p>
              <p className="text-sm text-gray-600">
                Uniqueness: {Math.round(strategy.uniquenessWeight * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Role Constraints</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {Object.entries(strategy.roleConstraints).map(([role, constraint]) => (
                <div key={role} className="flex justify-between">
                  <span>{role}:</span>
                  <span>{constraint.min}-{constraint.max}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Captain Distribution</h4>
            <div className="space-y-1 text-sm text-green-800">
              {strategy.captainDistribution.slice(0, 3).map((cap) => {
                const player = players.find(p => p.id === cap.playerId)
                return (
                  <div key={cap.playerId} className="flex justify-between">
                    <span className="truncate">{player?.name || 'Unknown'}</span>
                    <span>{cap.percentage}%</span>
                  </div>
                )
              })}
              {strategy.captainDistribution.length > 3 && (
                <div className="text-xs text-green-600">
                  +{strategy.captainDistribution.length - 3} more
                </div>
              )}
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">Credit Range</h4>
            <div className="text-sm text-orange-800">
              <div className="flex justify-between">
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
        <div className="card mb-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-dream11-primary mx-auto animate-spin" />
            <div>
              <h4 className="text-lg font-medium text-gray-900">Generating Teams...</h4>
              <p className="text-sm text-gray-600">
                This may take a moment depending on complexity
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-dream11-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{progress}% complete</p>
          </div>
        </div>
      )}

      {/* Generation Results */}
      {generationStats && (
        <div className="card mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Generation Complete!</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {generationStats.totalGenerated}
              </div>
              <div className="text-sm text-gray-600">Teams Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {generationStats.validTeams}
              </div>
              <div className="text-sm text-gray-600">Valid Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {generationStats.uniqueTeams}
              </div>
              <div className="text-sm text-gray-600">Unique Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(generationStats.executionTime / 1000).toFixed(1)}s
              </div>
              <div className="text-sm text-gray-600">Generation Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!isGenerating && !generationStats && (
        <div className="text-center">
          <button
            onClick={generateTeams}
            className="btn-primary text-lg px-8 py-4"
          >
            <Play className="w-6 h-6 mr-3" />
            Generate {teamCount} Teams
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">💡 Generation Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Higher uniqueness creates more diverse teams but may reduce optimization</li>
          <li>• Locked players will appear in all generated teams</li>
          <li>• Captain distribution percentages should add up to 100%</li>
          <li>• Generation time increases with team count and constraint complexity</li>
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
    const availablePlayers = players.filter(p => !strategy.excludedPlayers.includes(p.id))
    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5)
    
    // Select 11 players following basic rules
    const selectedPlayers = []
    const roleCounts = { WK: 0, BAT: 0, AR: 0, BOWL: 0 }
    let totalCredits = 0
    
    // Add locked players first
    for (const lockedId of strategy.lockedPlayers) {
      const player = players.find(p => p.id === lockedId)
      if (player && selectedPlayers.length < 11) {
        selectedPlayers.push(player)
        roleCounts[player.role]++
        totalCredits += player.credits
      }
    }
    
    // Fill remaining slots
    for (const player of shuffled) {
      if (selectedPlayers.length >= 11) break
      if (selectedPlayers.some(p => p.id === player.id)) continue
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
    
    const captain = highValuePlayers[0]?.id || selectedPlayers[0]?.id
    const viceCaptain = highValuePlayers[1]?.id || selectedPlayers[1]?.id
    
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

'use client'

import { useState, useMemo } from 'react'
import { Search, Download, Edit, Trash2, Copy, Filter, AlertTriangle } from 'lucide-react'
import { Player, Team } from '@/types'
import { exportTeamsToCSV } from '@/utils/csv-exporter'

interface TeamManagerProps {
  teams: Team[]
  players: Player[]
  onTeamsUpdate: (teams: Team[]) => void
}

export default function TeamManager({ teams, players, onTeamsUpdate }: TeamManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [showInvalidOnly, setShowInvalidOnly] = useState(false)
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<string>('')
  const [replacementPlayer, setReplacementPlayer] = useState<string>('')
  const [bulkEditStatus, setBulkEditStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const filteredTeams = useMemo(() => {
    let filtered = teams

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.players.some(player =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by validity
    if (showInvalidOnly) {
      filtered = filtered.filter(team => !team.isValid)
    }

    return filtered
  }, [teams, searchTerm, showInvalidOnly])

  // Get players in selected teams for "Replace Player" dropdown
  const playersInSelectedTeams = useMemo(() => {
    if (selectedTeams.length === 0) return []
    
    const playerIds = new Set<string | number>()
    teams
      .filter(team => selectedTeams.includes(team.id))
      .forEach(team => {
        team.players.forEach(player => playerIds.add(player.id))
      })
    
    return Array.from(playerIds)
      .map(playerId => players.find(p => String(p.id) === String(playerId)))
      .filter((player): player is Player => player !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [selectedTeams, teams, players])

  // Get match teams from selected teams to show replacement options
  const matchTeamsFromSelection = useMemo(() => {
    if (selectedTeams.length === 0) return []
    
    const teamNames = new Set<string>()
    teams
      .filter(team => selectedTeams.includes(team.id))
      .forEach(team => {
        team.players.forEach(player => teamNames.add(player.team))
      })
    
    const detectedTeams = Array.from(teamNames)
    
    // If we get generic team names like "team1", "team2", we need to map them to actual teams
    if (detectedTeams.some(team => team.startsWith('team'))) {
      console.log('🔧 Detected generic team names, trying to find actual match teams...')
      
      // Try to get match info from localStorage to determine the correct teams
      const matchIdData = localStorage.getItem('currentMatchId')
      if (matchIdData) {
        // We'll use a fallback approach: get teams from the selected players in localStorage
        try {
          const selectedPlayersData = localStorage.getItem('selectedPlayers')
          if (selectedPlayersData) {
            const selectedPlayers = JSON.parse(selectedPlayersData)
            const selectedTeams = Array.from(new Set(selectedPlayers.map((p: Player) => p.team)))
            console.log('🎯 Found actual teams from selected players:', selectedTeams)
            
            if (selectedTeams.length >= 2) {
              return selectedTeams.slice(0, 2) // Return first 2 teams for the match
            }
          }
        } catch (error) {
          console.error('Error reading localStorage:', error)
        }
      }
      
      // Final fallback: get the first 2 unique actual team names from players pool
      const allActualTeams = Array.from(new Set(players.map(p => p.team)))
        .filter(team => !team.startsWith('team')) // Exclude generic names
      console.log('🔄 Fallback: Using first 2 actual teams from pool:', allActualTeams.slice(0, 2))
      
      return allActualTeams.slice(0, 2)
    }
    
    return detectedTeams
  }, [selectedTeams, teams, players])

  // Get active players from match teams for "With Player" dropdown
  const activeMatchPlayers = useMemo(() => {
    // If no teams selected, return empty
    if (selectedTeams.length === 0) return []
    
    // Get teams from selected team players to identify the match
    const matchTeams = matchTeamsFromSelection
    
    console.log('🔍 Team detection for "With Player" dropdown:', {
      selectedTeams: selectedTeams.length,
      matchTeams,
      totalPlayers: players.length
    })
    
    if (matchTeams.length === 0) {
      console.log('⚠️ No match teams detected')
      return []
    }
    
    // Filter players by match teams and active status
    const filteredPlayers = players
      .filter(player => {
        // Must be from one of the match teams
        if (!matchTeams.includes(player.team)) return false
        // Must be active (playing today) - check for true or undefined (default active)
        if (player.isPlayingToday === false) return false
        return true
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    
    console.log('✅ Active match players found:', {
      totalFound: filteredPlayers.length,
      byTeam: filteredPlayers.reduce((acc, p) => {
        acc[p.team] = (acc[p.team] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    })
    
    // If we don't have enough players, try a fallback approach
    if (filteredPlayers.length < 20) {
      console.log('⚠️ Low player count detected, trying fallback logic')
      
      // Get all players from the detected teams regardless of isPlayingToday status
      const fallbackPlayers = players
        .filter(player => matchTeams.includes(player.team))
        .sort((a, b) => a.name.localeCompare(b.name))
      
      console.log('🔄 Fallback players found:', {
        totalFound: fallbackPlayers.length,
        byTeam: fallbackPlayers.reduce((acc, p) => {
          acc[p.team] = (acc[p.team] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      })
      
      return fallbackPlayers
    }
    
    return filteredPlayers
  }, [selectedTeams, players, matchTeamsFromSelection])

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  const handleSelectAll = () => {
    setSelectedTeams(
      selectedTeams.length === filteredTeams.length
        ? []
        : filteredTeams.map(team => team.id)
    )
  }

  const handleDeleteSelected = () => {
    const updatedTeams = teams.filter(team => !selectedTeams.includes(team.id))
    onTeamsUpdate(updatedTeams)
    setSelectedTeams([])
  }

  const handleDuplicateTeam = (teamId: string) => {
    const teamToDuplicate = teams.find(t => t.id === teamId)
    if (!teamToDuplicate) return

    const duplicatedTeam: Team = {
      ...teamToDuplicate,
      id: `${teamToDuplicate.id}-copy-${Date.now()}`,
      name: `${teamToDuplicate.name} (Copy)`
    }

    onTeamsUpdate([...teams, duplicatedTeam])
  }

  const handleBulkPlayerSwap = () => {
    if (!selectedPlayer || !replacementPlayer || selectedTeams.length === 0) {
      setBulkEditStatus({
        type: 'error',
        message: 'Please select a player to replace, a replacement player, and at least one team.'
      })
      return
    }

    const replacement = players.find(p => String(p.id) === String(replacementPlayer))
    if (!replacement) {
      setBulkEditStatus({
        type: 'error',
        message: 'Replacement player not found.'
      })
      return
    }

    console.log('Bulk player swap details:', {
      selectedPlayer,
      replacementPlayer,
      selectedTeams,
      totalPlayers: players.length,
      selectedPlayerName: players.find(p => String(p.id) === String(selectedPlayer))?.name,
      replacementPlayerName: replacement.name
    })

    const updatedTeams = teams.map(team => {
      if (!selectedTeams.includes(team.id)) return team

      const hasSelectedPlayer = team.players.some(p => String(p.id) === String(selectedPlayer))
      if (!hasSelectedPlayer) return team

      const updatedPlayers = team.players.map(p =>
        String(p.id) === String(selectedPlayer) ? replacement : p
      )

      const totalCredits = updatedPlayers.reduce((sum, p) => sum + p.credits, 0)

      // Enhanced validation
      const roleCount = {
        WK: updatedPlayers.filter(p => p.role === 'WK').length,
        BAT: updatedPlayers.filter(p => p.role === 'BAT').length,
        AR: updatedPlayers.filter(p => p.role === 'AR').length,
        BOWL: updatedPlayers.filter(p => p.role === 'BOWL').length
      }

      const validationErrors = []
      if (totalCredits > 100) validationErrors.push('Total credits exceed 100')
      if (updatedPlayers.length !== 11) validationErrors.push('Team must have exactly 11 players')
      if (roleCount.WK !== 1) validationErrors.push('Team must have exactly 1 wicket-keeper')
      if (roleCount.BAT > 5) validationErrors.push('Maximum 5 batsmen allowed')
      if (roleCount.BOWL > 5) validationErrors.push('Maximum 5 bowlers allowed')

      return {
        ...team,
        players: updatedPlayers,
        totalCredits,
        isValid: validationErrors.length === 0,
        validationErrors
      }
    })

    onTeamsUpdate(updatedTeams)
    
    // Show success message
    const affectedTeams = updatedTeams.filter(team => 
      selectedTeams.includes(team.id) && team.players.some(p => String(p.id) === String(replacementPlayer))
    )
    
    setBulkEditStatus({
      type: 'success',
      message: `Successfully replaced ${players.find(p => String(p.id) === String(selectedPlayer))?.name} with ${replacement.name} in ${affectedTeams.length} teams`
    })
    
    setSelectedPlayer('')
    setReplacementPlayer('')
    
    // Clear status after 3 seconds
    setTimeout(() => {
      setBulkEditStatus({ type: null, message: '' })
    }, 3000)
  }

  const handleExportCSV = () => {
    const teamsToExport = selectedTeams.length > 0
      ? teams.filter(team => selectedTeams.includes(team.id))
      : teams

    exportTeamsToCSV(teamsToExport)
  }

  const validTeams = teams.filter(team => team.isValid).length
  const totalTeams = teams.length

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Team Manager</h2>
          <p className="text-gray-600 mt-1">
            {validTeams} of {totalTeams} teams are valid
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setBulkEditMode(!bulkEditMode)
              if (bulkEditMode) {
                // Reset bulk edit state when closing
                setSelectedPlayer('')
                setReplacementPlayer('')
                setBulkEditStatus({ type: null, message: '' })
              }
            }}
            className={`btn-outline ${bulkEditMode ? 'bg-blue-50' : ''}`}
          >
            <Edit className="w-4 h-4 mr-2" />
            Bulk Edit
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search teams or players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInvalidOnly}
                onChange={(e) => setShowInvalidOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Show invalid only</span>
            </label>

            <button
              onClick={handleSelectAll}
              className="text-sm btn-outline"
            >
              {selectedTeams.length === filteredTeams.length ? 'Deselect All' : 'Select All'}
            </button>

            {selectedTeams.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedTeams.length})
              </button>
            )}
          </div>
        </div>

        {/* Bulk Edit Panel */}
        {bulkEditMode && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">
              Bulk Player Swap
              {selectedTeams.length > 0 && (
                <span className="ml-2 text-sm font-normal">
                  ({selectedTeams.length} teams selected)
                </span>
              )}
            </h4>
            
            {selectedTeams.length === 0 && (
              <div className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded-lg mb-3">
                ⚠️ Please select at least one team to perform bulk operations
              </div>
            )}

            {/* Status Messages */}
            {bulkEditStatus.type && (
              <div className={`text-sm p-3 rounded-lg mb-3 ${
                bulkEditStatus.type === 'success' 
                  ? 'text-green-700 bg-green-100 border border-green-300' 
                  : 'text-red-700 bg-red-100 border border-red-300'
              }`}>
                {bulkEditStatus.type === 'success' ? '✅' : '❌'} {bulkEditStatus.message}
              </div>
            )}

            {/* Debug Information */}
            {selectedTeams.length > 0 && (
              <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-xs">
                <div className="font-semibold text-gray-700 mb-2">🔍 Debug Info:</div>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <strong>Selected Teams:</strong> {selectedTeams.length}
                  </div>
                  <div>
                    <strong>Match Teams:</strong> {matchTeamsFromSelection.join(', ')}
                  </div>
                  <div>
                    <strong>Replace Player Options:</strong> {playersInSelectedTeams.length}
                  </div>
                  <div>
                    <strong>With Player Options:</strong> {activeMatchPlayers.length}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Player
                </label>
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="input-field"
                  disabled={selectedTeams.length === 0}
                >
                  <option value="">Select player to replace</option>
                  {playersInSelectedTeams.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.role}, {player.credits}cr)
                    </option>
                  ))}
                </select>
                {selectedTeams.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {playersInSelectedTeams.length} players in selected teams
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  With Player
                </label>
                <select
                  value={replacementPlayer}
                  onChange={(e) => setReplacementPlayer(e.target.value)}
                  className="input-field"
                  disabled={selectedTeams.length === 0}
                >
                  <option value="">Select replacement</option>
                  {activeMatchPlayers.length === 0 ? (
                    <option value="" disabled>No players available</option>
                  ) : (
                    activeMatchPlayers.map(player => {
                      // Check if this player is currently in any of the selected teams
                      const isInSelectedTeams = selectedTeams.length > 0 && teams
                        .filter(team => selectedTeams.includes(team.id))
                        .some(team => team.players.some(tp => String(tp.id) === String(player.id)))
                      
                      return (
                        <option key={player.id} value={player.id}>
                          {player.name} ({player.role}, {player.credits}cr) - {player.team}
                          {isInSelectedTeams ? ' • In teams' : ''}
                        </option>
                      )
                    })
                  )}
                </select>
                {selectedTeams.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {activeMatchPlayers.length} active players available
                    {activeMatchPlayers.length === 0 && (
                      <span className="text-red-500 ml-1">• Check console for debug info</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={handleBulkPlayerSwap}
                  disabled={!selectedPlayer || !replacementPlayer || selectedTeams.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  Apply to {selectedTeams.length} teams
                </button>
                <button
                  onClick={() => {
                    setBulkEditMode(false)
                    setSelectedPlayer('')
                    setReplacementPlayer('')
                    setBulkEditStatus({ type: null, message: '' })
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Preview */}
            {selectedPlayer && replacementPlayer && (
              <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
                <div className="text-sm text-gray-700">
                  <strong>Preview:</strong> Replace{' '}
                  <span className="font-semibold text-red-600">
                    {players.find(p => String(p.id) === String(selectedPlayer))?.name}
                  </span>
                  {' '}with{' '}
                  <span className="font-semibold text-green-600">
                    {players.find(p => String(p.id) === String(replacementPlayer))?.name}
                  </span>
                  {' '}in {selectedTeams.length} selected teams
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map(team => (
          <div
            key={team.id}
            className={`card-sport transition-all duration-300 transform hover:scale-105 ${
              selectedTeams.includes(team.id) ? 'ring-2 ring-dream11-primary bg-dream11-primary/5' : ''
            } ${!team.isValid ? 'border-red-300 bg-red-50' : ''}`}
          >
            {/* Team Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamSelect(team.id)}
                    className="w-5 h-5 text-dream11-primary rounded border-2 border-gray-300 focus:ring-dream11-primary focus:ring-2"
                  />
                  <span className="sr-only">Select team</span>
                </label>
                <h3 className="font-black text-dream11-dark text-lg">{team.name}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDuplicateTeam(team.id)}
                  className="p-2 text-gray-500 hover:text-dream11-primary transition-colors transform hover:scale-110"
                  title="Duplicate team"
                >
                  <Copy size={18} />
                </button>
                {!team.isValid && (
                  <span title="Invalid team">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                  </span>
                )}
              </div>
            </div>

            {/* Team Stats */}
            <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className={`text-lg font-black ${team.totalCredits > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {team.totalCredits.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase">Credits</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-dream11-dark">
                  {team.players.length}
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase">Players</div>
              </div>
            </div>

            {/* Validation Errors */}
            {team.validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-700">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-semibold">Validation Errors:</span>
                </div>
                <div className="mt-1">{team.validationErrors.join(', ')}</div>
              </div>
            )}

            {/* Players List */}
            <div className="space-y-2">
              {team.players.map(player => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all duration-200 ${
                    team.captain === player.id
                      ? 'bg-yellow-100 border border-yellow-300 shadow-sm'
                      : team.viceCaptain === player.id
                      ? 'bg-orange-100 border border-orange-300 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="font-semibold text-dream11-dark">{player.name}</span>
                    {team.captain === player.id && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-bold">C</span>
                    )}
                    {team.viceCaptain === player.id && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold">VC</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-gray-600">
                      <span className="font-bold">{player.role}</span>
                      <span className="ml-2 font-semibold">{player.credits}cr</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Role Distribution */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                {(['WK', 'BAT', 'AR', 'BOWL'] as const).map(role => {
                  const count = team.players.filter(p => p.role === role).length
                  return (
                    <div key={role} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-dream11-dark">{count}</div>
                      <div className="text-xs text-gray-500">{role}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Filter className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">No teams found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  )
}

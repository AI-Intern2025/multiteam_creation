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
    if (!selectedPlayer || !replacementPlayer) return

    const updatedTeams = teams.map(team => {
      if (!selectedTeams.includes(team.id)) return team

      const hasSelectedPlayer = team.players.some(p => p.id === selectedPlayer)
      if (!hasSelectedPlayer) return team

      const replacement = players.find(p => p.id === replacementPlayer)
      if (!replacement) return team

      const updatedPlayers = team.players.map(p =>
        p.id === selectedPlayer ? replacement : p
      )

      const totalCredits = updatedPlayers.reduce((sum, p) => sum + p.credits, 0)

      return {
        ...team,
        players: updatedPlayers,
        totalCredits,
        isValid: totalCredits <= 100 && updatedPlayers.length === 11,
        validationErrors: totalCredits > 100 ? ['Total credits exceed 100'] : []
      }
    })

    onTeamsUpdate(updatedTeams)
    setSelectedPlayer('')
    setReplacementPlayer('')
    setBulkEditMode(false)
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
            onClick={() => setBulkEditMode(!bulkEditMode)}
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
            <h4 className="font-medium text-blue-900 mb-3">Bulk Player Swap</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Player
                </label>
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select player to replace</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.role}, {player.credits}cr)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  With Player
                </label>
                <select
                  value={replacementPlayer}
                  onChange={(e) => setReplacementPlayer(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select replacement</option>
                  {players
                    .filter(p => p.id !== selectedPlayer)
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({player.role}, {player.credits}cr)
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleBulkPlayerSwap}
                  disabled={!selectedPlayer || !replacementPlayer || selectedTeams.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply to {selectedTeams.length} teams
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map(team => (
          <div
            key={team.id}
            className={`card transition-all duration-200 ${
              selectedTeams.includes(team.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            } ${!team.isValid ? 'border-red-300 bg-red-50' : ''}`}
          >
            {/* Team Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={() => handleTeamSelect(team.id)}
                  className="rounded border-gray-300"
                />
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDuplicateTeam(team.id)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Duplicate team"
                >
                  <Copy size={16} />
                </button>
                {!team.isValid && (
                  <span title="Invalid team">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </span>
                )}
              </div>
            </div>

            {/* Team Stats */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className={`font-medium ${team.totalCredits > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {team.totalCredits.toFixed(1)} credits
              </span>
              <span className="text-gray-500">
                {team.players.length} players
              </span>
            </div>

            {/* Validation Errors */}
            {team.validationErrors.length > 0 && (
              <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
                {team.validationErrors.join(', ')}
              </div>
            )}

            {/* Players List */}
            <div className="space-y-2">
              {team.players.map(player => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    team.captain === player.id
                      ? 'bg-yellow-100 border border-yellow-300'
                      : team.viceCaptain === player.id
                      ? 'bg-orange-100 border border-orange-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{player.name}</span>
                    {team.captain === player.id && (
                      <span className="text-xs bg-yellow-500 text-white px-1 rounded">C</span>
                    )}
                    {team.viceCaptain === player.id && (
                      <span className="text-xs bg-orange-500 text-white px-1 rounded">VC</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>{player.role}</span>
                    <span>{player.credits}cr</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Role Distribution */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-600">
                {(['WK', 'BAT', 'AR', 'BOWL'] as const).map(role => {
                  const count = team.players.filter(p => p.role === role).length
                  return (
                    <span key={role} className="flex items-center space-x-1">
                      <span>{role}:</span>
                      <span className="font-medium">{count}</span>
                    </span>
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

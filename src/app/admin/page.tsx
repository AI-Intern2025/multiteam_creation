'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Upload, Plus, Edit, Trash2, Calendar, Users, Trophy, Activity } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Match } from '@/types'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddMatch, setShowAddMatch] = useState(false)
  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    format: 'T20',
    venue: '',
    matchDate: '',
    startTime: '',
    endTime: '',
    isActive: true,
    isUpcoming: true,
    status: 'scheduled' as const
  })

  useEffect(() => {
    loadMatches()
  }, [])

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
      // Fallback to mock data
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
          venue: 'Lord\'s Cricket Ground, London',
          matchDate: '2025-07-05T10:00:00Z',
          startTime: '2025-07-05T07:30:00Z',
          endTime: '2025-07-05T10:00:00Z',
          isActive: false,
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
        }
      ]
      setMatches(mockMatches)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMatch,
          createdBy: user?.id
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMatches(prev => [...prev, data.match])
        setNewMatch({
          team1: '',
          team2: '',
          format: 'T20',
          venue: '',
          matchDate: '',
          startTime: '',
          endTime: '',
          isActive: true,
          isUpcoming: true,
          status: 'scheduled'
        })
        setShowAddMatch(false)
        toast.success('Match added successfully!')
      } else {
        throw new Error('Failed to add match')
      }
    } catch (error) {
      console.error('Error adding match:', error)
      toast.error('Failed to add match')
    }
  }

  const toggleMatchStatus = async (matchId: number) => {
    try {
      const match = matches.find(m => m.id === matchId)
      if (!match) return

      const response = await fetch('/api/matches', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: matchId,
          isActive: !match.isActive
        })
      })

      if (response.ok) {
        setMatches(prev => 
          prev.map(m => 
            m.id === matchId 
              ? { ...m, isActive: !m.isActive }
              : m
          )
        )
        toast.success('Match status updated!')
      } else {
        throw new Error('Failed to update match')
      }
    } catch (error) {
      console.error('Error updating match:', error)
      toast.error('Failed to update match status')
    }
  }

  const deleteMatch = async (matchId: number) => {
    if (!confirm('Are you sure you want to delete this match?')) return
    
    try {
      const response = await fetch(`/api/matches?id=${matchId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMatches(prev => prev.filter(m => m.id !== matchId))
        toast.success('Match deleted successfully!')
      } else {
        throw new Error('Failed to delete match')
      }
    } catch (error) {
      console.error('Error deleting match:', error)
      toast.error('Failed to delete match')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMatchStatus = (match: Match) => {
    const now = new Date()
    const matchDate = new Date(match.matchDate)
    const startTime = new Date(match.startTime)
    const endTime = new Date(match.endTime)

    if (match.status === 'live') return 'Live'
    if (match.status === 'completed') return 'Completed'
    if (match.status === 'cancelled') return 'Cancelled'
    if (now < startTime) return 'Upcoming'
    if (now >= startTime && now <= endTime) return 'Open for Teams'
    if (now > endTime && now < matchDate) return 'Teams Closed'
    return 'Scheduled'
  }

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dream11-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage matches and system settings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{matches.filter(m => m.isActive).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Upcoming Matches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {matches.filter(m => m.isUpcoming && new Date(m.matchDate) > new Date()).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Live Matches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {matches.filter(m => m.status === 'live').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Matches Management</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/upload')}
                className="flex items-center space-x-2 px-4 py-2 bg-dream11-primary text-white rounded-lg hover:bg-dream11-accent transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Screenshot</span>
              </button>
              <button
                onClick={() => setShowAddMatch(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Match</span>
              </button>
            </div>
          </div>

          {/* Add Match Modal */}
          {showAddMatch && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add New Match</h3>
                <form onSubmit={handleAddMatch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Team 1 (e.g., WI)"
                      value={newMatch.team1}
                      onChange={(e) => setNewMatch(prev => ({ ...prev, team1: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Team 2 (e.g., AUS)"
                      value={newMatch.team2}
                      onChange={(e) => setNewMatch(prev => ({ ...prev, team2: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                      required
                    />
                  </div>
                  <select
                    value={newMatch.format}
                    onChange={(e) => setNewMatch(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                  >
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="TEST">TEST</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Venue"
                    value={newMatch.venue}
                    onChange={(e) => setNewMatch(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                    required
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Match Date</label>
                    <input
                      type="datetime-local"
                      value={newMatch.matchDate}
                      onChange={(e) => setNewMatch(prev => ({ ...prev, matchDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Team Creation Opens</label>
                      <input
                        type="datetime-local"
                        value={newMatch.startTime}
                        onChange={(e) => setNewMatch(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Team Creation Closes</label>
                      <input
                        type="datetime-local"
                        value={newMatch.endTime}
                        onChange={(e) => setNewMatch(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newMatch.isActive}
                      onChange={(e) => setNewMatch(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-dream11-primary"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">Active Match</label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddMatch(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-dream11-primary text-white rounded-lg hover:bg-dream11-accent"
                    >
                      Add Match
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Matches Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Creation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{match.team1} vs {match.team2}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          match.format === 'T20' ? 'bg-blue-100 text-blue-800' :
                          match.format === 'ODI' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {match.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.venue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(match.matchDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="text-xs">
                          <div>Opens: {formatDate(match.startTime)}</div>
                          <div>Closes: {formatDate(match.endTime)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          match.status === 'live' ? 'bg-red-100 text-red-800' :
                          match.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          getMatchStatus(match) === 'Open for Teams' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getMatchStatus(match)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleMatchStatus(match.id)}
                            className={`px-3 py-1 text-xs rounded ${
                              match.isActive 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {match.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteMatch(match.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

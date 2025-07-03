'use client'

import { Calendar, Clock, Users, MapPin, Trophy } from 'lucide-react'

interface Match {
  id: number
  team1: string
  team2: string
  format: string
  venue: string
  matchDate: string
  isActive: boolean
}

interface MatchCardProps {
  match: Match
  onCreateTeams: (matchId: number) => void
}

export default function MatchCard({ match, onCreateTeams }: MatchCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTeamFlag = (team: string) => {
    const flags: Record<string, string> = {
      'WI': '🇼🇸',
      'AUS': '🇦🇺',
      'IND': '🇮🇳',
      'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'PAK': '🇵🇰',
      'SA': '🇿🇦',
      'NZ': '🇳🇿',
      'SL': '🇱🇰',
      'BAN': '🇧🇩',
      'AFG': '🇦🇫'
    }
    return flags[team] || '🏏'
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'T20': return 'bg-blue-600 text-white'
      case 'ODI': return 'bg-dream11-accent text-white'
      case 'TEST': return 'bg-purple-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className="match-card">
      {/* Match Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getFormatColor(match.format)}`}>
            {match.format}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            match.isActive 
              ? 'bg-dream11-accent text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {match.isActive ? 'LIVE' : 'UPCOMING'}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-dream11-primary to-red-600 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
              <span className="text-2xl">{getTeamFlag(match.team1)}</span>
            </div>
            <span className="text-lg font-black text-dream11-dark uppercase tracking-wide">{match.team1}</span>
          </div>
          
          <div className="text-center px-6">
            <div className="text-gray-500 text-sm mb-1 font-bold uppercase">VS</div>
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
          </div>
          
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-dream11-primary to-red-600 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
              <span className="text-2xl">{getTeamFlag(match.team2)}</span>
            </div>
            <span className="text-lg font-black text-dream11-dark uppercase tracking-wide">{match.team2}</span>
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="p-6 space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
          <Calendar className="w-4 h-4 text-dream11-primary" />
          <span>{formatDate(match.matchDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
          <Clock className="w-4 h-4 text-dream11-primary" />
          <span>{formatTime(match.matchDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
          <MapPin className="w-4 h-4 text-dream11-primary" />
          <span className="truncate">{match.venue}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 pt-0">
        <button
          onClick={() => onCreateTeams(match.id)}
          disabled={!match.isActive}
          className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-300 uppercase tracking-wide ${
            match.isActive
              ? 'btn-primary'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {match.isActive ? (
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>CREATE TEAMS</span>
            </div>
          ) : (
            'MATCH INACTIVE'
          )}
        </button>
      </div>
    </div>
  )
}

'use client'

import { Calendar, Clock, Users, MapPin, Trophy, Timer } from 'lucide-react'
import { useState, useEffect } from 'react'

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

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function MatchCard({ match, onCreateTeams }: MatchCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const matchTime = new Date(match.matchDate).getTime()
      const distance = matchTime - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [match.matchDate])

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
    <div 
      className={`match-card transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isHovered ? 'shadow-dream11-glow' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Match Header */}
      <div className="p-6 border-b border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dream11-primary/5 to-dream11-accent/5 animate-pulse"></div>
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getFormatColor(match.format)} animate-bounce`}>
            {match.format}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            match.isActive 
              ? 'bg-dream11-accent text-white animate-pulse' 
              : 'bg-gray-500 text-white'
          }`}>
            {match.isActive ? 'LIVE' : 'UPCOMING'}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between relative z-10">
          <div className="text-center flex-1">
            <div className={`w-16 h-16 bg-gradient-to-br from-dream11-primary to-red-600 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg transform transition-all duration-300 ${
              isHovered ? 'animate-spin-slow' : ''
            }`}>
              <span className="text-2xl">{getTeamFlag(match.team1)}</span>
            </div>
            <span className="text-lg font-black text-dream11-dark uppercase tracking-wide">{match.team1}</span>
          </div>
          
          <div className="text-center px-6">
            <div className="text-gray-500 text-sm mb-1 font-bold uppercase">VS</div>
            <Trophy className={`w-8 h-8 text-yellow-500 mx-auto transform transition-all duration-300 ${
              isHovered ? 'animate-bounce' : ''
            }`} />
          </div>
          
          <div className="text-center flex-1">
            <div className={`w-16 h-16 bg-gradient-to-br from-dream11-primary to-red-600 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg transform transition-all duration-300 ${
              isHovered ? 'animate-spin-slow' : ''
            }`}>
              <span className="text-2xl">{getTeamFlag(match.team2)}</span>
            </div>
            <span className="text-lg font-black text-dream11-dark uppercase tracking-wide">{match.team2}</span>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      {!match.isActive && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
        <div className="p-4 bg-gradient-to-r from-dream11-primary/10 to-dream11-accent/10 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-1 text-sm font-bold text-dream11-dark">
            <Timer className="w-4 h-4 text-dream11-primary animate-pulse" />
            <span className="text-xs uppercase tracking-wide">Starts in:</span>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-2">
            {timeLeft.days > 0 && (
              <div className="text-center">
                <div className="text-xl font-black text-dream11-primary">{timeLeft.days}</div>
                <div className="text-xs text-gray-600 uppercase">Days</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-xl font-black text-dream11-primary">{timeLeft.hours}</div>
              <div className="text-xs text-gray-600 uppercase">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-dream11-primary">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-600 uppercase">Min</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-dream11-primary animate-pulse">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-600 uppercase">Sec</div>
            </div>
          </div>
        </div>
      )}

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
          className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-300 uppercase tracking-wide transform hover:scale-105 ${
            match.isActive
              ? 'btn-primary hover:shadow-2xl active:scale-95'
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

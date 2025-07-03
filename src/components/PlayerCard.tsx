'use client'

import { useState } from 'react'
import { Star, StarOff, Lock, Unlock } from 'lucide-react'

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
  isSelected?: boolean
  isCaptain?: boolean
  isViceCaptain?: boolean
}

interface PlayerCardProps {
  player: Player
  onSelect?: (playerId: string) => void
  onToggleCaptain?: (playerId: string) => void
  onToggleViceCaptain?: (playerId: string) => void
  onToggleLock?: (playerId: string) => void
  showCaptainOptions?: boolean
  disabled?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export default function PlayerCard({
  player,
  onSelect,
  onToggleCaptain,
  onToggleViceCaptain,
  onToggleLock,
  showCaptainOptions = false,
  disabled = false,
  variant = 'default'
}: PlayerCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'WK': return '🧤'
      case 'BAT': return '🏏'
      case 'AR': return '⚡'
      case 'BOWL': return '🎯'
      default: return '👤'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'WK': return 'bg-blue-600'
      case 'BAT': return 'bg-green-600'
      case 'AR': return 'bg-purple-600'
      case 'BOWL': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getTeamColor = (team: string) => {
    switch (team) {
      case 'WI': return 'bg-yellow-600'
      case 'AUS': return 'bg-green-600'
      case 'IND': return 'bg-blue-600'
      case 'ENG': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`p-2 rounded border ${
        player.isSelected
          ? 'border-red-500 bg-red-900/20'
          : 'border-gray-700 bg-gray-800'
      } ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getRoleIcon(player.role)}</span>
            <div>
              <div className="font-medium text-sm">{player.name}</div>
              <div className="text-xs text-gray-400">{player.role}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">{player.credits}</div>
            <div className="text-xs text-gray-400">cr</div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-4 rounded-lg border-2 transition-all ${
        player.isSelected
          ? 'border-red-500 bg-red-900/20'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onSelect?.(player.id)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getTeamColor(player.team)}`}>
                {player.team}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${getRoleColor(player.role)}`}>
                {player.role}
              </div>
            </div>
            <div>
              <div className="font-semibold text-lg">{player.name}</div>
              {player.fullName && player.fullName !== player.name && (
                <div className="text-sm text-gray-400">{player.fullName}</div>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-400">{player.country}</span>
                {player.selectionPercentage && (
                  <span className="text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded">
                    {player.selectionPercentage}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{player.credits}</div>
            <div className="text-sm text-gray-400">Credits</div>
            {player.points && (
              <div className="text-sm text-green-400 mt-1">{player.points} pts</div>
            )}
          </div>
        </div>

        {showCaptainOptions && player.isSelected && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-700">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleCaptain?.(player.id)
              }}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                player.isCaptain 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Captain</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleViceCaptain?.(player.id)
              }}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                player.isViceCaptain 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <StarOff className="w-4 h-4" />
              <span>VC</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        player.isSelected
          ? 'border-red-500 bg-red-900/20'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect?.(player.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getRoleIcon(player.role)}</div>
          <div>
            <div className="font-semibold">{player.name}</div>
            <div className="text-sm text-gray-400">{player.role}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{player.credits}</div>
          <div className="text-xs text-gray-400">Credits</div>
        </div>
      </div>
      {player.selectionPercentage && (
        <div className="mt-2 text-xs text-gray-400">
          {player.selectionPercentage}% selected
        </div>
      )}
    </div>
  )
}

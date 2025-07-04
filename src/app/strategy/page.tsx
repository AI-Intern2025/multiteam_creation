'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import StrategySelector from '@/components/StrategySelector'
import { Player, Strategy } from '@/types'

export default function StrategyPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load selected players from localStorage
    const selectedPlayersData = localStorage.getItem('selectedPlayers')
    if (selectedPlayersData) {
      try {
        const selectedPlayers = JSON.parse(selectedPlayersData)
        setPlayers(selectedPlayers)
      } catch (error) {
        console.error('Failed to load selected players:', error)
        // Redirect back to home if no valid data
        router.push('/')
        return
      }
    } else {
      // No selected players, redirect to home
      router.push('/')
      return
    }
    setLoading(false)
  }, [router])

  const handleStrategySelected = (strategy: Strategy) => {
    // Store strategy and navigate to team generation
    localStorage.setItem('selectedStrategy', JSON.stringify(strategy))
    localStorage.setItem('selectedPlayers', JSON.stringify(players))
    
    // Navigate to teams page
    router.push('/teams')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-dream11-dark text-xl font-bold">Loading strategy options...</div>
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-dream11-primary text-xl mb-4 font-bold">No players selected</div>
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
                <h1 className="heading-secondary text-white">STRATEGY SELECTION</h1>
                <p className="text-gray-300 font-semibold">Choose your team generation strategy</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-white">{players.length} PLAYERS SELECTED</div>
              <div className="text-sm text-gray-300 font-semibold">
                {players.reduce((sum, p) => sum + p.credits, 0).toFixed(1)} CREDITS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Selected Players Summary */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h3 className="heading-accent mb-4 text-center">SELECTED PLAYERS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {players.map((player) => (
              <div key={player.id} className="bg-white rounded-lg p-3 text-sm border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="font-black text-dream11-dark truncate">{player.name}</div>
                <div className="text-gray-600 text-xs font-semibold">{player.role} • {player.credits}cr</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Selector */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200">
          <StrategySelector
            players={players}
            onStrategySelected={handleStrategySelected}
          />
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Settings, Lock, X, Plus, Minus } from 'lucide-react'
import { Player, Strategy, RoleConstraints, CaptainDistribution } from '@/types'

interface StrategySelectorProps {
  players: Player[]
  onStrategySelected: (strategy: Strategy) => void
}

const PRESET_STRATEGIES = {
  stack_team1: {
    name: 'Stack Team 1',
    description: 'Favor players from the first team',
    roleConstraints: { WK: { min: 1, max: 1 }, BAT: { min: 3, max: 5 }, AR: { min: 1, max: 3 }, BOWL: { min: 3, max: 5 } },
    uniquenessWeight: 0.3,
    narratives: ['Team 1 dominates', 'Strong batting lineup']
  },
  allrounder_focus: {
    name: 'All-Rounder Focus',
    description: 'Prioritize all-rounders for balanced teams',
    roleConstraints: { WK: { min: 1, max: 1 }, BAT: { min: 2, max: 4 }, AR: { min: 2, max: 4 }, BOWL: { min: 3, max: 5 } },
    uniquenessWeight: 0.5,
    narratives: ['Balanced attack', 'All-rounders shine']
  },
  safe_picks: {
    name: 'Safe Picks',
    description: 'Conservative strategy with proven performers',
    roleConstraints: { WK: { min: 1, max: 1 }, BAT: { min: 3, max: 4 }, AR: { min: 1, max: 2 }, BOWL: { min: 3, max: 4 } },
    uniquenessWeight: 0.1,
    narratives: ['Play it safe', 'Consistent performers']
  }
}

export default function StrategySelector({ players, onStrategySelected }: StrategySelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customStrategy, setCustomStrategy] = useState<Strategy>({
    id: 'custom-' + Date.now(),
    name: 'Custom Strategy',
    lockedPlayers: [],
    excludedPlayers: [],
    captainDistribution: [],
    roleConstraints: { WK: { min: 1, max: 1 }, BAT: { min: 3, max: 5 }, AR: { min: 1, max: 3 }, BOWL: { min: 3, max: 5 } },
    creditRange: { min: 95, max: 100 },
    uniquenessWeight: 0.5,
    narratives: []
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [captainPercentages, setCaptainPercentages] = useState<Record<string, number>>({})

  useEffect(() => {
    // Initialize captain distribution with top players
    const topPlayers = players
      .filter(p => p.credits >= 8)
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 5)
    
    const initialPercentages: Record<string, number> = {}
    topPlayers.forEach((player, index) => {
      initialPercentages[player.id] = index === 0 ? 40 : 15
    })
    
    setCaptainPercentages(initialPercentages)
  }, [players])

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey)
    const preset = PRESET_STRATEGIES[presetKey as keyof typeof PRESET_STRATEGIES]
    
    const strategy: Strategy = {
      id: 'preset-' + presetKey + '-' + Date.now(),
      name: preset.name,
      preset: presetKey as any,
      lockedPlayers: [],
      excludedPlayers: [],
      captainDistribution: Object.entries(captainPercentages)
        .filter(([_, percentage]) => percentage > 0)
        .map(([playerId, percentage]) => ({ playerId, percentage })),
      roleConstraints: preset.roleConstraints,
      creditRange: { min: 95, max: 100 },
      uniquenessWeight: preset.uniquenessWeight,
      narratives: preset.narratives
    }
    
    setCustomStrategy(strategy)
  }

  const handlePlayerLock = (playerId: string) => {
    setCustomStrategy(prev => ({
      ...prev,
      lockedPlayers: prev.lockedPlayers.includes(playerId)
        ? prev.lockedPlayers.filter(id => id !== playerId)
        : [...prev.lockedPlayers, playerId],
      excludedPlayers: prev.excludedPlayers.filter(id => id !== playerId)
    }))
  }

  const handlePlayerExclude = (playerId: string) => {
    setCustomStrategy(prev => ({
      ...prev,
      excludedPlayers: prev.excludedPlayers.includes(playerId)
        ? prev.excludedPlayers.filter(id => id !== playerId)
        : [...prev.excludedPlayers, playerId],
      lockedPlayers: prev.lockedPlayers.filter(id => id !== playerId)
    }))
  }

  const handleRoleConstraintChange = (role: keyof RoleConstraints, type: 'min' | 'max', value: number) => {
    setCustomStrategy(prev => ({
      ...prev,
      roleConstraints: {
        ...prev.roleConstraints,
        [role]: {
          ...prev.roleConstraints[role],
          [type]: Math.max(0, Math.min(11, value))
        }
      }
    }))
  }

  const handleCaptainPercentageChange = (playerId: string, percentage: number) => {
    setCaptainPercentages(prev => ({
      ...prev,
      [playerId]: Math.max(0, Math.min(100, percentage))
    }))
    
    // Update strategy
    setCustomStrategy(prev => ({
      ...prev,
      captainDistribution: Object.entries({ ...captainPercentages, [playerId]: percentage })
        .filter(([_, perc]) => perc > 0)
        .map(([id, perc]) => ({ playerId: id, percentage: perc }))
    }))
  }

  const handleSubmit = () => {
    const finalStrategy = {
      ...customStrategy,
      captainDistribution: Object.entries(captainPercentages)
        .filter(([_, percentage]) => percentage > 0)
        .map(([playerId, percentage]) => ({ playerId, percentage }))
    }
    
    onStrategySelected(finalStrategy)
  }

  const totalCaptainPercentage = Object.values(captainPercentages).reduce((sum, val) => sum + val, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="heading-primary mb-4 animate-slide-up">SELECT YOUR STRATEGY</h2>
        <p className="text-lg text-gray-600 font-semibold animate-slide-up">
          Choose a preset strategy or customize your own approach
        </p>
      </div>

      {/* Preset Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(PRESET_STRATEGIES).map(([key, preset], index) => (
          <div
            key={key}
            onClick={() => handlePresetSelect(key)}
            className={`strategy-card animate-scale-in ${
              selectedPreset === key ? 'strategy-card-selected' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h3 className="text-xl font-black text-dream11-dark mb-2 uppercase tracking-wide">{preset.name}</h3>
            <p className="text-gray-600 mb-4 font-medium">{preset.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-bold">Uniqueness:</span>
                <span className="font-black text-dream11-primary">{Math.round(preset.uniquenessWeight * 100)}%</span>
              </div>
              <div className="space-y-1">
                {Object.entries(preset.roleConstraints).map(([role, constraint]) => (
                  <div key={role} className="flex justify-between text-xs">
                    <span className="font-bold">{role}:</span>
                    <span className="font-semibold">{constraint.min}-{constraint.max}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Strategy Builder */}
      <div className="card-3d animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-dream11-dark uppercase tracking-wide">CUSTOMIZE STRATEGY</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-outline text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'HIDE ADVANCED' : 'SHOW ADVANCED'}
          </button>
        </div>

        {/* Player Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-black text-dream11-dark mb-4 uppercase tracking-wide">PLAYER SELECTION</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`player-card-3d animate-scale-in ${
                  customStrategy.lockedPlayers.includes(player.id)
                    ? 'border-dream11-accent bg-green-50'
                    : customStrategy.excludedPlayers.includes(player.id)
                    ? 'border-dream11-primary bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-black text-sm text-dream11-dark">{player.name}</p>
                    <p className="text-xs text-gray-600 font-semibold">
                      {player.role} • {player.credits}cr • {player.team === 'team1' ? 'T1' : 'T2'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePlayerLock(player.id)}
                      className={`p-1 rounded transition-all duration-200 hover:scale-110 ${
                        customStrategy.lockedPlayers.includes(player.id)
                          ? 'bg-dream11-accent text-white animate-glow'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title="Lock player"
                    >
                      <Lock size={14} />
                    </button>
                    <button
                      onClick={() => handlePlayerExclude(player.id)}
                      className={`p-1 rounded transition-all duration-200 hover:scale-110 ${
                        customStrategy.excludedPlayers.includes(player.id)
                          ? 'bg-dream11-primary text-white animate-glow'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title="Exclude player"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Captain Distribution */}
        <div className="mb-6">
          <h4 className="text-lg font-black text-dream11-dark mb-4 uppercase tracking-wide">
            CAPTAIN DISTRIBUTION
            <span className={`ml-2 text-sm font-bold ${totalCaptainPercentage === 100 ? 'text-dream11-accent' : 'text-dream11-primary'}`}>
              ({totalCaptainPercentage}%)
            </span>
          </h4>
          <div className="space-y-3">
            {players
              .filter(p => p.credits >= 8)
              .sort((a, b) => b.credits - a.credits)
              .slice(0, 8)
              .map((player, index) => (
                <div key={player.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-1">
                    <span className="font-black text-dream11-dark">{player.name}</span>
                    <span className="ml-2 text-sm text-gray-600 font-semibold">({player.credits}cr)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={captainPercentages[player.id] || 0}
                      onChange={(e) => handleCaptainPercentageChange(player.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border-2 border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-dream11-primary focus:border-dream11-primary transition-all duration-200"
                    />
                    <span className="text-sm text-gray-600 font-bold">%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-6">
            {/* Role Constraints */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Role Constraints</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(customStrategy.roleConstraints).map(([role, constraint]) => (
                  <div key={role} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{role}</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRoleConstraintChange(role as keyof RoleConstraints, 'min', constraint.min - 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono w-8 text-center">{constraint.min}</span>
                      <button
                        onClick={() => handleRoleConstraintChange(role as keyof RoleConstraints, 'min', constraint.min + 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="text-gray-500">-</span>
                      <button
                        onClick={() => handleRoleConstraintChange(role as keyof RoleConstraints, 'max', constraint.max - 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono w-8 text-center">{constraint.max}</span>
                      <button
                        onClick={() => handleRoleConstraintChange(role as keyof RoleConstraints, 'max', constraint.max + 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Range */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Credit Range</h4>
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm text-gray-700">Min Credits</label>
                  <input
                    type="number"
                    min="80"
                    max="100"
                    value={customStrategy.creditRange.min}
                    onChange={(e) => setCustomStrategy(prev => ({
                      ...prev,
                      creditRange: { ...prev.creditRange, min: parseInt(e.target.value) || 95 }
                    }))}
                    className="input-field w-20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Max Credits</label>
                  <input
                    type="number"
                    min="95"
                    max="100"
                    value={customStrategy.creditRange.max}
                    onChange={(e) => setCustomStrategy(prev => ({
                      ...prev,
                      creditRange: { ...prev.creditRange, max: parseInt(e.target.value) || 100 }
                    }))}
                    className="input-field w-20"
                  />
                </div>
              </div>
            </div>

            {/* Uniqueness Slider */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Uniqueness vs Optimization ({Math.round(customStrategy.uniquenessWeight * 100)}%)
              </h4>
              <input
                type="range"
                min="0"
                max="100"
                value={customStrategy.uniquenessWeight * 100}
                onChange={(e) => setCustomStrategy(prev => ({
                  ...prev,
                  uniquenessWeight: parseInt(e.target.value) / 100
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Max Optimization</span>
                <span>Max Uniqueness</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSubmit}
            disabled={totalCaptainPercentage !== 100}
            className={`px-6 py-3 rounded-lg font-medium ${
              totalCaptainPercentage === 100
                ? 'btn-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Team Generation
          </button>
        </div>
      </div>
    </div>
  )
}

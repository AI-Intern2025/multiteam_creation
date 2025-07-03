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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Strategy</h2>
        <p className="text-lg text-gray-600">
          Choose a preset strategy or customize your own approach
        </p>
      </div>

      {/* Preset Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(PRESET_STRATEGIES).map(([key, preset]) => (
          <div
            key={key}
            onClick={() => handlePresetSelect(key)}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPreset === key ? 'ring-2 ring-dream11-primary bg-blue-50' : ''
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{preset.name}</h3>
            <p className="text-gray-600 mb-4">{preset.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Uniqueness:</span>
                <span className="font-medium">{Math.round(preset.uniquenessWeight * 100)}%</span>
              </div>
              <div className="space-y-1">
                {Object.entries(preset.roleConstraints).map(([role, constraint]) => (
                  <div key={role} className="flex justify-between text-xs">
                    <span>{role}:</span>
                    <span>{constraint.min}-{constraint.max}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Strategy Builder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Customize Strategy</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-outline text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {/* Player Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Player Selection</h4>
          
          {/* Selected Players Display */}
          {(customStrategy.lockedPlayers.length > 0 || customStrategy.excludedPlayers.length > 0) && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              {customStrategy.lockedPlayers.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-green-700 mb-2">Locked Players:</p>
                  <div className="space-y-1">
                    {customStrategy.lockedPlayers.map(playerId => {
                      const player = players.find(p => p.id === playerId)
                      return player ? (
                        <div key={playerId} className="flex items-center justify-between bg-green-100 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <Lock size={14} className="text-green-600" />
                            <span className="font-medium text-sm">{player.name}</span>
                            <span className="text-xs text-gray-600">
                              {player.role} • {player.credits}cr • {player.team === 'team1' ? 'T1' : 'T2'}
                            </span>
                          </div>
                          <button
                            onClick={() => handlePlayerLock(playerId)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Remove lock"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              
              {customStrategy.excludedPlayers.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700 mb-2">Excluded Players:</p>
                  <div className="space-y-1">
                    {customStrategy.excludedPlayers.map(playerId => {
                      const player = players.find(p => p.id === playerId)
                      return player ? (
                        <div key={playerId} className="flex items-center justify-between bg-red-100 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <X size={14} className="text-red-600" />
                            <span className="font-medium text-sm">{player.name}</span>
                            <span className="text-xs text-gray-600">
                              {player.role} • {player.credits}cr • {player.team === 'team1' ? 'T1' : 'T2'}
                            </span>
                          </div>
                          <button
                            onClick={() => handlePlayerExclude(playerId)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Remove exclusion"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* All Players for Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {players
              .sort((a, b) => {
                const roleOrder = { 'WK': 0, 'BAT': 1, 'AR': 2, 'BOWL': 3 }
                const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 4
                const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 4
                if (aOrder !== bOrder) return aOrder - bOrder
                return b.credits - a.credits // Secondary sort by credits (high to low)
              })
              .map(player => (
              <div
                key={player.id}
                className={`p-3 border rounded-lg transition-colors ${
                  customStrategy.lockedPlayers.includes(player.id)
                    ? 'border-green-500 bg-green-50'
                    : customStrategy.excludedPlayers.includes(player.id)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{player.name}</p>
                    <p className="text-xs text-gray-500">
                      {player.role} • {player.credits}cr • {player.team === 'team1' ? 'T1' : 'T2'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePlayerLock(player.id)}
                      className={`p-1 rounded ${
                        customStrategy.lockedPlayers.includes(player.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title="Lock player"
                    >
                      <Lock size={14} />
                    </button>
                    <button
                      onClick={() => handlePlayerExclude(player.id)}
                      className={`p-1 rounded ${
                        customStrategy.excludedPlayers.includes(player.id)
                          ? 'bg-red-500 text-white'
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
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Captain Distribution
            <span className={`ml-2 text-sm ${totalCaptainPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
              ({totalCaptainPercentage}%)
            </span>
          </h4>
          
          {/* Selected Captains Display */}
          {Object.entries(captainPercentages).filter(([_, percentage]) => percentage > 0).length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2">Selected Captains:</p>
              <div className="space-y-2">
                {Object.entries(captainPercentages)
                  .filter(([_, percentage]) => percentage > 0)
                  .map(([playerId, percentage]) => {
                    const player = players.find(p => p.id === playerId)
                    return player ? (
                      <div key={playerId} className="flex items-center justify-between bg-blue-100 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{player.name}</span>
                          <span className="text-xs text-gray-600">
                            {player.role} • {player.credits}cr • {player.team === 'team1' ? 'T1' : 'T2'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-700">{percentage}%</span>
                          <button
                            onClick={() => handleCaptainPercentageChange(playerId, 0)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Remove as captain"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : null
                  })}
              </div>
            </div>
          )}
          
          {/* All Available Captains */}
          <div className="space-y-3">
            {players
              .filter(p => p.credits >= 8)
              .sort((a, b) => {
                const roleOrder = { 'WK': 0, 'BAT': 1, 'AR': 2, 'BOWL': 3 }
                const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 4
                const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 4
                if (aOrder !== bOrder) return aOrder - bOrder
                return b.credits - a.credits // Secondary sort by credits (high to low)
              })
              .slice(0, 8)
              .map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <span className="font-medium">{player.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {player.role} • {player.credits}cr • {player.team === 'team1' ? 'T1' : 'T2'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={captainPercentages[player.id] || 0}
                      onChange={(e) => handleCaptainPercentageChange(player.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-500">%</span>
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

'use client'

import { useState } from 'react'
import { Upload, Users, Settings, Download } from 'lucide-react'
import OCRProcessor from '@/components/OCRProcessor'
import StrategySelector from '@/components/StrategySelector'
import TeamGenerator from '@/components/TeamGenerator'
import TeamManager from '@/components/TeamManager'
import { Player, Team, Strategy } from '@/types'

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [currentStep, setCurrentStep] = useState<'upload' | 'strategy' | 'generate' | 'manage'>('upload')

  const handlePlayersExtracted = (extractedPlayers: Player[]) => {
    setPlayers(extractedPlayers)
    setCurrentStep('strategy')
  }

  const handleStrategySelected = (selectedStrategy: Strategy) => {
    setStrategy(selectedStrategy)
    setCurrentStep('generate')
  }

  const handleTeamsGenerated = (generatedTeams: Team[]) => {
    setTeams(generatedTeams)
    setCurrentStep('manage')
  }

  const stepInfo = {
    upload: { title: 'Upload Screenshot', icon: Upload, description: 'Upload Dream11 screenshot or enter player data' },
    strategy: { title: 'Select Strategy', icon: Settings, description: 'Choose team creation strategy and preferences' },
    generate: { title: 'Generate Teams', icon: Users, description: 'Create optimized fantasy teams' },
    manage: { title: 'Manage Teams', icon: Download, description: 'Review, edit, and export your teams' }
  }

  const renderStepIndicator = () => {
    const steps = ['upload', 'strategy', 'generate', 'manage'] as const
    const currentIndex = steps.indexOf(currentStep)
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const StepIcon = stepInfo[step].icon
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          
          return (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                isActive ? 'border-blue-500 bg-blue-500 text-white' :
                isCompleted ? 'border-green-500 bg-green-500 text-white' :
                'border-gray-300 bg-gray-100 text-gray-400'
              }`}>
                <StepIcon className="w-6 h-6" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return <OCRProcessor onPlayersExtracted={handlePlayersExtracted} />
      case 'strategy':
        return (
          <StrategySelector
            players={players}
            onStrategySelected={handleStrategySelected}
          />
        )
      case 'generate':
        return (
          <TeamGenerator
            players={players}
            strategy={strategy!}
            onTeamsGenerated={handleTeamsGenerated}
          />
        )
      case 'manage':
        return (
          <TeamManager
            teams={teams}
            players={players}
            onTeamsUpdate={setTeams}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-dream11-primary">
              Dream11 Multi Team Creator
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {teams.length} teams generated
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderStepIndicator()}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {stepInfo[currentStep].title}
            </h2>
            <p className="text-gray-600">{stepInfo[currentStep].description}</p>
            {players.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                {players.length} players loaded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
      </main>
    </div>
  )
}

// Core Types for Dream11 Multi Team Creator

export interface Player {
  id: string | number
  name: string
  fullName?: string
  team: string // Allow any team name (WI, AUS, IND, ENG, etc.)
  role: 'WK' | 'BAT' | 'AR' | 'BOWL'
  credits: number
  points?: number
  selectionPercentage?: number
  isPlayingToday?: boolean
  matchTeam?: string
  country?: string
  battingStyle?: string
  bowlingStyle?: string
  isLocked?: boolean
  isExcluded?: boolean
}

export interface Team {
  id: string
  name: string
  players: Player[]
  captain: string // player id
  viceCaptain: string // player id
  totalCredits: number
  isValid: boolean
  validationErrors: string[]
  strategy?: string
}

export interface Strategy {
  id: string
  name: string
  preset?: 'stack_team1' | 'allrounder_focus' | 'safe_picks'
  lockedPlayers: string[] // player ids
  excludedPlayers: string[] // player ids
  captainDistribution: CaptainDistribution[]
  roleConstraints: RoleConstraints
  creditRange: {
    min: number
    max: number
  }
  uniquenessWeight: number // 0-1, 0 = max optimization, 1 = max uniqueness
  narratives?: string[]
}

export interface CaptainDistribution {
  playerId: string
  percentage: number
}

export interface RoleConstraints {
  WK: { min: number; max: number }
  BAT: { min: number; max: number }
  AR: { min: number; max: number }
  BOWL: { min: number; max: number }
}

export interface ValidationRule {
  id: string
  name: string
  description: string
  validate: (team: Team, players: Player[]) => boolean
  errorMessage: string
}

export interface GenerationConfig {
  teamCount: number
  strategy: Strategy
  enforceUniqueness: boolean
  maxIterations: number
}

export interface TeamExport {
  teamName: string
  players: {
    name: string
    role: string
    team: string
    credits: number
    isCaptain: boolean
    isViceCaptain: boolean
  }[]
  totalCredits: number
}

// User Context Types
export interface UserPreferences {
  defaultStrategy: Strategy
  recentStrategies: Strategy[]
  favoriteNarratives: string[]
  exportFormat: 'csv' | 'json'
}

export interface MatchContext {
  id: string
  team1: string
  team2: string
  format: 'T20' | 'ODI' | 'TEST'
  venue?: string
  date: string
  players: Player[]
  generatedTeams: Team[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface GenerateTeamsRequest {
  players: BackendPlayer[] // Use backend-compatible format
  strategy: Strategy
  teamCount: number
}

export interface BackendPlayer {
  id: string
  name: string
  team: string // Allow any team name for flexibility
  role: 'WK' | 'BAT' | 'AR' | 'BOWL'
  credits: number
  points?: number
  isLocked?: boolean
  isExcluded?: boolean
}

export interface GenerateTeamsResponse {
  teams: Team[]
  metadata: {
    totalGenerated: number
    validTeams: number
    uniqueTeams: number
    executionTime: number
  }
}

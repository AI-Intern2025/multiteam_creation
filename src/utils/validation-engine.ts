import { Team, Player, ValidationRule, RoleConstraints } from '@/types'

/**
 * Core validation engine for Dream11 teams
 */
export class ValidationEngine {
  private rules: ValidationRule[] = []

  constructor() {
    this.initializeDefaultRules()
  }

  private initializeDefaultRules() {
    this.rules = [
      {
        id: 'team-size',
        name: 'Team Size',
        description: 'Team must have exactly 11 players',
        validate: (team: Team) => team.players.length === 11,
        errorMessage: 'Team must have exactly 11 players'
      },
      {
        id: 'credit-limit',
        name: 'Credit Limit',
        description: 'Total credits must not exceed 100',
        validate: (team: Team) => team.totalCredits <= 100,
        errorMessage: 'Total credits exceed 100 limit'
      },
      {
        id: 'wicket-keeper',
        name: 'Wicket Keeper',
        description: 'Team must have exactly 1 wicket-keeper',
        validate: (team: Team) => {
          const wkCount = team.players.filter(p => p.role === 'WK').length
          return wkCount === 1
        },
        errorMessage: 'Team must have exactly 1 wicket-keeper'
      },
      {
        id: 'minimum-batsmen',
        name: 'Minimum Batsmen',
        description: 'Team must have at least 3 batsmen',
        validate: (team: Team) => {
          const batCount = team.players.filter(p => p.role === 'BAT').length
          return batCount >= 3
        },
        errorMessage: 'Team must have at least 3 batsmen'
      },
      {
        id: 'maximum-batsmen',
        name: 'Maximum Batsmen',
        description: 'Team must have at most 5 batsmen',
        validate: (team: Team) => {
          const batCount = team.players.filter(p => p.role === 'BAT').length
          return batCount <= 5
        },
        errorMessage: 'Team cannot have more than 5 batsmen'
      },
      {
        id: 'minimum-bowlers',
        name: 'Minimum Bowlers',
        description: 'Team must have at least 3 bowlers',
        validate: (team: Team) => {
          const bowlCount = team.players.filter(p => p.role === 'BOWL').length
          return bowlCount >= 3
        },
        errorMessage: 'Team must have at least 3 bowlers'
      },
      {
        id: 'maximum-bowlers',
        name: 'Maximum Bowlers',
        description: 'Team must have at most 5 bowlers',
        validate: (team: Team) => {
          const bowlCount = team.players.filter(p => p.role === 'BOWL').length
          return bowlCount <= 5
        },
        errorMessage: 'Team cannot have more than 5 bowlers'
      },
      {
        id: 'maximum-all-rounders',
        name: 'Maximum All-Rounders',
        description: 'Team must have at most 4 all-rounders',
        validate: (team: Team) => {
          const arCount = team.players.filter(p => p.role === 'AR').length
          return arCount <= 4
        },
        errorMessage: 'Team cannot have more than 4 all-rounders'
      },
      {
        id: 'team-balance',
        name: 'Team Balance',
        description: 'Team must have players from both teams',
        validate: (team: Team, players: Player[]) => {
          const team1Count = team.players.filter(p => p.team === 'team1').length
          const team2Count = team.players.filter(p => p.team === 'team2').length
          return team1Count >= 1 && team2Count >= 1 && team1Count <= 7 && team2Count <= 7
        },
        errorMessage: 'Team must have 1-7 players from each team'
      },
      {
        id: 'captain-selected',
        name: 'Captain Selected',
        description: 'Team must have a captain',
        validate: (team: Team) => {
          return !!team.captain && team.players.some(p => p.id === team.captain)
        },
        errorMessage: 'Team must have a captain selected'
      },
      {
        id: 'vice-captain-selected',
        name: 'Vice Captain Selected',
        description: 'Team must have a vice-captain',
        validate: (team: Team) => {
          return !!team.viceCaptain && team.players.some(p => p.id === team.viceCaptain)
        },
        errorMessage: 'Team must have a vice-captain selected'
      },
      {
        id: 'captain-vice-captain-different',
        name: 'Captain and Vice-Captain Different',
        description: 'Captain and vice-captain must be different players',
        validate: (team: Team) => {
          return team.captain !== team.viceCaptain
        },
        errorMessage: 'Captain and vice-captain must be different players'
      }
    ]
  }

  /**
   * Validate a single team
   */
  validateTeam(team: Team, players: Player[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    for (const rule of this.rules) {
      if (!rule.validate(team, players)) {
        errors.push(rule.errorMessage)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate multiple teams
   */
  validateTeams(teams: Team[], players: Player[]): { validTeams: Team[]; invalidTeams: Team[] } {
    const validTeams: Team[] = []
    const invalidTeams: Team[] = []

    for (const team of teams) {
      const validation = this.validateTeam(team, players)
      const updatedTeam = {
        ...team,
        isValid: validation.isValid,
        validationErrors: validation.errors
      }

      if (validation.isValid) {
        validTeams.push(updatedTeam)
      } else {
        invalidTeams.push(updatedTeam)
      }
    }

    return { validTeams, invalidTeams }
  }

  /**
   * Check if role constraints are satisfied
   */
  validateRoleConstraints(players: Player[], constraints: RoleConstraints): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    const roleCounts = this.getRoleCounts(players)

    Object.entries(constraints).forEach(([role, constraint]) => {
      const count = roleCounts[role as keyof typeof roleCounts] || 0
      
      if (count < constraint.min) {
        errors.push(`${role}: Need at least ${constraint.min}, have ${count}`)
      }
      
      if (count > constraint.max) {
        errors.push(`${role}: Cannot have more than ${constraint.max}, have ${count}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get role distribution for players
   */
  private getRoleCounts(players: Player[]): Record<string, number> {
    return players.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Add custom validation rule
   */
  addCustomRule(rule: ValidationRule): void {
    this.rules.push(rule)
  }

  /**
   * Remove validation rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId)
  }

  /**
   * Get all validation rules
   */
  getRules(): ValidationRule[] {
    return [...this.rules]
  }

  /**
   * Check if a team can be made valid with minimal changes
   */
  suggestFixes(team: Team, players: Player[]): string[] {
    const suggestions: string[] = []
    const validation = this.validateTeam(team, players)

    if (validation.isValid) {
      return ['Team is already valid']
    }

    // Credit limit fixes
    if (team.totalCredits > 100) {
      const excess = team.totalCredits - 100
      suggestions.push(`Remove ${excess.toFixed(1)} credits worth of players`)
      
      // Suggest specific player replacements
      const expensivePlayers = team.players
        .filter(p => p.credits >= excess)
        .sort((a, b) => b.credits - a.credits)
      
      if (expensivePlayers.length > 0) {
        suggestions.push(`Consider replacing ${expensivePlayers[0].name} (${expensivePlayers[0].credits}cr)`)
      }
    }

    // Role balance fixes
    const roleCounts = this.getRoleCounts(team.players)
    
    if (roleCounts.WK !== 1) {
      if (roleCounts.WK === 0) {
        suggestions.push('Add 1 wicket-keeper')
      } else {
        suggestions.push(`Remove ${roleCounts.WK - 1} wicket-keeper(s)`)
      }
    }

    if (roleCounts.BAT < 3) {
      suggestions.push(`Add ${3 - roleCounts.BAT} batsman/batsmen`)
    } else if (roleCounts.BAT > 5) {
      suggestions.push(`Remove ${roleCounts.BAT - 5} batsman/batsmen`)
    }

    if (roleCounts.BOWL < 3) {
      suggestions.push(`Add ${3 - roleCounts.BOWL} bowler(s)`)
    } else if (roleCounts.BOWL > 5) {
      suggestions.push(`Remove ${roleCounts.BOWL - 5} bowler(s)`)
    }

    if (roleCounts.AR > 4) {
      suggestions.push(`Remove ${roleCounts.AR - 4} all-rounder(s)`)
    }

    // Team balance fixes
    const team1Count = team.players.filter(p => p.team === 'team1').length
    const team2Count = team.players.filter(p => p.team === 'team2').length

    if (team1Count === 0) {
      suggestions.push('Add at least 1 player from Team 1')
    } else if (team1Count > 7) {
      suggestions.push(`Remove ${team1Count - 7} player(s) from Team 1`)
    }

    if (team2Count === 0) {
      suggestions.push('Add at least 1 player from Team 2')
    } else if (team2Count > 7) {
      suggestions.push(`Remove ${team2Count - 7} player(s) from Team 2`)
    }

    // Captain/Vice-captain fixes
    if (!team.captain) {
      suggestions.push('Select a captain')
    }

    if (!team.viceCaptain) {
      suggestions.push('Select a vice-captain')
    }

    if (team.captain === team.viceCaptain) {
      suggestions.push('Captain and vice-captain must be different players')
    }

    return suggestions
  }

  /**
   * Calculate team strength score (0-100)
   */
  calculateTeamScore(team: Team): number {
    let score = 0

    // Base score from validation
    if (team.isValid) {
      score += 40
    }

    // Credit utilization (higher is better, but penalize going over)
    const creditUtilization = Math.min(team.totalCredits / 100, 1)
    if (team.totalCredits <= 100) {
      score += creditUtilization * 30
    } else {
      score -= (team.totalCredits - 100) * 5 // Penalty for exceeding
    }

    // Role balance score
    const roleCounts = this.getRoleCounts(team.players)
    const idealRoles = { WK: 1, BAT: 4, AR: 2, BOWL: 4 }
    
    let roleScore = 0
    Object.entries(idealRoles).forEach(([role, ideal]) => {
      const actual = roleCounts[role] || 0
      const deviation = Math.abs(actual - ideal)
      roleScore += Math.max(0, 5 - deviation)
    })
    score += roleScore

    // High-value player bonus
    const highValuePlayers = team.players.filter(p => p.credits >= 10).length
    score += Math.min(highValuePlayers * 3, 15)

    return Math.max(0, Math.min(100, score))
  }
}

// Singleton instance
export const validationEngine = new ValidationEngine()

/**
 * Quick validation function for single team
 */
export function validateTeam(team: Team, players: Player[]) {
  return validationEngine.validateTeam(team, players)
}

/**
 * Quick validation function for multiple teams
 */
export function validateTeams(teams: Team[], players: Player[]) {
  return validationEngine.validateTeams(teams, players)
}

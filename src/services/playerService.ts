import { db, players } from '@/db'
import { eq, and, gte, lte, like, or } from 'drizzle-orm'

export interface SearchFilters {
  team?: string
  role?: string
  minCredits?: number
  maxCredits?: number
  matchId?: number
}

export class PlayerService {
  static async searchPlayers(filters: SearchFilters = {}) {
    try {
      // Build where conditions
      const conditions = []
      
      if (filters.team) {
        conditions.push(eq(players.team, filters.team))
      }
      
      if (filters.role) {
        conditions.push(eq(players.role, filters.role))
      }
      
      if (filters.minCredits !== undefined) {
        conditions.push(gte(players.credits, filters.minCredits))
      }
      
      if (filters.maxCredits !== undefined) {
        conditions.push(lte(players.credits, filters.maxCredits))
      }
      
      // Apply all conditions
      let result
      if (conditions.length > 0) {
        result = await db.select().from(players).where(and(...conditions))
      } else {
        result = await db.select().from(players)
      }
      
      return result
    } catch (error) {
      console.error('Error searching players:', error)
      throw error
    }
  }
  
  static async findPlayerByName(name: string) {
    try {
      const result = await db.select()
        .from(players)
        .where(like(players.name, `%${name}%`))
      
      return result[0] || null
    } catch (error) {
      console.error('Error finding player by name:', error)
      throw error
    }
  }
  
  static async getPlayersByTeams(team1: string, team2: string) {
    try {
      const result = await db.select()
        .from(players)
        .where(
          or(
            eq(players.team, team1),
            eq(players.team, team2)
          )
        )
      
      return result
    } catch (error) {
      console.error('Error getting players by teams:', error)
      throw error
    }
  }
  
  static async getPlayersByMatchId(matchId: number) {
    try {
      // Since we don't have a direct matchId relation, we'll need to get match details first
      // For now, let's get all players and filter by match logic
      const result = await db.select().from(players)
      
      // Filter based on match ID logic (this could be improved with proper relations)
      return result
    } catch (error) {
      console.error('Error getting players by match ID:', error)
      throw error
    }
  }
  
  static async getAllPlayers() {
    try {
      const result = await db.select().from(players)
      return result
    } catch (error) {
      console.error('Error getting all players:', error)
      throw error
    }
  }
  
  static async validateTeamSelection(selectedPlayers: any[]) {
    // Validate Dream11 rules
    const validation = {
      isValid: true,
      errors: [] as string[]
    }
    
    if (selectedPlayers.length !== 11) {
      validation.isValid = false
      validation.errors.push('Team must have exactly 11 players')
    }
    
    // Count roles
    const roleCounts = selectedPlayers.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Validate role constraints
    const wkCount = roleCounts['WK'] || 0
    const batCount = roleCounts['BAT'] || 0
    const arCount = roleCounts['AR'] || 0
    const bowlCount = roleCounts['BOWL'] || 0
    
    if (wkCount < 1 || wkCount > 4) {
      validation.isValid = false
      validation.errors.push('Must have 1-4 Wicket Keepers')
    }
    
    if (batCount < 3 || batCount > 5) {
      validation.isValid = false
      validation.errors.push('Must have 3-5 Batsmen')
    }
    
    if (arCount < 1 || arCount > 4) {
      validation.isValid = false
      validation.errors.push('Must have 1-4 All Rounders')
    }
    
    if (bowlCount < 3 || bowlCount > 5) {
      validation.isValid = false
      validation.errors.push('Must have 3-5 Bowlers')
    }
    
    // Check team distribution (max 7 from one team)
    const teamCounts = selectedPlayers.reduce((acc, player) => {
      acc[player.team] = (acc[player.team] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const maxFromOneTeam = Math.max(...Object.values(teamCounts).map(count => count as number))
    if (maxFromOneTeam > 7) {
      validation.isValid = false
      validation.errors.push('Maximum 7 players from one team allowed')
    }
    
    // Check credits (assuming max 100 credits)
    const totalCredits = selectedPlayers.reduce((sum, player) => sum + player.credits, 0)
    if (totalCredits > 100) {
      validation.isValid = false
      validation.errors.push('Total credits cannot exceed 100')
    }
    
    return validation
  }
}

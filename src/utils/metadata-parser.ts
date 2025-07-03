import { Player, OCRResult } from '@/types'

/**
 * Parse OCR text to extract player data
 * This function analyzes the OCR output from Dream11 screenshots
 */
export function parsePlayerData(ocrText: string, confidence: number): OCRResult {
  const lines = ocrText.split('\n').filter(line => line.trim().length > 0)
  
  // Initialize result
  const result: OCRResult = {
    players: [],
    matchInfo: {
      team1: 'Team A',
      team2: 'Team B',
      format: 'T20'
    },
    confidence
  }

  // Extract team names from common patterns
  const teamPattern = /(\w+)\s+vs\s+(\w+)|(\w+)\s+v\s+(\w+)/i
  const formatPattern = /(T20|ODI|TEST)/i
  
  for (const line of lines) {
    const teamMatch = line.match(teamPattern)
    if (teamMatch) {
      result.matchInfo.team1 = teamMatch[1] || teamMatch[3] || 'Team A'
      result.matchInfo.team2 = teamMatch[2] || teamMatch[4] || 'Team B'
    }
    
    const formatMatch = line.match(formatPattern)
    if (formatMatch) {
      result.matchInfo.format = formatMatch[1] as 'T20' | 'ODI' | 'TEST'
    }
  }

  // Extract player data using multiple patterns
  const players: Player[] = []
  let currentTeam: 'team1' | 'team2' = 'team1'
  
  // First, try to extract all text and look for player patterns
  const allText = ocrText.toLowerCase()
  
  // Check for team indicators
  if (allText.includes('wi') && allText.includes('aus')) {
    result.matchInfo.team1 = 'WI'
    result.matchInfo.team2 = 'AUS'
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip obviously non-player lines
    if (line.length < 3 || 
        /^(create|team|make|upload|sel%|pts|played|last|match|tomorrow)$/i.test(line) ||
        /^\d+:\d+/.test(line) || // time stamps
        /^[%\d\s]+$/.test(line) || // just percentages/numbers
        line.includes('screenshot')) {
      continue
    }
    
    // Check if this line indicates a team switch (look for position numbers restarting)
    if (/^\d+$/.test(line) && parseInt(line) === 1 && players.length > 0) {
      currentTeam = 'team2'
      continue
    }
    
    // Pattern 1: Player name with percentage and points (Dream11 format)
    // e.g., "K Brathwaite" followed by "24%" and "28"
    if (isValidPlayerName(line) && i < lines.length - 2) {
      const nextLine1 = lines[i + 1]?.trim() || ''
      const nextLine2 = lines[i + 2]?.trim() || ''
      const nextLine3 = lines[i + 3]?.trim() || ''
      
      // Look for percentage pattern
      const percentageMatch = nextLine1.match(/(\d+)%/) || nextLine2.match(/(\d+)%/)
      // Look for points/credits pattern
      const pointsMatch = nextLine1.match(/^\d+$/) || nextLine2.match(/^\d+$/) || nextLine3.match(/^\d+$/)
      // Look for role pattern
      const roleMatch = nextLine1.match(/^(WK|BAT|BOWL|ALL)$/i) || 
                       nextLine2.match(/^(WK|BAT|BOWL|ALL)$/i) || 
                       nextLine3.match(/^(WK|BAT|BOWL|ALL)$/i)
      
      if (percentageMatch && pointsMatch && roleMatch) {
        const name = cleanPlayerName(line)
        const role = normalizeRole(roleMatch[1])
        const points = parseInt(pointsMatch[0])
        // Convert points to approximate credits (Dream11 uses points for display)
        const credits = Math.min(Math.max(points / 10, 7), 15) // Rough conversion
        
        if (name && role) {
          players.push(createPlayer(name, currentTeam, role, credits))
          i += 3 // Skip the lines we've processed
          continue
        }
      }
    }
    
    // Pattern 2: Name followed by role and credits (e.g., "Virat Kohli BAT 11.5")
    const pattern1 = /^(.+?)\s+(WK|BAT|AR|ALL|BOWL)\s+(\d+(?:\.\d+)?)\s*$/i
    const match1 = line.match(pattern1)
    
    if (match1) {
      const name = cleanPlayerName(match1[1])
      const role = normalizeRole(match1[2])
      const credits = parseFloat(match1[3])
      
      if (name && role && credits > 0 && credits <= 20) {
        players.push(createPlayer(name, currentTeam, role, credits))
        continue
      }
    }
    
    // Pattern 3: Multi-line format (name on one line, role/credits on next)
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1].trim()
      const pattern2 = /^(WK|BAT|AR|ALL|BOWL)\s+(\d+(?:\.\d+)?)\s*$/i
      const match2 = nextLine.match(pattern2)
      
      if (match2 && isValidPlayerName(line)) {
        const name = cleanPlayerName(line)
        const role = normalizeRole(match2[1])
        const credits = parseFloat(match2[2])
        
        if (name && role && credits > 0 && credits <= 20) {
          players.push(createPlayer(name, currentTeam, role, credits))
          i++ // Skip next line as we've processed it
          continue
        }
      }
    }
    
    // Pattern 4: Look for common Dream11 player name patterns
    if (isValidPlayerName(line)) {
      // Try to find role and credits in nearby lines
      let role = 'BAT' // default
      let credits = 8 // default
      
      // Look in next few lines for role
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const checkLine = lines[j].trim()
        const roleMatch = checkLine.match(/^(WK|BAT|BOWL|ALL)$/i)
        if (roleMatch) {
          role = normalizeRole(roleMatch[1])
          break
        }
      }
      
      // Look for points to estimate credits
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const checkLine = lines[j].trim()
        const pointsMatch = checkLine.match(/^\d{1,3}$/)
        if (pointsMatch) {
          const points = parseInt(pointsMatch[0])
          if (points > 20 && points < 300) { // Reasonable point range
            credits = Math.min(Math.max(points / 20, 7), 15)
            break
          }
        }
      }
      
      const name = cleanPlayerName(line)
      if (name && name.length > 3 && players.length < 22) { // Max 22 players (11 per team)
        players.push(createPlayer(name, currentTeam, role as any, credits))
      }
    }
  }

  // Remove duplicates and validate
  const uniquePlayers = removeDuplicatePlayers(players)
  
  // Assign teams more intelligently if we have enough players
  if (uniquePlayers.length >= 8) {
    const team1Players = uniquePlayers.slice(0, Math.ceil(uniquePlayers.length / 2))
    const team2Players = uniquePlayers.slice(Math.ceil(uniquePlayers.length / 2))
    
    team1Players.forEach(p => p.team = 'team1')
    team2Players.forEach(p => p.team = 'team2')
  }

  result.players = uniquePlayers
  
  // If we didn't find enough players, try the Dream11-specific parser
  if (uniquePlayers.length < 4) {
    const dream11Result = parseDream11Screenshot(ocrText, confidence)
    if (dream11Result.players.length > uniquePlayers.length) {
      result.players = dream11Result.players
      result.matchInfo = dream11Result.matchInfo
    }
  }
  
  // If still no luck, try parsing as team formation view
  if (result.players.length < 4) {
    const formationResult = parseTeamFormationView(ocrText, confidence)
    if (formationResult.players.length > result.players.length) {
      result.players = formationResult.players
      result.matchInfo = formationResult.matchInfo
    }
  }
  
  return result
}

/**
 * Parse Dream11 team formation view (the visual field layout)
 */
function parseTeamFormationView(ocrText: string, confidence: number): OCRResult {
  const result: OCRResult = {
    players: [],
    matchInfo: {
      team1: 'WI',
      team2: 'AUS', 
      format: 'T20'
    },
    confidence
  }
  
  const text = ocrText.toLowerCase()
  const players: Player[] = []
  
  // Check if this looks like a team formation view
  const isFormationView = text.includes('wicket') && text.includes('keeper') && 
                         (text.includes('batter') || text.includes('bowler'))
  
  if (isFormationView) {
    // Extract players from the actual OCR text instead of using hardcoded list
    const lines = ocrText.split('\n').filter(line => line.trim().length > 0)
    let currentRole: 'WK' | 'BAT' | 'AR' | 'BOWL' = 'BAT'
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Detect role sections
      if (line.toLowerCase().includes('wicket') || line.toLowerCase().includes('keeper')) {
        currentRole = 'WK'
        continue
      } else if (line.toLowerCase().includes('batter') || line.toLowerCase().includes('batsman')) {
        currentRole = 'BAT'
        continue
      } else if (line.toLowerCase().includes('all') && line.toLowerCase().includes('rounder')) {
        currentRole = 'AR'
        continue
      } else if (line.toLowerCase().includes('bowler')) {
        currentRole = 'BOWL'
        continue
      }
      
      // Check if this line is a valid player name
      if (isValidPlayerName(line)) {
        // Look for credits in nearby lines
        let credits = 8.0 // default
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          const creditLine = lines[j].trim()
          const creditMatch = creditLine.match(/(\d+(?:\.\d+)?)\s*cr/i)
          if (creditMatch) {
            credits = parseFloat(creditMatch[1])
            break
          }
        }
        
        // Determine team based on position and role
        const team: 'team1' | 'team2' = players.length < 6 ? 'team1' : 'team2'
        
        const player: Player = {
          id: generatePlayerId(line),
          name: cleanPlayerName(line),
          team,
          role: currentRole,
          credits,
          isLocked: false,
          isExcluded: false
        }
        
        // Avoid duplicates
        if (!players.some(p => p.name === player.name)) {
          players.push(player)
        }
      }
    }
    
    result.players = players
  }
  
  return result
}

function createPlayer(name: string, team: 'team1' | 'team2', role: 'WK' | 'BAT' | 'AR' | 'BOWL', credits: number): Player {
  return {
    id: generatePlayerId(name),
    name,
    team,
    role,
    credits,
    isLocked: false,
    isExcluded: false
  }
}

export function cleanPlayerName(name: string): string {
  return name
    .replace(/[^\w\s.-]/g, '') // Remove special characters except dots and hyphens
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function normalizeRole(role: string): 'WK' | 'BAT' | 'AR' | 'BOWL' {
  const normalizedRole = role.toUpperCase()
  if (['WK', 'WICKET-KEEPER', 'KEEPER'].indexOf(normalizedRole) !== -1) return 'WK'
  if (['BAT', 'BATSMAN', 'BATTER'].indexOf(normalizedRole) !== -1) return 'BAT'
  if (['AR', 'ALL-ROUNDER', 'ALLROUNDER', 'ALL'].indexOf(normalizedRole) !== -1) return 'AR'
  if (['BOWL', 'BOWLER'].indexOf(normalizedRole) !== -1) return 'BOWL'
  return 'BAT' // Default fallback
}

export function isValidPlayerName(name: string): boolean {
  const cleaned = name.trim()
  return cleaned.length > 2 && 
         cleaned.length < 50 && 
         /^[a-zA-Z\s.-]+$/.test(cleaned) &&
         !/^(WK|BAT|AR|BOWL|ALL|CAPTAIN|C|VC|SEL|PTS|PLAYED|LAST|MATCH|\d+%?)$/i.test(cleaned) &&
         !cleaned.match(/^\d+$/) && // Not just numbers
         !cleaned.match(/^\d+%$/) // Not just percentages
}

function generatePlayerId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
}

function removeDuplicatePlayers(players: Player[]): Player[] {
  const seen = new Set<string>()
  return players.filter(player => {
    const key = player.name.toLowerCase().replace(/\s+/g, '')
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Parse manually entered player data
 */
export function parseManualPlayerData(csvText: string): Player[] {
  const lines = csvText.trim().split('\n')
  const players: Player[] = []
  
  // Skip header if present
  const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0
  
  for (let i = startIndex; i < lines.length; i++) {
    const columns = lines[i].split(',').map(col => col.trim())
    
    if (columns.length >= 4) {
      const [name, team, role, credits] = columns
      
      if (name && team && role && credits) {
        try {
          const player: Player = {
            id: generatePlayerId(name),
            name: cleanPlayerName(name),
            team: team.toLowerCase().includes('1') || team.toLowerCase().includes('a') ? 'team1' : 'team2',
            role: normalizeRole(role),
            credits: parseFloat(credits),
            isLocked: false,
            isExcluded: false
          }
          
          if (player.credits > 0 && player.credits <= 20) {
            players.push(player)
          }
        } catch (error) {
          console.warn(`Failed to parse player data: ${lines[i]}`)
        }
      }
    }
  }
  
  return removeDuplicatePlayers(players)
}

/**
 * Validate extracted player data
 */
export function validatePlayerData(players: Player[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (players.length < 8) {
    errors.push('At least 8 players are required')
  }
  
  if (players.length > 30) {
    errors.push('Too many players detected (maximum 30)')
  }
  
  const roles = players.reduce((acc, player) => {
    acc[player.role] = (acc[player.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  if (roles.WK < 1) {
    errors.push('At least 1 wicket-keeper is required')
  }
  
  if (roles.BAT < 3) {
    errors.push('At least 3 batsmen are required')
  }
  
  if (roles.BOWL < 3) {
    errors.push('At least 3 bowlers are required')
  }
  
  const teams = players.reduce((acc, player) => {
    acc[player.team] = (acc[player.team] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  if (Object.keys(teams).length < 2) {
    errors.push('Players from both teams are required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Enhanced parser specifically for Dream11 screenshots
 * Handles both mobile app list format and team formation view
 */
function parseDream11Screenshot(ocrText: string, confidence: number): OCRResult {
  const lines = ocrText.split('\n').filter(line => line.trim().length > 0)
  
  const result: OCRResult = {
    players: [],
    matchInfo: {
      team1: 'Team A',
      team2: 'Team B',
      format: 'T20'
    },
    confidence
  }

  // Look for team names in common patterns
  const teamPattern = /(WI|IND|AUS|ENG|SA|NZ|PAK|SL|BAN|AFG|IRE)\s*(\d+)?\s*:?\s*(\d+)?\s*(WI|IND|AUS|ENG|SA|NZ|PAK|SL|BAN|AFG|IRE)/i
  for (const line of lines) {
    const teamMatch = line.match(teamPattern)
    if (teamMatch) {
      result.matchInfo.team1 = teamMatch[1].toUpperCase()
      result.matchInfo.team2 = teamMatch[4].toUpperCase()
      break
    }
  }

  // Extract players using Dream11 mobile format
  const players: Player[] = []
  let currentRole: 'WK' | 'BAT' | 'AR' | 'BOWL' = 'BAT'
  let currentTeam: 'team1' | 'team2' = 'team1'
  
  // Common name patterns that might appear in the OCR
  const namePatterns = [
    /^[A-Z]\s*[A-Za-z]+$/,        // S Hope, J Inglis
    /^[A-Z]\s*[A-Za-z]+\s*[A-Z]?\s*[A-Za-z]*$/,  // K Brathwait..., U Khawaja
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase()
    const originalLine = lines[i].trim()
    
    // Detect role sections
    if (line.includes('wicket') || line.includes('keeper')) {
      currentRole = 'WK'
      continue
    } else if (line.includes('batter') || line.includes('batsman')) {
      currentRole = 'BAT'
      continue
    } else if (line.includes('all') && line.includes('rounder')) {
      currentRole = 'AR'
      continue
    } else if (line.includes('bowler')) {
      currentRole = 'BOWL'
      continue
    }
    
    // Skip non-player lines
    if (line.length < 2 || 
        /^(create|team|make|upload|sel%|pts|played|last|match|tomorrow|\d+:\d+)/.test(line) ||
        /^[\d%\s]+$/.test(line) ||
        /^(wicket|keeper|batter|rounder|bowler|credits|left|players)$/i.test(line)) {
      continue
    }
    
    // Check for position numbers to determine team switch
    if (/^\d+$/.test(line) && parseInt(line) === 1 && players.length > 0) {
      currentTeam = 'team2'
      continue
    }
    
    // Check for player name patterns
    const isPlayerName = namePatterns.some(pattern => pattern.test(originalLine)) ||
                        isValidPlayerName(originalLine)
    
    if (isPlayerName) {
      // Default values
      let role = currentRole
      let credits = 8.0
      let team: 'team1' | 'team2' = currentTeam
      
      // Look ahead for credits
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const checkLine = lines[j].trim()
        
        // Check for credits pattern
        const creditMatch = checkLine.match(/(\d+(?:\.\d+)?)\s*cr/i)
        if (creditMatch) {
          credits = parseFloat(creditMatch[1])
          break
        }
      }
      
      const playerName = cleanPlayerName(originalLine)
      if (playerName && players.length < 22 && !players.some(p => p.name === playerName)) {
        const player: Player = {
          id: generatePlayerId(playerName),
          name: playerName,
          team,
          role,
          credits,
          isLocked: false,
          isExcluded: false
        }
        players.push(player)
      }
    }
  }

  // If we found some players, use this result
  if (players.length >= 1) {
    result.players = removeDuplicatePlayers(players)
    
    // Assign teams more intelligently based on order
    result.players.forEach((player, index) => {
      // First half goes to team1, second half to team2
      player.team = index < Math.ceil(result.players.length / 2) ? 'team1' : 'team2'
    })
  }

  return result
}

/**
 * Extract only player names from OCR text (simplified version)
 * This function focuses on extracting just the names without full player objects
 */
export function extractPlayerNamesFromOCR(ocrText: string): string[] {
  // Try the formation view approach first
  const formationResult = parseTeamFormationView(ocrText, 0.8)
  if (formationResult.players.length > 0) {
    return formationResult.players.map((p: Player) => p.name)
  }
  
  // Fallback to general extraction
  const lines = ocrText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  const playerNames: string[] = []
  
  // Extract valid player names from OCR text
  for (const line of lines) {
    if (isValidPlayerName(line)) {
      const cleaned = cleanPlayerName(line)
      if (cleaned && cleaned.length > 3 && !playerNames.includes(cleaned)) {
        playerNames.push(cleaned)
      }
    }
  }
  
  return Array.from(new Set(playerNames))
}

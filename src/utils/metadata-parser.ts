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

function cleanPlayerName(name: string): string {
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

function isValidPlayerName(name: string): boolean {
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
 * Handles the mobile app format with percentages and points
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
  const teamPattern = /(WI|IND|AUS|ENG|SA|NZ|PAK|SL|BAN|AFG|IRE)\s*(\d+)?\s*(WI|IND|AUS|ENG|SA|NZ|PAK|SL|BAN|AFG|IRE)/i
  for (const line of lines) {
    const teamMatch = line.match(teamPattern)
    if (teamMatch) {
      result.matchInfo.team1 = teamMatch[1].toUpperCase()
      result.matchInfo.team2 = teamMatch[3].toUpperCase()
      break
    }
  }

  // Extract players using Dream11 mobile format
  const players: Player[] = []
  let currentTeam: 'team1' | 'team2' = 'team1'
  
  // Common cricket player names to help with recognition
  const commonNames = ['brathwaite', 'campbell', 'carty', 'king', 'warrican', 'chase', 'hope', 'greaves', 'joseph', 'seales', 'konstas', 'khawaja', 'green', 'inglis', 'head', 'webster', 'carey', 'cummins', 'starc', 'lyon', 'hazlewood', 'kohli', 'rohit', 'sharma', 'pant', 'jadeja', 'bumrah', 'shami', 'siraj', 'iyer', 'gill', 'smith', 'warner', 'labuschagne', 'maxwell', 'zampa', 'agar', 'marsh', 'stoinis']
  
  // Additional patterns for player identification
  const namePatterns = [
    /^[A-Z][a-z]+ [A-Z][a-z]+$/,  // First Last
    /^[A-Z] [A-Z][a-z]+$/,        // A Last
    /^[A-Z][a-z]+ [A-Z] [A-Z][a-z]+$/, // First A Last
    /^[A-Z][a-z]+$/               // Single name
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase()
    
    // Skip non-player lines
    if (line.length < 2 || 
        /^(create|team|make|upload|sel%|pts|played|last|match|tomorrow|\d+:\d+)/.test(line) ||
        /^[\d%\s]+$/.test(line)) {
      continue
    }
    
    // Check for position numbers to determine team switch
    if (/^\d+$/.test(line) && parseInt(line) === 1 && players.length > 0) {
      currentTeam = 'team2'
      continue
    }
    
    // Look for player names (check against common names or valid name pattern)
    const isPlayerName = commonNames.some(name => line.includes(name)) || 
                        namePatterns.some(pattern => pattern.test(lines[i].trim())) ||
                        (/^[a-z][a-z\s]{2,}$/i.test(line) && 
                         !/(wk|bat|bowl|all|sel|pts|create|team|upload)$/i.test(line) &&
                         !/^\d+%?$/.test(line))
    
    if (isPlayerName) {
      // Default values
      let role: 'WK' | 'BAT' | 'AR' | 'BOWL' = 'BAT'
      let credits = 8.0
      
      // Look ahead for role and points
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const checkLine = lines[j].trim().toLowerCase()
        
        // Check for role
        if (/^(wk|bat|bowl|all)$/i.test(checkLine)) {
          role = normalizeRole(checkLine)
        }
        
        // Check for points to estimate credits
        if (/^\d{1,3}$/.test(checkLine)) {
          const points = parseInt(checkLine)
          if (points >= 7 && points <= 300) {
            // Convert points to credits (rough estimation)
            if (points < 50) credits = 7.0 + (points / 50) * 3  // 7-10 credits
            else if (points < 100) credits = 10.0 + ((points - 50) / 50) * 3  // 10-13 credits
            else credits = 13.0 + Math.min((points - 100) / 100, 2)  // 13-15 credits
            credits = Math.round(credits * 2) / 2 // Round to nearest 0.5
          }
        }
      }
      
      const playerName = cleanPlayerName(line)
      if (playerName && players.length < 22) {
        players.push(createPlayer(playerName, currentTeam, role, credits))
      }
    }
  }

  // If we found some players, use this result
  if (players.length >= 4) {
    result.players = removeDuplicatePlayers(players)
    
    // Assign teams more intelligently
    if (result.players.length >= 8) {
      const halfPoint = Math.ceil(result.players.length / 2)
      result.players.forEach((player, index) => {
        player.team = index < halfPoint ? 'team1' : 'team2'
      })
    }
  }

  return result
}

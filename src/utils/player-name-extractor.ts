/**
 * Utility functions to extract only player names from OCR text
 * This is optimized for Dream11 screenshots and cricket player names
 */

import { cleanPlayerName, isValidPlayerName } from './metadata-parser'

/**
 * Cricket-specific name patterns that are commonly found in Dream11
 */
const CRICKET_NAME_PATTERNS = [
  /^[A-Z]\s+[A-Z][a-z]{3,}$/,           // S Hope, J Inglis, K Brathwaite, U Khawaja, K Carty
  /^[A-Z]\s+[A-Z][a-z]{2,}$/,           // J Warrican, A Joseph
  /^[A-Z][a-z]{1,2}\s+[A-Z][a-z]{2,}$/,  // MS Dhoni, KL Rahul  
  /^[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}$/,   // Virat Kohli, Babar Azam
  /^[A-Z]{1,2}\s+[A-Z][a-z]{2,}$/,       // AB de Villiers, DJ Bravo
  /^[A-Z]\s+[A-Z][a-z]{5,}$/,           // B Webster, J Greaves
  /^[A-Z]\s+[A-Z][a-z]{4,}$/,           // P Cummins, M Starc
]

/**
 * Words that should be excluded as they're not player names
 */
const EXCLUDED_WORDS = [
  'wicket', 'keeper', 'keepers', 'batter', 'batters', 'batsman', 'batsmen',
  'bowler', 'bowlers', 'rounder', 'rounders', 'all-rounder', 'all-rounders',
  'captain', 'vice', 'create', 'team', 'make', 'upload', 'credits', 'left',
  'players', 'omkar', 'vindictive', 'dream11', 'match', 'today', 'tomorrow',
  'played', 'last', 'points', 'selected', 'sel', 'pts', 'cr', 'crores',
  'lakhs', 'millions', 'percentage', 'stats', 'average', 'strike', 'rate',
  'economy', 'innings', 'runs', 'wickets', 'catches', 'stumps', 'overs',
  'balls', 'fours', 'sixes', 'boundaries', 'maiden', 'no-ball', 'wide',
  'bye', 'leg-bye', 'extras', 'total', 'target', 'chase', 'defend',
  'toss', 'win', 'loss', 'draw', 'tie', 'result', 'venue', 'ground',
  'weather', 'pitch', 'conditions', 'forecast', 'probability', 'odds',
  'fantasy', 'prediction', 'tips', 'analysis', 'preview', 'review',
  'app', 'store', 'wi', 'aus', 'ind', 'pak', 'eng', 'sa', 'nz', 'sri',
  'ban', 'afg', 'ire', 'sco', 't20', 'odi', 'test', 'ipl', 'bbl', 'psl',
  'cpl', 'lpl', 'hundred', 'blast', 'county', 'shield', 'trophy', 'cup',
  'series', 'tour', 'league', 'championship', 'tournament', 'final', 'semi',
  'quarter', 'group', 'stage', 'round', 'qualifier', 'eliminator', 'playoff',
  'distribution', 'captain', 'captains', 'mo', 'em', 'mkar', 'vindictive'
]

/**
 * Extract only player names from OCR text
 * This function is specifically designed for Dream11 screenshots
 */
export function extractPlayerNamesOnly(ocrText: string): string[] {
  const lines = ocrText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  const playerNames: string[] = []
  
  for (const line of lines) {
    // Skip obvious non-player lines
    if (shouldSkipLine(line)) {
      continue
    }
    
    // Check if line matches cricket name patterns
    const matchesPattern = CRICKET_NAME_PATTERNS.some(pattern => pattern.test(line))
    
    if (matchesPattern || isValidPlayerName(line)) {
      const cleanedName = cleanPlayerName(line)
      
      // Additional validation for cricket names
      if (isLikelyCricketPlayerName(cleanedName)) {
        playerNames.push(cleanedName)
      }
    }
  }
  
  // Remove duplicates and return
  return Array.from(new Set(playerNames))
}

/**
 * Check if a line should be skipped (not a player name)
 */
function shouldSkipLine(line: string): boolean {
  const lowerLine = line.toLowerCase()
  
  // Skip lines that are too short or too long
  if (line.length < 3 || line.length > 30) {
    return true
  }
  
  // Skip lines with numbers only or percentages
  if (/^\d+$/.test(line) || /^\d+%$/.test(line) || /^\d+\.\d+$/.test(line)) {
    return true
  }
  
  // Skip lines with credit values (e.g., "7.5 Cr", "8 Cr")
  if (/^\d+(?:\.\d+)?\s*cr$/i.test(line)) {
    return true
  }
  
  // Skip role and credit patterns (e.g., "BAT • 8cr • T1")
  if (/^(WK|BAT|AR|BOWL)\s*•\s*\d+(?:\.\d+)?cr\s*•\s*T\d+$/i.test(line)) {
    return true
  }
  
  // Skip timestamp patterns
  if (/^\d{1,2}:\d{2}$/.test(line)) {
    return true
  }
  
  // Skip common UI elements and section headers
  if (/^(wicket-keepers?|batters?|all-rounders?|bowlers?)$/i.test(line)) {
    return true
  }
  
  // Skip common app text
  if (/^(app store|credits left|players|mo|em|captain distribution|selected captains)$/i.test(line)) {
    return true
  }
  
  // Skip match format indicators
  if (/^(wi|aus|ind|pak|eng|sa|nz|sri|ban|afg|ire|sco)$/i.test(line)) {
    return true
  }
  
  // Skip score patterns like "6:5"
  if (/^\d+:\d+$/.test(line)) {
    return true
  }
  
  // Skip battery percentage patterns
  if (/^\d{1,3}%?$/.test(line) || line === '76') {
    return true
  }
  
  // Skip percentage patterns like "40%", "15%"
  if (/^\d{1,2}%$/.test(line)) {
    return true
  }
  
  // Skip lines that start with numbers followed by text (like "100%)")
  if (/^\d+.*\)$/.test(line)) {
    return true
  }
  
  // Skip excluded words
  if (EXCLUDED_WORDS.some(word => lowerLine.includes(word))) {
    return true
  }
  
  // Skip lines with only special characters or numbers
  if (/^[^a-zA-Z]*$/.test(line)) {
    return true
  }
  
  // Skip lines that are clearly UI elements (contain dots and numbers)
  if (/^\.+\d+$/.test(line)) {
    return true
  }
  
  return false
}

/**
 * Check if a cleaned name is likely a cricket player name
 */
function isLikelyCricketPlayerName(name: string): boolean {
  // Empty or too short
  if (!name || name.length < 3) {
    return false
  }
  
  // Check if it matches typical cricket name patterns
  const matchesPattern = CRICKET_NAME_PATTERNS.some(pattern => pattern.test(name))
  
  // Additional checks for cricket names
  const words = name.split(' ')
  const hasValidWordCount = words.length >= 2 && words.length <= 4
  const hasProperCapitalization = words.every(word => 
    word.length > 0 && word[0] === word[0].toUpperCase()
  )
  
  // Should contain only letters, spaces, dots, hyphens
  const hasValidCharacters = /^[a-zA-Z\s.-]+$/.test(name)
  
  return matchesPattern && hasValidWordCount && hasProperCapitalization && hasValidCharacters
}

/**
 * Enhanced extraction specifically for Dream11 formation view
 * This handles the specific layout but extracts from actual OCR text
 */
export function extractPlayersFromFormationView(ocrText: string): string[] {
  const playerNames: string[] = []
  
  // First try general extraction
  const generallyExtracted = extractPlayerNamesOnly(ocrText)
  
  // Look for formation view indicators
  const text = ocrText.toLowerCase()
  const isFormationView = text.includes('wicket') && text.includes('keeper') && 
                         (text.includes('batter') || text.includes('bowler'))
  
  if (isFormationView) {
    // Extract from formation view by parsing sections
    const lines = ocrText.split('\n').filter(line => line.trim().length > 0)
    let currentRole = ''
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Track current section
      if (trimmedLine.toLowerCase().includes('wicket')) {
        currentRole = 'WK'
        continue
      } else if (trimmedLine.toLowerCase().includes('batter')) {
        currentRole = 'BAT'
        continue
      } else if (trimmedLine.toLowerCase().includes('rounder')) {
        currentRole = 'AR'
        continue
      } else if (trimmedLine.toLowerCase().includes('bowler')) {
        currentRole = 'BOWL'
        continue
      }
      
      // Extract player names from current section
      if (isLikelyCricketPlayerName(trimmedLine)) {
        const cleaned = cleanPlayerName(trimmedLine)
        if (cleaned && !playerNames.includes(cleaned)) {
          playerNames.push(cleaned)
        }
      }
    }
  }
  
  // Combine and deduplicate
  const allNames = [...playerNames, ...generallyExtracted]
  return Array.from(new Set(allNames))
}

/**
 * Simple regex-based extraction for basic use cases
 */
export function extractPlayerNamesSimple(ocrText: string): string[] {
  // Match patterns like "S Hope", "K Brathwaite", etc.
  const namePattern = /\b([A-Z][a-z]{0,2}\s+[A-Z][a-z]{3,})\b/g
  const matches = ocrText.match(namePattern) || []
  
  return matches
    .map(name => cleanPlayerName(name))
    .filter(name => name.length > 3)
    .filter(name => !EXCLUDED_WORDS.some(word => 
      name.toLowerCase().includes(word.toLowerCase())
    ))
}

/**
 * Enhanced Dream11 specific extraction
 * Looks for patterns where player names appear above credit values
 */
export function extractDream11Players(ocrText: string): string[] {
  const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const playerNames: string[] = []
  
  // Debug: Log all lines to understand OCR output
  console.log('OCR Lines:', lines)
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]
    const nextLine = lines[i + 1]
    const nextNextLine = lines[i + 2]
    
    // Skip obvious UI elements first
    if (shouldSkipLine(currentLine)) {
      continue
    }
    
    // Look for very specific Dream11 patterns
    // Pattern 1: Player name followed by role and credit (e.g., "S Hope", "WK • 7.5cr")
    if (isLikelyCricketPlayerName(currentLine)) {
      // Check if next line contains role and credit info
      if (nextLine && /(WK|BAT|AR|BOWL).*\d+(?:\.\d+)?cr/i.test(nextLine)) {
        const cleaned = cleanPlayerName(currentLine)
        if (cleaned && !playerNames.includes(cleaned)) {
          playerNames.push(cleaned)
        }
        continue
      }
      
      // Pattern 2: Player name followed by credit value only
      if (nextLine && /^\d+(?:\.\d+)?\s*cr$/i.test(nextLine)) {
        const cleaned = cleanPlayerName(currentLine)
        if (cleaned && !playerNames.includes(cleaned)) {
          playerNames.push(cleaned)
        }
        continue
      }
      
      // Pattern 3: Player name followed by "BAT • 8cr • T1" format
      if (nextLine && /^(WK|BAT|AR|BOWL)\s*•\s*\d+(?:\.\d+)?cr\s*•\s*T\d+$/i.test(nextLine)) {
        const cleaned = cleanPlayerName(currentLine)
        if (cleaned && !playerNames.includes(cleaned)) {
          playerNames.push(cleaned)
        }
        continue
      }
    }
    
    // Pattern 4: Look for names in middle of role-credit sandwich
    if (nextLine && nextNextLine && 
        /(WK|BAT|AR|BOWL)/i.test(currentLine) &&
        isLikelyCricketPlayerName(nextLine) &&
        /\d+(?:\.\d+)?cr/i.test(nextNextLine)) {
      const cleaned = cleanPlayerName(nextLine)
      if (cleaned && !playerNames.includes(cleaned)) {
        playerNames.push(cleaned)
      }
    }
  }
  
  // If we didn't find any players with the specific patterns, fall back to general extraction
  if (playerNames.length === 0) {
    console.log('No Dream11 patterns found, falling back to general extraction')
    return extractPlayerNamesOnly(ocrText)
  }
  
  console.log('Found Dream11 players:', playerNames)
  return playerNames
}

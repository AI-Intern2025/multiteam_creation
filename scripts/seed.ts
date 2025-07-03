import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, players, matches, type NewPlayer, type NewMatch } from '../src/db'

const sampleMatch: NewMatch = {
  team1: 'WI',
  team2: 'AUS', 
  format: 'T20',
  venue: 'Adelaide Oval',
  matchDate: new Date('2025-01-10T14:30:00Z'),
  isActive: true
}

const samplePlayers: NewPlayer[] = [
  // West Indies Team
  {
    name: 'K Brathwaite',
    fullName: 'Kraigg Brathwaite',
    team: 'WI',
    role: 'BAT',
    credits: 8.5,
    selectionPercentage: 25,
    points: 28,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'J Campbell',
    fullName: 'John Campbell',
    team: 'WI',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 19,
    points: 39,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'K Carty',
    fullName: 'Keacy Carty',
    team: 'WI',
    role: 'BAT',
    credits: 8.5,
    selectionPercentage: 52,
    points: 47,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'B King',
    fullName: 'Brandon King',
    team: 'WI',
    role: 'BAT',
    credits: 9.0,
    selectionPercentage: 32,
    points: 30,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'J Warrican',
    fullName: 'Jomel Warrican',
    team: 'WI',
    role: 'BOWL',
    credits: 7.5,
    selectionPercentage: 9,
    points: 7,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Slow left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'R Chase',
    fullName: 'Roston Chase',
    team: 'WI',
    role: 'ALL',
    credits: 9.5,
    selectionPercentage: 68,
    points: 85,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'S Hope',
    fullName: 'Shai Hope',
    team: 'WI',
    role: 'WK',
    credits: 10.0,
    selectionPercentage: 75,
    points: 99,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'J Greaves',
    fullName: 'Justin Greaves',
    team: 'WI',
    role: 'ALL',
    credits: 8.0,
    selectionPercentage: 42,
    points: 110,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'A Joseph',
    fullName: 'Alzarri Joseph',
    team: 'WI',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 30,
    points: 71,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'S Joseph',
    fullName: 'Shamar Joseph',
    team: 'WI',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 73,
    points: 274,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'J Seales',
    fullName: 'Jayden Seales',
    team: 'WI',
    role: 'BOWL',
    credits: 8.0,
    selectionPercentage: 39,
    points: 118,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },

  // Australia Team
  {
    name: 'S Konstas',
    fullName: 'Sam Konstas',
    team: 'AUS',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 23,
    points: 36,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'U Khawaja',
    fullName: 'Usman Khawaja',
    team: 'AUS',
    role: 'BAT',
    credits: 9.5,
    selectionPercentage: 64,
    points: 81,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'C Green',
    fullName: 'Cameron Green',
    team: 'AUS',
    role: 'ALL',
    credits: 9.0,
    selectionPercentage: 39,
    points: 32,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'J Inglis',
    fullName: 'Josh Inglis',
    team: 'AUS',
    role: 'WK',
    credits: 8.5,
    selectionPercentage: 46,
    points: 21,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'T Head',
    fullName: 'Travis Head',
    team: 'AUS',
    role: 'BAT',
    credits: 10.5,
    selectionPercentage: 90,
    points: 149,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'B Webster',
    fullName: 'Beau Webster',
    team: 'AUS',
    role: 'ALL',
    credits: 8.5,
    selectionPercentage: 69,
    points: 139,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'A Carey',
    fullName: 'Alex Carey',
    team: 'AUS',
    role: 'WK',
    credits: 9.0,
    selectionPercentage: 40,
    points: 141,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'P Cummins',
    fullName: 'Pat Cummins',
    team: 'AUS',
    role: 'BOWL',
    credits: 11.0,
    selectionPercentage: 85,
    points: 110,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'M Starc',
    fullName: 'Mitchell Starc',
    team: 'AUS',
    role: 'BOWL',
    credits: 10.5,
    selectionPercentage: 79,
    points: 95,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast',
    isPlayingToday: true
  },
  {
    name: 'N Lyon',
    fullName: 'Nathan Lyon',
    team: 'AUS',
    role: 'BOWL',
    credits: 9.0,
    selectionPercentage: 11,
    points: 77,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'J Hazlewood',
    fullName: 'Josh Hazlewood',
    team: 'AUS',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 77,
    points: 166,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  }
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')
    
    // Insert match
    console.log('📅 Creating match...')
    const [match] = await db.insert(matches).values(sampleMatch).returning()
    console.log(`✅ Match created: ${match.team1} vs ${match.team2}`)
    
    // Insert players
    console.log('👥 Creating players...')
    const insertedPlayers = await db.insert(players).values(samplePlayers).returning()
    console.log(`✅ ${insertedPlayers.length} players created`)
    
    console.log('🎉 Database seeded successfully!')
    
    // Display summary
    console.log('\n📊 Summary:')
    console.log(`Match: ${match.team1} vs ${match.team2}`)
    console.log(`Total Players: ${insertedPlayers.length}`)
    console.log(`WI Players: ${insertedPlayers.filter(p => p.team === 'WI').length}`)
    console.log(`AUS Players: ${insertedPlayers.filter(p => p.team === 'AUS').length}`)
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seed()
}

import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, players, matches, type NewPlayer, type NewMatch } from '../src/db'

// Multiple matches for realistic data
const matchesData: NewMatch[] = [
  {
    team1: 'WI',
    team2: 'AUS',
    format: 'T20',
    venue: 'Kensington Oval, Barbados',
    matchDate: new Date('2025-07-04T14:30:00Z'),
    isActive: true
  },
  {
    team1: 'IND',
    team2: 'ENG',
    format: 'ODI',
    venue: 'Lord\'s, London',
    matchDate: new Date('2025-07-05T10:30:00Z'),
    isActive: true
  },
  {
    team1: 'PAK',
    team2: 'SA',
    format: 'T20',
    venue: 'Gaddafi Stadium, Lahore',
    matchDate: new Date('2025-07-06T19:00:00Z'),
    isActive: true
  },
  {
    team1: 'NZ',
    team2: 'SL',
    format: 'ODI',
    venue: 'Eden Park, Auckland',
    matchDate: new Date('2025-07-07T02:30:00Z'),
    isActive: true
  },
  {
    team1: 'BAN',
    team2: 'AFG',
    format: 'T20',
    venue: 'Shere Bangla National Stadium, Dhaka',
    matchDate: new Date('2025-07-08T08:00:00Z'),
    isActive: true
  }
]

// WI vs AUS Players (Match 1)
const wiAusPlayers: NewPlayer[] = [
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
    credits: 9.0,
    selectionPercentage: 32,
    points: 45,
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
    credits: 9.5,
    selectionPercentage: 42,
    points: 52,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'S Hope',
    fullName: 'Shai Hope',
    team: 'WI',
    role: 'WK',
    credits: 10.0,
    selectionPercentage: 68,
    points: 74,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'R Chase',
    fullName: 'Roston Chase',
    team: 'WI',
    role: 'AR',
    credits: 8.5,
    selectionPercentage: 35,
    points: 41,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'J Greaves',
    fullName: 'Justin Greaves',
    team: 'WI',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 22,
    points: 31,
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
    credits: 9.0,
    selectionPercentage: 48,
    points: 56,
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
    selectionPercentage: 29,
    points: 38,
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
    credits: 8.5,
    selectionPercentage: 33,
    points: 42,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'J Warrican',
    fullName: 'Jomel Warrican',
    team: 'WI',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 18,
    points: 27,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },

  // Australia Team
  {
    name: 'S Konstas',
    fullName: 'Sam Konstas',
    team: 'AUS',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 15,
    points: 22,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'U Khawaja',
    fullName: 'Usman Khawaja',
    team: 'AUS',
    role: 'BAT',
    credits: 9.5,
    selectionPercentage: 55,
    points: 67,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'T Head',
    fullName: 'Travis Head',
    team: 'AUS',
    role: 'BAT',
    credits: 10.5,
    selectionPercentage: 72,
    points: 89,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'C Green',
    fullName: 'Cameron Green',
    team: 'AUS',
    role: 'AR',
    credits: 9.5,
    selectionPercentage: 61,
    points: 78,
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
    credits: 9.0,
    selectionPercentage: 47,
    points: 58,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'A Carey',
    fullName: 'Alex Carey',
    team: 'AUS',
    role: 'WK',
    credits: 8.5,
    selectionPercentage: 38,
    points: 46,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'B Webster',
    fullName: 'Beau Webster',
    team: 'AUS',
    role: 'AR',
    credits: 8.0,
    selectionPercentage: 25,
    points: 34,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'P Cummins',
    fullName: 'Pat Cummins',
    team: 'AUS',
    role: 'BOWL',
    credits: 11.0,
    selectionPercentage: 85,
    points: 96,
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
    selectionPercentage: 78,
    points: 88,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast',
    isPlayingToday: true
  },
  {
    name: 'J Hazlewood',
    fullName: 'Josh Hazlewood',
    team: 'AUS',
    role: 'BOWL',
    credits: 10.0,
    selectionPercentage: 69,
    points: 81,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'N Lyon',
    fullName: 'Nathan Lyon',
    team: 'AUS',
    role: 'BOWL',
    credits: 9.0,
    selectionPercentage: 43,
    points: 54,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  }
]

// IND vs ENG Players (Match 2)
const indEngPlayers: NewPlayer[] = [
  // India Team
  {
    name: 'V Kohli',
    fullName: 'Virat Kohli',
    team: 'IND',
    role: 'BAT',
    credits: 12.0,
    selectionPercentage: 92,
    points: 105,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    isPlayingToday: true
  },
  {
    name: 'R Sharma',
    fullName: 'Rohit Sharma',
    team: 'IND',
    role: 'BAT',
    credits: 11.5,
    selectionPercentage: 88,
    points: 98,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'S Gill',
    fullName: 'Shubman Gill',
    team: 'IND',
    role: 'BAT',
    credits: 10.0,
    selectionPercentage: 65,
    points: 76,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'S Iyer',
    fullName: 'Shreyas Iyer',
    team: 'IND',
    role: 'BAT',
    credits: 9.5,
    selectionPercentage: 52,
    points: 63,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'R Pant',
    fullName: 'Rishabh Pant',
    team: 'IND',
    role: 'WK',
    credits: 11.0,
    selectionPercentage: 83,
    points: 91,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'H Pandya',
    fullName: 'Hardik Pandya',
    team: 'IND',
    role: 'AR',
    credits: 10.5,
    selectionPercentage: 74,
    points: 85,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'R Jadeja',
    fullName: 'Ravindra Jadeja',
    team: 'IND',
    role: 'AR',
    credits: 10.0,
    selectionPercentage: 71,
    points: 82,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'J Bumrah',
    fullName: 'Jasprit Bumrah',
    team: 'IND',
    role: 'BOWL',
    credits: 11.5,
    selectionPercentage: 94,
    points: 108,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'M Shami',
    fullName: 'Mohammed Shami',
    team: 'IND',
    role: 'BOWL',
    credits: 10.5,
    selectionPercentage: 76,
    points: 87,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'M Siraj',
    fullName: 'Mohammed Siraj',
    team: 'IND',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 58,
    points: 69,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'K Yadav',
    fullName: 'Kuldeep Yadav',
    team: 'IND',
    role: 'BOWL',
    credits: 9.0,
    selectionPercentage: 44,
    points: 55,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm wrist-spin',
    isPlayingToday: true
  },

  // England Team
  {
    name: 'J Root',
    fullName: 'Joe Root',
    team: 'ENG',
    role: 'BAT',
    credits: 11.0,
    selectionPercentage: 79,
    points: 92,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'H Brook',
    fullName: 'Harry Brook',
    team: 'ENG',
    role: 'BAT',
    credits: 10.5,
    selectionPercentage: 68,
    points: 79,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'Z Crawley',
    fullName: 'Zak Crawley',
    team: 'ENG',
    role: 'BAT',
    credits: 9.5,
    selectionPercentage: 45,
    points: 56,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'B Duckett',
    fullName: 'Ben Duckett',
    team: 'ENG',
    role: 'BAT',
    credits: 9.0,
    selectionPercentage: 41,
    points: 52,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'J Buttler',
    fullName: 'Jos Buttler',
    team: 'ENG',
    role: 'WK',
    credits: 10.5,
    selectionPercentage: 73,
    points: 84,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'B Stokes',
    fullName: 'Ben Stokes',
    team: 'ENG',
    role: 'AR',
    credits: 11.0,
    selectionPercentage: 81,
    points: 93,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'M Ali',
    fullName: 'Moeen Ali',
    team: 'ENG',
    role: 'AR',
    credits: 9.0,
    selectionPercentage: 48,
    points: 59,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'J Anderson',
    fullName: 'James Anderson',
    team: 'ENG',
    role: 'BOWL',
    credits: 10.0,
    selectionPercentage: 62,
    points: 73,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'S Broad',
    fullName: 'Stuart Broad',
    team: 'ENG',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 54,
    points: 65,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'M Wood',
    fullName: 'Mark Wood',
    team: 'ENG',
    role: 'BOWL',
    credits: 9.0,
    selectionPercentage: 46,
    points: 57,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'A Rashid',
    fullName: 'Adil Rashid',
    team: 'ENG',
    role: 'BOWL',
    credits: 8.5,
    selectionPercentage: 37,
    points: 48,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm leg-break',
    isPlayingToday: true
  }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    console.log('🗑️ Clearing existing data...')
    await db.delete(players)
    await db.delete(matches)

    // Insert matches
    console.log('🏏 Inserting matches...')
    const insertedMatches = await db.insert(matches).values(matchesData).returning()
    console.log(`✅ Added ${insertedMatches.length} matches`)

    // Insert all players
    console.log('👥 Inserting players...')
    const allPlayers = [...wiAusPlayers, ...indEngPlayers]
    const insertedPlayers = await db.insert(players).values(allPlayers).returning()
    console.log(`✅ Added ${insertedPlayers.length} players`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- ${insertedMatches.length} matches added`)
    console.log(`- ${insertedPlayers.length} players added`)
    console.log(`- ${wiAusPlayers.length} WI vs AUS players`)
    console.log(`- ${indEngPlayers.length} IND vs ENG players`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })

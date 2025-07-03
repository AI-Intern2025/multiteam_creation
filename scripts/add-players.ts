import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, players, type NewPlayer } from '../src/db'

// Additional cricket players for different teams/matches
const additionalPlayers: NewPlayer[] = [
  // India Players
  {
    name: 'V Kohli',
    fullName: 'Virat Kohli',
    team: 'IND',
    role: 'BAT',
    credits: 11.5,
    selectionPercentage: 85,
    points: 145,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'R Sharma',
    fullName: 'Rohit Sharma',
    team: 'IND',
    role: 'BAT',
    credits: 12.0,
    selectionPercentage: 90,
    points: 162,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'KL Rahul',
    fullName: 'KL Rahul',
    team: 'IND',
    role: 'WK',
    credits: 10.5,
    selectionPercentage: 75,
    points: 134,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'R Pant',
    fullName: 'Rishabh Pant',
    team: 'IND',
    role: 'WK',
    credits: 10.0,
    selectionPercentage: 70,
    points: 128,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'R Jadeja',
    fullName: 'Ravindra Jadeja',
    team: 'IND',
    role: 'ALL',
    credits: 9.5,
    selectionPercentage: 82,
    points: 156,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Slow left-arm orthodox',
    isPlayingToday: true
  },
  {
    name: 'J Bumrah',
    fullName: 'Jasprit Bumrah',
    team: 'IND',
    role: 'BOWL',
    credits: 11.5,
    selectionPercentage: 95,
    points: 187,
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
    selectionPercentage: 78,
    points: 143,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'M Siraj',
    fullName: 'Mohammed Siraj',
    team: 'IND',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 72,
    points: 138,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  },
  {
    name: 'S Iyer',
    fullName: 'Shreyas Iyer',
    team: 'IND',
    role: 'BAT',
    credits: 9.0,
    selectionPercentage: 65,
    points: 119,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'S Gill',
    fullName: 'Shubman Gill',
    team: 'IND',
    role: 'BAT',
    credits: 9.5,
    selectionPercentage: 68,
    points: 125,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },

  // England Players
  {
    name: 'J Root',
    fullName: 'Joe Root',
    team: 'ENG',
    role: 'BAT',
    credits: 11.0,
    selectionPercentage: 88,
    points: 165,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'B Stokes',
    fullName: 'Ben Stokes',
    team: 'ENG',
    role: 'ALL',
    credits: 10.5,
    selectionPercentage: 85,
    points: 158,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },
  {
    name: 'J Buttler',
    fullName: 'Jos Buttler',
    team: 'ENG',
    role: 'WK',
    credits: 10.0,
    selectionPercentage: 82,
    points: 147,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'J Anderson',
    fullName: 'James Anderson',
    team: 'ENG',
    role: 'BOWL',
    credits: 9.5,
    selectionPercentage: 75,
    points: 142,
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
    credits: 9.0,
    selectionPercentage: 70,
    points: 135,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: true
  },

  // Additional common name variations
  {
    name: 'Kohli',
    fullName: 'Virat Kohli',
    team: 'IND',
    role: 'BAT',
    credits: 11.5,
    selectionPercentage: 85,
    points: 145,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: true
  },
  {
    name: 'Rohit',
    fullName: 'Rohit Sharma',
    team: 'IND',
    role: 'BAT',
    credits: 12.0,
    selectionPercentage: 90,
    points: 162,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: true
  },
  {
    name: 'Bumrah',
    fullName: 'Jasprit Bumrah',
    team: 'IND',
    role: 'BOWL',
    credits: 11.5,
    selectionPercentage: 95,
    points: 187,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: true
  }
]

async function addMorePlayers() {
  try {
    console.log('🌱 Adding more cricket players to database...')
    
    // Insert additional players
    console.log('👥 Creating additional players...')
    const insertedPlayers = await db.insert(players).values(additionalPlayers).returning()
    console.log(`✅ ${insertedPlayers.length} additional players created`)
    
    console.log('🎉 Database expanded successfully!')
    
    // Display summary
    console.log('\n📊 Summary:')
    console.log(`Additional Players: ${insertedPlayers.length}`)
    console.log(`IND Players: ${insertedPlayers.filter(p => p.team === 'IND').length}`)
    console.log(`ENG Players: ${insertedPlayers.filter(p => p.team === 'ENG').length}`)
    console.log(`Total Players in DB: ${await db.select().from(players).then(r => r.length)}`)
    
  } catch (error) {
    console.error('❌ Addition failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  addMorePlayers()
}

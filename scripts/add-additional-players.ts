import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, players, type NewPlayer } from '../src/db'

// Additional players for each team (4 more per team to make 15 total)
const additionalPlayers: NewPlayer[] = [
  // Additional WI Players
  {
    name: 'K Brathwaite',
    fullName: 'Kraigg Brathwaite',
    team: 'WI',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 35,
    points: 48,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'R Chase',
    fullName: 'Roston Chase',
    team: 'WI',
    role: 'AR',
    credits: 7.0,
    selectionPercentage: 28,
    points: 38,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: false
  },
  {
    name: 'J Blackwood',
    fullName: 'Jermaine Blackwood',
    team: 'WI',
    role: 'BAT',
    credits: 6.5,
    selectionPercentage: 22,
    points: 28,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'O McCoy',
    fullName: 'Obed McCoy',
    team: 'WI',
    role: 'BOWL',
    credits: 6.0,
    selectionPercentage: 18,
    points: 24,
    matchTeam: 'team1',
    country: 'WI',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast-medium',
    isPlayingToday: false
  },
  
  // Additional AUS Players
  {
    name: 'U Khawaja',
    fullName: 'Usman Khawaja',
    team: 'AUS',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 42,
    points: 58,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'C Green',
    fullName: 'Cameron Green',
    team: 'AUS',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 38,
    points: 52,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  {
    name: 'A Carey',
    fullName: 'Alex Carey',
    team: 'AUS',
    role: 'WK',
    credits: 7.0,
    selectionPercentage: 32,
    points: 44,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'S Abbott',
    fullName: 'Sean Abbott',
    team: 'AUS',
    role: 'BOWL',
    credits: 6.5,
    selectionPercentage: 26,
    points: 34,
    matchTeam: 'team2',
    country: 'AUS',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  
  // Additional IND Players
  {
    name: 'K Rahul',
    fullName: 'KL Rahul',
    team: 'IND',
    role: 'WK',
    credits: 8.5,
    selectionPercentage: 45,
    points: 68,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'I Kishan',
    fullName: 'Ishan Kishan',
    team: 'IND',
    role: 'WK',
    credits: 7.5,
    selectionPercentage: 35,
    points: 48,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'S Gill',
    fullName: 'Shubman Gill',
    team: 'IND',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 42,
    points: 58,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'A Patel',
    fullName: 'Axar Patel',
    team: 'IND',
    role: 'AR',
    credits: 7.0,
    selectionPercentage: 32,
    points: 42,
    matchTeam: 'team1',
    country: 'IND',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: false
  },
  
  // Additional ENG Players
  {
    name: 'D Malan',
    fullName: 'Dawid Malan',
    team: 'ENG',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 44,
    points: 62,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'L Livingstone',
    fullName: 'Liam Livingstone',
    team: 'ENG',
    role: 'AR',
    credits: 7.5,
    selectionPercentage: 38,
    points: 52,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm leg-break',
    isPlayingToday: false
  },
  {
    name: 'C Woakes',
    fullName: 'Chris Woakes',
    team: 'ENG',
    role: 'AR',
    credits: 7.0,
    selectionPercentage: 34,
    points: 46,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  {
    name: 'O Robinson',
    fullName: 'Ollie Robinson',
    team: 'ENG',
    role: 'BOWL',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team2',
    country: 'ENG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  
  // Additional PAK Players
  {
    name: 'S Khan',
    fullName: 'Sarfaraz Khan',
    team: 'PAK',
    role: 'WK',
    credits: 7.5,
    selectionPercentage: 35,
    points: 48,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'U Mir',
    fullName: 'Usama Mir',
    team: 'PAK',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 32,
    points: 42,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm leg-break',
    isPlayingToday: false
  },
  {
    name: 'S Ayub',
    fullName: 'Saim Ayub',
    team: 'PAK',
    role: 'BAT',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'H Ali',
    fullName: 'Hasan Ali',
    team: 'PAK',
    role: 'BOWL',
    credits: 6.0,
    selectionPercentage: 24,
    points: 32,
    matchTeam: 'team1',
    country: 'PAK',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: false
  },
  
  // Additional SA Players
  {
    name: 'A Markram',
    fullName: 'Aiden Markram',
    team: 'SA',
    role: 'BAT',
    credits: 8.0,
    selectionPercentage: 42,
    points: 58,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: false
  },
  {
    name: 'H Klaasen',
    fullName: 'Heinrich Klaasen',
    team: 'SA',
    role: 'WK',
    credits: 7.5,
    selectionPercentage: 38,
    points: 52,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'L Ngidi',
    fullName: 'Lungi Ngidi',
    team: 'SA',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 34,
    points: 46,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast',
    isPlayingToday: false
  },
  {
    name: 'S Harmer',
    fullName: 'Simon Harmer',
    team: 'SA',
    role: 'BOWL',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team2',
    country: 'SA',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: false
  },
  
  // Additional NZ Players
  {
    name: 'W Young',
    fullName: 'Will Young',
    team: 'NZ',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 36,
    points: 48,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'T Blundell',
    fullName: 'Tom Blundell',
    team: 'NZ',
    role: 'WK',
    credits: 7.0,
    selectionPercentage: 32,
    points: 42,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'K Jamieson',
    fullName: 'Kyle Jamieson',
    team: 'NZ',
    role: 'AR',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  {
    name: 'A Patel',
    fullName: 'Ajaz Patel',
    team: 'NZ',
    role: 'BOWL',
    credits: 6.0,
    selectionPercentage: 24,
    points: 32,
    matchTeam: 'team1',
    country: 'NZ',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: false
  },
  
  // Additional SL Players
  {
    name: 'D Karunaratne',
    fullName: 'Dimuth Karunaratne',
    team: 'SL',
    role: 'BAT',
    credits: 7.5,
    selectionPercentage: 38,
    points: 52,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'N Dickwella',
    fullName: 'Niroshan Dickwella',
    team: 'SL',
    role: 'WK',
    credits: 7.0,
    selectionPercentage: 32,
    points: 44,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'P Jayasuriya',
    fullName: 'Prabath Jayasuriya',
    team: 'SL',
    role: 'BOWL',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Left-arm orthodox',
    isPlayingToday: false
  },
  {
    name: 'K Asalanka',
    fullName: 'Kamindu Mendis',
    team: 'SL',
    role: 'AR',
    credits: 6.0,
    selectionPercentage: 24,
    points: 32,
    matchTeam: 'team2',
    country: 'SL',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: false
  },
  
  // Additional BAN Players
  {
    name: 'M Hridoy',
    fullName: 'Towhid Hridoy',
    team: 'BAN',
    role: 'BAT',
    credits: 7.0,
    selectionPercentage: 34,
    points: 44,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'M Rahim',
    fullName: 'Mushfiqur Rahim',
    team: 'BAN',
    role: 'WK',
    credits: 7.5,
    selectionPercentage: 38,
    points: 52,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'S Islam',
    fullName: 'Shoriful Islam',
    team: 'BAN',
    role: 'BOWL',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Left-handed',
    bowlingStyle: 'Left-arm fast-medium',
    isPlayingToday: false
  },
  {
    name: 'T Sakib',
    fullName: 'Tanzim Hasan Sakib',
    team: 'BAN',
    role: 'BOWL',
    credits: 6.0,
    selectionPercentage: 24,
    points: 32,
    matchTeam: 'team1',
    country: 'BAN',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  
  // Additional AFG Players
  {
    name: 'A Ghazanfar',
    fullName: 'Allah Ghazanfar',
    team: 'AFG',
    role: 'BOWL',
    credits: 7.0,
    selectionPercentage: 32,
    points: 44,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm off-break',
    isPlayingToday: false
  },
  {
    name: 'S Shirzad',
    fullName: 'Sayed Shirzad',
    team: 'AFG',
    role: 'BOWL',
    credits: 6.5,
    selectionPercentage: 28,
    points: 36,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm fast-medium',
    isPlayingToday: false
  },
  {
    name: 'I Alikhil',
    fullName: 'Ikram Alikhil',
    team: 'AFG',
    role: 'WK',
    credits: 6.0,
    selectionPercentage: 24,
    points: 32,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Left-handed',
    bowlingStyle: null,
    isPlayingToday: false
  },
  {
    name: 'B Ahmadzai',
    fullName: 'Bahir Shah Ahmadzai',
    team: 'AFG',
    role: 'BAT',
    credits: 5.5,
    selectionPercentage: 20,
    points: 28,
    matchTeam: 'team2',
    country: 'AFG',
    battingStyle: 'Right-handed',
    bowlingStyle: null,
    isPlayingToday: false
  }
]

async function addAdditionalPlayers() {
  try {
    console.log('🌱 Adding additional players to make 15 per team...')
    
    // Add additional players
    const inserted = await db.insert(players).values(additionalPlayers).returning()
    console.log(`✅ Added ${inserted.length} additional players`)
    
    // Verify total count
    const allPlayers = await db.select().from(players)
    console.log(`📊 Total players in database: ${allPlayers.length}`)
    
    // Verify team distribution
    const teamCounts = allPlayers.reduce((acc, p) => {
      acc[p.team] = (acc[p.team] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('\n🏏 Team distribution:')
    Object.entries(teamCounts).forEach(([team, count]) => {
      console.log(`${team}: ${count} players`)
    })
    
    // Verify active/inactive distribution
    const activeCount = allPlayers.filter(p => p.isPlayingToday).length
    const inactiveCount = allPlayers.filter(p => !p.isPlayingToday).length
    console.log(`\n👥 Active players: ${activeCount}`)
    console.log(`👥 Inactive players: ${inactiveCount}`)
    
    console.log('\n🎉 Successfully added additional players!')
    
  } catch (error) {
    console.error('❌ Error adding additional players:', error)
    throw error
  }
}

// Run the seeding
addAdditionalPlayers()
  .then(() => {
    console.log('✅ Additional player seeding completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Additional player seeding failed:', error)
    process.exit(1)
  })

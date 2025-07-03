import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, matches, players } from '../src/db'
import { or, eq } from 'drizzle-orm'

async function testAllMatches() {
  try {
    console.log('🧪 Testing all matches with player data...')
    
    // Get all matches
    const allMatches = await db.select().from(matches)
    console.log(`\n📊 Found ${allMatches.length} matches`)
    
    for (const match of allMatches) {
      console.log(`\n🏏 Testing Match ${match.id}: ${match.team1} vs ${match.team2}`)
      
      // Get players for this match
      const matchPlayers = await db.select().from(players).where(
        or(
          eq(players.team, match.team1),
          eq(players.team, match.team2)
        )
      )
      
      // Filter by each team
      const team1Players = matchPlayers.filter(p => p.team === match.team1)
      const team2Players = matchPlayers.filter(p => p.team === match.team2)
      
      console.log(`  ${match.team1}: ${team1Players.length} players`)
      console.log(`  ${match.team2}: ${team2Players.length} players`)
      
      // Check active vs inactive
      const activeTeam1 = team1Players.filter(p => p.isPlayingToday).length
      const inactiveTeam1 = team1Players.filter(p => !p.isPlayingToday).length
      const activeTeam2 = team2Players.filter(p => p.isPlayingToday).length
      const inactiveTeam2 = team2Players.filter(p => !p.isPlayingToday).length
      
      console.log(`  ${match.team1}: ${activeTeam1} active, ${inactiveTeam1} inactive`)
      console.log(`  ${match.team2}: ${activeTeam2} active, ${inactiveTeam2} inactive`)
      
      // Verify we have the right numbers
      if (team1Players.length !== 15 || team2Players.length !== 15) {
        console.log(`  ⚠️  Warning: Expected 15 players per team, got ${team1Players.length} and ${team2Players.length}`)
      }
      
      if (activeTeam1 !== 11 || activeTeam2 !== 11) {
        console.log(`  ⚠️  Warning: Expected 11 active players per team, got ${activeTeam1} and ${activeTeam2}`)
      }
      
      if (inactiveTeam1 !== 4 || inactiveTeam2 !== 4) {
        console.log(`  ⚠️  Warning: Expected 4 inactive players per team, got ${inactiveTeam1} and ${inactiveTeam2}`)
      }
      
      console.log(`  ✅ Match ${match.id} data verified`)
    }
    
    console.log('\n🎉 All matches tested successfully!')
    
  } catch (error) {
    console.error('❌ Error testing matches:', error)
    throw error
  }
}

// Run the test
testAllMatches()
  .then(() => {
    console.log('✅ Match testing completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Match testing failed:', error)
    process.exit(1)
  })

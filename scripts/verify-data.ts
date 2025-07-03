import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

import { db, matches, players } from '../src/db'

async function verifyData() {
  console.log('🔍 Verifying database data...')
  
  // Check matches
  const allMatches = await db.select().from(matches)
  console.log('\n📊 Matches:')
  allMatches.forEach((match, index) => {
    console.log(`${index + 1}. ${match.team1} vs ${match.team2} (${match.format}) - ${match.venue}`)
  })
  
  // Check players
  const allPlayers = await db.select().from(players)
  console.log(`\n👥 Total players: ${allPlayers.length}`)
  
  // Group by team
  const teamCounts = allPlayers.reduce((acc, p) => {
    acc[p.team] = (acc[p.team] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\n🏏 Team distribution:')
  Object.entries(teamCounts).forEach(([team, count]) => {
    console.log(`${team}: ${count} players`)
  })
  
  // Check roles
  const roleCounts = allPlayers.reduce((acc, p) => {
    acc[p.role] = (acc[p.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\n👤 Role distribution:')
  Object.entries(roleCounts).forEach(([role, count]) => {
    console.log(`${role}: ${count} players`)
  })
  
  console.log('\n✅ Database verification completed!')
}

verifyData().catch(console.error)

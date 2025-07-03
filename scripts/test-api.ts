import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testAPI() {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 Testing API endpoints...')
  
  try {
    // Test matches endpoint
    console.log('\n📊 Testing /api/matches...')
    const matchesResponse = await fetch(`${baseURL}/api/matches`)
    if (matchesResponse.ok) {
      const matchesData = await matchesResponse.json()
      console.log(`✅ Matches API working - Found ${matchesData.matches.length} matches`)
      console.log('First match:', matchesData.matches[0])
    } else {
      console.log('❌ Matches API failed:', matchesResponse.status)
    }
    
    // Test players endpoint
    console.log('\n👥 Testing /api/players...')
    const playersResponse = await fetch(`${baseURL}/api/players`)
    if (playersResponse.ok) {
      const playersData = await playersResponse.json()
      console.log(`✅ Players API working - Found ${playersData.players.length} players`)
      
      // Test team distribution
      const teamCounts = playersData.players.reduce((acc: any, player: any) => {
        acc[player.team] = (acc[player.team] || 0) + 1
        return acc
      }, {})
      console.log('Team distribution:', teamCounts)
      
      // Test role distribution
      const roleCounts = playersData.players.reduce((acc: any, player: any) => {
        acc[player.role] = (acc[player.role] || 0) + 1
        return acc
      }, {})
      console.log('Role distribution:', roleCounts)
      
    } else {
      console.log('❌ Players API failed:', playersResponse.status)
    }
    
    // Test players with team filter
    console.log('\n🏏 Testing /api/players with team filter...')
    const wiPlayersResponse = await fetch(`${baseURL}/api/players?team=WI`)
    if (wiPlayersResponse.ok) {
      const wiPlayersData = await wiPlayersResponse.json()
      console.log(`✅ WI players filter working - Found ${wiPlayersData.players.length} WI players`)
    } else {
      console.log('❌ WI players filter failed:', wiPlayersResponse.status)
    }
    
    console.log('\n🎉 API testing completed!')
    
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
}

testAPI()

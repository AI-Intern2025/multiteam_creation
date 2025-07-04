// Test to check how many players the API returns
const testPlayersAPI = async () => {
    console.log('🧪 Testing Players API Response...')
    
    try {
        const response = await fetch('http://localhost:3000/api/players')
        if (response.ok) {
            const data = await response.json()
            console.log('✅ API Response Success!')
            console.log('- Total players returned:', data.players?.length || 0)
            
            if (data.players && data.players.length > 0) {
                console.log('- First 5 players:')
                data.players.slice(0, 5).forEach((player, index) => {
                    console.log(`  ${index + 1}. ${player.name} (${player.role}, ${player.credits}cr) - ${player.team}`)
                })
                
                if (data.players.length > 5) {
                    console.log(`  ... and ${data.players.length - 5} more players`)
                }
                
                // Check teams
                const teams = [...new Set(data.players.map(p => p.team))]
                console.log('- Teams found:', teams)
                
                // Check active players
                const activePlayers = data.players.filter(p => p.isPlayingToday !== false)
                console.log('- Active players:', activePlayers.length)
            }
        } else {
            console.error('❌ API failed with status:', response.status)
        }
    } catch (error) {
        console.error('❌ API call failed:', error)
    }
    
    console.log('🎉 Players API Test Complete!')
}

// Run the test
testPlayersAPI()

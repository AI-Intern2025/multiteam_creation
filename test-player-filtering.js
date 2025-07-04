// Test the player filtering logic for bulk edit
const testPlayerFiltering = () => {
    console.log('🔍 Testing Player Filtering Logic...')
    
    // Mock data similar to what we have in the app
    const mockPlayers = []
    
    // Create 30 players (15 per team as we have in the app)
    for (let i = 1; i <= 30; i++) {
        mockPlayers.push({
            id: `player-${i}`,
            name: `Player ${i}`,
            role: ['WK', 'BAT', 'AR', 'BOWL'][Math.floor(Math.random() * 4)],
            credits: 6 + Math.random() * 4, // 6-10 credits
            team: i <= 15 ? 'team1' : 'team2'
        })
    }
    
    // Mock teams using first 11 players each
    const mockTeams = [
        {
            id: 'generated-team-1',
            name: 'Generated Team 1',
            players: mockPlayers.slice(0, 11),
            totalCredits: 85,
            isValid: true
        },
        {
            id: 'generated-team-2', 
            name: 'Generated Team 2',
            players: mockPlayers.slice(5, 16), // Overlapping players
            totalCredits: 87,
            isValid: true
        }
    ]
    
    console.log('📊 Data Summary:')
    console.log('- Total Players:', mockPlayers.length)
    console.log('- Total Teams:', mockTeams.length)
    console.log('- Players per Team:', mockTeams[0].players.length)
    
    // Test filtering for selected teams
    const selectedTeams = ['generated-team-1', 'generated-team-2']
    const selectedPlayer = 'player-5' // This player is in both teams
    
    console.log('\n🎯 Testing Filtering Logic:')
    console.log('- Selected Teams:', selectedTeams)
    console.log('- Selected Player to Replace:', selectedPlayer)
    
    // Get players in selected teams
    const playersInSelectedTeams = Array.from(new Set(
        mockTeams
            .filter(team => selectedTeams.includes(team.id))
            .flatMap(team => team.players)
            .map(player => player.id)
    ))
    
    console.log('- Players in Selected Teams:', playersInSelectedTeams.length)
    
    // Old restrictive filtering (what was causing the issue)
    const oldFiltering = mockPlayers.filter(p => {
        if (p.id === selectedPlayer) return false
        
        const isInSelectedTeams = mockTeams
            .filter(team => selectedTeams.includes(team.id))
            .some(team => team.players.some(tp => tp.id === p.id))
        
        return !isInSelectedTeams
    })
    
    console.log('- Old Filtering Result:', oldFiltering.length, 'players available')
    
    // New improved filtering (what fixes the issue)
    const newFiltering = mockPlayers.filter(p => {
        if (p.id === selectedPlayer) return false
        return true // Allow all other players
    })
    
    console.log('- New Filtering Result:', newFiltering.length, 'players available')
    
    console.log('\n✅ Issue Analysis:')
    console.log('- Old logic was too restrictive, showing only', oldFiltering.length, 'replacement options')
    console.log('- New logic shows', newFiltering.length, 'replacement options')
    console.log('- This gives users much more flexibility in team building')
    
    console.log('\n🎉 Player Filtering Test Complete!')
}

// Run the test
testPlayerFiltering()

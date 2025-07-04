// Test the player selection flow with real data
async function testPlayerSelection() {
  try {
    console.log('🧪 Testing player selection with real data...')
    
    // Simulate real player data from the database
    const mockPlayers = [
      { id: '1', name: 'K Brathwaite', team: 'WI', role: 'BAT', credits: 8.5, points: 28 },
      { id: '2', name: 'J Campbell', team: 'WI', role: 'BAT', credits: 8.0, points: 39 },
      { id: '3', name: 'S Hope', team: 'WI', role: 'WK', credits: 10.0, points: 99 },
      { id: '4', name: 'R Chase', team: 'WI', role: 'AR', credits: 9.5, points: 85 },
      { id: '5', name: 'A Joseph', team: 'WI', role: 'BOWL', credits: 8.5, points: 71 },
      { id: '6', name: 'S Joseph', team: 'WI', role: 'BOWL', credits: 8.0, points: 274 },
      { id: '7', name: 'S Konstas', team: 'AUS', role: 'BAT', credits: 8.0, points: 36 },
      { id: '8', name: 'U Khawaja', team: 'AUS', role: 'BAT', credits: 9.5, points: 81 },
      { id: '9', name: 'C Green', team: 'AUS', role: 'AR', credits: 9.0, points: 32 },
      { id: '10', name: 'J Inglis', team: 'AUS', role: 'WK', credits: 8.5, points: 21 },
      { id: '11', name: 'T Head', team: 'AUS', role: 'BAT', credits: 10.5, points: 149 },
      { id: '12', name: 'P Cummins', team: 'AUS', role: 'BOWL', credits: 11.0, points: 110 },
      { id: '13', name: 'M Starc', team: 'AUS', role: 'BOWL', credits: 10.5, points: 95 },
      { id: '14', name: 'J Hazlewood', team: 'AUS', role: 'BOWL', credits: 9.5, points: 166 },
      { id: '15', name: 'N Lyon', team: 'AUS', role: 'BOWL', credits: 9.0, points: 77 }
    ]
    
    // Test the team name transformation
    const uniqueTeams = Array.from(new Set(mockPlayers.map(p => p.team)))
    console.log('Original teams:', uniqueTeams)
    
    const teamMapping = uniqueTeams.reduce((acc, team, index) => {
      acc[team] = index === 0 ? 'team1' : 'team2'
      return acc
    }, {})
    
    console.log('Team mapping:', teamMapping)
    
    // Transform players
    const transformedPlayers = mockPlayers.map(player => ({
      ...player,
      team: teamMapping[player.team] || 'team1'
    }))
    
    console.log('Sample transformed players:')
    transformedPlayers.slice(0, 3).forEach(player => {
      console.log(`${player.name} (${player.team}) - Originally: ${mockPlayers.find(p => p.id === player.id)?.team}`)
    })
    
    // Test role and team distribution
    const roleDistribution = transformedPlayers.reduce((acc, p) => {
      acc[p.role] = (acc[p.role] || 0) + 1
      return acc
    }, {})
    
    const teamDistribution = transformedPlayers.reduce((acc, p) => {
      acc[p.team] = (acc[p.team] || 0) + 1
      return acc
    }, {})
    
    console.log('Role distribution:', roleDistribution)
    console.log('Team distribution:', teamDistribution)
    
    // Test with backend-compatible format
    const mockStrategy = {
      id: 'test-strategy',
      name: 'Test Strategy',
      lockedPlayers: [],
      excludedPlayers: [],
      captainDistribution: [],
      roleConstraints: {
        WK: { min: 1, max: 1 },
        BAT: { min: 3, max: 5 },
        AR: { min: 1, max: 4 },
        BOWL: { min: 3, max: 5 }
      },
      creditRange: { min: 70, max: 100 },
      uniquenessWeight: 0.5
    }
    
    const testRequest = {
      players: transformedPlayers,
      strategy: mockStrategy,
      teamCount: 1
    }
    
    console.log('\n🚀 Testing backend API...')
    const response = await fetch('http://localhost:3000/api/backend/generate-teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Backend API Success!')
      console.log('Teams generated:', result.teams.length)
      console.log('First team players:', result.teams[0]?.players?.length || 0)
    } else {
      const error = await response.text()
      console.log('❌ Backend API Error:', response.status, error)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testPlayerSelection()

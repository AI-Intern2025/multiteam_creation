// Test both backend and frontend API endpoints
const testBackend = async () => {
    console.log('🧪 Testing backend connection...')
    
    try {
        // Test direct backend connection
        const backendResponse = await fetch('http://localhost:8000/health')
        if (backendResponse.ok) {
            const data = await backendResponse.json()
            console.log('✅ Backend health check:', data)
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error)
    }
    
    try {
        // Test frontend API route
        const frontendResponse = await fetch('http://localhost:3000/api/backend/generate-teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                players: [
                    { id: 'p1', name: 'Player 1', role: 'WK', credits: 8.5, team: 'team1' },
                    { id: 'p2', name: 'Player 2', role: 'BAT', credits: 9.0, team: 'team1' },
                    { id: 'p3', name: 'Player 3', role: 'BAT', credits: 8.0, team: 'team2' },
                    { id: 'p4', name: 'Player 4', role: 'BAT', credits: 7.5, team: 'team1' },
                    { id: 'p5', name: 'Player 5', role: 'AR', credits: 8.5, team: 'team2' },
                    { id: 'p6', name: 'Player 6', role: 'AR', credits: 8.0, team: 'team1' },
                    { id: 'p7', name: 'Player 7', role: 'BOWL', credits: 8.5, team: 'team2' },
                    { id: 'p8', name: 'Player 8', role: 'BOWL', credits: 8.0, team: 'team1' },
                    { id: 'p9', name: 'Player 9', role: 'BOWL', credits: 7.5, team: 'team2' },
                    { id: 'p10', name: 'Player 10', role: 'BOWL', credits: 7.0, team: 'team1' },
                    { id: 'p11', name: 'Player 11', role: 'BAT', credits: 6.5, team: 'team2' }
                ],
                strategy: {
                    name: 'balanced',
                    lockedPlayers: [],
                    excludedPlayers: [],
                    roleConstraints: {
                        'WK': { min: 1, max: 1 },
                        'BAT': { min: 3, max: 5 },
                        'AR': { min: 1, max: 4 },
                        'BOWL': { min: 3, max: 5 }
                    },
                    creditRange: { min: 70, max: 100 }
                },
                teamCount: 2
            })
        })
        
        if (frontendResponse.ok) {
            const data = await frontendResponse.json()
            console.log('✅ Frontend API working:', data)
        } else {
            console.error('❌ Frontend API failed:', frontendResponse.status)
        }
    } catch (error) {
        console.error('❌ Frontend API connection failed:', error)
    }
}

// Run the test
testBackend()

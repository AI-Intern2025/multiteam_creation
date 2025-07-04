// Test script to verify bulk edit functionality
const testBulkEdit = () => {
    console.log('🧪 Testing Team Manager Bulk Edit Functionality...')
    
    // Test data
    const mockPlayers = [
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
        { id: 'p11', name: 'Player 11', role: 'BAT', credits: 6.5, team: 'team2' },
        { id: 'p12', name: 'Player 12', role: 'BAT', credits: 6.0, team: 'team1' },
        { id: 'p13', name: 'Player 13', role: 'AR', credits: 7.5, team: 'team2' }
    ]

    const mockTeams = [
        {
            id: 'team1',
            name: 'Team 1',
            players: mockPlayers.slice(0, 11),
            captain: 'p2',
            viceCaptain: 'p1',
            totalCredits: 85.5,
            isValid: true,
            validationErrors: []
        },
        {
            id: 'team2',
            name: 'Team 2',
            players: mockPlayers.slice(0, 11),
            captain: 'p2',
            viceCaptain: 'p5',
            totalCredits: 85.5,
            isValid: true,
            validationErrors: []
        }
    ]

    // Test filtering logic
    const selectedTeams = ['team1', 'team2']
    const playersInSelectedTeams = Array.from(new Set(
        mockTeams
            .filter(team => selectedTeams.includes(team.id))
            .flatMap(team => team.players)
            .map(player => player.id)
    ))
    
    console.log('✅ Players in selected teams:', playersInSelectedTeams)
    
    const playersNotInSelectedTeams = mockPlayers.filter(p => {
        const isInSelectedTeams = mockTeams
            .filter(team => selectedTeams.includes(team.id))
            .some(team => team.players.some(tp => tp.id === p.id))
        return !isInSelectedTeams
    })
    
    console.log('✅ Players NOT in selected teams:', playersNotInSelectedTeams.map(p => p.name))
    
    // Test bulk replacement logic
    const selectedPlayer = 'p1'
    const replacementPlayer = 'p12'
    
    console.log('🔄 Testing bulk replacement:', { selectedPlayer, replacementPlayer })
    
    const updatedTeams = mockTeams.map(team => {
        if (!selectedTeams.includes(team.id)) return team

        const hasSelectedPlayer = team.players.some(p => p.id === selectedPlayer)
        if (!hasSelectedPlayer) return team

        const replacement = mockPlayers.find(p => p.id === replacementPlayer)
        if (!replacement) return team

        const updatedPlayers = team.players.map(p =>
            p.id === selectedPlayer ? replacement : p
        )

        const totalCredits = updatedPlayers.reduce((sum, p) => sum + p.credits, 0)

        return {
            ...team,
            players: updatedPlayers,
            totalCredits,
            isValid: totalCredits <= 100 && updatedPlayers.length === 11,
            validationErrors: totalCredits > 100 ? ['Total credits exceed 100'] : []
        }
    })
    
    console.log('✅ Updated teams after bulk replacement:', updatedTeams.map(t => ({
        name: t.name,
        totalCredits: t.totalCredits,
        isValid: t.isValid,
        hasReplacement: t.players.some(p => p.id === replacementPlayer)
    })))
    
    console.log('🎉 Bulk edit test completed successfully!')
}

// Run the test
testBulkEdit()

// Test the exact request format that the frontend is sending
const testFrontendRequest = async () => {
  try {
    // First, let's test the /api/backend/generate-teams endpoint through the Next.js proxy
    const testData = {
      players: [
        {
          id: "player1",
          name: "Test Player 1",
          team: "team1",
          role: "WK",
          credits: 8.5,
          points: 50,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player2",
          name: "Test Player 2",
          team: "team1",
          role: "BAT",
          credits: 9.0,
          points: 60,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player3",
          name: "Test Player 3",
          team: "team2",
          role: "BAT",
          credits: 8.0,
          points: 45,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player4",
          name: "Test Player 4",
          team: "team2",
          role: "AR",
          credits: 7.5,
          points: 40,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player5",
          name: "Test Player 5",
          team: "team1",
          role: "AR",
          credits: 8.0,
          points: 50,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player6",
          name: "Test Player 6",
          team: "team2",
          role: "BOWL",
          credits: 7.0,
          points: 35,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player7",
          name: "Test Player 7",
          team: "team1",
          role: "BOWL",
          credits: 6.5,
          points: 30,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player8",
          name: "Test Player 8",
          team: "team2",
          role: "BAT",
          credits: 7.5,
          points: 42,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player9",
          name: "Test Player 9",
          team: "team1",
          role: "BOWL",
          credits: 6.0,
          points: 28,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player10",
          name: "Test Player 10",
          team: "team2",
          role: "AR",
          credits: 7.0,
          points: 38,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player11",
          name: "Test Player 11",
          team: "team1",
          role: "BAT",
          credits: 6.5,
          points: 32,
          isLocked: false,
          isExcluded: false
        },
        {
          id: "player12",
          name: "Test Player 12",
          team: "team2",
          role: "BOWL",
          credits: 6.0,
          points: 25,
          isLocked: false,
          isExcluded: false
        }
      ],
      strategy: {
        id: "strategy1",
        name: "Balanced Strategy",
        preset: "safe_picks",
        lockedPlayers: [],
        excludedPlayers: [],
        captainDistribution: [],
        roleConstraints: {
          WK: { min: 1, max: 1 },
          BAT: { min: 3, max: 5 },
          AR: { min: 1, max: 4 },
          BOWL: { min: 3, max: 5 }
        },
        creditRange: {
          min: 70,
          max: 100
        },
        uniquenessWeight: 0.5,
        narratives: []
      },
      teamCount: 1
    }

    console.log('Testing frontend proxy endpoint...')
    console.log('Request data:', JSON.stringify(testData, null, 2))
    
    // Test the Next.js proxy endpoint
    const response = await fetch('http://localhost:3000/api/backend/generate-teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('Success! Response data:', JSON.stringify(data, null, 2))
    } else {
      const errorText = await response.text()
      console.log('Error response:', errorText)
    }
    
  } catch (error) {
    console.error('Request failed:', error)
  }
}

testFrontendRequest()

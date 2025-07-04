const testRequest = {
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

console.log('Testing backend API...')
console.log('Request payload:', JSON.stringify(testRequest, null, 2))

fetch('http://localhost:8000/generate-teams', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testRequest)
})
.then(response => {
  console.log('Response status:', response.status)
  console.log('Response headers:', response.headers)
  return response.json()
})
.then(data => {
  console.log('Response data:', JSON.stringify(data, null, 2))
})
.catch(error => {
  console.error('Error:', error)
})

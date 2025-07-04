// Debug team detection in bulk edit
import fetch from 'node-fetch';

async function debugTeamDetection() {
  try {
    console.log('🔍 Debugging team detection issue...\n');
    
    // Fetch all players from the API
    const playersResponse = await fetch('http://localhost:3001/api/players');
    const playersData = await playersResponse.json();
    const players = playersData.players || [];
    
    console.log('📊 Player data sample:');
    const samplePlayers = players.slice(0, 5);
    samplePlayers.forEach(player => {
      console.log(`- ${player.name} (Team: "${player.team}", Active: ${player.isPlayingToday})`);
    });
    
    console.log('\n🏏 Teams found in player data:');
    const teams = [...new Set(players.map(p => p.team))].sort();
    teams.forEach(team => {
      const teamPlayers = players.filter(p => p.team === team);
      const activePlayers = teamPlayers.filter(p => p.isPlayingToday !== false);
      console.log(`- ${team}: ${teamPlayers.length} total, ${activePlayers.length} active`);
    });
    
    // Test what happens with mock selected teams
    console.log('\n🧪 Testing bulk edit logic with mock data:');
    
    // Simulate a team selection like the UI would have
    const mockTeamData = {
      id: 'team-1',
      players: players.slice(0, 11) // First 11 players
    };
    
    console.log('Mock team players teams:', mockTeamData.players.map(p => p.team));
    
    // Extract team names like the code does
    const teamNames = new Set();
    mockTeamData.players.forEach(player => teamNames.add(player.team));
    const matchTeams = Array.from(teamNames);
    
    console.log('Detected match teams:', matchTeams);
    
    // Filter active players like the code does
    const activeMatchPlayers = players
      .filter(player => {
        if (!matchTeams.includes(player.team)) return false;
        if (player.isPlayingToday === false) return false;
        return true;
      });
    
    console.log(`Active match players found: ${activeMatchPlayers.length}`);
    console.log('Active players by team:');
    const byTeam = activeMatchPlayers.reduce((acc, p) => {
      acc[p.team] = (acc[p.team] || 0) + 1;
      return acc;
    }, {});
    console.log(byTeam);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugTeamDetection();

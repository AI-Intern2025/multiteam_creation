async function testTeamDetection() {
  try {
    console.log('🔍 Testing team detection logic...\n');
    
    // Simulate players data (we know the structure)
    const allPlayers = [
      // PAK players (sample)
      { id: 1, name: 'S Masood', team: 'PAK', role: 'BAT', isPlayingToday: true, credits: 9.0 },
      { id: 2, name: 'F Zaman', team: 'PAK', role: 'WK', isPlayingToday: true, credits: 9.5 },
      { id: 3, name: 'H Rauf', team: 'PAK', role: 'BOWL', isPlayingToday: true, credits: 8.5 },
      // SA players (sample)
      { id: 4, name: 'T Bavuma', team: 'SA', role: 'BAT', isPlayingToday: true, credits: 9.0 },
      { id: 5, name: 'D Miller', team: 'SA', role: 'BAT', isPlayingToday: true, credits: 9.5 },
      { id: 6, name: 'K Rabada', team: 'SA', role: 'BOWL', isPlayingToday: true, credits: 9.5 },
      // WI players (sample)
      { id: 7, name: 'S Hope', team: 'WI', role: 'WK', isPlayingToday: true, credits: 9.0 },
      { id: 8, name: 'N Pooran', team: 'WI', role: 'WK', isPlayingToday: true, credits: 9.5 },
      // AUS players (sample) 
      { id: 9, name: 'D Warner', team: 'AUS', role: 'BAT', isPlayingToday: true, credits: 9.5 },
      { id: 10, name: 'G Maxwell', team: 'AUS', role: 'AR', isPlayingToday: true, credits: 9.0 },
    ];
    
    console.log(`📊 Total players available: ${allPlayers.length}`);
    
    // Group players by team
    const playersByTeam = allPlayers.reduce((acc, player) => {
      if (!acc[player.team]) acc[player.team] = [];
      acc[player.team].push(player);
      return acc;
    }, {});
    
    console.log('\n🏏 Players by team:');
    Object.keys(playersByTeam).forEach(team => {
      const activeCount = playersByTeam[team].filter(p => p.isPlayingToday).length;
      const totalCount = playersByTeam[team].length;
      console.log(`  ${team}: ${activeCount}/${totalCount} active`);
    });
    
    // Test match detection for specific match (PAK vs SA)
    console.log('\n🎯 Testing PAK vs SA match detection:');
    
    // Simulate selected teams containing PAK and SA players
    const pakPlayers = playersByTeam['PAK'] || [];
    const saPlayers = playersByTeam['SA'] || [];
    
    const mockSelectedTeam = {
      id: 'test-team-1',
      name: 'Test Team 1',
      players: [
        ...pakPlayers.slice(0, 6), // 6 PAK players
        ...saPlayers.slice(0, 5)   // 5 SA players
      ]
    };
    
    console.log('📋 Mock selected team:');
    console.log(`  PAK players: ${mockSelectedTeam.players.filter(p => p.team === 'PAK').length}`);
    console.log(`  SA players: ${mockSelectedTeam.players.filter(p => p.team === 'SA').length}`);
    
    // Extract teams from selected team players
    const detectedTeams = [...new Set(mockSelectedTeam.players.map(p => p.team))];
    console.log(`  Detected teams: ${detectedTeams.join(', ')}`);
    
    // Get all active players from detected teams
    const activeMatchPlayers = allPlayers.filter(player => {
      return detectedTeams.includes(player.team) && player.isPlayingToday;
    });
    
    console.log(`\n✅ Active players available for replacement: ${activeMatchPlayers.length}`);
    
    const replacementsByTeam = activeMatchPlayers.reduce((acc, player) => {
      if (!acc[player.team]) acc[player.team] = [];
      acc[player.team].push(player.name);
      return acc;
    }, {});
    
    Object.keys(replacementsByTeam).forEach(team => {
      console.log(`  ${team}: ${replacementsByTeam[team].length} players`);
      console.log(`    ${replacementsByTeam[team].slice(0, 3).join(', ')}${replacementsByTeam[team].length > 3 ? '...' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTeamDetection();

// Debug script to test the exact same logic as the component
async function debugRealScenario() {
  try {
    console.log('🔍 Debugging Real Bulk Edit Scenario...');
    
    // Get players from API (same as component)
    const response = await fetch('http://localhost:3001/api/players');
    const data = await response.json();
    
    if (!data.players) {
      console.log('❌ No players from API');
      return;
    }
    
    console.log('✅ Players from API:', data.players.length);
    
    // Simulate the exact scenario from the screenshot
    console.log('\n🎯 Simulating Exact Scenario:');
    console.log('- 1 team selected (Team 1)');
    console.log('- Replace Player: F Zaman selected');
    console.log('- With Player dropdown: Should show options');
    
    // Mock data similar to what the component receives
    const selectedTeams = ['team-1']; // 1 team selected
    const teams = [
      {
        id: 'team-1',
        players: [
          { id: 1, name: 'S Masood', team: 'PAK' },
          { id: 2, name: 'D Miller', team: 'SA' },
          { id: 3, name: 'F Zaman', team: 'PAK' }
          // ... more players
        ]
      }
    ];
    
    // Test matchTeamsFromSelection logic
    const teamNames = new Set();
    teams
      .filter(team => selectedTeams.includes(team.id))
      .forEach(team => {
        team.players.forEach(player => teamNames.add(player.team));
      });
    
    const matchTeamsFromSelection = Array.from(teamNames);
    console.log('Match teams from selection:', matchTeamsFromSelection);
    
    // Test activeMatchPlayers logic
    let matchTeams = [];
    
    if (matchTeamsFromSelection.length >= 2) {
      matchTeams = matchTeamsFromSelection;
    } else {
      matchTeams = ['WI', 'AUS']; // Fallback
    }
    
    console.log('Final match teams:', matchTeams);
    
    // Filter players
    const activeMatchPlayers = data.players
      .filter(player => {
        if (!matchTeams.includes(player.team)) return false;
        if (player.isPlayingToday === false) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('\n📊 Results:');
    console.log(`- Match teams detected: ${matchTeamsFromSelection.length} (${matchTeamsFromSelection.join(', ')})`);
    console.log(`- Using teams: ${matchTeams.join(' vs ')}`);
    console.log(`- Active players found: ${activeMatchPlayers.length}`);
    
    if (activeMatchPlayers.length > 0) {
      console.log('\n📝 Sample players for dropdown:');
      activeMatchPlayers.slice(0, 10).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr) - ${p.team}`);
      });
    } else {
      console.log('❌ No active players found - this is the issue!');
    }
    
    // Check if the real issue is team detection
    console.log('\n🔍 Team Detection Analysis:');
    console.log('From screenshot, we see PAK players (F Zaman, S Masood)');
    console.log('So the teams should be detected as PAK + something else');
    
    // Check what teams are actually in the API
    const allTeams = [...new Set(data.players.map(p => p.team))];
    console.log('All teams in API:', allTeams);
    
    // Check PAK players specifically
    const pakPlayers = data.players.filter(p => p.team === 'PAK');
    console.log(`PAK players: ${pakPlayers.length}`);
    
    if (pakPlayers.length > 0) {
      console.log('Sample PAK players:');
      pakPlayers.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, isPlayingToday: ${p.isPlayingToday})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error in debug:', error);
  }
}

// Use fetch API for browser compatibility
if (typeof fetch !== 'undefined') {
  debugRealScenario();
} else {
  console.log('Run this in browser console or use Node.js with fetch polyfill');
}

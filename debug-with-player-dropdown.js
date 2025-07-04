const http = require('http');

async function debugWithPlayerDropdown() {
  try {
    console.log('🔍 Debugging "With Player" Dropdown...');
    
    // Get all players from API
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/players',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const data = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    if (data.players && data.players.length > 0) {
      console.log('✅ Players Retrieved:', data.players.length);
      
      // Test the match teams logic
      console.log('\n🏏 Testing Match Teams Logic:');
      
      // Simulate what happens when teams are selected
      const allPlayers = data.players;
      
      // Get WI vs AUS players
      const wiPlayers = allPlayers.filter(p => p.team === 'WI');
      const ausPlayers = allPlayers.filter(p => p.team === 'AUS');
      
      console.log(`- WI players: ${wiPlayers.length}`);
      console.log(`- AUS players: ${ausPlayers.length}`);
      
      // Simulate selected teams having WI and AUS players
      const mockSelectedTeamPlayers = [
        ...wiPlayers.slice(0, 6), // Take 6 WI players
        ...ausPlayers.slice(0, 5)  // Take 5 AUS players
      ];
      
      console.log('\n📋 Mock Selected Team Players:');
      mockSelectedTeamPlayers.forEach(p => {
        console.log(`  - ${p.name} (${p.team})`);
      });
      
      // Test matchTeamsFromSelection logic
      const matchTeamsFromSelection = Array.from(new Set(
        mockSelectedTeamPlayers.map(player => player.team)
      ));
      
      console.log('\n🎯 Match Teams From Selection:');
      console.log('Teams:', matchTeamsFromSelection);
      
      // Test activeMatchPlayers logic
      const activeMatchPlayers = allPlayers.filter(player => {
        // Must be from one of the match teams
        if (!matchTeamsFromSelection.includes(player.team)) return false;
        // Must be active (playing today)
        if (player.isPlayingToday === false) return false;
        return true;
      });
      
      console.log('\n🔥 Active Match Players:');
      console.log(`- Total active players: ${activeMatchPlayers.length}`);
      console.log(`- Expected: 22 (11 WI + 11 AUS)`);
      
      // Show breakdown by team
      const wiActive = activeMatchPlayers.filter(p => p.team === 'WI');
      const ausActive = activeMatchPlayers.filter(p => p.team === 'AUS');
      
      console.log(`- WI active: ${wiActive.length}`);
      console.log(`- AUS active: ${ausActive.length}`);
      
      // Show first few from each team
      console.log('\n📝 Sample Active Players:');
      console.log('WI Players:');
      wiActive.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr, isPlayingToday: ${p.isPlayingToday})`);
      });
      
      console.log('AUS Players:');
      ausActive.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr, isPlayingToday: ${p.isPlayingToday})`);
      });
      
      // Check for any issues
      console.log('\n🔍 Issue Analysis:');
      console.log(`- Total players: ${allPlayers.length}`);
      console.log(`- WI total: ${wiPlayers.length}, Active: ${wiActive.length}`);
      console.log(`- AUS total: ${ausPlayers.length}, Active: ${ausActive.length}`);
      console.log(`- Match teams detected: ${matchTeamsFromSelection.join(', ')}`);
      console.log(`- Active match players: ${activeMatchPlayers.length}`);
      
      if (activeMatchPlayers.length === 22) {
        console.log('✅ "With Player" dropdown should work correctly!');
      } else {
        console.log('❌ Issue found with active match players logic');
      }
      
    } else {
      console.log('❌ No players found');
    }

  } catch (error) {
    console.error('❌ Error debugging "With Player" dropdown:', error);
  }
}

debugWithPlayerDropdown();

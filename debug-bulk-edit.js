const http = require('http');

async function debugBulkEditDropdowns() {
  try {
    console.log('🔍 Debugging Bulk Edit Dropdowns...');
    
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
      console.log('✅ API Players Retrieved:', data.players.length);
      
      // Check data structure
      console.log('\n📋 First Player Structure:');
      const firstPlayer = data.players[0];
      console.log(JSON.stringify(firstPlayer, null, 2));
      
      // Check team distribution
      console.log('\n🏏 Team Distribution:');
      const teamCounts = {};
      data.players.forEach(p => {
        teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
      });
      Object.entries(teamCounts).forEach(([team, count]) => {
        console.log(`- ${team}: ${count} players`);
      });
      
      // Check active players
      console.log('\n🎯 Active Players Check:');
      const activeCount = data.players.filter(p => p.isPlayingToday !== false).length;
      console.log(`- Active players: ${activeCount}`);
      console.log(`- Inactive players: ${data.players.length - activeCount}`);
      
      // Check WI vs AUS specifically
      console.log('\n🏆 WI vs AUS Match Analysis:');
      const wiPlayers = data.players.filter(p => p.team === 'WI');
      const ausPlayers = data.players.filter(p => p.team === 'AUS');
      
      console.log(`- WI players total: ${wiPlayers.length}`);
      console.log(`- AUS players total: ${ausPlayers.length}`);
      
      const activeWI = wiPlayers.filter(p => p.isPlayingToday !== false);
      const activeAUS = ausPlayers.filter(p => p.isPlayingToday !== false);
      
      console.log(`- WI active: ${activeWI.length}`);
      console.log(`- AUS active: ${activeAUS.length}`);
      
      // Show some example players
      console.log('\n📝 Example WI Active Players:');
      activeWI.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr, isPlayingToday: ${p.isPlayingToday})`);
      });
      
      console.log('\n📝 Example AUS Active Players:');
      activeAUS.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr, isPlayingToday: ${p.isPlayingToday})`);
      });
      
      // Check if we have player ID strings vs numbers
      console.log('\n🔢 Player ID Type Check:');
      console.log(`- First player ID: ${firstPlayer.id} (type: ${typeof firstPlayer.id})`);
      console.log(`- Second player ID: ${data.players[1].id} (type: ${typeof data.players[1].id})`);
      
    } else {
      console.log('❌ No players found in API response');
    }

  } catch (error) {
    console.error('❌ Error debugging bulk edit:', error);
  }
}

debugBulkEditDropdowns();

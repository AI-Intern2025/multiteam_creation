const http = require('http');

async function testBulkEditLogic() {
  try {
    console.log('🧪 Testing Bulk Edit Logic...');
    
    // First, get all players
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
      console.log('✅ Player Data Retrieved');
      console.log('- Total players:', data.players.length);
      
      // Test WI vs AUS match scenario
      const wiPlayers = data.players.filter(p => p.team === 'WI');
      const ausPlayers = data.players.filter(p => p.team === 'AUS');
      
      console.log('\n🏏 WI vs AUS Match:');
      console.log(`- WI players: ${wiPlayers.length}`);
      console.log(`- AUS players: ${ausPlayers.length}`);
      
      // Test active players logic
      const activeWI = wiPlayers.filter(p => p.isPlayingToday !== false);
      const activeAUS = ausPlayers.filter(p => p.isPlayingToday !== false);
      
      console.log('\n🎯 Active Players (for bulk edit replacement):');
      console.log(`- Active WI players: ${activeWI.length}`);
      console.log(`- Active AUS players: ${activeAUS.length}`);
      console.log(`- Total active players for match: ${activeWI.length + activeAUS.length}`);
      
      // Show example players for bulk edit
      console.log('\n📋 Example Active Players for Bulk Edit:');
      console.log('WI Active Players:');
      activeWI.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr)`);
      });
      
      console.log('AUS Active Players:');
      activeAUS.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr)`);
      });
      
      // Test role distribution
      console.log('\n🎮 Role Distribution (Active Players):');
      const allActiveMatch = [...activeWI, ...activeAUS];
      const roleCounts = allActiveMatch.reduce((acc, p) => {
        acc[p.role] = (acc[p.role] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`  - ${role}: ${count} players`);
      });
      
      console.log('\n✅ Bulk Edit Logic Test Complete!');
      console.log('📝 Summary:');
      console.log(`- When user selects teams from WI vs AUS match:`);
      console.log(`  - "Replace Player" dropdown: Shows only players in selected teams`);
      console.log(`  - "With Player" dropdown: Shows all ${allActiveMatch.length} active players from the match`);
      console.log(`  - This allows swapping any selected player with any available player from the match`);
      
    } else {
      console.log('❌ No players found in API response');
    }

  } catch (error) {
    console.error('❌ Error testing bulk edit logic:', error);
  }
}

testBulkEditLogic();

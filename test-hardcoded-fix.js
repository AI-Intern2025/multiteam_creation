const http = require('http');

async function testHardcodedFix() {
  try {
    console.log('🧪 Testing Hardcoded WI vs AUS Fix...');
    
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
      
      // Test hardcoded WI vs AUS logic
      const matchTeams = ['WI', 'AUS'];
      
      const activeMatchPlayers = data.players
        .filter(player => {
          // Must be from one of the match teams
          if (!matchTeams.includes(player.team)) return false;
          // Must be active (playing today)
          if (player.isPlayingToday === false) return false;
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      
      console.log('\n🏏 Hardcoded WI vs AUS Results:');
      console.log(`- Total active players: ${activeMatchPlayers.length}`);
      console.log(`- Expected: 22 (11 WI + 11 AUS)`);
      
      // Breakdown by team
      const wiActive = activeMatchPlayers.filter(p => p.team === 'WI');
      const ausActive = activeMatchPlayers.filter(p => p.team === 'AUS');
      
      console.log(`- WI active: ${wiActive.length}`);
      console.log(`- AUS active: ${ausActive.length}`);
      
      // Show sample players that should appear in dropdown
      console.log('\n📝 Sample Players for "With Player" Dropdown:');
      console.log('WI Players:');
      wiActive.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr)`);
      });
      
      console.log('AUS Players:');
      ausActive.slice(0, 5).forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr)`);
      });
      
      if (activeMatchPlayers.length === 22) {
        console.log('\n✅ Hardcoded fix should work!');
        console.log('🎯 "With Player" dropdown should now show 22 options');
      } else {
        console.log('\n❌ Still an issue with the player count');
      }
      
    } else {
      console.log('❌ No players found');
    }

  } catch (error) {
    console.error('❌ Error testing hardcoded fix:', error);
  }
}

testHardcodedFix();

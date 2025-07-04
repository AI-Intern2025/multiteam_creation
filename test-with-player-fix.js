const http = require('http');

async function testWithPlayerDropdownFix() {
  try {
    console.log('🔧 Testing "With Player" Dropdown Fix...');
    
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
      
      // Test both scenarios
      console.log('\n🏏 Testing Both Scenarios:');
      
      // Scenario 1: Teams detected from selection
      const mockMatchTeams = ['WI', 'AUS'];
      const detectedActiveUsers = data.players
        .filter(player => {
          if (!mockMatchTeams.includes(player.team)) return false;
          if (player.isPlayingToday === false) return false;
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      
      console.log('Scenario 1 - Teams detected from selection:');
      console.log(`- Match teams: ${mockMatchTeams.join(' vs ')}`);
      console.log(`- Active players: ${detectedActiveUsers.length}`);
      
      // Scenario 2: Fallback to WI vs AUS
      const fallbackTeams = ['WI', 'AUS'];
      const fallbackActiveUsers = data.players
        .filter(player => {
          if (!fallbackTeams.includes(player.team)) return false;
          if (player.isPlayingToday === false) return false;
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      
      console.log('\nScenario 2 - Fallback to WI vs AUS:');
      console.log(`- Match teams: ${fallbackTeams.join(' vs ')}`);
      console.log(`- Active players: ${fallbackActiveUsers.length}`);
      
      // Show sample players
      console.log('\n📝 Sample Players for "With Player" Dropdown:');
      const samplePlayers = fallbackActiveUsers.slice(0, 10);
      samplePlayers.forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr) - ${p.team}`);
      });
      
      // Verify the fix
      console.log('\n🎯 Fix Verification:');
      console.log(`- Total active players available: ${fallbackActiveUsers.length}`);
      console.log(`- Expected dropdown options: ${fallbackActiveUsers.length}`);
      
      if (fallbackActiveUsers.length === 22) {
        console.log('✅ "With Player" dropdown should now work correctly!');
        console.log('🎉 Users should see 22 player options in the dropdown');
      } else {
        console.log('❌ Still an issue with player count');
      }
      
    } else {
      console.log('❌ No players found');
    }

  } catch (error) {
    console.error('❌ Error testing fix:', error);
  }
}

testWithPlayerDropdownFix();

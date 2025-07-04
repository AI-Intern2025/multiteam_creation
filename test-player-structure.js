const http = require('http');

async function testPlayerStructure() {
  try {
    console.log('🧪 Testing Player Data Structure...');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
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
      console.log('✅ Player Data Structure:');
      console.log('- Total players:', data.players.length);
      
      // Show first player structure
      console.log('\n📋 First player structure:');
      console.log(JSON.stringify(data.players[0], null, 2));
      
      // Show WI vs AUS players
      const wiPlayers = data.players.filter(p => p.team === 'WI');
      const ausPlayers = data.players.filter(p => p.team === 'AUS');
      
      console.log('\n🏏 WI vs AUS Match Players:');
      console.log(`- WI players: ${wiPlayers.length}`);
      console.log(`- AUS players: ${ausPlayers.length}`);
      
      // Show active players
      const activeWI = wiPlayers.filter(p => p.isPlayingToday !== false);
      const activeAUS = ausPlayers.filter(p => p.isPlayingToday !== false);
      
      console.log('\n🎯 Active Players:');
      console.log(`- Active WI players: ${activeWI.length}`);
      console.log(`- Active AUS players: ${activeAUS.length}`);
      
      // Show player properties
      console.log('\n🔍 Player Properties:');
      const samplePlayer = data.players[0];
      console.log('Properties:', Object.keys(samplePlayer));
      
      // Check if isPlayingToday exists
      console.log('\n✅ isPlayingToday property check:');
      console.log(`- Has isPlayingToday: ${samplePlayer.hasOwnProperty('isPlayingToday')}`);
      console.log(`- isPlayingToday value: ${samplePlayer.isPlayingToday}`);
      
    } else {
      console.log('❌ No players found in API response');
    }

  } catch (error) {
    console.error('❌ Error testing player structure:', error);
  }
}

testPlayerStructure();

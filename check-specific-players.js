const http = require('http');

async function checkSpecificPlayers() {
  try {
    console.log('🔍 Checking Specific Players from Screenshot...');
    
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
      console.log('✅ Players Retrieved:', data.players.length);
      
      // Check for specific players from the screenshot
      const targetPlayers = ['S Masood', 'D Miller', 'F Zaman', 'T Bavuma', 'H Rauf'];
      
      console.log('\n🎯 Checking Screenshot Players:');
      targetPlayers.forEach(name => {
        const player = data.players.find(p => p.name === name);
        if (player) {
          console.log(`✅ ${name}: Found - ${player.team}, ${player.role}, ${player.credits}cr, active: ${player.isPlayingToday}`);
        } else {
          console.log(`❌ ${name}: Not found`);
        }
      });
      
      // Get PAK and SA active players
      console.log('\n🏏 PAK vs SA Active Players:');
      const pakActive = data.players.filter(p => p.team === 'PAK' && p.isPlayingToday !== false);
      const saActive = data.players.filter(p => p.team === 'SA' && p.isPlayingToday !== false);
      
      console.log(`PAK Active (${pakActive.length}):`);
      pakActive.forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr)`);
      });
      
      console.log(`\nSA Active (${saActive.length}):`);
      saActive.forEach(p => {
        console.log(`  - ${p.name} (${p.role}, ${p.credits}cr)`);
      });
      
      console.log(`\n📊 Total PAK + SA active players: ${pakActive.length + saActive.length}`);
      console.log('This should be the number shown in "With Player" dropdown for PAK vs SA match');
      
    } else {
      console.log('❌ No players found');
    }

  } catch (error) {
    console.error('❌ Error checking specific players:', error);
  }
}

checkSpecificPlayers();

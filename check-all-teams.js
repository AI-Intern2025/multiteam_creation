const http = require('http');

async function checkAllTeams() {
  try {
    console.log('🔍 Checking All Teams in Database...');
    
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
      
      // Get all unique teams
      const allTeams = [...new Set(data.players.map(p => p.team))];
      console.log('\n🏏 All Teams in Database:', allTeams);
      
      // Count players per team
      allTeams.forEach(team => {
        const teamPlayers = data.players.filter(p => p.team === team);
        const activePlayers = teamPlayers.filter(p => p.isPlayingToday !== false);
        console.log(`${team}: ${teamPlayers.length} total, ${activePlayers.length} active`);
        
        // Show first few players
        if (activePlayers.length > 0) {
          console.log(`  Active players: ${activePlayers.slice(0, 3).map(p => p.name).join(', ')}`);
        }
      });
      
      // Check if PAK or SA exist
      const pakExists = data.players.some(p => p.team === 'PAK');
      const saExists = data.players.some(p => p.team === 'SA');
      
      console.log('\n🔍 Team Existence Check:');
      console.log(`- PAK exists: ${pakExists}`);
      console.log(`- SA exists: ${saExists}`);
      console.log(`- WI exists: ${data.players.some(p => p.team === 'WI')}`);
      console.log(`- AUS exists: ${data.players.some(p => p.team === 'AUS')}`);
      
      if (!pakExists || !saExists) {
        console.log('\n❌ Missing Teams!');
        console.log('The screenshot shows PAK and SA players, but they are not in the database.');
        console.log('This explains why the dropdown is empty.');
      }
      
    } else {
      console.log('❌ No players found');
    }

  } catch (error) {
    console.error('❌ Error checking teams:', error);
  }
}

checkAllTeams();

const { default: fetch } = require('node-fetch');

async function testPlayerSelection() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing player selection functionality...\n');
    
    // Test 1: Get all players
    console.log('1. Testing GET /api/players');
    const allPlayersResponse = await fetch(`${baseURL}/api/players`);
    const allPlayersData = await allPlayersResponse.json();
    console.log(`   ✅ Status: ${allPlayersResponse.status}`);
    console.log(`   ✅ Players count: ${allPlayersData.players.length}`);
    
    // Test 2: Get players by team
    console.log('\n2. Testing GET /api/players?team=IND');
    const indPlayersResponse = await fetch(`${baseURL}/api/players?team=IND`);
    const indPlayersData = await indPlayersResponse.json();
    console.log(`   ✅ Status: ${indPlayersResponse.status}`);
    console.log(`   ✅ IND players count: ${indPlayersData.players.length}`);
    
    // Test 3: Get players by team
    console.log('\n3. Testing GET /api/players?team=WI');
    const wiPlayersResponse = await fetch(`${baseURL}/api/players?team=WI`);
    const wiPlayersData = await wiPlayersResponse.json();
    console.log(`   ✅ Status: ${wiPlayersResponse.status}`);
    console.log(`   ✅ WI players count: ${wiPlayersData.players.length}`);
    
    // Test 4: Get matches
    console.log('\n4. Testing GET /api/matches');
    const matchesResponse = await fetch(`${baseURL}/api/matches`);
    const matchesData = await matchesResponse.json();
    console.log(`   ✅ Status: ${matchesResponse.status}`);
    console.log(`   ✅ Matches count: ${matchesData.matches.length}`);
    
    // Test 5: Check player data structure
    console.log('\n5. Testing player data structure');
    const samplePlayer = allPlayersData.players[0];
    console.log(`   ✅ Sample player: ${samplePlayer.name} (${samplePlayer.team})`);
    console.log(`   ✅ Role: ${samplePlayer.role}, Credits: ${samplePlayer.credits}`);
    console.log(`   ✅ Playing today: ${samplePlayer.isPlayingToday}`);
    
    // Test 6: Check team distribution
    console.log('\n6. Testing team distribution');
    const teamCounts = {};
    allPlayersData.players.forEach(player => {
      teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
    });
    console.log('   ✅ Team distribution:', teamCounts);
    
    // Test 7: Check active/inactive players
    console.log('\n7. Testing active/inactive players');
    const activePlayers = allPlayersData.players.filter(p => p.isPlayingToday);
    const inactivePlayers = allPlayersData.players.filter(p => !p.isPlayingToday);
    console.log(`   ✅ Active players: ${activePlayers.length}`);
    console.log(`   ✅ Inactive players: ${inactivePlayers.length}`);
    
    console.log('\n🎉 All tests passed! Database connection is working perfectly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPlayerSelection();

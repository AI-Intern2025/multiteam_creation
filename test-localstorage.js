// Test localStorage data structure
console.log('🧪 Testing localStorage data...');

// Check if we have the required data
const selectedPlayers = localStorage.getItem('selectedPlayers');
const selectedStrategy = localStorage.getItem('selectedStrategy');
const currentMatchId = localStorage.getItem('currentMatchId');

console.log('Selected players:', selectedPlayers ? JSON.parse(selectedPlayers).length : 'null');
console.log('Selected strategy:', selectedStrategy ? JSON.parse(selectedStrategy).name : 'null');
console.log('Current match ID:', currentMatchId);

if (selectedPlayers) {
  const players = JSON.parse(selectedPlayers);
  console.log('Player teams:', [...new Set(players.map(p => p.team))]);
  console.log('Sample players:', players.slice(0, 5).map(p => `${p.name} (${p.team})`));
}

// Test API call
console.log('\n🔍 Testing API call...');
fetch('/api/players')
  .then(r => r.json())
  .then(data => {
    console.log('API Players:', data.players.length);
    const teams = [...new Set(data.players.map(p => p.team))];
    console.log('All teams:', teams);
    
    // Check WI vs AUS specifically
    const wiPlayers = data.players.filter(p => p.team === 'WI');
    const ausPlayers = data.players.filter(p => p.team === 'AUS');
    console.log(`WI: ${wiPlayers.length}, AUS: ${ausPlayers.length}`);
    
    const activeWI = wiPlayers.filter(p => p.isPlayingToday !== false);
    const activeAUS = ausPlayers.filter(p => p.isPlayingToday !== false);
    console.log(`Active - WI: ${activeWI.length}, AUS: ${activeAUS.length}`);
  })
  .catch(e => console.error('API Error:', e));

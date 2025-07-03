import { db } from '../src/db/index.js';
import { players } from '../src/db/schema.js';

// WI vs AUS players from the Dream11 screenshot with exact stats
const wiAusPlayers = [
  // WI Team (Left side)
  { name: 'K Brathwaite', fullName: 'Kraigg Brathwaite', team: 'WI', role: 'BAT', credits: 8.0, selectionPercentage: 25, points: 28, matchTeam: 'team1', country: 'WI' },
  { name: 'J Campbell', fullName: 'John Campbell', team: 'WI', role: 'BAT', credits: 8.5, selectionPercentage: 19, points: 39, matchTeam: 'team1', country: 'WI' },
  { name: 'K Carty', fullName: 'Keacy Carty', team: 'WI', role: 'BAT', credits: 8.5, selectionPercentage: 52, points: 47, matchTeam: 'team1', country: 'WI' },
  { name: 'B King', fullName: 'Brandon King', team: 'WI', role: 'BAT', credits: 8.0, selectionPercentage: 32, points: 30, matchTeam: 'team1', country: 'WI' },
  { name: 'J Warrican', fullName: 'Jomel Warrican', team: 'WI', role: 'BOWL', credits: 7.0, selectionPercentage: 9, points: 7, matchTeam: 'team1', country: 'WI' },
  { name: 'R Chase', fullName: 'Roston Chase', team: 'WI', role: 'ALL', credits: 8.5, selectionPercentage: 68, points: 85, matchTeam: 'team1', country: 'WI' },
  { name: 'S Hope', fullName: 'Shai Hope', team: 'WI', role: 'WK', credits: 9.5, selectionPercentage: 75, points: 99, matchTeam: 'team1', country: 'WI' },
  { name: 'J Greaves', fullName: 'Justin Greaves', team: 'WI', role: 'ALL', credits: 8.0, selectionPercentage: 42, points: 110, matchTeam: 'team1', country: 'WI' },
  { name: 'A Joseph', fullName: 'Alzarri Joseph', team: 'WI', role: 'BOWL', credits: 8.5, selectionPercentage: 30, points: 71, matchTeam: 'team1', country: 'WI' },
  { name: 'S Joseph', fullName: 'Shamar Joseph', team: 'WI', role: 'BOWL', credits: 8.0, selectionPercentage: 73, points: 274, matchTeam: 'team1', country: 'WI' },
  { name: 'J Seales', fullName: 'Jayden Seales', team: 'WI', role: 'BOWL', credits: 8.0, selectionPercentage: 39, points: 118, matchTeam: 'team1', country: 'WI' },

  // AUS Team (Right side) 
  { name: 'S Konstas', fullName: 'Sam Konstas', team: 'AUS', role: 'BAT', credits: 8.0, selectionPercentage: 23, points: 36, matchTeam: 'team2', country: 'AUS' },
  { name: 'U Khawaja', fullName: 'Usman Khawaja', team: 'AUS', role: 'BAT', credits: 9.0, selectionPercentage: 64, points: 81, matchTeam: 'team2', country: 'AUS' },
  { name: 'C Green', fullName: 'Cameron Green', team: 'AUS', role: 'ALL', credits: 8.5, selectionPercentage: 39, points: 32, matchTeam: 'team2', country: 'AUS' },
  { name: 'J Inglis', fullName: 'Josh Inglis', team: 'AUS', role: 'WK', credits: 8.0, selectionPercentage: 46, points: 21, matchTeam: 'team2', country: 'AUS' },
  { name: 'T Head', fullName: 'Travis Head', team: 'AUS', role: 'BAT', credits: 10.0, selectionPercentage: 90, points: 149, matchTeam: 'team2', country: 'AUS' },
  { name: 'B Webster', fullName: 'Beau Webster', team: 'AUS', role: 'ALL', credits: 8.5, selectionPercentage: 69, points: 139, matchTeam: 'team2', country: 'AUS' },
  { name: 'A Carey', fullName: 'Alex Carey', team: 'AUS', role: 'WK', credits: 8.5, selectionPercentage: 40, points: 141, matchTeam: 'team2', country: 'AUS' },
  { name: 'P Cummins', fullName: 'Pat Cummins', team: 'AUS', role: 'BOWL', credits: 9.0, selectionPercentage: 85, points: 110, matchTeam: 'team2', country: 'AUS' },
  { name: 'M Starc', fullName: 'Mitchell Starc', team: 'AUS', role: 'BOWL', credits: 9.0, selectionPercentage: 79, points: 95, matchTeam: 'team2', country: 'AUS' },
  { name: 'N Lyon', fullName: 'Nathan Lyon', team: 'AUS', role: 'BOWL', credits: 8.5, selectionPercentage: 11, points: 77, matchTeam: 'team2', country: 'AUS' },
  { name: 'J Hazlewood', fullName: 'Josh Hazlewood', team: 'AUS', role: 'BOWL', credits: 8.5, selectionPercentage: 77, points: 166, matchTeam: 'team2', country: 'AUS' }
];

async function addWiAusPlayers() {
  try {
    console.log('🗄️ Clearing existing players...');
    await db.delete(players);
    
    console.log('📥 Adding WI vs AUS players to database...');
    
    for (const player of wiAusPlayers) {
      await db.insert(players).values(player);
      console.log(`✅ Added ${player.name} (${player.team}) - ${player.role}, ${player.credits}cr`);
    }
    
    console.log('\n🎉 Successfully added all 22 WI vs AUS players!');
    console.log(`📊 Total: ${wiAusPlayers.length} players`);
    console.log(`🟩 WI: ${wiAusPlayers.filter(p => p.team === 'WI').length} players`);
    console.log(`🟨 AUS: ${wiAusPlayers.filter(p => p.team === 'AUS').length} players`);
    
    // Verify the data
    const allPlayers = await db.select().from(players);
    console.log(`\n✅ Verification: ${allPlayers.length} players in database`);
    
  } catch (error) {
    console.error('❌ Error adding players:', error);
  }
}

addWiAusPlayers().then(() => process.exit(0)).catch(console.error);

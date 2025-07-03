import { PlayerService } from '../src/services/playerService'

// Test the updated validation rules
async function testNewValidationRules() {
  console.log('🧪 Testing updated Dream11 validation rules...')
  
  // Mock players for testing
  const mockPlayers = [
    // 5 BAT players (max allowed)
    { id: '1', role: 'BAT', team: 'WI', credits: 8.0 },
    { id: '2', role: 'BAT', team: 'WI', credits: 8.5 },
    { id: '3', role: 'BAT', team: 'AUS', credits: 9.0 },
    { id: '4', role: 'BAT', team: 'AUS', credits: 8.0 },
    { id: '5', role: 'BAT', team: 'AUS', credits: 7.5 },
    
    // 5 BOWL players (max allowed)
    { id: '6', role: 'BOWL', team: 'WI', credits: 8.0 },
    { id: '7', role: 'BOWL', team: 'WI', credits: 8.5 },
    { id: '8', role: 'BOWL', team: 'AUS', credits: 9.0 },
    { id: '9', role: 'BOWL', team: 'AUS', credits: 8.0 },
    { id: '10', role: 'BOWL', team: 'AUS', credits: 7.5 },
    
    // 1 WK player (required)
    { id: '11', role: 'WK', team: 'WI', credits: 9.0 }
  ]
  
  console.log('\n✅ Test Case 1: Valid team with new limits')
  console.log('Team: 5 BAT + 5 BOWL + 1 WK = 11 players')
  
  const validation1 = await PlayerService.validateTeamSelection(mockPlayers)
  console.log('Result:', validation1.isValid ? '✅ Valid' : '❌ Invalid')
  if (!validation1.isValid) {
    console.log('Errors:', validation1.errors)
  }
  
  // Test case 2: Too many BAT players
  const tooManyBat = [
    ...mockPlayers,
    { id: '12', role: 'BAT', team: 'WI', credits: 7.0 } // 6th BAT player
  ].slice(0, 11) // Keep only 11 players but with 6 BAT
  
  console.log('\n❌ Test Case 2: Too many BAT players (6 instead of max 5)')
  const validation2 = await PlayerService.validateTeamSelection([
    ...mockPlayers.slice(0, 4), // 4 BAT
    { id: '12', role: 'BAT', team: 'WI', credits: 7.0 }, // 5th BAT
    { id: '13', role: 'BAT', team: 'WI', credits: 7.0 }, // 6th BAT (exceeds limit)
    ...mockPlayers.slice(5) // Rest of the team
  ])
  console.log('Result:', validation2.isValid ? '✅ Valid' : '❌ Invalid')
  if (!validation2.isValid) {
    console.log('Errors:', validation2.errors)
  }
  
  // Test case 3: Valid team with minimum BAT and BOWL
  const minTeam = [
    // 3 BAT players (minimum)
    { id: '1', role: 'BAT', team: 'WI', credits: 8.0 },
    { id: '2', role: 'BAT', team: 'WI', credits: 8.5 },
    { id: '3', role: 'BAT', team: 'AUS', credits: 9.0 },
    
    // 3 BOWL players (minimum)
    { id: '4', role: 'BOWL', team: 'WI', credits: 8.0 },
    { id: '5', role: 'BOWL', team: 'WI', credits: 8.5 },
    { id: '6', role: 'BOWL', team: 'AUS', credits: 9.0 },
    
    // 4 AR players (max allowed)
    { id: '7', role: 'AR', team: 'WI', credits: 8.0 },
    { id: '8', role: 'AR', team: 'WI', credits: 8.5 },
    { id: '9', role: 'AR', team: 'AUS', credits: 9.0 },
    { id: '10', role: 'AR', team: 'AUS', credits: 8.0 },
    
    // 1 WK player
    { id: '11', role: 'WK', team: 'WI', credits: 9.0 }
  ]
  
  console.log('\n✅ Test Case 3: Valid team with minimum BAT/BOWL and maximum AR')
  console.log('Team: 3 BAT + 3 BOWL + 4 AR + 1 WK = 11 players')
  
  const validation3 = await PlayerService.validateTeamSelection(minTeam)
  console.log('Result:', validation3.isValid ? '✅ Valid' : '❌ Invalid')
  if (!validation3.isValid) {
    console.log('Errors:', validation3.errors)
  }
  
  console.log('\n📋 Updated Dream11 Rules Summary:')
  console.log('• Wicket Keepers (WK): 1-4 players')
  console.log('• Batsmen (BAT): 3-5 players ⬅️ UPDATED (was 3-6)')
  console.log('• All Rounders (AR): 1-4 players')
  console.log('• Bowlers (BOWL): 3-5 players ⬅️ UPDATED (was 3-6)')
  console.log('• Total: Exactly 11 players')
  console.log('• Max 7 from one team')
  console.log('• Max 100 credits')
  
  console.log('\n🎉 Validation rule testing completed!')
}

testNewValidationRules().catch(console.error)

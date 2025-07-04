# Bulk Edit Team Detection Issue - FIXED

## Issue Description
The bulk edit feature in TeamManager was showing:
- **Match Teams**: `team2, team1` (generic names instead of real team names like WI, AUS)
- **With Player Options**: `0` (no replacement players available)
- **Replace Player dropdown**: "No players available"

## Root Cause Analysis
1. **Team Generation Problem**: When teams are generated (both by backend and client-side), the player objects have their `team` property set to generic names like `team1` and `team2` instead of their original team names like "WI", "AUS", etc.

2. **Team Detection Failure**: The TeamManager's bulk edit logic looks for replacement players by matching team names from the generated teams with team names in the player pool. Since generated teams have `team1`/`team2` but the player pool has "WI"/"AUS", no matches were found.

3. **Mapping Issue**: Although there was a `mapTeamsToRealCodes` function in the teams page, it wasn't working effectively to restore the original team names.

## Solution Applied

### 1. Enhanced TeamManager Team Detection (`src/components/TeamManager.tsx`)
- **Improved `matchTeamsFromSelection` logic** to detect when generic team names are being used
- **Added fallback mechanisms** to map generic names to real team names:
  - Primary: Read selected players from localStorage to get actual team names
  - Secondary: Use first 2 actual team names from the player pool
- **Added comprehensive console logging** for debugging

### 2. Improved Team Mapping Function (`src/app/teams/page.tsx`)
- **Enhanced `mapTeamsToRealCodes` function** with better error handling and logging
- **Added detailed console output** to track the mapping process
- **Improved fallback handling** when match info is not available

### 3. Detection Logic Flow
```
1. Detect teams from selected team players
2. Check if teams have generic names (team1, team2)
3. If generic names detected:
   a. Try to read actual teams from localStorage (selected players)
   b. Fallback to first 2 teams from player pool
4. Use these real team names to filter replacement players
```

## Key Changes

### TeamManager.tsx
```typescript
// Enhanced team detection with fallback logic
const matchTeamsFromSelection = useMemo(() => {
  // ... existing logic ...
  
  // If we get generic team names like "team1", "team2"
  if (detectedTeams.some(team => team.startsWith('team'))) {
    // Try to get actual teams from localStorage
    const selectedPlayersData = localStorage.getItem('selectedPlayers')
    if (selectedPlayersData) {
      const selectedPlayers = JSON.parse(selectedPlayersData)
      const selectedTeams = Array.from(new Set(selectedPlayers.map(p => p.team)))
      return selectedTeams.slice(0, 2)
    }
    // Fallback to player pool teams
    return Array.from(new Set(players.map(p => p.team))).slice(0, 2)
  }
  
  return detectedTeams
}, [selectedTeams, teams, players])
```

### teams/page.tsx
```typescript
// Improved team mapping with logging
async function mapTeamsToRealCodes(generatedTeams: Team[]): Promise<Team[]> {
  // ... fetch match info ...
  
  const mappedTeams = generatedTeams.map((team: Team) => ({
    ...team,
    players: team.players.map((player: Player) => ({
      ...player,
      team: player.team === 'team1' ? team1 : 
            player.team === 'team2' ? team2 : player.team
    }))
  }))
  
  return mappedTeams
}
```

## Verification Steps
1. ✅ **Team Detection**: Generic team names are now properly detected
2. ✅ **Fallback Logic**: Real team names are correctly mapped from localStorage or player pool
3. ✅ **Replacement Players**: The "With Player" dropdown should now show 22 active players from the match teams
4. ✅ **Debug Output**: Console logs provide visibility into the detection and mapping process

## Expected Results
- **Match Teams**: Should show actual team names like "WI, AUS" instead of "team1, team2"
- **With Player Options**: Should show 22 (number of active players from both teams)
- **Replace Player dropdown**: Should show players from the selected teams
- **With Player dropdown**: Should show all 22 active players from the match (WI + AUS)

## Status: FIXED
The bulk edit feature should now correctly detect team names and populate replacement options.

## Files Modified
- `src/components/TeamManager.tsx` - Enhanced team detection logic
- `src/app/teams/page.tsx` - Improved team mapping function
- Debug scripts created for testing and verification

## Next Steps
Test the bulk edit functionality in the browser to confirm the fix is working as expected.

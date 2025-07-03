import { Team, TeamExport } from '@/types'

/**
 * Export teams to CSV format compatible with Dream11
 */
export function exportTeamsToCSV(teams: Team[]): void {
  const csvData = generateCSVData(teams)
  const csvContent = convertToCSV(csvData)
  downloadCSV(csvContent, `dream11-teams-${new Date().toISOString().split('T')[0]}.csv`)
}

/**
 * Generate CSV data from teams
 */
function generateCSVData(teams: Team[]): TeamExport[] {
  return teams.map(team => ({
    teamName: team.name,
    players: team.players.map(player => ({
      name: player.name,
      role: player.role,
      team: player.team === 'team1' ? 'Team 1' : 'Team 2',
      credits: player.credits,
      isCaptain: team.captain === player.id,
      isViceCaptain: team.viceCaptain === player.id
    })),
    totalCredits: team.totalCredits
  }))
}

/**
 * Convert team data to CSV string
 */
function convertToCSV(teamExports: TeamExport[]): string {
  const headers = [
    'Team Name',
    'Player Name',
    'Role',
    'Team',
    'Credits',
    'Captain',
    'Vice Captain',
    'Player Number'
  ]

  let csvContent = headers.join(',') + '\n'

  teamExports.forEach(teamExport => {
    teamExport.players.forEach((player, index) => {
      const row = [
        `"${teamExport.teamName}"`,
        `"${player.name}"`,
        player.role,
        `"${player.team}"`,
        player.credits.toString(),
        player.isCaptain ? 'Yes' : 'No',
        player.isViceCaptain ? 'Yes' : 'No',
        (index + 1).toString()
      ]
      csvContent += row.join(',') + '\n'
    })
  })

  return csvContent
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Export single team to Dream11 compatible format
 */
export function exportSingleTeamToCSV(team: Team): void {
  exportTeamsToCSV([team])
}

/**
 * Generate Dream11 upload format
 * This format is specifically designed for Dream11's bulk upload feature
 */
export function generateDream11Format(teams: Team[]): string {
  let content = 'TeamName,PlayerName,Role,Credits,Captain,ViceCaptain\n'
  
  teams.forEach(team => {
    team.players.forEach(player => {
      const row = [
        team.name.replace(/,/g, ''),
        player.name.replace(/,/g, ''),
        player.role,
        player.credits.toString(),
        team.captain === player.id ? '1' : '0',
        team.viceCaptain === player.id ? '1' : '0'
      ]
      content += row.join(',') + '\n'
    })
  })
  
  return content
}

/**
 * Export teams with advanced formatting options
 */
export function exportTeamsAdvanced(
  teams: Team[],
  options: {
    format: 'csv' | 'json' | 'dream11'
    includeStats: boolean
    filename?: string
  }
): void {
  const timestamp = new Date().toISOString().split('T')[0]
  const defaultFilename = `dream11-teams-${timestamp}`

  switch (options.format) {
    case 'csv':
      exportTeamsToCSV(teams)
      break
      
    case 'json':
      exportTeamsToJSON(teams, options.filename || `${defaultFilename}.json`)
      break
      
    case 'dream11':
      const dream11Content = generateDream11Format(teams)
      downloadCSV(dream11Content, options.filename || `${defaultFilename}-dream11.csv`)
      break
  }
}

/**
 * Export teams to JSON format
 */
function exportTeamsToJSON(teams: Team[], filename: string): void {
  const jsonData = {
    exportDate: new Date().toISOString(),
    totalTeams: teams.length,
    validTeams: teams.filter(t => t.isValid).length,
    teams: teams.map(team => ({
      id: team.id,
      name: team.name,
      isValid: team.isValid,
      totalCredits: team.totalCredits,
      players: team.players.map(p => ({
        name: p.name,
        role: p.role,
        team: p.team,
        credits: p.credits
      })),
      captain: team.players.find(p => p.id === team.captain)?.name,
      viceCaptain: team.players.find(p => p.id === team.viceCaptain)?.name,
      strategy: team.strategy,
      validationErrors: team.validationErrors
    }))
  }

  const jsonString = JSON.stringify(jsonData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const link = document.createElement('a')
  
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Validate CSV export data
 */
export function validateExportData(teams: Team[]): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (teams.length === 0) {
    errors.push('No teams to export')
    return { isValid: false, errors, warnings }
  }

  teams.forEach((team, index) => {
    if (team.players.length !== 11) {
      errors.push(`Team ${index + 1} (${team.name}) does not have 11 players`)
    }

    if (!team.captain || !team.viceCaptain) {
      errors.push(`Team ${index + 1} (${team.name}) missing captain or vice-captain`)
    }

    if (team.totalCredits > 100) {
      errors.push(`Team ${index + 1} (${team.name}) exceeds 100 credit limit`)
    }

    if (!team.isValid) {
      warnings.push(`Team ${index + 1} (${team.name}) has validation issues`)
    }

    // Check role distribution
    const roleCounts = team.players.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    if (roleCounts.WK !== 1) {
      errors.push(`Team ${index + 1} (${team.name}) must have exactly 1 wicket-keeper`)
    }

    if (roleCounts.BAT < 3 || roleCounts.BAT > 5) {
      warnings.push(`Team ${index + 1} (${team.name}) has unusual number of batsmen (${roleCounts.BAT})`)
    }

    if (roleCounts.BOWL < 3 || roleCounts.BOWL > 5) {
      warnings.push(`Team ${index + 1} (${team.name}) has unusual number of bowlers (${roleCounts.BOWL})`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generate team summary for export
 */
export function generateTeamSummary(teams: Team[]): string {
  const validTeams = teams.filter(t => t.isValid)
  const avgCredits = teams.reduce((sum, t) => sum + t.totalCredits, 0) / teams.length

  let summary = `Dream11 Team Export Summary\n`
  summary += `Generated: ${new Date().toLocaleString()}\n`
  summary += `Total Teams: ${teams.length}\n`
  summary += `Valid Teams: ${validTeams.length}\n`
  summary += `Average Credits: ${avgCredits.toFixed(2)}\n\n`

  // Captain distribution
  const captainCounts = teams.reduce((acc, team) => {
    const captain = team.players.find(p => p.id === team.captain)
    if (captain) {
      acc[captain.name] = (acc[captain.name] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  summary += `Captain Distribution:\n`
  Object.entries(captainCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([name, count]) => {
      summary += `${name}: ${count} teams (${((count / teams.length) * 100).toFixed(1)}%)\n`
    })

  return summary
}

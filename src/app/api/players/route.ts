import { NextRequest, NextResponse } from 'next/server'
import { PlayerService } from '@/services/playerService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const team = searchParams.get('team')
    const role = searchParams.get('role')
    const minCredits = searchParams.get('minCredits')
    const maxCredits = searchParams.get('maxCredits')
    
    if (name) {
      // Search for specific player by name
      const player = await PlayerService.findPlayerByName(name)
      return NextResponse.json({ player })
    }
    
    // Get all players with filters
    const players = await PlayerService.searchPlayers({
      team: team || undefined,
      role: role || undefined,
      minCredits: minCredits ? parseFloat(minCredits) : undefined,
      maxCredits: maxCredits ? parseFloat(maxCredits) : undefined
    })
    
    return NextResponse.json({ players })
    
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { names } = await request.json()
    
    if (!Array.isArray(names)) {
      return NextResponse.json(
        { error: 'Names must be an array' },
        { status: 400 }
      )
    }
    
    const players = await PlayerService.findPlayersByNames(names)
    
    return NextResponse.json({ 
      players,
      found: players.length,
      total: names.length 
    })
    
  } catch (error) {
    console.error('Error finding players by names:', error)
    return NextResponse.json(
      { error: 'Failed to find players' },
      { status: 500 }
    )
  }
}



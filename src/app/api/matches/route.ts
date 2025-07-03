import { NextRequest, NextResponse } from 'next/server'
import { db, matches } from '@/db'

export async function GET(request: NextRequest) {
  try {
    // Get all active matches
    const allMatches = await db.select().from(matches)
    
    // Format the response
    const formattedMatches = allMatches.map(match => ({
      id: match.id,
      team1: match.team1,
      team2: match.team2,
      format: match.format,
      venue: match.venue,
      matchDate: match.matchDate?.toISOString() || new Date().toISOString(),
      isActive: match.isActive
    }))
    
    return NextResponse.json({ matches: formattedMatches })
    
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

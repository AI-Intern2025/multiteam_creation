import { NextRequest, NextResponse } from 'next/server'
import { db, matches } from '@/db'
import { eq } from 'drizzle-orm'

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
      startTime: match.startTime?.toISOString() || new Date().toISOString(),
      endTime: match.endTime?.toISOString() || new Date().toISOString(),
      isActive: match.isActive,
      isUpcoming: match.isUpcoming,
      status: match.status,
      createdBy: match.createdBy
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create new match
    const newMatch = await db.insert(matches).values({
      team1: body.team1,
      team2: body.team2,
      format: body.format,
      venue: body.venue,
      matchDate: new Date(body.matchDate),
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      isActive: body.isActive ?? true,
      isUpcoming: body.isUpcoming ?? true,
      status: body.status ?? 'scheduled',
      createdBy: body.createdBy
    }).returning()
    
    return NextResponse.json({ match: newMatch[0] }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    // Update match
    const updatedMatch = await db.update(matches)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(matches.id, id))
      .returning()
    
    return NextResponse.json({ match: updatedMatch[0] })
    
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }
    
    // Delete match
    await db.delete(matches).where(eq(matches.id, parseInt(id)))
    
    return NextResponse.json({ message: 'Match deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
}

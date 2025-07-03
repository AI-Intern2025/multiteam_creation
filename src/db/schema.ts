import { pgTable, serial, varchar, real, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  fullName: varchar('full_name', { length: 150 }),
  team: varchar('team', { length: 50 }).notNull(), // WI, AUS, etc.
  role: varchar('role', { length: 10 }).notNull(), // BAT, BOWL, WK, ALL
  credits: real('credits').notNull(),
  
  // Performance metrics
  selectionPercentage: real('selection_percentage').default(0),
  points: integer('points').default(0),
  
  // Match context
  isPlayingToday: boolean('is_playing_today').default(true),
  matchTeam: varchar('match_team', { length: 10 }).notNull(), // team1 or team2
  
  // Additional metadata
  country: varchar('country', { length: 3 }),
  battingStyle: varchar('batting_style', { length: 20 }),
  bowlingStyle: varchar('bowling_style', { length: 30 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  team1: varchar('team1', { length: 50 }).notNull(),
  team2: varchar('team2', { length: 50 }).notNull(),
  format: varchar('format', { length: 10 }).notNull(), // T20, ODI, TEST
  venue: varchar('venue', { length: 100 }),
  matchDate: timestamp('match_date'),
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at').defaultNow()
})

export type Player = typeof players.$inferSelect
export type NewPlayer = typeof players.$inferInsert
export type Match = typeof matches.$inferSelect
export type NewMatch = typeof matches.$inferInsert
